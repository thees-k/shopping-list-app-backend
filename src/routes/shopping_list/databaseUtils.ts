// databaseUtils.ts

import Database from "better-sqlite3";
import path from "path";

export const managedListTable: string = "ManagedList";
export const itemTable: string = "Item";

export type ManagedList = {
    id: number,
    name: string,
    counter: number
};

export class DatabaseUtils {
    private database: Database.Database;

    constructor() {
        const dbPath = path.join(__dirname, "..", "..", "..", "data", "shopping_list", "sqlite.db");
        console.log(`Open database at: ${dbPath}`);
        this.database = new Database(dbPath);
        this.createManagedListTable();
        this.createItemTable();
    }

    private createManagedListTable() {
        const createTableStatement = `
        CREATE TABLE IF NOT EXISTS ${managedListTable} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            counter INTEGER NOT NULL DEFAULT 0
        )
        `;
        this.database.exec(createTableStatement);
    }

    private createItemTable(): void {
        const createTableStatement = `
        CREATE TABLE IF NOT EXISTS ${itemTable} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            checked BOOLEAN NOT NULL,
            managedList INTEGER NOT NULL,
            FOREIGN KEY (managedList) REFERENCES ${managedListTable}(id)
        )
        `;
        this.database.exec(createTableStatement);
    }

    public getDatabase(): Database.Database {
        return this.database;
    }
}
