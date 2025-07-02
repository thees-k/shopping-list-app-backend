// src/server.ts

import express, { Application } from "express";
import path from "path";
import { createShoppingListRouter } from "./routes/shopping_list/shoppingListRouter";

export function createApp(): Application {
  const app = express();

  app.use(express.static(path.join(__dirname, "..", "public"))); // serve index.html and shared assets

  app.get("/shopping-list.html", (req, res) => {
    res.redirect(301, "/shopping-list/shopping-list.html");
  });
  
  app.use("/shopping-list", createShoppingListRouter());

  return app;
}
 

