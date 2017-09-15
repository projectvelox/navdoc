angular.module('mapService', [])
    .factory('mapSv', function () {
        var geolocation = navigator.geolocation;
        //var geocoder = null;
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
                },
                openTravelModePicker: function (callback) {
                    var title = document.createElement('div');
                    var header = document.createElement('div');
                    var body = document.createElement('div');
                    var footer = document.createElement('div');
                    var content = document.createElement('div');
                    var dialog = document.createElement('div');
                    var modal = document.createElement('div');
                    var result = null;
                    $(title).html('Select Travel Mode')
                        .attr('class','modal-title');
                    $(header).attr('class','modal-header')
                        .append(title);
                    $(body).attr('class','modal-body');
                    $(footer).attr('class','modal-footer');
                    $(content).attr('class','modal-content')
                        .append(header)
                        .append(body)
                        .append(footer);
                    $(dialog).attr('class','modal-dialog')
                        .attr('role','document')
                        .append(content);
                    $(modal).attr('class','modal fade')
                        .attr('tabindex','-1')
                        .attr('role','dialog')
                        .append(dialog)
                        .on('hidden.bs.modal', function () {
                            $(modal).remove();
                            callback(result);
                        })
                        .modal('show');
                    $('body').append(modal);

                    //picker
                    var listGroup = document.createElement('div');
                    var createItemWithMaterialIcon = function (icon, text) {
                        var a = document.createElement('a');
                        var table = document.createElement('table');
                        var tr = document.createElement('tr');
                        var td1 = document.createElement('td');
                        var td2 = document.createElement('td');
                        var span = document.createElement('span');
                        $(td1)
                            .css('padding', '0 5px 0 0')
                            .append(span);
                        $(td2)
                            .html(text);
                        $(tr)
                            .append(td1)
                            .append(td2);
                        $(table)
                            .append(tr);
                        $(a)
                            .attr('class', 'list-group-item')
                            .attr('href', 'javascript:void(0);')
                            .append(table);
                        $(span)
                            .html(icon)
                            .attr('class', 'material-icons');
                        return a;
                    };
                    var cancelButton = createItemWithMaterialIcon('cancel', 'Cancel');
                    var icons = service.syncMethods.getTravelModeIcons();
                    for(var i = 0; i < icons.length; i++){
                        var icon = icons[i];
                        var optionButton = createItemWithMaterialIcon(icon.materialIcon, icon.name);
                        $(optionButton)
                            .data('googleConstant', icon.googleConstant)
                            .on('click', function () {
                                result = $(this).data('googleConstant');
                                $(modal).modal('hide');
                            });
                        $(listGroup).append(optionButton);
                    }
                    $(cancelButton).on('click', function () {
                        $(modal).modal('hide');
                    });
                    $(listGroup)
                        .attr('class', 'list-group')
                        .append(cancelButton);
                    $(body)
                        .append(listGroup);
                },
                getSpriteIcon: function (name, color, size) {
                    //must be initialized!
                    var sprite_src = 'assets/images/map/.... image here!';
                    var original_image_size = {width: 370, height: 424};
                    var image_count = {x: 5, y: 4};
                    var default_size = 45;


                    //let the magic begin.
                    var image_size = new google.maps.Size(((size || default_size)/100) * original_image_size.width, ((size || default_size)/100) * original_image_size.height);
                    var sprite_size = new google.maps.Size(image_size.width/image_count.x, image_size.height/image_count.y);

                    //column names
                    var colors = {//aka x-axis
                        green: 0,
                        red: (sprite_size.width * 1),
                        blue: (sprite_size.width * 2),
                        gray: (sprite_size.width * 3),
                        orange: (sprite_size.width * 4)
                    };

                    //row names
                    var names = { //aka y-axis
                        doctor: 0,
                        m_user: (sprite_size.height * 1),
                        f_user: (sprite_size.height * 2),
                        clinic: (sprite_size.height * 3)
                    };

                    //validate inputs
                    if(Object.keys(colors).indexOf(color) < 0) color = 'blue';
                    if(Object.keys(names).indexOf(name) < 0) name = 'm_user';

                    //icon object
                    return {
                        labelOrigin: new google.maps.Point(0,0),
                        origin: new google.maps.Point(colors[color],names[name]),
                        scaledSize: image_size,
                        size: sprite_size,
                        url: sprite_src
                    }
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
                },
                alertControl: function (options) {
                    var alertControl = this;

                    //options
                    options = options || {};
                    options.map = options.map || {};
                    options.defaultMessage = options.defaultMessage || '';
                    options.defaultType = options.defaultType || 'info';
                    options.position = options.position || 'BOTTOM_CENTER';

                    //elements
                    this.element = document.createElement('div');
                    var closeButton = document.createElement('span');
                    closeButton.style.cursor = 'pointer';
                    closeButton.style.float = 'right';
                    closeButton.style.margin = '0 0 0 10px';
                    closeButton.innerHTML = '&times;';
                    closeButton.addEventListener('click', function () {
                        alertControl.hide();
                    });
                    var messageSpan = document.createElement('span');
                    messageSpan.innerHTML = options.defaultMessage;

                    //style
                    alertControl.element.className = 'alert alert-' + options.defaultType;
                    alertControl.element.setAttribute('role','alert');
                    alertControl.element.style.margin = '5px';
                    alertControl.element.style.display = 'none';
                    alertControl.element.append(closeButton);
                    alertControl.element.append(messageSpan);

                    //methods
                    this.show = function (message, type) {
                        messageSpan.innerHTML = (message || options.defaultMessage);
                        alertControl.element.className = 'alert alert-' + (type || options.defaultType);
                        alertControl.element.style.display = '';
                    };
                    this.hide = function () {
                        alertControl.element.style.display = 'none';
                    };

                    //set to map
                    options.map.controls[google.maps.ControlPosition[options.position]].push(alertControl.element);
                },
                locationControl: function (options, callback) {
                    var locationControl = this;
                    var follow = false;

                    //callback
                    callback = callback || function () {};

                    //options
                    options = options || {};
                    options.map = options.map || {};
                    options.markerOptions = options.markerOptions || {};
                    options.position = options.position || 'RIGHT_BOTTOM';
                    options.innerHtml = options.innerHtml || 'my_location';
                    options.className = options.className || 'material-icons';

                    //element
                    this.element = document.createElement('span');
                    locationControl.element.style.borderRadius = '2px';
                    locationControl.element.style.width = '28px';
                    locationControl.element.style.height = '28px';
                    locationControl.element.style.cursor = 'pointer';
                    locationControl.element.style.backgroundColor = 'white';
                    locationControl.element.style.margin = '0 10px';
                    locationControl.element.style.justifyContent = 'center';
                    locationControl.element.style.alignItems = 'center';
                    locationControl.element.style.fontSize = 'large';
                    locationControl.element.style.display = 'none';
                    locationControl.element.innerHTML = options.innerHtml;
                    locationControl.element.className = options.className;
                    locationControl.element.addEventListener('click', followLocation);

                    //map event
                    options.map.addListener('dragstart', unfollowLocation);
                    options.map.addListener('zoom_changed', unfollowLocation);

                    //marker
                    this.marker = new google.maps.Marker(options.markerOptions);
                    locationControl.marker.setPosition(options.map.getCenter());

                    //marker active
                    this.active = false;

                    //functions
                    function renderMarker(position) {
                        callback(null, position);
                        var latLng = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        locationControl.marker.setPosition(latLng);
                        if(follow) options.map.setCenter(latLng);
                        if(!locationControl.active){
                            locationControl.element.style.display = 'flex';
                            locationControl.marker.setMap(options.map);
                            locationControl.active = true;
                        }
                    }
                    function followLocation() {
                        follow = true;
                        locationControl.element.style.color = 'skyblue';
                        options.map.setCenter(locationControl.marker.getPosition());
                    }
                    function unfollowLocation() {
                        follow = false;
                        locationControl.element.style.color = '';
                    }

                    //check saved current location
                    if(locationCurrentPosition) renderMarker(locationCurrentPosition);

                    //watch
                    service.asyncMethods.watchUserLocation(function (err, position) {
                        if(err) callback(err);
                        else renderMarker(position);
                    });

                    //set to map
                    options.map.controls[google.maps.ControlPosition[options.position]].push(locationControl.element);
                }
            }
        };
        return service;
    });