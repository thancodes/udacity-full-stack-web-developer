// District Model
function District(data) {
    var self = this;
    self.district = typeof data['district'] !== 'undefined' ? data['district'] : 'N/A';
    self.province = typeof data['province'] !== 'undefined' ? data['province'] : 'N/A';
    self.lat = typeof data['lat'] !== 'undefined' ? parseFloat(data['lat']) : 0;
    self.lng = typeof data['long'] !== 'undefined' ? parseFloat(data['long']) : 0;

    // render district, province for easy user readable
    self.formatted = ko.computed(function () {
        return self.district + ', ' + self.province;
    });
}

// RandomImage Model
function RandomImage(data) {
    var self = this;
    self.format = typeof data['format'] !== 'undefined' ? data['format'] : '';
    self.width = typeof data['width'] !== 'undefined' ? data['width'] : '';
    self.height = typeof data['height'] !== 'undefined' ? data['height'] : '';
    self.filename = typeof data['filename'] !== 'undefined' ? data['filename'] : '';
    self.id = typeof data['id'] !== 'undefined' ? data['id'] : '';
    self.author = typeof data['author'] !== 'undefined' ? data['author'] : '';
    self.author_url = typeof data['author_url'] !== 'undefined' ? data['author_url'] : '';
    self.post_url = typeof data['post_url'] !== 'undefined' ? data['post_url'] : '';

    // random image url
    self.image_url = 'https://unsplash.it/300/200?random&_=' + Math.floor(Math.random() * 100) + 1;
}

// Initialize ViewModel
function NeighborhoodMapViewModel(googleMap) {
    // Set value is "" for search input
    self.search = ko.observable("");

    // Set district list observable array from tambons.json with ajax
    self.districtItems = ko.observableArray([]);

    // Set random images list observable array
    self.randomImages = ko.observableArray([]);

    // Initialize Google Map and set focused map to "Rayong"
    self.map = googleMap;

    // Initialize map markers
    self.mapMarkers = [];

    // Initialize infowindow
    self.infoWindow = new google.maps.InfoWindow({
        height: 320
    });

    // Add event for google map when click on map closing old infowindow
    google.maps.event.addListener(self.map, 'click', function () {
        var infoWindow = self.infoWindow;
        infoWindow.close()
    });

    // Clear all map markers
    self.clearMapMarkers = function () {
        for (var index = 0; index < this.mapMarkers.length; index++) {
            this.mapMarkers[index].setMap(null);
        }
        this.mapMarkers = [];
    };

    // Re-drawing map markers in the map
    self.drawMarkers = function (districts) {
        self.clearMapMarkers();

        for (var index = 0; index < districts.length; index++) {
            var district = districts[index];

            // Map icons array
            var mapIcons = [
                'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
                'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            ];

            var mapMarker = new google.maps.Marker({
                position: {lat: district.lat, lng: district.lng},
                map: self.map,
                icon: mapIcons[Math.floor(Math.random() * mapIcons.length)]
            });
            mapMarker.addListener('click', self.selectedMapMarker(mapMarker, district));

            self.mapMarkers.push(mapMarker);
            self.mapMarkers[index].setMap(self.map);
        }
    };

    // Clear state map markers animate in the map
    self.clearMapAnimation = function () {
        for (var i = 0; i < self.mapMarkers.length; i++) {
            if (typeof mapMarkers[i].animation !== "undefined") {
                self.mapMarkers[i].setAnimation(google.maps.Animation.NONE);
            }
        }
    };

    // Change center of the map using panTo function
    self.mapChangeCenter = function (item) {
        self.map.panTo({lat: item.lat, lng: item.lng});

        var index = self.filteredDistrictItems().indexOf(item);
        var mapMarker = self.mapMarkers[index];

        self.selectedMapMarker(mapMarker, item)();
    };

    // Filter district list with input value from search field
    self.filteredDistrictItems = ko.computed(function () {
        var searchQuery = self.search();
        if (searchQuery !== '') {
            return ko.utils.arrayFilter(self.districtItems(), function (item) {
                return item.formatted().toLowerCase().indexOf(searchQuery) !== -1;
            });
        }

        return self.districtItems();
    });

    // Subscribe event chaning in search field
    self.filteredDistrictItems.subscribe(function () {
        self.drawMarkers(self.filteredDistrictItems());
    });

    '3730de81374be7ce04f1a8b488159d68';
    // Select map marker and close old infoWindow and show new infoWindow
    self.selectedMapMarker = function (mapMarker, place) {
        return function () {
            var contentString = '<div class="info-window">' +
                '<h3>' + place.formatted() + '</h3>' +
                '<strong id="summary_value"></strong>' +
                '<br><strong>Humidity:</strong> <span id="humidity_value"></span>' +
                '<br><strong>Wind:</strong> <span id="wind_value"></span>' +
                '</div>';

            // Set content infoWindow
            var infoWindow = self.infoWindow;
            infoWindow.setContent(contentString);
            infoWindow.close();

            infoWindow.open(self.map, mapMarker);

            // Clear map marker animation in the map
            self.clearMapAnimation();

            // Set animation for selected map marker
            mapMarker.setAnimation(google.maps.Animation.BOUNCE);

            // Update weather content in infowindow
            updateWeather(place.lat, place.lng);
        };
    };

    // Update weather content in infowindow
    self.updateWeather = function (lat, lng) {
        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&appid=3730de81374be7ce04f1a8b488159d68',
            type: 'GET',
            beforeSend: function (xhr) {
                // Set loading
                $('#summary_value').text('Loading...');
                $('#humidity_value').text('Loading...');
                $('#wind_value').text('Loading...');
            }
        }).done(function (data, textStatus, jqXHR) {
            // Set weather content with response data
            $('#summary_value').text(data.weather[0].main + ', ' + data.weather[0].description);
            $('#humidity_value').text(data.main.humidity + '%');
            $('#wind_value').text(data.wind.speed + ' km/h');
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // Set weather content to n/a
            $('#summary_value').text('N/A');
            $('#humidity_value').text('N/A');
            $('#wind_value').text('N/A');
        }).always(function () {
            //
        })
    };

    // Get json tambons.json and assign data to districtItems
    $.getJSON('tambons.json', function (data) {
        var mapped = $.map(data, function (item) {
            return new District(item);
        })

        self.districtItems(mapped);
        self.drawMarkers(self.districtItems());
    });

    // Get random images from unsplash.it
    $.ajax({
        url: 'http://unsplash.it/list',
        type: 'GET',
        cache: true
    }).done(function (data, textStatus, jqXHR) {
        // transform data to RandomImage Model
        var mapped = $.map(data, function (item) {
            return new RandomImage(item);
        })

        // Set values randomImages with mapped array
        self.randomImages(mapped.splice(0, 9));
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#random > .panel-body').html('<div class="alert alert-danger">Fail to get `unsplash.it` resources</div>');
    }).always(function () {
        //
    });
}

// Initialize Google Map and set focused map to "Rayong" with async
function initMap() {
    googleMap = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 12.7074, lng: 101.1474},
        zoom: 10,
        mapTypeControl: false,
        streetViewControl: false
    });

    ko.applyBindings(new NeighborhoodMapViewModel(googleMap));
}
