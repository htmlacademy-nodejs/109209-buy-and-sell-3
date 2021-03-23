'use strict';
const fs = require(`fs`);
const path = require(`path`);
const {promisify} = require(`util`);
const chalk = require(`chalk`);

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.getContent = async (name) => {
  const readFile = promisify(fs.readFile);
  const pathFile = path.join(`data`, `${name}.txt`);

  try {
    const data = await readFile(pathFile, `utf8`);
    return data.split(`\n`);
  } catch (e) {
    return console.error(chalk.red(e));
  }
};
