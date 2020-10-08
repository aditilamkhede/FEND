import "babel-polyfill";
// const fetch = require("node-fetch");

// const { checkForName, validateURL } = require('../src/client/js/validate');
const { validateInput } = require('../src/client/js/formMain');

const travelApi = require('../src/client/js/formMain');
// import * as nlpapi from '../src/client/js/formHandler';
console.log(travelApi);

const url = 'http://localhost:5000/weather';
// const urldata = {nlpurl: 'http://techcrunch.com/2015/07/16/microsoft-will-never-give-up-on-mobile'};
const weatherdata = { weather: [
    {
      temp: 64.4,
      date: '2020-08-19',
      icon: 'r03d',
      iconDesc: 'Heavy rain'
    },
    {
      temp: 64,
      date: '2020-08-20',
      icon: 'r03d',
      iconDesc: 'Heavy rain'
    },
    {
      temp: 62.3,
      date: '2020-08-21',
      icon: 'r02d',
      iconDesc: 'Moderate rain'
    },
    {
      temp: 63.4,
      date: '2020-08-22',
      icon: 'r03d',
      iconDesc: 'Heavy rain'
    },
    {
      temp: 61.4,
      date: '2020-08-23',
      icon: 'r03d',
      iconDesc: 'Heavy rain'
    },
    {
      temp: 62.4,
      date: '2020-08-24',
      icon: 'r03d',
      iconDesc: 'Heavy rain'
    },
    {
      temp: 62.4,
      date: '2020-08-25',
      icon: 'r02d',
      iconDesc: 'Moderate rain'
    },
    {
      temp: 62.7,
      date: '2020-08-26',
      icon: 'r03d',
      iconDesc: 'Heavy rain'
    }
  ]
};

test('validates input', () => {
  expect(validateInput('san jose', '10/04/2020')).toBe(undefined);
})

test('testing post weather data', async (done) => {
  // expect.assertions(1);
  await expect(travelApi.postWeatherData).toBeDefined();

  // const data = await travelApi.postWeatherData(url, weatherdata);
  // console.log('data.categories[0].code - ', data.weather[0].temp);
  // await expect(data.weather).toBe('Ron Miller');

  done();
});
