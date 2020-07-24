import inquirer from 'inquirer';

import { Input } from './Input';

export interface Argument {
  name: string;
  description: string;
  getQuestion: (input: Input) => Promise<inquirer.Question> | Promise<inquirer.Question[]>;
  configure: (input: any) => void | Promise<void>;
  default?: string;
}

export namespace Argument {}
