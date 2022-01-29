var button;
var saveArray = false;
var skipConfirm = false;

// Add Recent Buttons from localStorage, OR set savedBtns as blank Array.
var savedBtns = JSON.parse(localStorage.getItem("Recent Searches")) || [];
console.log(savedBtns);

    // Append Recent Search Buttons
function startUpBtns() {
    var btnContainer = document.querySelector("#cityBtns");
    
    for ( var i = 0; i < savedBtns.length; i++) {
        var buttonEl = document.createElement("button");
        buttonEl.className = "cityBtn searchBtn mw-100";
        buttonEl.textContent = savedBtns[i].name;
        var btnInput = JSON.stringify(savedBtns[i].input);
        buttonEl.setAttribute("data-input", btnInput);
        console.log(btnInput);
        btnContainer.appendChild(buttonEl);
    }
    btnClicks();
}

// Add saved Buttons Function
startUpBtns();

function search(event) {
    // If Recent Search Buttons selected, use their "Input" data, from savedBtns Input property
    if ($(this).text() !== "Search") {
        var city = $(this).data("input");

    // If search button selected, use input field for City name
    } else {
        // swap spaces with %20 for api call
        var city = $("#city-input").val().toLowerCase().replace(/\ /g, "%20");
        $("#city-input").val("");
        saveArray = true;
    }

    // API call for lat and long of city
    fetch("https://api.myptv.com/geocoding/v1/locations/by-text?searchText=" + city, {
        method: "GET",
        headers: { apiKey: "Y2E4ODI1NGU1MjlhNGFmODllN2VhYTQ0NzM4ZWUzZDM6MjAwYmZlN2UtZWYzNi00ZDIyLTkzNjEtNjFiMGU2MmE4NGY3", "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(result => {

        // Append City Name from API formatted Name
        heading = result.locations[0].formattedAddress;
        $("#city-name").text(heading).append();

        // Check if recent Button already exists
        for (var i = 0; i < savedBtns.length; i++) {
            var btnCheck = savedBtns[i].name;
            if (btnCheck === heading) {
                saveArray = false;
            }
        }
        
        // If not, Save Button to localStorage
        if (savedBtns.length < 12 && saveArray === true){
            var savedBtn = {
                name: heading,
                input: city
            };
            if (!skipConfirm) {
                savedBtns.push(savedBtn);
                localStorage.setItem("Recent Searches", JSON.stringify(savedBtns));
            }
        } else if (savedBtns.length = 12 && saveArray === true && skipConfirm !== true) {
            saveArray = false;
            var reset = window.confirm("Sorry! You can't add any more Recent Search Buttons. Would you like to reset your recent searches?");
            if (reset === true) {
                savedBtns = [];
                localStorage.setItem("Recent Searches", JSON.stringify(savedBtns));
                $(".cityBtn").remove();
                var savedBtn = {
                    name: heading,
                    input: city
                };
                savedBtns.push(savedBtn);
                localStorage.setItem("Recent Searches", JSON.stringify(savedBtns));
                saveArray = true;
            } else {
                skipConfirm = true;
            }
            
            
        }
        return result.locations[0].referencePosition;
    })

    // API call for weather data
    .then(function(data) {
        fetch(
            'https://api.openweathermap.org/data/2.5/onecall?lat=' + data.latitude + '&lon=' + data.longitude + '&exclude=minutely&appid=d3c47a1f177d224c8f7fe16686ddb65e'
        ).then(function(response) {
            return response.json();
        })
        .then(function(data) {

            // Append Current City Time
            var timeStamp = data.current.dt + data.timezone_offset + 18000;
            var date = new Date(timeStamp * 1000);
            var weekday = date.getDay();
            if (weekday === 0) { weekdayNamed = "Sunday";}
            if (weekday === 1) { weekdayNamed = "Monday";}
            if (weekday === 2) { weekdayNamed = "Tuesday";}
            if (weekday === 3) { weekdayNamed = "Wednesday";}
            if (weekday === 4) { weekdayNamed = "Thursday";}
            if (weekday === 5) { weekdayNamed = "Friday";}
            if (weekday === 6) { weekdayNamed = "Saturday";}
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            var hours = date.getHours();
            var amPm;
            if (hours > 12) {
                hours = hours - 12;
                amPm = "pm"
            } else {
                amPm = "am"
            }
            if (hours === 0) { hours = 12; }
            var minutes = date.getMinutes();
                if (minutes < 10) { minutes = "0" + minutes; }

            var locationTime = "Where it is " + weekdayNamed + ", " + month + "/" + day + "/" + year + ", and the time is " + hours + ":" + minutes + " " + amPm;
            $("#date").text(locationTime).append();

            // Append Weather Icon
            var sunrise = data.current.sunrise + 18000;
            var sunset = data.current.sunset + 18000;
            var weather = data.current.weather[0].main;
            var weatherIcon;
            if (weather === "Clouds") {weatherIcon = " ☁️"}
            if (weather === "Thunderstorm") {weatherIcon = " ⚡️"}
            if (weather === "Rain" || weather === "Drizzle") {weatherIcon = " 💧"}
            if (weather === "Snow") {weatherIcon = " ❄️"}
            if (weather === "Tornado") {weatherIcon = " 🌪"}
            if (weather === "Mist" || weather === "Smoke" || weather === "Haze" ||weather === "Dust" || weather === "Fog" || weather === "Sand" || weather === "Squall" || weather === "Ash") 
                {weatherIcon = " 🌫"}
            if (weather === "Clear") {
                if (timeStamp - sunrise < 0 || timeStamp - sunset > 0) { weatherIcon = " 🌑"
                } else {weatherIcon = " ☀️"}
            }
            $("#city-name").text(heading + weatherIcon).append();

            // Append Temperature
            // Convert Kelvin to Fahrenheit
            var temp = (Math.round(((data.current.temp - 273.15) * 1.8 + 32) * 100)) / 100;
            $("#city-temp").text("Temperature: " + temp + "°F").append();

            // Append Wind Speed
            // Convert meter/sec to Miles/hour
            var wind = (Math.round((data.current.wind_speed * 2.236494) * 10)) / 10;
            $("#city-wind").text("Wind: " + wind + " MPH").append();

            // Append Humidity
            var humidity = (Math.round(data.current.humidity));
            $("#city-humid").text("Humidity: " + humidity + "%").append();

            // Append UV Index
            var uvIndex = data.current.uvi;

            $("#uvBtn").removeClass("uv-low uv-moderate uv-high uv-very-high uv-extreme");
            if (uvIndex <= 2.5) {
                $("#uvBtn").addClass("uv-low");
            } else if (uvIndex <= 5.5) {
                $("#uvBtn").addClass("uv-moderate");
            } else if (uvIndex <= 7.5) {
                $("#uvBtn").addClass("uv-high");
            } else if (uvIndex <= 10.5) {
                $("#uvBtn").addClass("uv-very-high");
            } else if (uvIndex > 10.5) {
                $("#uvBtn").addClass("uv-extreme");
            }
            $("#uvBtn").text("UV Index: " + uvIndex);

            // 5 Day Forecast Loop
            for (var i = 0; i < 5; i++) {
                var cardId = "#day-" + [i+1];

                var dailyTimeStamp = data.daily[i].dt + data.timezone_offset + 18000;
                var dailyDate = new Date(dailyTimeStamp * 1000);
                var dailyWeekday = date.getDay() + i;
                // var options = {weekday: "long"}
                // var dailyWeekdayNamed = new Intl.DateTimeFormat('en-US', options).format(weekday);
                            
                var dailyMonth = dailyDate.getMonth() + 1;
                var dailyDay = dailyDate.getDate();
                var dailyYear = dailyDate.getFullYear();
                var finalDailyDate = dailyMonth + "/" + dailyDay + "/" + dailyYear;

                if (dailyWeekday === 0 || dailyWeekday === 7) { dailyWeekdayNamed = "Sunday";}
                if (dailyWeekday === 1 || dailyWeekday === 8) { dailyWeekdayNamed = "Monday";}
                if (dailyWeekday === 2 || dailyWeekday === 9) { dailyWeekdayNamed = "Tuesday";}
                if (dailyWeekday === 3 || dailyWeekday === 10) { dailyWeekdayNamed = "Wednesday";}
                if (dailyWeekday === 4) { dailyWeekdayNamed = "Thursday";}
                if (dailyWeekday === 5) { dailyWeekdayNamed = "Friday";}
                if (dailyWeekday === 6) { dailyWeekdayNamed = "Saturday";}
                
                $(cardId).find(".card-weekday").text(dailyWeekdayNamed).append();
                $(cardId).find(".card-date").text(finalDailyDate).append();
                
                var dailyWeather = data.daily[i].weather[0].main;
                var dailyIcon;
                if (dailyWeather === "Clouds") {dailyIcon = " ☁️"}
                if (dailyWeather === "Thunderstorm") {dailyIcon = " ⚡️"}
                if (dailyWeather === "Rain" || dailyWeather === "Drizzle") {dailyIcon = " 💧"}
                if (dailyWeather === "Snow") {dailyIcon = " ❄️"}
                if (dailyWeather === "Tornado") {dailyIcon = " 🌪"}
                if (dailyWeather === "Mist" || dailyWeather === "Smoke" || dailyWeather === "Haze" ||dailyWeather === "Dust" || dailyWeather === "Fog" || dailyWeather === "Sand" || dailyWeather === "Squall" || dailyWeather === "Ash") 
                    {dailyIcon = " 🌫"}
                if (dailyWeather === "Clear") {
                    {dailyIcon = " ☀️"}
                }
                $(cardId).find(".card-icon").text(dailyIcon).append();

                var dailyTemp = (Math.round(((data.daily[i].temp.day - 273.15) * 1.8 + 32) * 100)) / 100;
                $(cardId).find(".card-temp").text("Temp: " + dailyTemp + "°F");

                var dailyWind = (Math.round((data.daily[i].wind_speed * 2.236494) * 10)) / 10;
                $(cardId).find(".card-wind").text("Wind: " + dailyWind + " MPH");

                var dailyHumid = (Math.round(data.current.humidity));
                $(cardId).find(".card-humid").text("Humidity: " + dailyHumid + "%").append();
            }

        //Append new recent search "City" buttons
        }).then(function(data){
            if (savedBtns.length <= 12 && saveArray === true && skipConfirm !== true) {
                var btnContainer = document.querySelector("#cityBtns");
                var buttonEl = document.createElement("button");
                buttonEl.className = "cityBtn mw-100 newSearchBtn";
                buttonEl.textContent= heading;
                buttonEl.setAttribute("data-input", city);
                btnContainer.appendChild(buttonEl);
                $(".newSearchBtn").on("click", search);
                saveArray = false;
                console.log("saved")
            }
        })
    })
// });
}

// Add button querySelectors
function btnClicks() {
    button = document.querySelectorAll(".searchBtn");
}

// Click Search Button and initiate Geolocation fetch

$(button).on("click", search);


    // fetch(
    //     'https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=minutely&appid=d3c47a1f177d224c8f7fe16686ddb65e'
    //     ).then(function(response) {
    //         return response.json();
    //     })
    //     .then(function(data) {
    //         console.log(data);
    // });
    
    // fetch("https://api.myptv.com/geocoding/v1/locations/by-text?searchText=Los%20Angeles", {
    //         method: "GET",
    //         headers: { apiKey: "Y2E4ODI1NGU1MjlhNGFmODllN2VhYTQ0NzM4ZWUzZDM6MjAwYmZlN2UtZWYzNi00ZDIyLTkzNjEtNjFiMGU2MmE4NGY3", "Content-Type": "application/json" },
    //     })
    //     .then(response => response.json())
    //     .then(result => console.log(result.locations[0].referencePosition));