angular.module('publicControllers')
    .controller('homeCtrl', function (mapSv) {
        var home = this;
        home.contact = {map: new google.maps.Map(document.getElementById('map'), mapSv.syncMethods.getDefaultMapOptions())};
        home.contact.marker = new google.maps.Marker({
            map: home.contact.map,
            position: home.contact.map.getCenter(),
            animation: google.maps.Animation.BOUNCE
        })
    });