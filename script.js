
// ```
// AS A traveler
// I WANT to see the weather outlook for multiple cities
// SO THAT I can plan a trip accordingly
// ```

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast
// ```


var searchHistory = [];

function setupArray() {
    $('#cities').empty();
    searchHistory = localStorage.getItem('searchHistory');
    searchHistory = JSON.parse(searchHistory);

    if (searchHistory === null) {
        searchHistory = [];
        getLatLong('Austin');
    } else {
        renderCities();
    }

}

function renderCities() {
    $('#cities').empty();
    for (let i = 0; i < searchHistory.length; i++) {
        var newCity = $('<li>');
        newCity.text(searchHistory[i]);
        newCity.attr('class', 'list-group-item');
        newCity.attr('data-city', searchHistory[i]);

        var removeIcon = $('<button>').attr('class', 'btn fa fa-times-circle');
        removeIcon.attr('id', 'removeIcon');
        removeIcon.attr('data-cityIndex', i);
        newCity.append(removeIcon);

        $('#cities').append(newCity);
    }
    getLatLong(searchHistory[searchHistory.length - 1]);

}



// *********** SET UP ************
// setupArray() will only set up the arrays, it will not render the buttons
setupArray();


// *********** SEARCH BAR ************
$('#searchBtn').on('click', function (event) {
    event.preventDefault();

    var cityName = $('#search').val();

    //check to see if the city is in the list
    if (!searchHistory.includes(newCity)) {
        searchHistory.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        var newCity = $('<li>');
        newCity.text(cityName);
        newCity.attr('class', 'list-group-item');
        newCity.attr('data-city', cityName)
        var removeIcon = $('<button>').attr('class', 'btn fa fa-times-circle');
        removeIcon.attr('id', 'removeIcon');
        removeIcon.attr('data-cityIndex', searchHistory.length - 1);
        newCity.append(removeIcon);
        $('#cities').append(newCity);
    }

    $('#search').val('');
    getLatLong(cityName);
});

function getLatLong(city) {
    $('#fiveDayForecast').empty();
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=fa094e3fd4ac961ac4f62ea10ae68dca`;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var name = response.name;
        var temp = response.main.temp;
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        var icon = response.weather[0].icon;
        var iconpic = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        var today = moment().format('MM/DD/YY');
        var fullTitle = `The forecast for ${name} on ${today}`;

        $('#cityTitle').text(fullTitle);
        var img = $('<img>');
        img.attr('src', iconpic);
        $('#cityTitle').append(img);
        $('#icon').attr('src', iconpic);
        $('#temperature').text(`Temperature: ${temp} \u00B0F`);
        $('#humidity').text(`Humidity: ${humidity}%`);
        $('#windSpeed').text(`Windspeed: ${windSpeed} MPH`);

        queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=fa094e3fd4ac961ac4f62ea10ae68dca`;

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            //console.log(response);
            var uvIndex = response.current.uvi;

            $('#UV-index').text(`UV Index: ${uvIndex}%`);

            // $('#fiveDayForecast').empty();

            for (let i = 1; i < 6; i++) {
                let card = $('<div>').attr('class', 'card');
                //card.attr('style', 'width: 14vw');
                let ul = $('<ul>').attr('class', 'list-group list-group-flush');
                //ul.attr('class', 'foreCastUl');
                let dateLi = $('<li>').attr('class', 'list-group-item cardDate');
                dateLi.text((moment(response.daily[i].dt, "X").format('MM/DD/YY')));
                //icon
                let icon = response.daily[i].weather[0].icon;
                let iconpic = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                let img = $('<img>').attr('src', iconpic);
                let iconLi = $('<li>').attr('class', 'list-group-item');

                let tempLi = $('<li>').attr('class', 'list-group-item');
                tempLi.text(`Temp: ${response.daily[i].temp.day} \u00B0F`);

                let humidLi = $('<li>').attr('class', 'list-group-item');
                humidLi.text(`Humidity: ${response.daily[i].humidity}%`);

                iconLi.append(img);
                ul.append(dateLi, iconLi, tempLi, humidLi);
                card.append(ul);
                $('#fiveDayForecast').append(card);
            }
        });
    });
}

//working on this...
$('#searchSidebar').on('click', function () {
    
        console.log($(event.target));
    // console.log($(this).attr('id'));
    // let removeIndex = $(this).attr('data-cityIndex');
    // searchHistory.splice(removeIndex, 1);
    // renderCities();

});




