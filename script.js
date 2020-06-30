
var searchHistory = [];

function setupArray() {
    $('#cities').empty();
    searchHistory = localStorage.getItem('searchHistory');
    searchHistory = JSON.parse(searchHistory);

    if (searchHistory === null || searchHistory.length === 0) {
        getLatLong('Austin');
        searchHistory = [];
    } else {
        renderCities();
    }
}

function renderCities() {
    $('#cities').empty();
    for (let i = 0; i < searchHistory.length; i++) {
        var newCity = $('<li>');
        var cityBtn = $('<button>');
        cityBtn.text(searchHistory[i]);
        newCity.attr('class', 'list-group-item');
        cityBtn.attr('class', 'btn customBtn');
        cityBtn.attr('id', searchHistory[i]);
        var removeIcon = $('<button>').attr('class', 'btn fa fa-times-circle');
        removeIcon.attr('id', i);
        newCity.append(cityBtn);
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
    if(searchHistory === null) searchHistory = [];
    var cityName = $('#search').val();
    

    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        var newCity = $('<li>');
        var cityBtn = $('<button>');
        cityBtn.text(cityName);
        newCity.attr('class', 'list-group-item');
        cityBtn.attr('class', 'btn customBtn');
        cityBtn.attr('id', cityName)
        var removeIcon = $('<button>').attr('class', 'btn fa fa-times-circle');
        removeIcon.attr('id', searchHistory.length - 1);
        newCity.append(cityBtn);
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

            var uvIndex = response.current.uvi;
            var uvBtn = $('<button>');
            $('#UV-index').text('UV Index: ');
            uvBtn.text(uvIndex);
            if (uvIndex <= 2) {
                uvBtn.attr('class', 'btn btn-success');
            } else if (uvIndex > 2 && uvIndex <= 5) {
                uvBtn.attr('class', 'btn btn-warning');
            } else if (uvIndex > 5 && uvIndex <= 7) {
                uvBtn.attr('class', 'btn btn-orange');
            } else {
                uvBtn.attr('class', 'btn btn-danger');
            }

            $('#UV-index').append(uvBtn);

            // $('#fiveDayForecast').empty();
            if (window.innerWidth > 1195) {
                for (let i = 1; i < 6; i++) {
                    let card = $('<div>').attr('class', 'card');
                    let ul = $('<ul>').attr('class', 'list-group list-group-flush');
                    let dateLi = $('<li>').attr('class', 'list-group-item cardDate');
                    dateLi.text((moment(response.daily[i].dt, "X").format('MM/DD/YY')));

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
            } else {
                for(let i = 1; i < 6; i++) {
                    let card = $('<div>').attr('class', 'card');
                    let cardRow = $('<div>').attr('class', 'row no-gutters');
                    let firstCol = $('<div>').attr('class', 'col-sm-6');
                    let dateDiv = $('<div>').attr('class', 'card-body');
                    dateDiv.text((moment(response.daily[i].dt, "X").format('MM/DD/YY')));
                    let icon = response.daily[i].weather[0].icon;
                    let iconpic = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                    let img =  $('<img>').attr('src', iconpic);
                    let iconDiv = $('<div>').attr('class', 'card-text');
                    iconDiv.append(img);
                    dateDiv.append(iconDiv);
                    firstCol.append(dateDiv);

                    let secondCol = $('<div>').attr('class', 'col-sm-6');
                    let tempDiv = $('<div>').attr('class', 'card-body');
                    tempDiv.text(`Temp: ${response.daily[i].temp.day} \u00B0F`);
                    let humidDiv = $('<div>').attr('class', 'card-text');
                    humidDiv.text(`Humidity: ${response.daily[i].humidity}%`)
                    tempDiv.append(humidDiv);
                    secondCol.append(tempDiv);
                    cardRow.append(firstCol);
                    cardRow.append(secondCol);
                    card.append(cardRow);
                    $('#fiveDayForecast').append(card);

                }

            }
        });
    });
}

$(window).resize(function() {
    getLatLong(searchHistory[searchHistory.length - 1 ]);
});

$('#searchSidebar').on('click', function (event) {
    event.preventDefault();
    let removeIndex = parseInt($(event.target)[0].id);

    if (removeIndex > -1) {
        searchHistory.splice(removeIndex, 1);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        if (searchHistory.length === 0) {
            $('#cities').empty();
            getLatLong('Austin');
        } else {
            renderCities();
        }
    }
});

$('#searchSidebar').on('click', function (event) {
    event.preventDefault();
    let city = $(event.target)[0].id;

    if (searchHistory.includes(city)) {
        getLatLong(city);
    }

});




