import sharp, { ExtendOptions } from 'sharp';
import fs from 'fs';
import convertStream from 'convert-stream';

import { Option } from '../../common/interface/Option';
import { SuperCommand } from '../../common/SuperCommand';
import { Argument } from '../../common/interface/Argument';
import { Names } from '../../common/interface/Names';

const argumentss: Argument[] = [];
const options: Option[] = [
  Option.height,
  Option.input,
  Option.left,
  Option.output,
  Option.top,
  Option.width,
];

interface TrimInfo {
  format: string,
  width: number,
  height: number,
  channels: number,
  premultiplied: boolean,
  trimOffsetLeft: number,
  trimOffsetTop: number,
  size: number
}

export class Command extends SuperCommand {
  description: string = 'CLI wrapper for Sharp extract';
  alias: string = 'extract';

  public async execute(vital?: boolean, input?: any) {
    await super.executeWithInput(argumentss, options, input, vital, async () => {
      const inputFile = this.input[Names.INPUT]
        ? fs.readFileSync(this.input[Names.INPUT])
        : (await convertStream.toBuffer(process.stdin)) as Buffer;
      const outputFilePath = this.input[Names.OUTPUT];
      const height = this.input[Names.HEIGHT];
      const left = this.input[Names.LEFT];
      const top = this.input[Names.TOP];
      const width = this.input[Names.WIDTH];

      let trimResults: TrimInfo;
      if (this.input[Names.INPUT]) {
        try {
          const inputBuffer = (await convertStream.toBuffer(process.stdin)) as Buffer
          const possibleJson = inputBuffer.toString();
          trimResults = JSON.parse(possibleJson);
        } catch (error) {
          // That's fine, probably no TrimInfo was passed
        }
      }

      const sharpInstance = sharp(inputFile);
      if (trimResults) {
        await sharpInstance.extract({
          top: trimResults.trimOffsetTop * -1, // trim offset is negative
          width: trimResults.width,
          left: trimResults.trimOffsetLeft,
          height: trimResults.height,
        });
      } else {
        await sharpInstance.extract({
          top: top ? parseInt(top, 10) : 0,
          width: width ? parseInt(width, 10) : 0,
          left: left ? parseInt(left, 10) : 0,
          height: height ? parseInt(height, 10) : 0,
        });
      }

      if (outputFilePath) {
        await sharpInstance.toFile(outputFilePath);
      } else {
        const buffer = await sharpInstance.toBuffer();
        process.stdout.write(buffer);
      }
    });
  }
}
