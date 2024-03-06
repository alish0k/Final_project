async function loadModel() {
    return await tf.loadLayersModel('model.json');
}
  
async function preprocessImage(imageElement) {
    const tensor = tf.browser.fromPixels(imageElement)
        .resizeNearestNeighbor([350, 350])
        .toFloat()
        .div(tf.scalar(255.0))
        .expandDims(); 
  
    return tensor;
}

async function predictObject(model, imageElement) {
    const tensor = await preprocessImage(imageElement);
    const prediction = await model.predict(tensor);
    const predictedClass = prediction.argMax(axis=1).dataSync()[0]; 
    return predictedClass;
}
  
  const classes = ["fog", "rain", "snow", "sun"];
  
async function predictImage() {
    const fileInput = document.getElementById('fileInput');
    const resultDiv = document.getElementById('resultImage');
    const imageContainer = document.getElementById('imageContainer');
    
    const file = fileInput.files[0];
  
    if (!file) {
      resultDiv.innerText = 'No file selected.';
      return;
    }
  
    const model = await loadModel();
  
    const imgElement = new Image();
    const reader = new FileReader();
  
    reader.onloadend = function () {
      imgElement.src = reader.result;
    };
  
    reader.readAsDataURL(file);
  
    imgElement.onload = async function () {
      const predictedClass = await predictObject(model, imgElement);
      resultDiv.innerText = `Predicted Class: ${classes[predictedClass]}`;
      imageContainer.innerHTML = '';
      const imageItem = document.createElement('img');
      imageItem.src = reader.result;
      imageItem.classList.add('imageItem');
      imageContainer.appendChild(imageItem);
    };
}


document.getElementById('dateForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const date = formData.get('date');

    try {
        const response = await fetch(`/data?date=${date}`);
        if (!response.ok) {
            throw new Error('Data not found for the provided date.');
        }
        const data = await response.json();

        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `

            <p>Predictions on Max Temp (C) in Astana: ${data.combinedEntry.predictions}</p>
            <p>Actual Max Temp (C) in Astana: ${data.combinedEntry.actual}</p>
  
            <p>Predictions on Min Temp(C) in Astana: ${data.combinedMinEntry.predictions_min}</p>
            <p>Actual Min Temp (C) in Astana: ${data.combinedMinEntry.actual_min}</p>

            <p>Predictions on Max Temp (C) in Almaty: ${data.combinedAlmatyEntry.predictions}</p>
            <p>Actual Max Temp (C) in Almaty: ${data.combinedAlmatyEntry.actual}</p>

            <p>Predictions on Min Temp(C) in Almaty: ${data.combinedMinAlmatyEntry.predictions_min}</p>
            <p>Actual Min Temp (C) in Almaty: ${data.combinedMinAlmatyEntry.actual_min}</p>

            <p>Predictions on Max Temp (C) in Karaganda: ${data.combinedKaragandaEntry.predictions}</p>
            <p>Actual Max Temp (C) in Karaganda: ${data.combinedKaragandaEntry.actual}</p>

            <p>Predictions on Min Temp(C) in Karaganda: ${data.combinedMinKaragandaEntry.predictions_min}</p>
            <p>Actual Min Temp (C) in Karaganda: ${data.combinedMinKaragandaEntry.actual_min}</p>
        `;
    } catch (error) {
        console.error('Error:', error.message);
        result.innerHTML = `<p>${error.message}</p>`;
    }
});

document.getElementById('cityForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const date = formData.get('date');
    const city = formData.get('city');

    try {
        const response = await fetch(`/dataByCity?date=${date}&city=${city}`);
        const data = await response.json();

        const resultDiv = document.getElementById('resultCity');
        resultDiv.innerHTML = `

            <p>Predictions on Max Temp (C): ${data.combinedEntry.predictions}</p>
            <p>Actual Max Temp (C): ${data.combinedEntry.actual}</p>

            <p>Predictions on Min Temp(C): ${data.combinedMinEntry.predictions_min}</p>
            <p>Actual Min Temp (C): ${data.combinedMinEntry.actual_min}</p>
        `;
    } catch (error) {
        console.error('Error:', error);
    }
});




document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value.trim();
    if (city !== '') {
        fetchWeatherData2(city);
    }
});

function fetchWeatherData2(city) {
    const apiKey = '70e1dd0b73837f377ed1a50e46d3bdce'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;


    fetch(apiUrl)
        .then(resp => resp.json())
        .then(data => {
            displayWeatherData2(data);
            displayCityMap(data.coord.lat, data.coord.lon);
            fetchCountryFlag(data.sys.country);
            displayRainVolume(data);
        })
        .catch(error => {
            console.error(`Error fetching weather data for ${city}:`, error);
        });
}

function displayWeatherData2(data) {
    const weatherInfo = document.getElementById('weatherInfo2');
    weatherInfo.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${Math.round(data.main.temp - 273)}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">
        <p>Coordinates: Latitude: ${data.coord.lat}, Longitude: ${data.coord.lon}</p>
        <p>Feels like: ${Math.round(data.main.feels_like - 273)}°C</p>
        <p>Humidity: ${data.main.humidity}</p>
        <p>Pressure: ${data.main.pressure}</p>
        <p>Wind speed: ${data.wind.speed}m/s</p>
        <p>Country code: ${data.sys.country}</p>
    `;
}

function displayCityMap(lat, lng) {
    const mapOptions = {
        zoom: 10,
        center: { lat, lng }
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
}


function fetchCountryFlag(countryCode) {
    const flagImg = document.createElement('img');
    flagImg.src = `https://flagsapi.com/${countryCode}/flat/64.png`;

    const flagContainer = document.getElementById('flag');
    flagContainer.innerHTML = ''; // Clear previous flag
    flagContainer.appendChild(flagImg);
}

function displayRainVolume(data) {
    const rainContainer = document.getElementById('rainContainer');

    if (data.rain && data.rain['1h']) {
        const rainVolume = data.rain['1h'];
        rainContainer.textContent = `Rain Volume (last hour): ${rainVolume} mm`;
    } else {
        rainContainer.textContent = 'No rain data available';
    }
}