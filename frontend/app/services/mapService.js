angular.module('mapService', [])
    .factory('mapSv', function () {
        var geolocation = navigator.geolocation;
        var geocoder = null;
        var directionsService = null;
        var locationWatchID = null;
        var locationWatcher = null;
        var locationCurrentPosition = null;

        var service = {
            syncMethods: {
                getDefaultMapOptions: function () {
                    return {
                        center: {lat: 10.7242516, lng: 122.5571539},
                        zoom: 14
                    };
                },
                getTravelModeIcons: function () {
                    return [
                        {name: 'Bicycling', materialIcon: 'directions_bike', googleConstant: 'BICYCLING'},
                        {name: 'Driving', materialIcon: 'directions_car', googleConstant: 'DRIVING'},
                        {name: 'Transit', materialIcon: 'directions_transit', googleConstant: 'TRANSIT'},
                        {name: 'Walking', materialIcon: 'directions_walk', googleConstant: 'WALKING'}
                    ];
                },
                getBoundsFromPath: function () {
                    var bounds = new google.maps.LatLngBounds();
                    for(var i = 0; i < path.length; i++)
                        bounds.extend(path[i]);
                    return bounds;
                }
            }
        };
        return service;
    });