/**
 * Created by Administrator on 2017/3/2.
 */
(function(){
    console.info("map-service.js");
    /**
     * 地图描点
     * @param path
     */
    function describeMarkers(path,map){
        var markers = [];
        for(var i=0;i<path.length;i+=1){
            markers.push(new AMap.Marker({
                map:map,
                position:path[i].pos,
                icon:new AMap.Icon({
                    size:new AMap.Size(24,32),
                    image:getMarkerImage(path[i].industry)
                }),
                offset: new AMap.Pixel(-15,-15),
                title:"车牌号码："+path[i].plate_number,
                extData:path[i]
            }))
        }
        return markers;
    }

    /**
     * 地图描线路
     * @param startPot [120.380783,36.080451]
     * @param endPot [120.377282,36.089451]
     * @param pathArr
     */
    function describeRoute(startPot, endPot, pathArr,map,color){
        //绘制起点，终点
        new AMap.Marker({
            map: map,
            position: startPot, //基点位置
            icon:new AMap.Icon({
                size:new AMap.Size(19,31),
                image:'resources/images/wy/start.png'
            }),
            zIndex: 10
        });
        new AMap.Marker({
            map: map,
            position:endPot, //基点位置
            icon:new AMap.Icon({
                size:new AMap.Size(19,31),
                image:'resources/images/wy/end.png'
            }),
            zIndex: 10
        });
        //绘制乘车的路线
        busPolyline = new AMap.Polyline({
            map: map,
            path: pathArr,
            strokeColor: color,//线颜色"#09f"
            strokeOpacity: 0.8,//线透明度
            strokeWeight: 4//线宽
        });
        //map.setFitView();//地图自适应
        return busPolyline;
    }

    /**
     * 轨迹回放
     * @param startPot
     * @param lineArr
     * @param speed
     */
    function traceBack(startPot,lineArr,speed,map,lineColor,passedColor){
        var marker;
        marker = new AMap.Marker({
            map: map,
            position: startPot,
            icon:new AMap.Icon({
                size:new AMap.Size(52,26),
                image:'resources/images/wy/car.png'
            }),
            offset: new AMap.Pixel(-26, -13),
            autoRotation: true
        });

        // 绘制轨迹
        var polyline = new AMap.Polyline({
            map: map,
            path: lineArr,
            strokeColor: lineColor,  //线颜色
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 3      //线宽
            // strokeStyle: "solid"  //线样式
        });

        var passedPolyline = new AMap.Polyline({
            map: map,
            //path: lineArr,
            strokeColor: passedColor,  //线颜色
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 3     //线宽
            // strokeStyle: "solid"  //线样式
        });

        marker.on('moving',function(e){
            passedPolyline.setPath(e.passedPath);
        });

        map.setFitView();
        marker.moveAlong(lineArr, speed);
    }

    function describeDistrict(map,districtName,districtColor) {
        //加载行政区划插件
        AMap.service('AMap.DistrictSearch', function() {
            var opts = {
                subdistrict: 1,   //返回下一级行政区
                extensions: 'all',  //返回行政区边界坐标组等具体信息
                level: 'city'  //查询行政级别为 市
            };
            //实例化DistrictSearch
            district = new AMap.DistrictSearch(opts);
            district.setLevel('district');
            //行政区查询
            district.search(districtName, function(status, result) {
                var bounds = result.districtList[0].boundaries;
                var polygons = [];
                if (bounds) {
                    for (var i = 0, l = bounds.length; i < l; i++) {
                        //生成行政区划polygon
                        var polygon = new AMap.Polygon({
                            map: map,
                            strokeWeight: 2,
                            path: bounds[i],
                            //fillOpacity: 0.7,
                            fillOpacity: 0.7,
                            fillColor: '',
                            strokeColor:districtColor
                        });
                        polygons.push(polygon);
                    }
                }
            });
        });
    }

    /**
     * 获取小车图标 industry N03 城市公交,N02 公路货运,N01 公路客运,N08港口
     * @param industry
     * @returns {*}
     */
    function getMarkerImage(industry){
        if(industry == 'N01'){
            return "resources/images/wy/cloud_ico14.png"
        }else if(industry == 'N02'){
            return "resources/images/wy/cloud_ico13.png"
        }else if(industry == 'N03'){
            return "resources/images/wy/cloud_ico15.png"
        }else if(industry == 'N08'){
            return "resources/images/wy/cloud_ico16.png"
        }
    }

    /**
     * 地图风格
     * @param style
     * @param map
     */
    function setMapStyle(style,map){
        map.setMapStyle('amap://styles/'+style);
    }

    /**
     * 公交线路查询
     * @param busLine
     */
    function lineSearch(busLine,map,color) {
        //实例化公交线路查询类，只取回一条路线
        var linesearch = new AMap.LineSearch({
            pageIndex: 1,
            city: '镇江',
            pageSize: 1,
            extensions: 'all'
        });
        //搜索“536”相关公交线路
        linesearch.search(busLine, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                lineSearch_Callback(result,map,color);
            } else {
                alert(result);
            }
        });
    }

    /**
     * 公交路线查询服务返回数据解析概况
     * @param data
     */
    function lineSearch_Callback(data,map,color) {
        var lineArr = data.lineInfo;
        var lineNum = data.lineInfo.length;
        if (lineNum == 0) {
        } else {
            for (var i = 0; i < lineNum; i++) {
                var pathArr = lineArr[i].path;
                var stops = lineArr[i].via_stops;
                var startPot = stops[0].location;
                var endPot = stops[stops.length - 1].location;
                map.setCenter(startPot);
                if (i == 0) {
                    describeRoute(startPot, endPot, pathArr,map,color)
                }
            }
        }
    }
    /**
     * 绘制起点，终点
     * @param startPoint,endPoint,map
     * @param iconWidth,iconHeight 图片大小
     * @param iconStartPath,iconEndPath 图片路径
     */
    function getStartAndEndInfo(startPoint,endPoint,map,iconWidth,iconHeight,iconStartPath,iconEndPath) {
        //绘制起点，终点
        new AMap.Marker({
            map: map,
            position: startPoint, //基点位置
            icon:new AMap.Icon({
                size:new AMap.Size(iconWidth,iconHeight),
                image: iconStartPath
            }),
            zIndex: 10
        });
        new AMap.Marker({
            map: map,
            position:endPoint, //基点位置
            icon:new AMap.Icon({
                size:new AMap.Size(iconWidth,iconHeight),
                image: iconEndPath
            }),
            zIndex: 10
        });
    }

    angular.module('map_common',[]);

    angular.module("map_common").service('mapService', ['$http',
        function($http){
            return {
                getMarkers: function (path,map) {
                    return describeMarkers(path,map);
                },
                getRoute: function (startPot1, endPot1, pathArr,map,color) {
                    return describeRoute(startPot1, endPot1, pathArr,map,color);
                },
                traceBack: function (startPot1, pathArr,speed,map,lineColor,passedColor) {
                    return traceBack(startPot1, pathArr,speed,map,lineColor,passedColor);
                },
                changeMapStyle: function (style,map) {
                    return setMapStyle(style,map);
                },
                describeDistrict: function (map,districtName,districtColor) {
                    return describeDistrict(map,districtName,districtColor);
                },
                getStartAndEndInfo:function (startPot,endPot,map,iconWidth,iconHeight,iconStartPath,iconEndPath) {
                    return getStartAndEndInfo(startPot,endPot,map,iconWidth,iconHeight,iconStartPath,iconEndPath);
                }
            }

        }])
})();