#!/usr/bin/env node

import glob from 'glob';

import { SuperCommand } from './common/SuperCommand';
import { inspect } from 'util';
import { revealAllProperties } from './common';

const desiredCommand: string = process.argv[2];
const commandPaths: string[] = glob.sync(`${__dirname}/commands/**/*.js`);
const foundCommands: { [alias: string]: SuperCommand } = {};

const commandPromises = commandPaths.map(async (path) => {
  try {
    const command: SuperCommand = new (require(path).Command);
    if (desiredCommand === command.alias) {
      try {
        await command.execute(true);
        process.exit();
      } catch (error) {
        console.error(`An error occurred:`);
        console.error(JSON.stringify(revealAllProperties(error), null, 2));
        process.exit(1);
      }
    } else {
      if (foundCommands[command.alias]) throw new Error(`Duplicate command alias: ${command.alias}`);
      foundCommands[command.alias] = command;
      return command;
    }
  } catch (error) {
    console.error(`Problem occurred while trying to instantiate Command in file, '${path}'`);
    console.log(`${inspect(error, true)}`);
    process.exit(1);
  }
});

(async () => {
  const commands = await Promise.all(commandPromises);
  console.log(`Command not found, available commands:`);
  for (const command of commands) {
    console.log(`${command.alias}\t${command.description}`);
  }
})();
