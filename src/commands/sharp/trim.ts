import sharp from 'sharp';
import fs from 'fs';
import convertStream from 'convert-stream';

import { Option } from '../../common/interface/Option';
import { SuperCommand } from '../../common/SuperCommand';
import { Argument } from '../../common/interface/Argument';
import { Names } from '../../common/interface/Names';

const argumentss: Argument[] = [];
const options: Option[] = [
  Option.input,
  Option.output,
  Option.threshold,
  Option.justInfo,
];

export class Command extends SuperCommand {
  description: string = 'CLI wrapper for Sharp trim';
  alias: string = 'trim';

  public async execute(vital?: boolean, input?: any) {
    await super.executeWithInput(argumentss, options, input, vital, async () => {
      const inputFile = this.input[Names.INPUT]
        ? fs.readFileSync(this.input[Names.INPUT])
        : await convertStream.toBuffer(process.stdin);
      const outputFilePath = this.input[Names.OUTPUT];
      const threshold = this.input[Names.THRESHOLD] ? parseInt(this.input[Names.THRESHOLD], 10) : 10;
      const justInfo = this.input[Names.JUST_INFO] && this.input[Names.JUST_INFO].toLocaleUpperCase() == 'TRUE';

      const sharpInstance = sharp(inputFile);
      await sharpInstance.trim(threshold);

      if (outputFilePath) {
        await sharpInstance.toFile(outputFilePath);
      } else {
        const buffer = await sharpInstance.toBuffer({ resolveWithObject: true });
        if (justInfo) {
          process.stdout.write(JSON.stringify(buffer.info));
        } else {
          process.stdout.write(buffer.data);
        }
      }
    });
  }
}
