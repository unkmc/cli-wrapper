import _ from 'lodash';
import inquirer from 'inquirer';

import { Option } from './interface/Option';
import { Argument } from './interface/Argument';
import { Names } from './interface/Names';
import { revealAllProperties } from '.';

export abstract class SuperCommand {
  abstract alias: string;
  abstract description: string;
  input: { [inputName: string]: string };
  requiredOptions: Option[];
  public abstract execute(vital?: boolean, input?: any): Promise<void>;

  public async prepareExecution(options: Option[] = [], argumentss: Argument[] = [], input?: any) {
    options.unshift(Option.force);
    options.unshift(Option.help);
    this.requiredOptions = options;
    this.input = await this.verifyInput(options, argumentss, input);
  }

  public async executeWithInput(
    argumentss: Argument[],
    options: Option[],
    input: any,
    vital: boolean,
    functionToExecute: (input: any) => Promise<void>,
  ) {
    try {
      await this.prepareExecution(options, argumentss, input);
      if (this.input[Names.HELP]) {

      }
      await functionToExecute(input);
    } catch (error) {
      console.log(`An error ocurred: ${error}`);
      console.log(error.stack);
      if (vital) process.exit(1);
    }
  }

  public async confirm(message, confirmDefault = true, throwOnFalse = true): Promise<boolean> {
    if (this.input[Names.FORCE] && this.input[Names.FORCE].toLocaleUpperCase() === 'TRUE') {
      return true;
    }
    const answers: any = await inquirer.prompt({
      message,
      type: 'confirm',
      name: 'confirm',
      default: confirmDefault,
    });
    if (throwOnFalse && !answers.confirm) {
      console.log(`Confirmation failed, aborting.`);
      process.exit();
    }
    return answers.confirm;
  }

  public async verifyInput(options: Option[], argumentss: Argument[], injectedInput: any) {
    if (injectedInput) {
      this.verifyInjectedInput(argumentss, injectedInput);
      return injectedInput;
    }

    const parsedArgumentsAndOptions = await this.parseArgumentsAndOptions(options, argumentss);
    argumentss.forEach((argument) => {
      const found = !!parsedArgumentsAndOptions[argument.name];
      if (!found) {
        console.log(`Did not find argument: ${argument.name}`);
        throw new Error(`Did not find argument: ${argument.name}`);
      }
    });

    // Prompt for values for any configured but not-supplied options...
    if (options && options.length > 1) {
      let answers = {};
      for (const option of options) {
        if (!parsedArgumentsAndOptions[option.name]) {
          const question = await option.getQuestion(answers);
          if (question) {
            const answer = await inquirer.prompt([question]) as any;
            answers = Object.assign(answer, answers);
          }
        }
        await option.configure({ ...parsedArgumentsAndOptions, ...answers });
      }
      return { ...parsedArgumentsAndOptions, ...answers };
    }
    return parsedArgumentsAndOptions;
  }

  private async parseArgumentsAndOptions(
    options: Option[],
    argumentss: Argument[],
  ) {
    try {
      // Commander sucks at parsing arguments, I'll do it myself.
      const parsedArguments: { [argumentName: string]: any } = {};
      const parsedOptions: { [optionName: string]: any } = {};

      // argv will look like this: [
      //   "/Users/userName/.nvm/versions/node/v12.13.0/bin/node",
      //   "/Users/userName/.nvm/versions/node/v12.13.0/bin/wrap",
      //   "gcam",
      //   "ok" ]
      const argv = _.clone(process.argv);
      const args = (argv as string[]).slice(3, argv.length)

      if (argumentss.length > 0) {
        for (let index = 0; index < argumentss.length; index += 1) {
          const argument = argumentss[index];
          const inputArg = args.shift();
          parsedArguments[argument.name] = inputArg || argument.default;
        }
      }

      if (options.length > 0) {
        const inputOptions: { [flag: string]: string } = {};
        while (args.length > 0) {
          const inputOption = args.splice(0, 2);
          if (inputOption.includes(`-${Option.help.shortName}`)) {
            console.log(`Help for this command:`);
            if (argumentss.length > 0) {
              argumentss.forEach((argument) => {
                console.log(`${argument.name} : ${argument.description}`);
              });
            }
            if (options.length > 0) {
              options.forEach((option) => {
                console.log(`-${option.shortName} ${option.name} : ${option.description}`);
              });
            }
            process.exit(1);
          }
          inputOptions[inputOption[0]] = inputOption[1];
        }
        options.forEach((option) => {
          const matchingInputOptionValue = inputOptions[`-${option.shortName}`]
          if (matchingInputOptionValue) {
            parsedOptions[option.name] = matchingInputOptionValue;
          }
        })
      }
      return {
        ...parsedArguments,
        ...parsedOptions,
      };
    } catch (error) {
      console.log(`ERROR: ${error}`);
      return {};
    }
  }

  public verifyInjectedInput(argumentss: Argument[], injectedInput: any) {
    const injectedInputMissing = argumentss.find((option) => {
      return !injectedInput[option.name];
    });
    if (injectedInputMissing) {
      throw new Error(`Required input not found.\n` +
        `Required: ${JSON.stringify(injectedInputMissing)}\n` +
        `Found: ${JSON.stringify(injectedInput)} `);
    }
  }
}
