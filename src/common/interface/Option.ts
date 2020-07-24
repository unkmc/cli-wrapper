import inquirer from 'inquirer';
import { Input } from './Input';
import { Names } from './Names';

export interface Option {
  name: string;
  shortName: string;
  description: string;
  getQuestion: (input: Input) => Promise<inquirer.Question> | Promise<inquirer.Question[]>;
  configure: (input: any) => void;
}

export namespace Option {
  export const force: Option = {
    name: Names.FORCE,
    shortName: 'F',
    description: 'Skip input confirmation',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const help: Option = {
    name: Names.HELP,
    shortName: '?',
    description: 'Print help information',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const width: Option = {
    name: Names.WIDTH,
    shortName: 'w',
    description: 'Width',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const height: Option = {
    name: Names.HEIGHT,
    shortName: 'h',
    description: 'Height',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const input: Option = {
    name: Names.INPUT,
    shortName: 'i',
    description: 'Input file path',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const background: Option = {
    name: Names.BACKGROUND,
    shortName: 'b',
    description: 'Background',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const fastShrinkOnLoad: Option = {
    name: Names.FAST_SHRINK_ON_LOAD,
    shortName: 's',
    description: 'Fast shrink on load (boolean)',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const fit: Option = {
    name: Names.FIT,
    shortName: 'f',
    description: 'Fit',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const kernel: Option = {
    name: Names.KERNEL,
    shortName: 'k',
    description: 'Kernel',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const position: Option = {
    name: Names.POSITION,
    shortName: 'p',
    description: 'Position',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const withoutEnlargement: Option = {
    name: Names.WITHOUT_ENLARGEMENT,
    shortName: 'e',
    description: 'Without enlargement (boolean)',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const output: Option = {
    name: Names.OUTPUT,
    shortName: 'o',
    description: 'Output',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const top: Option = {
    name: Names.TOP,
    shortName: 't',
    description: 'top',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const bottom: Option = {
    name: Names.BOTTOM,
    shortName: 'bo',
    description: 'bottom',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const left: Option = {
    name: Names.LEFT,
    shortName: 'l',
    description: 'left',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const right: Option = {
    name: Names.RIGHT,
    shortName: 'r',
    description: 'right',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const threshold: Option = {
    name: Names.THRESHOLD,
    shortName: 't',
    description: 'threshold',
    getQuestion: () => undefined,
    configure: () => undefined,
  };

  export const justInfo: Option = {
    name: Names.JUST_INFO,
    shortName: 'j',
    description: 'Only print the info object, do not write to file or output buffer',
    getQuestion: () => undefined,
    configure: () => undefined,
  };
}
