# A basic Typescript Webserver

### Notes:

##### Setup:

- Install nvm to manage node.js versions across projects ```nvm install <version>```, then store the wanted node version in a .nvmrc file in the root and select it with ```nvm use```.

- Initialize a node.js project with ```npm init -y``` where the -y automatically answers yes to all the prompts that usually come from a plain ```npm init```.

- Install Typescript and node type definitions ```npm install -D typescript @types/node``` where -D means install package as a development dependency, which means it is only needed in development and not production.

- Create a tsconfig.json file in the root, this basically provides instructions to typescript on how to compile code. For instance the include ```"include": ["./src/**/*.ts"]``` key which notifies typescript on which files must be compiled and exclude ```"exclude": ["node_modules"]``` key which ignores specified files.

- Update package.json to use ES modules ```"type": "module"``` so that imports and exports can be used in modern JavaScript standard, ```import x from 'module'``` and ```export const x = ...```.