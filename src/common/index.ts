import _ from 'lodash';

import { SuperCommand } from './SuperCommand';

export async function sleep(milliseconds?: number) {
  const time = milliseconds
    ? milliseconds
    : 100;
  await new Promise(resolve => setTimeout(resolve, time));
}

export async function exponentialBackOff<T>(action: () => T, timesRetried: number = 0): Promise<T> {
  try {
    return await action();
  } catch (error) {
    if (error.message.indexOf('Rate exceeded') > -1) {
      console.log(`Exponential Backoff Error: ${error.message}`);

      // https://cloud.google.com/iot/docs/how-tos/exponential-backoff
      const extraSeconds = Math.random();
      const delaySeconds = Math.pow(2, timesRetried) + extraSeconds;
      console.log(`Delaying ${delaySeconds} before retrying...`);

      const delayMilliseconds = delaySeconds * 1000;
      sleep(delayMilliseconds);
      return await exponentialBackOff(action, timesRetried + 1);
    }
    throw error;
  }
}

export function execute(command: SuperCommand) {
  try {
    (async () => {
      await command.prepareExecution();
      process.exit();
    })();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export function revealAllProperties(object: any): any {
  const objectReferences: any[] = [];

  do {
    objectReferences.unshift(object);
    // tslint:disable-next-line: no-parameter-reassignment
  } while (object = Object.getPrototypeOf(object));

  const enumeratedObject: any = {};
  for (const objectReference of objectReferences) {
    Object.getOwnPropertyNames(objectReference).forEach((property) => {
      enumeratedObject[property] = _.cloneDeep(objectReference[property]);
    });
  }

  return enumeratedObject;
}
