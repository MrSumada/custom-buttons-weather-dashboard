// var city;

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


$("#searchBtn").on("click", function(){
    var city = $("#city-input").val().replace(/\ /g, "%20");

    console.log(city);

    var data = fetch("https://api.myptv.com/geocoding/v1/locations/by-text?searchText=" + city, {
        method: "GET",
        headers: { apiKey: "Y2E4ODI1NGU1MjlhNGFmODllN2VhYTQ0NzM4ZWUzZDM6MjAwYmZlN2UtZWYzNi00ZDIyLTkzNjEtNjFiMGU2MmE4NGY3", "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        console.log(result.locations[0].referencePosition);
        return result.locations[0].referencePosition;
    })
    .then(function(data) {
        // var roundLat = Math.round(data.latitude * 100) / 100;
        // var roundLong = Math.round(data.longitude * 100) / 100;
        fetch(
            'https://api.openweathermap.org/data/2.5/onecall?lat=' + data.latitude + '&lon=' + data.longitude + '&exclude=minutely&appid=d3c47a1f177d224c8f7fe16686ddb65e'
            ).then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
        });
    })

    // console.log(data);
    // .then(function(data) {
    //     var lat = result[1];
    //     console.log(lat);
    // })

    

    // var lat = result[0].referencePosition;
    // var long = result[0].locations.referencePosition.longitude;
    // console.log(lat);
    // console.log(long);
});

