const usertab = document.querySelector("[data-userweather]");
const searchtab = document.querySelector("[data-searchweather]");
const usercontainer = document.querySelector(".weather-container");
const grantaccesscontainer = document.querySelector(
  ".grant-location-container"
);
const searchform = document.querySelector("[data-searchform]");
const loadingscreen = document.querySelector(".loading-container");
const userinfocontainer = document.querySelector(".user-info-container");
const error = document.querySelector(".error");

let currenttab = usertab;
const your_api_key = "aec6f3581255d4b457085d92b8fdde42";
currenttab.classList.add("current-tab");
getfromsessionstorage();

function switchtab(clickedtab) {
  if (clickedtab != currenttab) {
    currenttab.classList.remove("current-tab");
    currenttab = clickedtab;
    currenttab.classList.add("current-tab");

    if (!searchform.classList.contains("active")) {
      userinfocontainer.classList.remove("active");
      grantaccesscontainer.classList.remove("active");
      searchform.classList.add("active");
    } else {
      searchform.classList.remove("active");
      userinfocontainer.classList.remove("active");
      getfromsessionstorage();
    }
  }
}

usertab.addEventListener("click", () => {
  switchtab(usertab);
});

searchtab.addEventListener("click", () => {
  switchtab(searchtab);
});

// check if cordinates are already present in session layer
function getfromsessionstorage() {
  const localcoordinate = sessionStorage.getItem("user-coordinates");
  if (!localcoordinate) {
    grantaccesscontainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localcoordinate);
    fetchuserweatherinfo(coordinates);
  }
}

console.log(getfromsessionstorage);

async function fetchuserweatherinfo(coordinates) {
  const { lat, lon } = coordinates;
  grantaccesscontainer.classList.remove("active");
  loadingscreen.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${your_api_key}&units=metric`
    );

    if (!response.ok) {
      // Handle the error when the response is not ok
      throw new Error(`Weather data not available (${response.status})`);
    }
    const data = await response.json();
    loadingscreen.classList.remove("active");
    error.classList.remove("active");
    userinfocontainer.classList.add("active");

    renderweatherinfo(data);
  } catch (err) {
    loadingscreen.classList.remove("active");
    userinfocontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active");
    error.classList.add("active");
  }
}

function renderweatherinfo(weatherinfo) {
  const cityname = document.querySelector("[data-cityname]");
  const countryicon = document.querySelector("[data-countryicon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weathericon = document.querySelector("[data-weathericon");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-clouds]");

  // fetch value from weatherinfo object and put the UI elements

  cityname.innerText = weatherinfo?.name; // optional chainning operator
  countryicon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherinfo?.weather?.[0]?.description;
  weathericon.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherinfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherinfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherinfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherinfo?.clouds?.all}%`;
}

function getlocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by your browser");
  }
}

function showPosition(position) {
  const usercoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(usercoordinates));
  fetchuserweatherinfo(usercoordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getlocation);

const searchinput = document.querySelector("[data-searchinput]");
searchform.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchinput.value;
  if (cityName == "") return;
  else fetchsearchweatherinfo(cityName);
});

async function fetchsearchweatherinfo(city) {
  loadingscreen.classList.add("active");
  userinfocontainer.classList.remove("active");
  grantaccesscontainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${your_api_key}&units=metric`
    );

    if (!response.ok) {
      // Handle the error when the response is not ok
      throw new Error(`Weather data not available (${response.status})`);
    }
    const data = await response.json();
    loadingscreen.classList.remove("active");
    error.classList.remove("active");
    userinfocontainer.classList.add("active");
    renderweatherinfo(data);
  } catch (err) {
    loadingscreen.classList.remove("active");
    userinfocontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active");
    error.classList.add("active");
  }
}