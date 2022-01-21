

var city;



fetch(
    'https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=minutely&appid=d3c47a1f177d224c8f7fe16686ddb65e'
    ).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
});

fetch("https://api.myptv.com/geocoding/v1/locations/by-text?searchText=Los%20Angeles", {
        method: "GET",
        headers: { apiKey: "Y2E4ODI1NGU1MjlhNGFmODllN2VhYTQ0NzM4ZWUzZDM6MjAwYmZlN2UtZWYzNi00ZDIyLTkzNjEtNjFiMGU2MmE4NGY3", "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(result => console.log(result));


$("#searchBtn").on("click", function(){
    city = $("#city-input").val();

    console.log(city);
});
