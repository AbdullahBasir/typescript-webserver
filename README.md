# A basic Typescript Webserver

### Notes:

##### Setup:

- Install nvm to manage node.js versions across projects ```nvm install <version>```, then store the wanted node version in a .nvmrc file in the root and select it with ```nvm use```.

- Initialize a node.js project with ```npm init -y``` where the -y automatically answers yes to all the prompts that usually come from a plain ```npm init```.

- Install Typescript and node type definitions ```npm install -D typescript @types/node``` where -D means install package as a development dependency, which means it is only needed in development and not production.

- Create a tsconfig.json file in the root, this basically provides instructions to typescript on how to compile code. For instance the include ```"include": ["./src/**/*.ts"]``` key which notifies typescript on which files must be compiled and exclude ```"exclude": ["node_modules"]``` key which ignores specified files.

- Update package.json to use ES modules ```"type": "module"``` so that imports and exports can be used in modern JavaScript standard, ```import x from 'module'``` and ```export const x = ...```.

##### Server:

- Install express (web framework: a toolkit that offers pre-built components such as Request/response handling) and its type definitions to build the webserver and Api ```npm install express npm install -D @types/express```.

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
