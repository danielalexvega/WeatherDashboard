// # 06 Server-Side APIs: Weather Dashboard

// Developers are often tasked with retrieving data from another application's API and using it in the context of their own. Third-party APIs allow developers to access their data and functionality by making requests with specific parameters to a URL. Your challenge is to build a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS.

// Use the [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities. The documentation includes a section called "How to start" that will provide basic setup and usage instructions. Use `localStorage` to store any persistent data.

// ## User Story

// ```
// AS A traveler
// I WANT to see the weather outlook for multiple cities
// SO THAT I can plan a trip accordingly
// ```

// ## Acceptance Criteria

// ```
// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast
// ```


var previousSearchs = [];

// *********** SEARCH BAR ************
$('#searchBtn').on('click', function (event) {
    event.preventDefault();
    $('#fiveDayForecast').empty();
    var cityName = $('#search').val();
    var newCity = $('<li>');
    newCity.text(cityName);
    newCity.attr('class', 'list-group-item');
    newCity.attr('data-city', cityName)
    $('#cities').append(newCity);
    $('#search').val('');


    previousSearchs.push(cityName);
    getLatLong(cityName);


});

function getLatLong(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=fa094e3fd4ac961ac4f62ea10ae68dca`;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        console.log(response);
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var name = response.name;
        var temp = response.main.temp;
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        var icon = response.weather[0].icon;
        var iconpic = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        var today = moment().format('MM/DD/YY');
        var fullTitle = `The forcast for ${name} on ${today}`;

        //update the Display
        $('#cityTitle').text(fullTitle);
        var img = $('<img>');
        img.attr('src', iconpic);
        $('#cityTitle').append(img);
        $('#icon').attr('src', iconpic);
        $('#temperature').text(`Temperature: ${temp} \u00B0F`); // U+00B0
        $('#humidity').text(`Humidity: ${humidity}%`);
        $('#windSpeed').text(`Windspeed: ${windSpeed} MPH`);

        //make another ajax call to the one call... 
        // let coordLat = response.coord; 
        //return something

        queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=fa094e3fd4ac961ac4f62ea10ae68dca`;

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            console.log(response);
            var uvIndex = response.current.uvi;

            $('#UV-index').text(`UV Index: ${uvIndex}%`);

           // $('#fiveDayForecast').empty();

            for (let i = 1; i < 6; i++) {
                let card = $('<div>').attr('class', 'col-md-2');
                card.attr('style', 'width: 12vw');
                let ul = $('<ul>').attr('class', 'list-group list-group-flush');
                let dateLi = $('<li>').attr('class', 'list-group-item');
                let dateHeader = $('<h4>').text((moment(response.daily[i].dt, "X").format('MM/DD/YY')));
                //icon
                let icon = response.daily[i].weather[0].icon;
                let iconpic = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                let img = $('<img>').attr('src', iconpic);
                let iconLi = $('<li>').attr('class', 'list-group-item');

                let tempLi = $('<li>').attr('class', 'list-group-item');
                tempLi.text(response.daily[i].temp.day);

                let humidLi = $('<li>').attr('class', 'list-group-item');
                humidLi.text(response.daily[i].humidity);

                card.append(ul);
                dateLi.append(dateHeader);
                iconLi.append(img);
                ul.append(dateLi, iconLi, tempLi, humidLi);
                $('#fiveDayForecast').append(ul);
            }

            //$('#date1').text(moment(response.daily[1].dt, "X").format('MM/DD/YY'));

        });
    });
}





