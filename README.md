# shopping-list-app-backend

This project is an Express-based backend server for a Shopping List application. It provides a RESTful API with persistent storage using SQLite and is implemented in TypeScript.

## Features

- REST API for managing shopping list items (CRUD operations)
- SQLite database for data persistence using `better-sqlite3`
- Serves static frontend files for the shopping list app
- Written in TypeScript with strict type checking
- Development support with nodemon and ts-node
- Unit testing with Jest

## Project Structure

- `src/` - Source TypeScript files
  - `server.ts` - Express app setup
  - `start.ts` - Server entry point
  - `routes/shopping_list/` - Shopping list API and utilities
    - `shoppingListRouter.ts` - Express router for shopping list API
    - `ManagedListService.ts` - Service managing shopping list data and DB operations
    - `databaseUtils.ts` - SQLite database setup and utilities
    - `setup.sh` - Script to copy static files to build directory
    - `public/` - Static frontend files for the shopping list app
- `data/shopping_list/sqlite.db` - SQLite database file (created at runtime)
- `built/` - Compiled JavaScript output directory

## Prerequisites

- Node.js (v16+ recommended)
- npm
- SQLite3 (optional, for direct DB inspection)
- Bash shell (for running setup scripts)

## Installation

```bash
npm install
```

## Development

Start the development server with automatic reload on source changes:

```bash
npm run dev
```

This runs `nodemon` watching `src` files and uses `ts-node` to run the server.

## Build

Compile TypeScript and prepare static files:

```bash
npm run build
```

This runs the TypeScript compiler and copies static assets.

## Start

Run the compiled server:

```bash
npm start
```

This compiles the project, runs the setup script, and starts the server from the built files.

## API Endpoints

Base URL: `/shopping-list/api`

- `GET /items` - Get all shopping list items
- `POST /items` - Add a new item (JSON body: `{ text: string, checked?: boolean }`)
- `GET /items/:id` - Get item by ID
- `PUT /items/:id` - Update item by ID (JSON body: `{ text: string, checked: boolean | null }`)
- `DELETE /items/:id` - Delete item by ID
- `GET /check?counter=number` - Check and update the list counter for synchronization

## Static Files

- The frontend is served under `/shopping-list` path.
- The main entry is `shopping-list.html` located in `src/routes/shopping_list/public`.

## Systemd Service

An example systemd service configuration is included in the `shopping_list_app.sh` script comments for running the app as a service with automatic restart.

## Testing

Run tests with Jest:

```bash
npm test
```

## Environment Variables

- `PORT` - Port number for the server to listen on (set in environment)

## Notes

- The SQLite database file is located at `data/shopping_list/sqlite.db`.
- Error logs are written to `error.log` in the working directory.
- The project uses strict TypeScript settings for type safety.

## License

ISC

