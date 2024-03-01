onload = () => {
    const amenities = {};
    $.get('http://localhost:5001/api/v1/status/', function (data) {
        if (data.status === 'OK') {
            document.getElementById("api_status").className = "available";
        } else {
            document.getElementById("api_status").className = "";
        }
    })
    $('.popover_checkbox').change(function () {
        if ($(this).is(':checked')) {
            amenities[$(this).attr('data-id')] = $(this).attr('data-name');
        } else {
            delete amenities[$(this).attr('data-id')];
        }
        $('.amenities h4').text(Object.values(amenities).join(', '));
    });
}
