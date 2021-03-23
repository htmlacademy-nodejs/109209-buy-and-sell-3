'use strict';

const {
  getRandomInt,
  shuffle,
  getContent
} = require(`../../utils`);
const fs = require(`fs`);
const chalk = require(`chalk`);
const {promisify} = require(`util`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16
};

const getPictureFileName = (count) => {
  const prepareCount = count < 10 ? `0${count}` : count;
  return `item${prepareCount}.jpg`;
};

const generateOffers = async (count) => {
  const [titles, categories, sentences] = await Promise.all(
      [getContent(`titles`), getContent(`categories`), getContent(`sentences`)]
  );

  return Array(count).fill({}).map(() => ({
    category: [categories[getRandomInt(0, categories.length - 1)]],
    description: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: OfferType[Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const writeFile = promisify(fs.writeFile);

    try {
      const content = JSON.stringify(await generateOffers(countOffer));
      await writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
