import { spawn } from 'child_process';

export async function getCommandOutput(command: string, parameters?: string[], options?: any): Promise<string> {
  const dataHolder = [];
  const child = spawn(command, parameters, options);
  child.stdout.on('data', data => dataHolder.push(data));
  child.stderr.on('data', data => dataHolder.push(data));

  return new Promise<string>((resolve, reject) => {
    child.on('close', (code) => {
      if (code === 0) {
        resolve(dataHolder.join('').trim());
      } else {
        reject({ message: dataHolder.join('').trim() });
      }
    });
  });
}

export async function executeCommand(command: string, parameters?: string[], injectedOptions?: any): Promise<any> {
  const options = Object.assign({ stdio: 'inherit' }, injectedOptions);
  console.log(`\nRunning command: ${[command].concat(parameters).join(' ')}`);
  const child = spawn(command, parameters, options);

  return new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code === 0) {
        resolve('Success');
      } else {
        reject(`Failure: ${code}`);
      }
    });
  });
}
