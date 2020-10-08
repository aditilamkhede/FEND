const request = require('supertest');
// const app = require('../src/server/server');

import { app } from '../src/server/server';

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

describe('Tests server Weather endpoints', () => {

  let req = null
  let server = null

  beforeAll(async function(done){
    server = await app.listen(done);
    req = request.agent(server);
    done();
  });

  afterAll(async function(done){
    return await server && server.close(done);
  });

  // This passes because 1 === 1
  it('Async test', async done => {
    // Do your async tests here
    done();
  });

  it('should test get endoint', async(done) => {
    const res = await request(app).get('/all');
    expect(res.statusCode).toEqual(200);
    console.log('get res.body - ', res.body);
    // expect(res.body).toHaveProperty('title');
    done();
  });

  it('should test weather post endpoint', async(done) => {
    const res = await request(app)
      .post('/weather')
      .send(weatherdata);
      // .send(urldata);
    console.log('post - ', res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('weather');
    done();
  });

});
