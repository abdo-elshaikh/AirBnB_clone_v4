onload = () => {

    const amenities = {};
    $('.popover_checkbox').change(function () {
        if ($(this).is(':checked')) {
            amenities[$(this).attr('data-id')] = $(this).attr('data-name');
        } else {
            delete amenities[$(this).attr('data-id')];
        }
        $('.amenities h4').text(Object.values(amenities).join(', '));
    });

    const states = {};
    $('.state_checkbox').change(function () {
        if ($(this).is(':checked')) {
            states[$(this).attr('data-id')] = $(this).attr('data-name');
        } else {
            delete states[$(this).attr('data-id')];
        }
        $('.locations h4').text(Object.values(states).join(', '));
    });

    const cities = {};
    $('.city_checkbox').change(function () {
        if ($(this).is(':checked')) {
            cities[$(this).attr('data-id')] = $(this).attr('data-name');
        } else {
            delete cities[$(this).attr('data-id')];
        }
        $('.locations h4').text(Object.values(cities).join(', '));
    });

    $('button').on('click', function () {
        $.ajax({
            type: "POST",
            url: "http://localhost:5001/api/v1/places_search",
            data: JSON.stringify({
                "states": Object.keys(states),
                "cities": Object.keys(cities),
                "amenities": Object.keys(amenities)
            }),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                $('section.places').empty();
                for (const place of data) {
                    $('section.places').append(createPlace(place));
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });

    checkStatus();
}

function checkStatus() {
    $.ajax({
        type: "GET",
        url: "http://localhost:5001/api/v1/status/",
        success: function (data) {
            if (data.status === 'OK') {
                document.getElementById("api_status").className = "available";
            } else {
                document.getElementById("api_status").className = "";
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function showReviews() {
    if ($('.description').is(':visible')) {
        $('.description').style('display', 'none');
    } else {
        $('.description').style('display', 'block');
    }
}

function getPlaceAminities(placeId) {
    $.ajax({
        type: "GET",
        url: "http://localhost:5001/api/v1/places/" + placeId + "/amenities",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            return data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    })
}

function getPlaceReviews(placeId) {
    $.ajax({
        type: "GET",
        url: "http://localhost:5001/api/v1/places/" + placeId + "/reviews",
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            return data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    })
}

function getUser(userId) {
    $.ajax({
        type: "GET",
        url: "http://localhost:5001/api/v1/users/" + userId,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            return data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    })
}

function createPlace(place) {
    const userName = getUser(place.user_id);
    let placeAmenities = getPlaceAminities(place.id);
    let placeReviews = getPlaceReviews(place.id);

    console.log(placeAmenities, placeReviews, users);

    const places = document.querySelector('section.places');
    const article = document.createElement('article');
    const priceByNight = document.createElement('div');
    const information = document.createElement('div');
    const user = document.createElement('div');
    const description = document.createElement('div');
    const amenities = document.createElement('div');
    const reviews = document.createElement('div');
    let title = document.createElement('h2');

    title.textContent = 'MY HOME';

    article.appendChild(title);
    article.appendChild(priceByNight);
    article.appendChild(information);
    article.appendChild(user);
    article.appendChild(description);
    article.appendChild(amenities);
    article.appendChild(reviews);

    places.appendChild(article);

    // Price by night
    priceByNight.className = 'price_by_night';
    priceByNight.innerHTML = `<h3>$${place.price_by_night}</h3>`;

    // Information
    information.className = 'information';
    const max_guest = document.createElement('div');
    const number_rooms = document.createElement('div');
    const number_bathrooms = document.createElement('div');

    max_guest.innerHTML = `<h3>${place.max_guest} Guests</h3>`;
    number_rooms.innerHTML = `<h3>${place.number_rooms} Bedroom </h3>`;
    number_bathrooms.innerHTML = `<h3>${place.number_bathrooms} Bathroom </h3>`;

    information.appendChild(max_guest);
    information.appendChild(number_rooms);
    information.appendChild(number_bathrooms);


    // User
    user.className = 'user';
    user.innerHTML = `<b>Owner:</b> ${userName.first_name} ${userName.last_name}`

    // Description
    description.className = 'description';
    description.innerHTML = `<p>${place.description}</p>`;

    // Amenities
    amenities.className = 'amenities';
    title.textContent = 'AMENITIES';
    const list = document.createElement('ul');
    amenities.appendChild(title);
    amenities.appendChild(list);
    amenities.setAttribute('role', 'menu');
    for (const i in placeAmenities) {
        const li = document.createElement('li');
        li.textContent = placeAmenities[i].name;
        li.setAttribute('role', 'listitem');
        li.className = `${placeAmenities[i].name}`.replace(' ', '_').toLowerCase();
        list.appendChild(li);
    }

    // Reviews
    reviews.className = 'reviews';
    title.textContent = 'REVIEWS';
    reviews.appendChild(title);
    const ul = document.createElement('ul');
    reviews.appendChild(ul);
    reviews.setAttribute('role', 'contentinfo');
    for (const i in placeReviews) {
        const li = document.createElement('li');
        li.innerHTML = `<p>${placeReviews[i].text}</p>`;
        li.setAttribute('role', 'listitem');
        li.className = 'listitem';
        ul.appendChild(li);
    }

    // Add class to article
    article.className = 'article';

    return article;
}
