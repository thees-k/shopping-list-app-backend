// 

import express, { Express, NextFunction, Request, Response, Router } from "express";
import dotenv from "dotenv";
import path from "path";
import ManagedListService, { NullOneZero } from "./ManagedListService";
import fs from 'fs';

dotenv.config();

export function createShoppingListRouter(): Router {
  const router: Router = express.Router();
  const basePath = "/api";

  // Create a new instance of the ManagedListService with the name "shoppingList"
  const managedListService = new ManagedListService("shoppingList");

  // Middleware for JSON bodies
  router.use(express.json());

  // Serve static files from the public directory
  router.use(express.static(path.join(__dirname, "public")));

  router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "shopping-list.html"));
  });

  // Function to validate item ID
  function isValidId(id: unknown): boolean {
    if (!id || isNaN(Number(id))) {
      return false;
    } else {
      return true;
    }
  }

  function getCorrectIsoDate(): string {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  }

  function logError(error: Error | unknown) {
    const stackTrace = error ? (error as Error).stack : error;
    const errorMessage: string = `${getCorrectIsoDate()}: ${stackTrace}\n`;
    fs.appendFileSync('error.log', errorMessage);
    console.log(errorMessage);
  }

  function getCheckedValue(checked: null | string | number | boolean): NullOneZero {
    if (checked === null) {
      return null;
    } else if (typeof checked === "boolean") {
      return checked ? 1 : 0;
    } else if (typeof checked === "string") {
      const lowerCaseChecked = checked.toLowerCase();
      return lowerCaseChecked === "null" ? null : lowerCaseChecked === "false" ? 0 : 1;
    } else if (typeof checked === "number") {
      return checked === 0 ? 0 : 1;
    } else {
      throw new Error(`'checked' must not be of type ${typeof checked}, got ${checked}`);
    }
  }


  /**
   * Get all items in the shopping list.
   * @returns A JSON array of all items in the list.
   */
  router.get(`${basePath}/items`, (req: Request, res: Response) => {
    try {
      const items = managedListService.reloadManagedList();
      res.json(items);
    } catch (error) {
      logError(error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  /**
   * Add a new item to the shopping list.
   * @param {string} text - The text of the item.
   * @param {boolean} checked - Whether the item is checked or not.
   * @returns A JSON object representing the newly added item if successful, otherwise an error message.
   */
  router.post(`${basePath}/items`, (req: Request, res: Response) => {
    const { text, checked } = req.body;
    if (!text) {
      res.status(400).json({ error: "Text is required" });
    } else {
      try {
        const newItem = managedListService.addItem(text, checked);
        res.status(201).json(newItem);
      } catch (error) {
        logError(error);
        res.status(500).json({ error: "Failed to add item" });
      }
    }
  });

  /**
   * Get a specific item from the shopping list by its ID.
   * @param {string} id - The ID of the item to retrieve.
   * @returns A JSON object representing the item, or a 404 error if the item was not found.
   */
  router.get(`${basePath}/items/:id`, (req: Request, res: Response) => {
    const { id } = req.params;
    if (isValidId(id)) {
      try {
        const item = managedListService.getItemById(Number(id));
        if (item) {
          res.json(item);
        } else {
          res.status(404).json({ error: "Item not found" });
        }
      } catch (error) {
        logError(error);
        res.status(500).json({ error: "Failed to fetch item" });
      }
    } else {
      res.status(400).json({ error: "Invalid item ID" });
    }
  });

  /**
   * Delete a specific item from the shopping list by its ID.
   * @param {string} id - The ID of the item to delete.
   * @returns A success message if the item was deleted successfully, or a 404 error if the item was not found.
   */
  router.delete(`${basePath}/items/:id`, (req: Request, res: Response) => {
    const { id } = req.params;
    if (isValidId(id)) {
      try {
        managedListService.deleteItemById(Number(id));
        res.send("Item deleted successfully");
      } catch (error) {
        logError(error);
        res.status(500).json({ error: "Failed to delete item" });
      }
    } else {
      res.status(400).json({ error: "Invalid item ID" });
    }
  });

  /**
   * Update a specific item in the shopping list by its ID.
   * @param {string} id - The ID of the item to update.
   * @param {string} text - The new text for the item.
   * @param {boolean | null} checked - Whether the item is checked or not. Null or "null" to keep the current value.
   * @returns A success message if the item was updated successfully, or a 404 error if the item was not found.
   */
  router.put(`${basePath}/items/:id`, (req: Request, res: Response) => {
    const { id } = req.params;
    let { text, checked } = req.body;

    if (!isValidId(id)) {
      res.status(400).json({ error: "Invalid item ID" });
    } if (!text) {
      res.status(400).json({ error: "Text is required" });
    } else {
      try {
        managedListService.updateItem(Number(id), text, getCheckedValue(checked));
        res.send("Item updated successfully");
      } catch (error) {
        logError(error);
        res.status(500).json({ error: "Failed to update item" });
      }
    }
  });

  /**
   * Check if the counter needs updating.
   * @param {number} counter - The current counter value.
   * @returns A JSON object with the updated counter value.
   */
  router.get(`${basePath}/check`, (req: Request, res: Response) => {
    const { counter } = req.query;
    if (isNaN(Number(counter))) {
      res.status(400).json({ error: "Invalid counter value" });
    } else {
      try {
        const updateObject: { counter: number, updated: boolean } = managedListService.doUpdateCheck(Number(counter));
        res.json(updateObject);
      } catch (error) {
        logError(error);
        res.status(500).json({ error: "Failed to update check" });
      }
    }
  });

  return router;
}
