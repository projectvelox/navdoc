angular.module('publicControllers')
    .controller('clinicProfileCtrl', function ($scope, $route, $routeParams, $location, serverSv, mapSv) {
        var clinicProfile = this;
        clinicProfile.errorMessage = undefined;
        clinicProfile.loading = false;
        clinicProfile.profile = {};
        clinicProfile.map = new google.maps.Map(document.getElementById('map'), mapSv.syncMethods.getDefaultMapOptions());
        clinicProfile.locationControl = new mapSv.classes.locationControl({
            map: clinicProfile.map,
            markerOptions: {
                clickable: false,
                icon: mapSv.syncMethods.getSpriteIcon('m_user', 'orange')
            }
        }, function (err) {
            if(err) Dialog.alert('Location Not Available', err.message || err);
        });
        clinicProfile.directionRenderer = new mapSv.classes.directionsRenderer({
            map: clinicProfile.map
        });
        clinicProfile.marker = new google.maps.Marker({
            map: clinicProfile.map,
            clickable: false,
            icon: mapSv.syncMethods.getSpriteIcon('clinic', 'blue')
        });

        //method
        clinicProfile.init = function () {
            clinicProfile.loading = true;
            serverSv.request('/clinic/get/' + $routeParams.id)
                .then(function (response) {
                    var data = response.data;
                    if(data.error) clinicProfile.errorMessage = data.error[1];
                    else {
                        clinicProfile.profile = data;
                        clinicProfile.marker.setPosition(clinicProfile.profile.coordinates);
                        clinicProfile.map.setCenter(clinicProfile.marker.getPosition());
                    }
                }).catch(function (err) {
                    clinicProfile.errorMessage = 'An unknown error occurred';
                }).finally(function () {
                    clinicProfile.loading = false;
                });
        };
        clinicProfile.getDirection = function () {
            mapSv.syncMethods.openTravelModePicker(function (mode) {
                if(mode){
                    $('body').scrollTop(0);
                    var preloader = new Dialog.preloader('Calculating a route');
                    if(!clinicProfile.locationControl.active) Dialog.alert('Location not Available', 'Cannot get your location.');
                    else mapSv.asyncMethods.calculateRoute({
                        origin: clinicProfile.locationControl.marker.getPosition(),
                        destination: clinicProfile.marker.getPosition(),
                        optimizeWaypoints: true,
                        provideRouteAlternatives: true,
                        travelMode: mode
                    },function (err, result) {
                        if(err) Dialog.alert('No Route', 'Cannot get route. status: ' + err);
                        else {
                            clinicProfile.directionRenderer.setDirections(result);

                            clinicProfile.map.fitBounds(mapSv.syncMethods.getBoundsFromPath([clinicProfile.marker.getPosition(), clinicProfile.locationControl.marker.getPosition()]));
                        }
                        preloader.destroy();
                    });
                }
            });
        };

        //initialize
        $scope.$on('pageValidated', function () {
            setTimeout(function () {
                google.maps.event.trigger(clinicProfile.map, 'resize');
                clinicProfile.map.setCenter(clinicProfile.marker.getPosition());
            }, 2000);
        });
        clinicProfile.init();
    });