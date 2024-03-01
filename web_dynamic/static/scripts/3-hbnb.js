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

    checkStatus();
    searchPlaces();
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

function searchPlaces() {
    $.ajax({
        type: "POST",
        url: "http://localhost:5001/api/v1/places_search",
        data: '{}',
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
}

function createPlace(place) {
    let article = `
    <article>
        <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
        </div>
        <div class="information">
            <div class="max_guest">${place.max_guest} Guest{% if place.max_guest != 1 %}s{% endif %}</div>
            <div class="number_rooms">${place.number_rooms} Bedroom{% if place.number_rooms != 1 %}s{% endif %}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom{% if place.number_bathrooms != 1 %}s{% endif %}</div>
        </div>
        <div class="user">
            <b>Owner:</b> ${place.user.first_name} ${place.user.last_name}
        </div>
        <div class="description">${place.description}</div>
    `;
    return article;
}
