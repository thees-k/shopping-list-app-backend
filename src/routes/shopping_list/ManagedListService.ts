// ManagedListService.ts

import Database from "better-sqlite3";
import { managedListTable, itemTable, ManagedList, DatabaseUtils } from "./databaseUtils";

export type NullOneZero = null | 1 | 0;

class ManagedListService {

    private managedList: ManagedList;
    private database: Database.Database;

    constructor(private listName: string = "managedList") {
        this.database = new DatabaseUtils().getDatabase();
        this.managedList = this.loadOrCreateManagedList();        
    }

    private loadOrCreateManagedList(): ManagedList {
        const managedList = this.getManagedListByName();
        return managedList ? managedList : this.initiateManagedList();
    }

    private initiateManagedList(): ManagedList {
        const transaction = this.database.transaction(() => {
            this.insertManagedList();
            return this.getManagedListByName() as ManagedList;
        });
        return transaction();
    }

    private insertManagedList(): void {
        this.database.prepare(
            `INSERT INTO ${managedListTable} (name) VALUES (?)`
        ).run(this.listName);
    }

    private getManagedListByName(): ManagedList | null {
        const resultSet = this.database.prepare(
            `SELECT id, name, counter FROM ${managedListTable} WHERE name = ?`
        ).get(this.listName);
        return resultSet ? (resultSet as ManagedList) : null;
    }

    // Function to load all records of table "Item"
    public reloadManagedList(): { id: number, text: string, checked: boolean }[] | null {
        const transaction = this.database.transaction(() => {
            const resultSet = this.database.prepare(`
            SELECT * FROM ${itemTable} WHERE managedList = ? ORDER BY id ASC
        `).all(this.managedList.id);
            return resultSet ? (resultSet as { id: number, text: string, checked: boolean }[]) : null;
        });
        return transaction();
    }

    // Function to add a record to table "Item"
    public addItem(text: string, checked: boolean = false): { "id": number, "text": string, "checked": boolean } {
        const transaction = this.database.transaction(() => {
            const insertStatement = this.database.prepare(
                `INSERT INTO ${itemTable} (text, checked, managedList) VALUES (?, ?, ?)`
            );
            const result = insertStatement.run(text, checked ? 1 : 0, this.managedList.id);
            const insertedItem = this.getItemById(result.lastInsertRowid as number);
            if (insertedItem) {
                return insertedItem;
            } else {
                throw Error("Could not reload just inserted record");
            }
        });
        return transaction();
    }

    // Function to load a record of table "Item" by its ID
    public getItemById(id: number): { id: number, text: string, checked: boolean } | null {
        const resultSet = this.database.prepare(`
            SELECT * FROM ${itemTable} WHERE id = ?
        `).get(id);
        return resultSet ? (resultSet as { id: number, text: string, checked: boolean }) : null;
    }

    // Function to delete a record of table "Item" by its ID
    public deleteItemById(id: number): void {
        this.database.prepare(`
            DELETE FROM ${itemTable} WHERE id = ?
        `).run(id);
    }

    // Function to edit a record of table "Item"
    public updateItem(id: number, text: string, checked: NullOneZero): void {
        if(checked === null) {
            this.database.prepare(`
                UPDATE ${itemTable} SET text = ? WHERE id = ?
            `).run(text, id);
        } else {
            this.database.prepare(`
                UPDATE ${itemTable} SET text = ?, checked = ? WHERE id = ?
            `).run(text, checked, id);    
        }
    }

    public doUpdateCheck(counter: number): { counter: number, updated: boolean } {
        const transaction = this.database.transaction(() => {
            if (this.managedList.counter === counter) {
                return this.increaseCounter();
            } else {
                return {
                    counter: this.managedList.counter,
                    updated: false
                };
            }
        });
        return transaction();
    }

    private increaseCounter() {
        this.managedList.counter++;
        this.database.prepare(`
                    UPDATE ${managedListTable} SET counter = ? WHERE id = ?
                `).run(this.managedList.counter, this.managedList.id);
        return {
            counter: this.managedList.counter,
            updated: true
        };
    }
}

export default ManagedListService;