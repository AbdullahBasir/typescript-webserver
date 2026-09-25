# A basic Typescript Webserver

### Notes:

##### Setup:

- Install nvm to manage node.js versions across projects ```nvm install <version>```, then store the wanted node version in a .nvmrc file in the root and select it with ```nvm use```.

- Initialize a node.js project with ```npm init -y``` where the -y automatically answers yes to all the prompts that usually come from a plain ```npm init```.

- Install Typescript and node type definitions ```npm install -D typescript @types/node``` where -D means install package as a development dependency, which means it is only needed in development and not production.

- Create a tsconfig.json file in the root, this basically provides instructions to typescript on how to compile code. For instance the include ```"include": ["./src/**/*.ts"]``` key which notifies typescript on which files must be compiled and exclude ```"exclude": ["node_modules"]``` key which ignores specified files.

- Update package.json to use ES modules ```"type": "module"``` so that imports and exports can be used in modern JavaScript standard, ```import x from 'module'``` and ```export const x = ...```.

##### Server:

- Install express (web framework: a toolkit that offers pre-built components such as Request/response handling) and its type definitions to build the webserver and Api ```npm install express``` ```npm install -D @types/express```.

- Start the server with express's .listen() method, and use the .static() middleware to specify what should be displayed from the server (the .use() method processes middleware):

```typescript
import express from "express";

const app = express();
const PORT = 8080;

app.use(express.static("."));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
```

- Endpoints can be called alongside their request handlers (e.g. get/post/put/delete requests) in this format:

```
app.<request>("<endpoint>", <handler-function>);
```

for example:

```typescript
// handler function file, src/api/example.ts
import { Request, Response } from 'express';

export function exampleHandler(req: Request, res: Response) {
    // request handling lets say for posting

    ...

    // send response status and response
    res.status(201).send({ id: 123, name: "Example" });
}

// main/server file src/server.ts
import { exampleHandler } from './api/example.js';

app.post("/examples", exampleHandler);
```

##### Storage:

- PostgreSQL is used for the database and handles data storage and retrieval and is run on its own server. ```brew install postgresql@<version-number>``` then start the server ```brew services start postgresql@<version-number>```.

- Connect to the server with ```psql postgres``` and create a database ```CREATE DATABASE <database-name>;```.

- This project uses drizzle as the migration and ORM tool (ORM converts typescript written queries to sql format behind the scenes, migrations keep track of the changes done to the database in sql files). ```npm i drizzle-orm postgres``` ```npm i -D drizzle-kit```.

- Create a drizzle.config.ts which contains the configuration for the migrations:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: '<path-to-schema.ts>', // location where the database tables are defined
  dbCredentials: {
    url: process.env.DATABASE_URL!, // the connection string that connects to the database "psql 'postgres://<username>:@localhost:<port>/<database-name>?sslmode=disable'"
  },
  out: './drizzle',
});
```

- Create a schema.ts file which is where the database tables are defined with similar keywords to sql, for example:

```typescript
import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
// the types from drizzle are similar to plain sql such as timestamp for a date or varchar for a limited string

export const examples = pgTable("examples", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    email: varchar("email").unique().notNull(),
});

// export the type for the table for "insert " it would be:

export type NewExample = typeof examples.$inferInsert;

// for "select it would be:

export type Examples = typeof examples.$inferSelect;

// These types are to let typescript know how the tables should be structured during creation or retrieval
```

- Generate and migrate the new table ```npx drizzle-kit generate``` ```npx drizzle-kit migrate```

- configure the database so that queries can be made with typescript instead of sql:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "<path-to-schema.js>";

const client = postgres(process.env.DATABASE_URL!); // connection to database
export const db = drizzle(client, {schema}); // allowing queries to database to be written in typescript and later converted to sql via the ORM
```

```sql
const result = await client`SELECT * FROM examples WHERE id = ${id}`;
```

vs

```typescript
const result = await db.select().from(examples).where(eq(examples.id, id));
```

- Create the queries to the database:

```typescript
import { db } from "<path-to-database-configuration.js>";
import { NewExample, examples } from "<path-to-schema.js>";

export async function createExample(example: NewExample) {
  const [result] = await db
    .insert(examples)
    .values(example) // insert to the examples table the values passed into the function that have the same structure as type NewExample
    .onConflictDoNothing()
    .returning(); // used when the inserted or changed values of the table need to be returned
  return result;
}
```