$(document).ready(function () {
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
    function NeighborhoodMapViewModel() {
        // Set value is "" for search input
        self.search = ko.observable("");

        // Set district list observable array from tambons.json with ajax
        self.districtItems = ko.observableArray([]);

        // Set random images list observable array
        self.randomImages = ko.observableArray([]);

        // Initialize Google Map and set focused map to "Rayong"
        self.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 12.7074, lng: 101.1474},
            zoom: 10,
            mapTypeControl: false,
            streetViewControl: false
        });

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

                var mapMarker = new google.maps.Marker({
                    position: {lat: district.lat, lng: district.lng},
                    map: self.map
                });
                mapMarker.addListener('click', self.selectedMapMarker(mapMarker, index, district));

                self.mapMarkers.push(mapMarker);
                self.mapMarkers[index].setMap(self.map);
            }
        };

        // Change center of the map using panTo function
        self.mapChangeCenter = function (item) {
            self.map.panTo({lat: item.lat, lng: item.lng});
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

        // Select map marker and close old infoWindow and show new infoWindow
        self.selectedMapMarker = function (marker, index, place) {
            return function () {
                let contentString = '<div class="info-window">' +
                    '<img class="img-thumbnail" style="max-width: 300px;" src="https://maps.googleapis.com/maps/api/streetview?size=280x140&location=' + place.formatted().replace(' ', '+') + '&heading=151.78&pitch=-0.76&key=AIzaSyDzW4E77XCeNaBRJ3xzee1LHISl0nd-efQ">' +
                    '<h3>' + place.formatted() + '</h3>' +
                    '</div>';

                var infoWindow = self.infoWindow;
                infoWindow.setContent(contentString);
                infoWindow.close();

                infoWindow.open(self.map, marker);
            };
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
            url: 'https://unsplash.it/list',
            type: 'GET',
            cache: true
        }).done(function (data, textStatus, jqXHR) {
            var mapped = $.map(data, function (item) {
                return new RandomImage(item);
            })
            self.randomImages(mapped.splice(0, 9));
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $('#random').hide();
        }).always(function () {
            //
        });
    }

    ko.applyBindings(new NeighborhoodMapViewModel());
});
