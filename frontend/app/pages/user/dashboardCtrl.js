angular.module('userControllers')
    .controller('userDashboardCtrl', function ($scope, mapSv) {
        var dashboard = this;

        //components
        dashboard.map = new google.maps.Map(document.getElementById('map'), mapSv.syncMethods.getDefaultMapOptions());
        dashboard.alertControl = new mapSv.classes.alertControl({
            map: dashboard.map
        });
        dashboard.locationControl = new mapSv.classes.locationControl({
            map: dashboard.map,
            markerOptions: {
                clickable: false,
                icon: mapSv.syncMethods.getSpriteIcon('m_user', 'orange')
            }
        }, function (err) {
            if(err) {
                Dialog.alert('Location Not Available', err.message || err);
                dashboard.alertControl.show(err.message || err, 'danger');
            }
        });
        dashboard.directionRenderer = new mapSv.classes.directionsRenderer({
            map: dashboard.map
        });
        dashboard.searchBoxControl = new mapSv.classes.searchBoxControl({map: dashboard.map}, function (keyword) {
             alert(keyword);
        });
        dashboard.infoWindow = new google.maps.InfoWindow();

        //variables
        dashboard.clinics = [];
        dashboard.clinicMarkers = [];

        //methods
        dashboard.getClinicDirection = function (marker) {
            mapSv.syncMethods.openTravelModePicker(function (mode) {
                if(mode){
                    dashboard.infoWindow.close();
                    var preloader = new Dialog.preloader('Calculating a route');
                    if(!dashboard.locationControl.active) Dialog.alert('Location not Available', 'Cannot get your location.');
                    else mapSv.asyncMethods.calculateRoute({
                        origin: dashboard.locationControl.marker.getPosition(),
                        destination: marker.getPosition(),
                        optimizeWaypoints: true,
                        provideRouteAlternatives: true,
                        travelMode: mode
                    },function (err, result) {
                        if(err) Dialog.alert('No Route', 'Cannot get route. status: ' + err);
                        else dashboard.directionRenderer.setDirections(result, marker.data);
                        preloader.destroy();
                    });
                }
            });
        };
        dashboard.clearClinicMarkers = function () {
            for(var i = 0; i < dashboard.clinicMarkers.length; i++)
                dashboard.clinicMarkers[i].setMap(null);
            dashboard.clinicMarkers = [];
        };
        dashboard.renderClinics = function () {
            for(var i = 0; i < dashboard.clinics.length; i++){
                var clinic = dashboard.clinics[i];
                var clinicMarker = new google.maps.Marker({
                    map: dashboard.map,
                    position: clinic.coordinates,
                    data: clinic,
                    icon: mapSv.syncMethods.getSpriteIcon('clinic', 'blue')
                });
                clinicMarker.addListener('click', function () {
                    dashboard.infoWindow.setContent(dashboard.getClinicInfoWindowContent(this, dashboard.getClinicDirection));
                    dashboard.infoWindow.setPosition(this.getPosition());
                    dashboard.infoWindow.open(dashboard.map);
                });
                dashboard.clinicMarkers.push(clinicMarker);
            }
        };
        dashboard.getClinicInfoWindowContent = function (marker) {
            var data = marker.data;
            var googleMapsLink = 'https://maps.google.com/maps?saddr=My+Location&daddr=' + data.coordinates.lat + ',' + data.coordinates.lng;
            var template = $($('#clinicInfoWindowTemplate').html());

            //name
            $($(template).find('.name')).html(marker.data.name);
            $($(template).find('.name')).attr('href', '#/users/clinic-profile/marker.data.uid');


            for(var i = 0; i < marker.data.doctors.length; i++){
                var doctor = marker.data.doctors[i];
                $($(template).find('.doctors'))
                    .append('<li><a href="#/users/doctor-profile/123">' + doctor.username + '</a> (' + doctor.specialty + ')</li>')
            }

            //get direction button
            $($(template).find('.get-direction-btn'))
                .attr('href', googleMapsLink)
                .on('click', function (e) {
                    e.preventDefault();
                    dashboard.getClinicDirection(marker);
                });

            //google direction button
            $($(template).find('.google-direction-btn'))
                .attr('target','_blank')
                .attr('href', googleMapsLink);
            return $(template)[0];
        };

        //initialize
        mapSv.asyncMethods.getUserLocation(function (err, position) {
            if(err) {
                dashboard.alertControl.show(err.message || err, 'danger');
            } else dashboard.map.setCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        });
        $scope.$on('pageValidated', function () {
            setTimeout(function () {
                google.maps.event.trigger(dashboard.map, 'resize');
            }, 2000);
        });
    });