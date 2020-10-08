/* Global Variables */
const api_GeoBaseURL = 'http://api.geonames.org/searchJSON?q=';
const api_WBitBaseURL_FCast = 'https://api.weatherbit.io/v2.0/forecast/daily?key='
const api_WBitBaseURL_Curr = 'https://api.weatherbit.io/v2.0/current?key='
const api_pxbBaseURL = 'https://pixabay.com/api/?key='


let zip = '95124'
let cityName = 'san jose'
let country = 'us'
let state = ''
const appID_WBit = '5e91a20278054587941f9c330a3be04e'
const key_Pxb = '17496130-86911d19665df26c192b13e9a'
const username = 'aditilamkhede'

// Create a new date instance dynamically with JS
let d = new Date();
let todaysDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
// d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();
let countryCodeArray;

//Initialize function imported in index.js and exported from there
function init() {
  console.log("In Init");
  //register click event listner
  document.getElementById('generate').addEventListener('click', generateOnClick);
  // document.getElementById('cityName').addEventListener('key');

  function debounce(callback, wait) {
    let timeout;
    return (...args) => {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(context, args), wait);
    };
  }
  const elmPlace = document.getElementById('cityName');
  const elmCountry = document.querySelector("#country");
  elmCountry.addEventListener('change', onCountrySelect);
  elmPlace.addEventListener('keyup', debounce( () => {
    // code you would like to run 1000ms after the keyup event has stopped firing
    // further keyup events reset the timer, as expected
    console.log('Inside event listner call');
    fetch(`${api_GeoBaseURL}${elmPlace.value}&username=${username}`)
    .then(res=>res.json())
    .then(res=>{
      console.log(res);
      // const countryCodeArray = [...new Set(res.geonames.map(item=>[item.countryCode, item.countryName]))]
      countryCodeArray = res.geonames.map(item=>[item.countryCode, item.countryName, ((item.adminCodes1) ? item.adminCodes1.ISO3166_2 : (undefined, item.adminCode1)), item.adminName1]);
      console.log(countryCodeArray);
      const selectInput = (countryCodeArray) =>{

        elmCountry.innerHTML = "";
        // console.log('divCountry after', divCountry);
        const optCountry = `${ [...new Set(countryCodeArray.map(item => `<option value="${item[0]}">${item[1]}</option>\n`))]}`;
        console.log('optCountry', optCountry);
        elmCountry.innerHTML = optCountry.replace(/,/ig, '');

        //Selects first value in both dropdowns
        elmCountry.selectedIndex = 0;
        onCountrySelect();

    }
    // create select input
    selectInput(countryCodeArray)
  })
}, 1000))



}

function onCountrySelect() {
  console.log('onCountrySelect', countryCodeArray);
  const elmState = document.querySelector("#state");
  const elmCountry = document.querySelector("#country");
  const optState = `${ [...new Set(countryCodeArray.map(item => ((item[0] == elmCountry.options[elmCountry.selectedIndex].value) ?  (`<option value="${item[2]}">${item[3]}</option>\n`) : null)))]}`;
  elmState.innerHTML = optState.replace(/,/ig, '');
  console.log('optState', optState.replace(/,/ig, ''));
}


function generateOnClick(e) {
  console.log('In click');

  const elmState = document.querySelector("#state");
  const elmCountry = document.querySelector("#country");

  cityName = document.getElementById('cityName').value;
  const elmDate = document.getElementById('startDate');
  country = elmCountry.options[elmCountry.selectedIndex].value;
  const countryName = elmCountry.options[elmCountry.selectedIndex].text;
  state = elmState.options[elmState.selectedIndex].value;

  // Validate form input
  validateInput(cityName, elmDate.value);

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(elmDate.value);
  alert(firstDate);
  // alert(elmDate.value);
  // const secondDate = new Date(newDate);
  // alert(newDate, secondDate);


  const diffDays = Math.round(Math.abs((firstDate - todaysDate) / oneDay));
  alert(diffDays);

  // const userResponse = document.getElementById('feelings').value;
  getCoordinates(api_GeoBaseURL, cityName, country, state, username)
  .then(function(data){
    console.log(data.geonames[0]);
    let arrData = [data.geonames[0].lat, data.geonames[0].lng, data.geonames[0].countryName];
    console.log(arrData);
    let wBitURL = api_WBitBaseURL_Curr;
    if(diffDays > 1) {
      wBitURL = api_WBitBaseURL_FCast;
    }
    getWeatherData(wBitURL, arrData[0], arrData[1], appID_WBit, diffDays)
    .then(function(res) {
      console.log('response', res.data);
      // let date = new Date(res.data[0].valid_date * 1000);
      const weatherDataArr = preapareData(res.data);
      console.log("weatherDataArr - ", weatherDataArr);
      // postWeatherData('http://localhost:5000/weather', {temperature: res.data[0].temp, date: res.data[0].datetime, userip: userResponse})
      postWeatherData('http://localhost:5000/weather', {"weather": weatherDataArr})
      .then(function() {
        getLocationImage(api_pxbBaseURL, cityName, key_Pxb)
        .then(function(resImg) {
          let imgURL = '';
          console.log('resImg.hits', resImg.hits);
          console.log('resImg.hits.length', resImg.hits.length);
          if (resImg.hits.length > 0) {
            imgURL = resImg.hits[0].largeImageURL;
            console.log(imgURL);
            updateWeatherUI(imgURL);
          }
          else {
            getLocationImage(api_pxbBaseURL, countryName, key_Pxb)
            .then(function(resImg) {
              imgURL = resImg.hits[0].largeImageURL;
              console.log(imgURL);
              updateWeatherUI(imgURL);
            })
          }

        })
      })
    })

  });

  // console.log('data', data);
}

function validateInput(cityName, startDt) {
  let errorDtElm = document.getElementById('errorDt');
  let errorElm = document.getElementById('errorZip');
  if (startDt === "" || startDt === null) {
    console.log("Please enter valid trip start date.");

    errorDtElm.innerHTML = 'Please enter valid trip start date.';
    // errorElm.style.display = "block";
    return;
  }
  else {
    // document.getElementById('error').style.display = "none";
    if (errorDtElm) {
      errorDtElm.innerHTML = '';
    }

  }

  if (cityName === "" || cityName === null) {
    console.log("Please enter valid cityName.");

    errorElm.innerHTML = 'Please enter valid cityName code.';
    // errorElm.style.display = "block";
    return;
  }
  else {
    // document.getElementById('error').style.display = "none";
    if (errorElm) {
      errorElm.innerHTML = '';
    }

  }

}

function preapareData(wData) {
  let jsonObjArr = [];
  for (var i = 0; i < wData.length; i++) {
    const jsonObj = { "temp": wData[i].temp, "date": wData[i].datetime, "icon": wData[i].weather.icon, "iconDesc": wData[i].weather.description}
    jsonObjArr.push(jsonObj);
  }
  return jsonObjArr;
}

//get Latitude, longitude and country
const getCoordinates = async(baseURL, cityName, country, state, username) => {
  const wURL = `${baseURL}${ cityName }&country=${country}&adminCodes1=ISO3166_2:${state}&maxRows=1&username=${ username }`;
  console.log(wURL);
  const res = await fetch(wURL);
  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch(e) {
    console.log('Error', e);
  }
}


//get request to get weather data
const getWeatherData = async(apiBaseURL, lat, lon, key, days) => {
  const wURL = `${apiBaseURL}${key}&lat=${lat}&lon=${lon}&units=i&days=${days}`;
  console.log(wURL);
  const res = await fetch(wURL);
  try {
    const data = await res.json();
    console.log(data.data);
    return data;
  } catch(e) {
    console.log('Error', e);
  }
}

const getLocationImage = async(apiBaseURL, location, key) => {
  const wURL = `${apiBaseURL}${key}&q=${encodeURIComponent(location)}&image_type=photo&pretty=true`;
  console.log(wURL);
  const res = await fetch(wURL);
  try {
    const data = await res.json();
    console.log(data.hits);
    return data;
  } catch(e) {
    console.log('Error', e);
  }
}

//post request
const postWeatherData = async(url='', data={}) => {
  console.log("In Post 1", url, data);
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  try {
    const newData = await res.json();
    // console.log("In post data", newData);
    return newData;
  } catch (e) {
    console.log('Error', e);
  }
}

//Get HTML data
function getHTMLData(wData) {
  let elmHTML = "";
  for (var i = 0; i < wData.length; i++) {
    // elmHTML += `<div class="">Date: <div id="date">${wData[i].temp}</div></div>
    //   <div class="">Temperature: <div id="temp">${wData[i].date}</div></div>`

    elmHTML += `<div id="date">${wData[i].date}</div>
      <div id="temp">${wData[i].temp}</div>
      <div id="icon"><img height="50" width="50" alt="${wData[i].iconDesc}"
      src="https://www.weatherbit.io/static/img/icons/${wData[i].icon}.png"></div>`;
  }
  return elmHTML;
}

// update UI with weather database
const updateWeatherUI = async(imgURL) => {
  const req = await fetch('http://localhost:5000/all');
  try {
    const data = await req.json();
    const elmWeather = getHTMLData(data.weather);
    // console.log('elmWeather', elmWeather);
    console.log('imgURL', imgURL);
    document.getElementById('entryHolder').innerHTML = elmWeather;

    // document.getElementById('date').innerHTML = data.date;
    // document.getElementById('temp').innerHTML = data.temperature;
    // document.getElementById('content').innerHTML = data.userip;
    document.body.style.background = `url(${imgURL}) no-repeat center center fixed`;

  } catch (e) {
    console.log('Error - ', e);
  }
}

export { init, validateInput, postWeatherData }
