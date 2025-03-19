#!/usr/bin/env node
import fs from "fs-extra";
import inquirer from "inquirer";
import chalk from "chalk";

// 🏗️ Component Template
const componentTemplate = (name) => `
import React from 'react';

const ${name} = () => {
    return (
        <div>
            <h2>${name}</h2>
        </div>
    );
};

export default ${name};
`;

// 🔥 Redux Slice Template
const reduxTemplate = (name) => `
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: [],
};

const ${name.toLowerCase()}Slice = createSlice({
    name: '${name.toLowerCase()}',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        }
    }
});

export const { setData } = ${name.toLowerCase()}Slice.actions;
export default ${name.toLowerCase()}Slice.reducer;
`;

// 📌 CRUD Module Generator Function
async function createCrudModule(name) {
  const basePath = `src/components/${name}`;
  await fs.ensureDir(basePath);

  const files = [
    {
      path: `${basePath}/${name}List.tsx`,
      content: componentTemplate(`${name}List`),
    },
    {
      path: `${basePath}/${name}Form.tsx`,
      content: componentTemplate(`${name}Form`),
    },
    {
      path: `${basePath}/${name}Details.tsx`,
      content: componentTemplate(`${name}Details`),
    },
    {
      path: `${basePath}/${name}Edit.tsx`,
      content: componentTemplate(`${name}Edit`),
    },
    {
      path: `src/redux/${name.toLowerCase()}Slice.ts`,
      content: reduxTemplate(name),
    },
  ];

  for (const file of files) {
    await fs.outputFile(file.path, file.content);
    console.log(chalk.green(`✔ Created: ${file.path}`));
  }
}

// 🚀 CLI Input Handler
async function main() {
  const { moduleName } = await inquirer.prompt([
    {
      type: "input",
      name: "moduleName",
      message: "Enter module name (e.g., Users):",
    },
  ]);

  await createCrudModule(moduleName);
  console.log(chalk.blue("🎉 CRUD module created successfully!"));
}

main();
