/**
 * Created by JMS on 2017/2/18.
 * 兰州 Echarts 地图
 * 可以根据获得的配置项，在controller中修改配置项
 */
(function () {

    var Config = function () {
    };
    Config.prototype.district = function () {
        return ["七里河区", "安宁区", "城关区", "西固区", "红古区", "永登县", "皋兰县", "榆中县"]
    };
    Config.prototype.colors = function () {
        return ["#1467CC", "#2173D9", "#3A88E9", "#5FA3F7", "#7CB1F4", "#A6C9F6", "#C5DCF8", "#E5F3FF"]
    };
    Config.prototype.dataItemDistinct = function () {
        return {
            name: "",
            itemStyle: {
                normal: {
                    areaColor: "",
                    borderColor: "#ffffff",
                    opacity: 0.75,
                    borderWidth: 2
                },
                emphasis: {
                    areaColor: "#FDDD9B",
                    borderColor: "#ffffff",
                    opacity: 1,
                    borderWidth: 1
                }
            },
            label: {
                normal: {
                    textStyle: {
                        color: "#00135A",
                        fontWeight: 'bold',
                        fontSize: 10,
                        fontFamily: "微软雅黑"
                    }
                },
                emphasis: {
                    textStyle: {
                        color: "#00135A",
                        fontWeight: 'bold',
                        fontSize: 10,
                        fontFamily: "微软雅黑"
                    }
                }
            }
        }
    };
    Config.prototype.dataItemCity = function () {
        return {
            name: "兰州市",
            itemStyle: {
                normal: {
                    areaColor: "transparent",
                    borderColor: "#2C79C6",
                    opacity: 0.75,
                    borderWidth: 5
                },
                emphasis: {
                    areaColor: "transparent",
                    borderColor: "#2C79C6",
                    opacity: 0.75,
                    borderWidth: 2
                }
            },
            label: {
                normal: {
                    textStyle: {
                        color: "transparent"
                    }
                },
                emphasis: {
                    textStyle: {
                        color: "transparent"
                    }
                }
            }

        }
    };
    Config.prototype.option = function () {
        return {
            backgroundColor: 'transparent',
            tooltip: {
                show: true,
                formatter: function (params) {
                    return params.name;
                }
            },
            series: [
                {
                    type: 'map',
                    selectedMode: 'single',
                    roam: true,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: "#404040"
                                }
                            }
                        },
                        emphasis: {label: {show: true}}
                    },
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    map: 'lanzhou',
                    data: []
                }
            ]
        }
    };

    angular.module('map.lanzhou',[]);

    angular.module('map.lanzhou').service('lzMapService', function () {

        /**
         * 默认颜色的地图
         * */
        function getDefaultMap() {
            var config = new Config();
            var result = config.option();
            for (var i = 0; i < config.district().length; i++) {
                var item = config.dataItemDistinct();
                item.name = config.district()[i];
                item.itemStyle.normal.areaColor = config.colors()[i];
                result.series[0].data.push(item);
            }
            result.series[0].data.push(config.dataItemCity());
            return result;
        }

        /**
         * 颜色 按value desc 顺序排列
         * @param [{name:'红谷区',value:1},{name:'西固区',value:2}...]；长度为8
         * */
        function getOrderMap(array) {
            if (array == undefined || array == null || array.length != 8) {
                throw "入参不符合要求！";
            }

            var config = new Config();
            var result = config.option();
            array.sort(function (a, b) {
                return Number(b.value) - Number(a.value);
            });
            for (var i = 0; i < config.district().length; i++) {
                var item = config.dataItemDistinct();
                item.name = array[i].name;
                item.value = array[i].value;
                item.itemStyle.normal.areaColor = config.colors()[i];
                result.series[0].data.push(item);
            }
            result.series[0].data.push(config.dataItemCity());
            return result;
        }


        /**
         * 如果需要特殊效果，可以调用此接口，获取基本的配置项
         * */
        function getConfig() {
            return new Config();
        }


        return {
            getDefaultMap: getDefaultMap,
            getOrderMap: getOrderMap,
            getConfig: getConfig
        }


    });

})();