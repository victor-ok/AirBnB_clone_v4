$('document').ready(function () {
    const api = 'http://' + window.location.hostname;
  
    $.get(api + ':5001:/api/v1/status/', function (response) {
      if (response.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    });
  
    $.ajax({
      url: api + ':5001/api/v1/places_search/',
      type: 'POST',
      data: '{}',
      contentType: 'application/json',
      dataType: 'json',
      success: appendPlaces
    });
  
    let amenities = {};
    $('input[type="checkbox"]').change(function () {
      if ($(this).is(':checked')) {
        amenities[$(this).attr('data-id')] = $(this).attr('data-name');
      } else {
        delete amenities[$(this).attr('data-id')];
      }
      if (Object.values(amenities).length === 0) {
        $('.amenities h4').html('&nbsp;');
      } else {
        $('.amenities h4').text(Object.values(amenities).join(', '));
      }
    });
  
    $('button').click(function () {
      $.ajax({
        url: api + ':5001/api/v1/places_search/',
        type: 'POST',
        data: JSON.stringify({ 'amenities': Object.keys(amenities) }),
        contentType: 'application/json',
        dataType: 'json',
        success: appendPlaces
      });
    });
  });
  
  function appendPlaces (data) {
    $('section.places').empty();
    $('section.places').append(data.map(place => {
      return `<article>
                <div class="title">
                  <H2>${place.name}</H2>
                    <div class="price_by_night">
                      ${place.price_by_night}
                    </div>
                  </div>
                  <div class="information">
                    <div class="max_guest">
                      <I class="fa fa-users fa-3x" aria-hidden="true"></I>
                      </br>
                      ${place.max_guest} Guests
                    </div>
                    <div class="number_rooms">
                      <I class="fa fa-bed fa-3x" aria-hidden="true"></I>
                      </br>
                      ${place.number_rooms} Bedrooms
                    </div>
                    <div class="number_bathrooms">
                      <I class="fa fa-bath fa-3x" aria-hidden="true"></I>
                      </br>
                      ${place.number_bathrooms} Bathrooms
                    </div>
                  </div>
                  <div class="description">
                    ${place.description}
                  </div>
                </article>`;
    }));
  }
