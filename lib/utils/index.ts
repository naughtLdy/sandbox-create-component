import * as fs from 'fs';
import { prompt, Separator, QuestionCollection, Answers } from 'inquirer';
import snakelize from './snakelize';

const src = 'src';
const templateDir = 'template';
const componentDir = `${src}/components`;
const localeComponentDir = `${src}/locales/ja/components`;

let componentName = '';
let componentFileDir = '';
let componentCreateOption: string[] = [];
let localeFileDir = '';

export default async (): Promise<void> => {
  // compoennt name
  const inputQuestions: QuestionCollection = [
    {
      type: 'input',
      message: "What's component name",
      name: 'name',
      validate: (componentName: string): boolean | string => {
        if (componentName === '') {
          return 'You must input component name';
        }
        if (fs.existsSync(`${componentDir}/${componentName}`)) {
          return 'already exists';
        }

        return true;
      },
    },
  ];
  await prompt(inputQuestions).then((answers: Answers) => {
    console.log(JSON.stringify(answers, null, '  '));
    componentName = answers.name;
    componentFileDir = `${componentDir}/${answers.name}`;
    localeFileDir = `${localeComponentDir}/${snakelize(answers.name)}`;
  });

  // generate option
  const checkboxQuestions: QuestionCollection = [
    {
      type: 'checkbox',
      message: 'select',
      name: 'select',
      choices: [
        new Separator('What do you need?'),
        { name: 'storybook' },
        { name: 'utils' },
        { name: 'locales' },
      ],
    },
  ];
  await prompt(checkboxQuestions).then((answers: Answers) => {
    console.log(JSON.stringify(answers, null, '  '));
    componentCreateOption = answers.select;
  });

  console.log('generate component files ...');

  // copy files
  fs.mkdirSync(componentFileDir, { recursive: true });
  fs.readFile(`${templateDir}/components/index.vue`, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/<%= component-name %>/g, componentName);

    fs.writeFile(`${componentFileDir}/index.vue`, result, 'utf8', function (
      err,
    ) {
      if (err) return console.log(err);
    });
  });
  fs.readFile(`${templateDir}/components/index.ts`, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/<%= component-name %>/g, componentName);

    fs.writeFile(`${componentFileDir}/index.ts`, result, 'utf8', function (
      err,
    ) {
      if (err) return console.log(err);
    });
  });

  // component option
  if (componentCreateOption.length > 0) {
    if (componentCreateOption.find((option) => option === 'storybook')) {
      fs.mkdirSync(`${componentFileDir}/__stories__`, { recursive: true });
      fs.readFile(
        `${templateDir}/components/__stories__/index.stories.ts`,
        'utf8',
        (err, data) => {
          if (err) {
            return console.log(err);
          }
          var result = data.replace(/<%= component-name %>/g, componentName);

          fs.writeFile(
            `${componentFileDir}/__stories__/index.stories.ts`,
            result,
            'utf8',
            function (err) {
              if (err) return console.log(err);
            },
          );
        },
      );
    }

    if (componentCreateOption.find((option) => option === 'utils')) {
      fs.mkdirSync(`${componentFileDir}/utils`, { recursive: true });
      fs.copyFile(
        `${templateDir}/components/utils/index.ts`,
        `${componentFileDir}/utils/index.ts`,
        (err) => {
          if (err) throw err;
          console.log(`create file ${componentFileDir}/utils/index.ts`);
        },
      );
      fs.mkdirSync(`${componentFileDir}/utils/__tests__`, { recursive: true });
      fs.copyFile(
        `${templateDir}/components/utils/__tests__/index.test.ts`,
        `${componentFileDir}/utils/__tests__/index.test.ts`,
        (err) => {
          if (err) throw err;
          console.log(
            `create file ${componentFileDir}/utils/__tests__/index.test.ts`,
          );
        },
      );
    }

    if (componentCreateOption.find((option) => option === 'locales')) {
      fs.mkdirSync(localeFileDir, { recursive: true });
      fs.copyFile(
        `${templateDir}/locales/index.ts`,
        `${localeFileDir}/index.ts`,
        (err) => {
          if (err) throw err;
          console.log(`create file ${localeFileDir}/index.ts`);
        },
      );
    }
  }
};
