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
            },
            asyncMethods: {
                getUserLocation: function (callback) {
                    if(geolocation){
                        if(locationCurrentPosition) callback(null, locationCurrentPosition);
                        else geolocation.getCurrentPosition(function (position) {
                            callback(null, position);
                        }, callback, {
                            enableHighAccuracy: true
                        });
                    } else callback('Geolocation is not supported by this browser.');
                },
                watchUserLocation: function (watch) {
                    locationWatcher = watch;
                    if (geolocation){
                        if(!locationWatchID) {
                            locationWatchID = geolocation.watchPosition(function (position) {
                                locationCurrentPosition = position;
                                locationWatcher(null, position);
                            }, function (err) {
                                locationWatcher(err);
                            }, {
                                enableHighAccuracy: true
                            });
                        } else locationWatcher = watch;
                    }
                    else callback('Geolocation is not supported by this browser.');
                },
                calculateRoute: function (options, callback) {
                    if(!directionsService) directionsService = new google.maps.DirectionsService();
                    directionsService.route(options, function (result, status) {
                        if(status == 'OK') callback(null, result);
                        else callback(status, result);
                    });
                }
            },
            classes: {
                directionsRenderer: function (options) {
                    //options
                    options = options || {};
                    options.map = options.map || null;
                    options.polylineOptions = options.polylineOptions || {
                            strokeColor: '#424242',
                            strokeWeight: 10,
                            strokeOpacity: 0.5
                        };
                    options.selectedPolylineOptions = options.selectedPolylineOptions || {
                            strokeColor: '#1565c0',
                            strokeWeight: 12,
                            strokeOpacity: 0.8
                        };
                    options.markerColor = options.markerColor || '#8bc34a';

                    //private properties
                    var renderer = this;
                    var directions = null;
                    var routeIndex = 0;
                    var polylines = [];
                    var markers = [];
                    var infoWindow = new google.maps.InfoWindow();
                    var finalInfoWindow = new google.maps.InfoWindow();

                    //private methods
                    var clearPolylines = function () {
                        for(var i = 0; i < polylines.length; i++)
                            polylines[i].setMap(null);
                        polylines = [];
                    };
                    var clearMarkers = function () {
                        for(var i = 0; i < markers.length; i++)
                            markers[i].setMap(null);
                        markers = [];
                    };
                    var clearInfoWindows = function () {
                        infoWindow.close();
                        finalInfoWindow.close();
                    };
                    var clearOverlays = function () {
                        clearPolylines();
                        clearMarkers();
                        clearInfoWindows();
                    };
                    var createTextAndMaterialIconHTML = function (icon, text) {
                        var div = document.createElement('div');
                        var table = document.createElement('table');
                        var tr = document.createElement('tr');
                        var td1 = document.createElement('td');
                        var td2 = document.createElement('td');
                        var span = document.createElement('span');
                        $(div).append(table);
                        $(table).append(tr);
                        $(td1).append(span);
                        $(td2).css('padding', '0 0 0 5px').html(text);
                        $(span).attr('class', 'material-icons').html(icon);
                        $(tr).append(td1).append(td2);
                        return div;
                    };
                    var createInfoWindowContent = function (data) {
                        var content = document.createElement('div');
                        $(content).css('padding', '10px');
                        for(var i = 0; i < data.length; i++)
                            $(content).append(createTextAndMaterialIconHTML(data[i][0], data[i][1]));
                        return content;
                    };
                    var getTravelModeMaterialIcon = function () {
                        var mode = directions.request.travelMode;
                        var icons = service.getTravelModeIcons();
                        for(var i = 0; i < icons.length; i++){
                            var icon = icons[i];
                            if(icon.googleConstant == mode) return icon.materialIcon;
                        }
                        return 'directions_car';
                    };
                    var renderPolylines = function () {
                        var routes = directions.routes;
                        for(var i = 0; i < routes.length; i++){
                            var path = routes[i].overview_path;
                            var polyline = new google.maps.Polyline ((i == routeIndex)? options.selectedPolylineOptions:options.polylineOptions);
                            polyline.setPath(path);
                            polyline.setMap(options.map);
                            polyline.index = i;
                            polyline.addListener('click', function () {
                                renderer.setRouteIndex(this.index);
                            });
                            polylines.push(polyline);
                        }
                    };
                    var renderFinalInfoWindow = function () {
                        var legs = directions.routes[routeIndex].legs;
                        var lastLeg = legs[legs.length - 1];
                        var div = document.createElement('div');
                        var button = document.createElement('button');
                        var content = createInfoWindowContent([
                            ['place', lastLeg.end_address],
                            ['directions', lastLeg.distance.text],
                            [getTravelModeMaterialIcon(), lastLeg.duration.text]
                        ]);
                        $(button)
                            .attr('class', 'btn btn-sm btn-default')
                            .html('Clear Direction')
                            .on('click', function () {
                                renderer.clearDirections();
                            });
                        $(div)
                            .css('padding-top', '10px')
                            .css('text-align', 'right')
                            .append(button);
                        $(content).append(div);

                        finalInfoWindow.setContent(content);
                        finalInfoWindow.setPosition(lastLeg.end_location);
                        finalInfoWindow.open(options.map);
                    };
                    var renderMarkers = function () {
                        var legs = directions.routes[routeIndex].legs;
                        for(var i = 0; i < legs.length; i++){
                            var leg = legs[i];
                            for(var j = 0; j < leg.steps.length; j++){
                                var step = leg.steps[j];
                                var marker = new google.maps.Marker({
                                    map: options.map,
                                    position: step.start_location,
                                    icon: {
                                        path: google.maps.SymbolPath.CIRCLE,
                                        fillOpacity: 1,
                                        strokeWeight: 0,
                                        scale: 7,
                                        fillColor: options.markerColor
                                    },
                                    infoContent: createInfoWindowContent([
                                        ['navigation', step.instructions],
                                        ['directions', step.distance.text],
                                        [getTravelModeMaterialIcon(), step.duration.text]
                                    ])
                                });
                                marker.addListener('click', function () {
                                    infoWindow.setContent(this.infoContent);
                                    infoWindow.setPosition(this.getPosition());
                                    infoWindow.open(options.map);
                                });
                                markers.push(marker);
                            }
                        }
                    };
                    var renderDirections = function () {
                        renderPolylines();
                        renderMarkers();
                        renderFinalInfoWindow();
                    };

                    //public methods
                    this.clearDirections = function () {
                        directions = null;
                        routeIndex = 0;
                        clearOverlays();
                    };
                    this.setDirections = function (directionsResult) {
                        renderer.clearDirections();
                        directions = directionsResult;
                        renderDirections();
                    };
                    this.setRouteIndex = function (index) {
                        routeIndex = index;
                        clearOverlays();
                        renderDirections();
                    };
                }
            }
        };
        return service;
    });