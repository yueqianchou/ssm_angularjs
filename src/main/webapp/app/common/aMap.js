/**
 * Created by Administrator on 2017/9/14.
 */
(function () {
    angular.module('map', []);
    angular.module('map').directive('aMap', function ($q,$timeout) {
        return {
            restrict: 'EA',
            templateUrl: 'app/common/aMap.html',
            link: function(scope){

                setPosition();

                scope.layerFlag = false;

                var _map, _mark;

                /*初始化地图*/
                initMap().then(function(){
                    /*加载插件*/
                    loadPlugin();
                    /*加载点击事件*/
                    loadClickEvent();
                    /*输入定位*/
                    getPosition();
                    /*卫星云图*/
                    cutoverSatellite();
                });

                function initMap() {
                    var deferred = $q.defer();

                    //生成地图实例  默认中心为镇江市
                    _map = new AMap.Map('mapContainer', {
                        resizeEnable: true,
                        //center: [119.45,32.20],
                        center: [112.7841,32.114564],//枣阳市汉城
                        zoom: 11
                    });
                    setScopePositionInfo(_map.getCenter());

                    deferred.resolve();
                    return deferred.promise;
                }

                //加载插件
                function loadPlugin() {
                    _map.plugin(["AMap.ToolBar", "AMap.Autocomplete", "AMap.PlaceSearch"], function () {
                        _map.addControl(new AMap.ToolBar());

                        //联想搜索框
                        var autoOptions = {
                            city: "镇江市", //城市，默认全国
                            input: "tipinput"//使用联想输入的input的id
                        };
                        //构造地点查询类
                        var placeSearch = new AMap.PlaceSearch({
                            map: _map
                        });

                        //注册监听，当选中某条记录时会触发
                        AMap.event.addListener(new AMap.Autocomplete(autoOptions), "select", select);
                        function select(e) {
                            placeSearch.setCity(e.poi.adcode);
                            placeSearch.search(e.poi.name);  //关键字查询
                        }
                    });
                }

                //输入数值进行定位
                function getPosition() {
                    $('#getPosition').click(function () {
                        var lnglat = new AMap.LngLat(parseFloat(scope.longitudeValue), parseFloat(scope.latitudeValue));
                        _map.setCenter(lnglat);
                        _mark.setPosition(lnglat);
                    });
                }

                //加载点击事件
                function loadClickEvent() {
                    _mark = new AMap.Marker({
                        map: _map
                    });
                    _map.on('click', function (e) {
                        setScopePositionInfo(e.lnglat);
                        _mark.setPosition(e.lnglat);
                        _map.setCenter(e.lnglat);
                        scope.$apply();
                    });
                }

                //添加卫星云图
                function cutoverSatellite() {
                    var satelliteLayer = new AMap.TileLayer.Satellite();
                    $('#satellite').click(function () {
                        scope.layerFlag ? satelliteLayer.setMap(null) : satelliteLayer.setMap(_map);
                        scope.layerFlag = !scope.layerFlag;
                        scope.$apply();
                    });
                }

                function setScopePositionInfo(lnglat) {
                    scope.longitudeValue = lnglat.getLng();
                    scope.latitudeValue = lnglat.getLat();
                }

                function setPosition(){
                    scope.$watch("showMap",function(newVal,oldVal){
                        if(newVal === oldVal) return;
                        if(newVal == true){
                            $timeout(function () {
                                $('.outContent').css({
                                    position:"absolute"
                                    // left:($(window).width() - $('.outContent').outerWidth())/2,
                                    // top:($(window).height() - $('.outContent').outerHeight())/2
                                })
                            })
                        }
                    })
                }
            }
        }
    });

})();