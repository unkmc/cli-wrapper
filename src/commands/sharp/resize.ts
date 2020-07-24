import sharp from 'sharp';
import fs from 'fs';
import convertStream from 'convert-stream';

import { Option } from '../../common/interface/Option';
import { SuperCommand } from '../../common/SuperCommand';
import { Argument } from '../../common/interface/Argument';
import { Names } from '../../common/interface/Names';

const argumentss: Argument[] = [];
const options: Option[] = [
  Option.fastShrinkOnLoad,
  Option.fit,
  Option.height,
  Option.input,
  Option.kernel,
  Option.output,
  Option.position,
  Option.width,
  Option.withoutEnlargement,
  Option.background,
];

export class Command extends SuperCommand {
  description: string = 'CLI wrapper for Sharp resize';
  alias: string = 'resize';

  private validPositions = [
    "top", "right top", "right", "right bottom", "bottom", "left bottom", "left", "left top",
    "north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest", "center", "centre",
    "cover", "entropy", "strategy"
  ];
  private validFits = ["contain", "cover", "fill", "inside", "outside"];
  private validKernels = ["nearest", "cubic", "mitchell", "lanczos2", "lanczos3"];

  public async execute(vital?: boolean, input?: any) {
    await super.executeWithInput(argumentss, options, input, vital, async () => {
      const inputFile = this.input[Names.INPUT]
        ? fs.readFileSync(this.input[Names.INPUT])
        : await convertStream.toBuffer(process.stdin);
      const fastShrinkOnLoad = this.input[Names.FAST_SHRINK_ON_LOAD];
      const fit: any = this.input[Names.FIT];
      const height = this.input[Names.HEIGHT];
      const kernel = this.input[Names.KERNEL];
      const outputFilePath = this.input[Names.OUTPUT];
      const position = this.input[Names.POSITION];
      const width = this.input[Names.WIDTH];
      const withoutEnlargement = this.input[Names.WITHOUT_ENLARGEMENT];
      const background = this.input[Names.BACKGROUND];
      let backgroundObject: any = undefined;

      if (fit && !this.validFits.includes(fit)) {
        throw new Error(`Fit must be one of: ${this.validFits}`);
      }
      if (position && !this.validPositions.includes(position)) {
        throw new Error(`Fit must be one of: ${this.validPositions}`);
      }
      if (kernel && !this.validKernels.includes(kernel)) {
        throw new Error(`Fit must be one of: ${this.validKernels}`);
      }
      try {
        if (background) {
          backgroundObject = JSON.parse(background);
        }
      } catch (error) {
        console.error(`Unable to parse background string, "${background}" as JSON`);
        console.error(`It should match the format, "{r:0,g:0,b:0,alpha:0.5}"`);
        throw error;
      }
      if (withoutEnlargement &&
        withoutEnlargement.toLocaleUpperCase() != "TRUE" &&
        withoutEnlargement.toLocaleUpperCase() != "FALSE") {
        console.error("Option, \"without enlargement\" must be \"true\" or \"false\"");
      }
      if (fastShrinkOnLoad &&
        fastShrinkOnLoad.toLocaleUpperCase() != "TRUE" &&
        fastShrinkOnLoad.toLocaleUpperCase() != "FALSE") {
        console.error("Option, \"fast shrink on load\" must be \"true\" or \"false\"");
      }

      const sharpInstance = sharp(inputFile);
      await sharpInstance.resize({
        fit,
        position,
        withoutEnlargement: withoutEnlargement ? withoutEnlargement.toLocaleUpperCase() == "TRUE" : undefined,
        fastShrinkOnLoad: fastShrinkOnLoad ? fastShrinkOnLoad.toLocaleUpperCase() == "TRUE" : undefined,
        width: width ? parseInt(width, 10) : undefined,
        height: height ? parseInt(height, 10) : undefined,
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
