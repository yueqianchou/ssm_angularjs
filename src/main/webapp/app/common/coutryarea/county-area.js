angular.module('zjtec.gis', []);

angular.module('zjtec.gis')
    .directive('countyArea', function () {
        return {
            restrict: 'AE',
            templateUrl: 'app/gis/county-area.html',
            link: function (scope, element, attrs) {

                /*var county = gisCommonService.getVector(gisCommonService.getCountySource(), gisCommonService.getDefaultStroke(),
                 gisCommonService.getDefaultCountyColor(), gisCommonService.getCountyText);

                 var divMap = new ol.Map({
                 layers: [gisCommonService.getDefaultRaster(), county],
                 target: 'map3d',
                 view: gisCommonService.getMapCenter()
                 });

                 divMap.on('singleclick', function (evt) {
                 $rootScope.$broadcast('map-click', {
                 event: evt,
                 feature: divMap.forEachLayerAtPixel(evt.pixel, function (pixel, feature) {
                 return feature;
                 })
                 })
                 })*/
                /*       map.centerAndZoom(new BMap.Point(116.417854,39.921988), 15);*/

                scope.loadMapData = function (type, locationList, mapId) {
                    setTimeout(function () {

                        map = new BMap.Map(mapId);
                        var point = null;
                        if (locationList.length > 0) {
                            point = new BMap.Point(locationList[0].longitude, locationList[0].latitude);
                            map.centerAndZoom(point, 12);
                        } else {
                            point = new BMap.Point(119.27, 32.12);
                            map.centerAndZoom(point, 5);
                        }
                            // strokeOpacity: 1,     //线透明度
                            map.setMapStyle({style:'midnight'});
                       /* map.setStrokeColor("#00A");
                        map.setStrokeOpacity(1);*/
                        map.enableScrollWheelZoom();
                        initMarker(type, locationList, mapId);

                    }, 500);
                };
                function initMarker(type, locationList, mapId) {
                    for (var index in locationList) {
                        var marker = setMarker(locationList[index].longitude, locationList[index].latitude);
                        addClickHandler(type, locationList[index], marker);
                    }
                }

                //地图用一个，但是根据type的不同，点击出来的框不一样
                function addClickHandler(type, objectInfo, marker) {
                    marker.addEventListener("click", function (e) {
                            openInfo(type, objectInfo, e);
                        }
                    );
                }

                function openInfo(type, objectInfo, e) {
                    scope.$apply(function () {
                        if (type == "energyEnt") {
                            scope.selectEntEnergy(objectInfo);
                        }
                        if (type == "energyProject") {
                            scope.selectProjectMapInfo(objectInfo);
                        }
                        if (type == "carbonEnt") {
                            scope.selectEnt(objectInfo);
                        }
                        if (type == "carbonIndustry") {
                            scope.selectIndustryEnt(objectInfo);
                        }
                    });


                }

                function setMarker(lng, lat) {
                    var myIcon = new BMap.Icon("resources/images/liz/mapicon6.png", new BMap.Size(18, 24));
                    var marker = new BMap.Marker(new BMap.Point(lng, lat), {icon: myIcon});
                    map.addOverlay(marker);
                    return marker;
                }

            }
        }
    });


/*  var opts = {
 width: 100,
 height: 100,
 enableMessage:true//设置允许信息窗发送短息
 };
 var p = e.target;
 var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
 var infoWindow = new BMap.InfoWindow(objectInfo.project_name,opts);  // 创建信息窗口对象
 map.openInfoWindow(infoWindow,point);

 var myGeo = new BMap.Geocoder();
 var map = new BMap.Map("l-map");
 map.centerAndZoom(new BMap.Point(119.2, 32.2235), 13);
 map.enableScrollWheelZoom(true);
 var index = 0;
 var adds = "镇江市梦溪路二号";
 scope.bdGEO = function () {
 bdGEO();
 };
 function bdGEO() {
 var add = adds;
 geocodeSearch(add);
 }

 function geocodeSearch(add) {
 setTimeout(window.bdGEO, 400);
 myGeo.getPoint(add, function (point) {
 if (point) {
 document.getElementById("result").innerHTML +=  add + ":" + point.lng + "," + point.lat + "</br>";
 var address = new BMap.Point(point.lng, point.lat);
 addMarker(address, new BMap.Label( add, {offset: new BMap.Size(20, -10)}));
 }
 }, "镇江市");
 }
定义风格
var styleJson = [
    {
        "featureType": "all",
        "elementType": "geometry",
        "backgroundColor":"0.5",
        "stylers": {
            "hue": "#1A232C",
            "saturation": 1
        }
    },
    {
        "featureType": "water",
        "elementType": "all",
        "backgroundColor":"0.5",
        "stylers": {
            "color": "#ffffff"
        }
    }
];
map.setMapStyle({styleJson:styleJson});

 // 编写自定义函数,创建标注
 function addMarker(point, label) {
 var marker = new BMap.Marker(point);
 map.addOverlay(marker);
 marker.setLabel(label);
 }
 }*/