import sharp, { ExtendOptions } from 'sharp';
import fs from 'fs';
import convertStream from 'convert-stream';

import { Option } from '../../common/interface/Option';
import { SuperCommand } from '../../common/SuperCommand';
import { Argument } from '../../common/interface/Argument';
import { Names } from '../../common/interface/Names';

const argumentss: Argument[] = [];
const options: Option[] = [
  Option.background,
  Option.bottom,
  Option.input,
  Option.left,
  Option.output,
  Option.right,
  Option.top,
];

export class Command extends SuperCommand {
  description: string = 'CLI wrapper for Sharp extend';
  alias: string = 'extend';

  public async execute(vital?: boolean, input?: any) {
    await super.executeWithInput(argumentss, options, input, vital, async () => {
      const inputFile = this.input[Names.INPUT]
        ? fs.readFileSync(this.input[Names.INPUT])
        : await convertStream.toBuffer(process.stdin);
      const outputFilePath = this.input[Names.OUTPUT];
      const top = this.input[Names.TOP];
      const bottom = this.input[Names.BOTTOM];
      const left = this.input[Names.LEFT];
      const right = this.input[Names.RIGHT];
      const background = this.input[Names.BACKGROUND];
      let backgroundObject: any = undefined;

      try {
        if (background) {
          backgroundObject = JSON.parse(background);
        }
      } catch (error) {
        console.error(`Unable to parse background string, "${background}" as JSON`);
        console.error(`It should match the format, "{r:0,g:0,b:0,alpha:0.5}"`);
        throw error;
      }

      const sharpInstance = sharp(inputFile);
      await sharpInstance.extend({
        top: top ? parseInt(top, 10) : 0,
        bottom: bottom ? parseInt(bottom, 10) : 0,
        left: left ? parseInt(left, 10) : 0,
        right: right ? parseInt(right, 10) : 0,
        background: backgroundObject,
      })

      if (outputFilePath) {
        await sharpInstance.toFile(outputFilePath);
      } else {
        const buffer = await sharpInstance.toBuffer();
        process.stdout.write(buffer);
      }
    });
  }
}
