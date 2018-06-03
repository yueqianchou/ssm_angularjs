/**
 * 综合报告
 */
(function () {
    angular.module('zjtec.decision').controller('decisionReportCtrl', ['$scope', 'reportService', '$filter',
        function ($scope, reportService, $filter) {
            $('.addScroll').perfectScrollbar();
            init();

            function init() {
                /*获取综合报告各年份信息（包含 年份，该年份有无生成报告，该年份能不能生成报告）*/
                getAllYearsComprehensiveReportState();

            }

            function getAllYearsComprehensiveReportState() {
                reportService.getAllYearsComprehensiveReportState().success(function (response) {
                    if (response.success) {
                        $scope.yearState = response.data;
                        initParam($scope.yearState[0].code);
                        moveDirection($scope.yearState[0].code, 'left');//初始化时间
                        /* 获取历史报告信息（metric_value_comp_report 所有信息）*/
                        if ($scope.state == 1) {
                            getQingdaoComprehensiveReportInfo($scope.periodValue);
                        }
                    }
                })
            }

            function initParam(year) {
                for (var i in $scope.yearState) {
                    if (year == $scope.yearState[i].code) {
                        $scope.periodValue = $scope.yearState[i].code
                        $scope.state = $scope.yearState[i].state //综合报告的状态 （0未生成报告，1已生成报告）
                        $scope.is_can_create = $scope.yearState[i].is_can_create//是否可以生成报告
                        return;
                    }
                }
            }

            /*向左向右改变年*/
            $scope.moveDirection = function (date, direction) {
                moveDirection(date, direction);
            }

            /*
             * 1.判断长度是否够5年
             * 2.到达最左边就不能向左移动,到达最右边就不能向右移动
             * 3.移动时先拿到年份的code列表,在从$scope.yearState拿到对应的年份列表
             * */
            function moveDirection(date, direction) {
                var dateLength = $scope.yearState[0].code * 1 - $scope.yearState[$scope.yearState.length - 1].code * 1;
                dateLength = (dateLength < 4 ? dateLength : 5);//dateLength等于3长度为4年,等于4长度为5年,最大显示5年
                if ((date == $scope.yearState[$scope.yearState.length - 1].code && direction == 'left')
                    || ($scope.yearList != undefined && date == $scope.yearState[0].code && direction == 'right')) {
                    return;
                } else {
                    $scope.yearList = [];
                    if (direction == 'left') {
                        if (dateLength < 4) {
                            for (var i = dateLength; i >= 0; i--) {
                                $scope.yearList.push($scope.yearState[$scope.yearState.length - i - 1].code);
                            }
                        } else {
                            for (var i = 4; i >= 0; i--) {
                                if (date * 1 - i >= $scope.yearState[$scope.yearState.length - 1].code) {
                                    $scope.yearList.push(date * 1 - i);
                                }
                            }
                            if ($scope.yearList.length < 5) {//向左移动时小于5个默认从最后补足5个
                                $scope.yearList = [];
                                for (var i = 0; i < 5; i++) {
                                    $scope.yearList.push($scope.yearState[$scope.yearState.length - i - 1].code)
                                }
                            }
                        }
                    } else {
                        if (dateLength < 4) {
                            for (var i = 0; i <= dateLength; i++) {
                                $scope.yearList.push($scope.yearState[0 + i].code);
                            }
                        } else {
                            for (var i = 0; i < 5; i++) {
                                if (date * 1 + i <= $scope.yearState[0].code) {
                                    $scope.yearList.push(date * 1 + i);
                                }
                            }
                            if ($scope.yearList.length < 5) {//向右移动时小于5个默认从最后补足5个
                                $scope.yearList = [];
                                for (var i = 4; i >= 0; i--) {
                                    $scope.yearList.push($scope.yearState[0 + i].code)
                                }
                            }
                        }
                    }
                    $scope.years = [];
                    for (var i in $scope.yearList) {
                        for (var j in $scope.yearState) {
                            if ($scope.yearList[i] == $scope.yearState[j].code) {
                                $scope.years.push($scope.yearState[j]);
                            }
                        }
                    }
                }
            }

            /*改变年*/
            $scope.changeYear = function (year) {
                initParam(year);
                if ($scope.state == 1) {
                    getQingdaoComprehensiveReportInfo($scope.periodValue);
                }
            }
            /* 获取历史报告信息（metric_value_comp_report 所有信息）*/
            function getQingdaoComprehensiveReportInfo(year) {
                reportService.getQingdaoComprehensiveReportInfo(year).success(function (response) {
                    if (response.success) {
                        //$scope.info=response.data.report_info.parseJSON();
                        $scope.info = JSON.parse(response.data.report_info);
                        $scope.reportId = response.data.id;
                        if ($scope.info != null) {
                            $scope.baseList = $scope.info.marco.baseList;
                            $scope.macroNoDimList = $scope.info.marco.macroNoDimList;//宏观数据
                            $scope.coalAndCarbonList = $scope.info.marco.coalAndCarbonList;//宏观数据
                            $scope.fuelTypeMacroValueList = $scope.info.marco.fuelTypeMacroValueList;//宏观数据
                            getOneDimMetricDimValuesDataBar($scope.coalAndCarbonList)//条形图
                            getMetricDimValuesPie($scope.fuelTypeMacroValueList, 2);//饼图

                            $scope.mainIndustryInfoList = $scope.info.mainIndustryInfo;//8个行业数据
                            $scope.RoadPassengerReportInfo = $filter('filter')($scope.mainIndustryInfoList, {industry_name: '公路客运'})[0];
                            getRoadPassengerReportInfoBar($scope.RoadPassengerReportInfo.vehicleTypeOneDimValueList, 4)//条形图
                            getRoadPassengerReportInfoPie($scope.RoadPassengerReportInfo.fuelTypeOneDimValueList, 3);//饼图

                            $scope.RoadFreightReportInfo = $filter('filter')($scope.mainIndustryInfoList, {industry_name: '公路货运'})[0];
                            getRoadPassengerReportInfoPie($scope.RoadFreightReportInfo.fuelTypeOneDimValueList, 5);//饼图
                            getRoadPassengerReportInfoBar($scope.RoadFreightReportInfo.truckTypeOneDimValueList, 6)//条形图

                            $scope.BusReportInfo = $filter('filter')($scope.mainIndustryInfoList, {industry_name: '城市公交'})[0];
                            getRoadPassengerReportInfoPie($scope.BusReportInfo.fuelTypeOneDimValueList, 7);//饼图
                            getRoadPassengerReportInfoBar($scope.BusReportInfo.vehicleTypeOneDimValueList, 8)//条形图

                            $scope.TaxiReportInfo = $filter('filter')($scope.mainIndustryInfoList, {industry_name: '城市出租'})[0];
                            $scope.fuelTypeOneDimValueList = $filter('filter')($scope.TaxiReportInfo.fuelTypeOneDimValueList, {metric_code: 'energy_value'}, true);
                            $scope.taxiReportTypeOneDimValueList = $filter('filter')($scope.TaxiReportInfo.fuelTypeOneDimValueList, {metric_code: 'energy_value'}, false);
                            getRoadPassengerReportInfoPie($scope.fuelTypeOneDimValueList, 9);//饼图
                            getRoadPassengerReportInfoBar($scope.taxiReportTypeOneDimValueList, 10)//条形图


                            $scope.RoadBuildReportInfo = $filter('filter')($scope.mainIndustryInfoList, {industry_name: '公路建设'})[0];
                            getRoadPassengerReportInfoPie($scope.RoadBuildReportInfo.fuelTypeOneDimValueList, 11);//饼图
                            getRoadPassengerReportInfoBar($scope.RoadBuildReportInfo.facilityTypeOneDimValueList, 12)//条形图
                            getRoadPassengerReportInfoBar($scope.RoadBuildReportInfo.roadProjectTypeOneDimValueList, 13)//条形图

                            $scope.RoadBusinessReportInfo = $filter('filter')($scope.mainIndustryInfoList, {industry_name: '公路运营养护'})[0];
                            getRoadPassengerReportInfoPie($scope.RoadBusinessReportInfo.fuelTypeOneDimValueList, 14);//饼图
                            getRoadPassengerReportInfoBar($scope.RoadBusinessReportInfo.roadProjectTypeOneDimValueList, 15)//条形图

                            $scope.ShipReportInfo = $filter('filter')($scope.mainIndustryInfoList, {industry_name: '水路货运'})[0];
                            getRoadPassengerReportInfoPie($scope.ShipReportInfo.fuelTypeOneDimValueList, 16);//饼图
                            getRoadPassengerReportInfoBar($scope.ShipReportInfo.shipTypeOneDimValueList, 17)//条形图

                            $scope.PortReportInfo = $filter('filter')($scope.mainIndustryInfoList, {industry_name: '港口生产'})[0];
                            getRoadPassengerReportInfoPie($scope.PortReportInfo.fuelTypeOneDimValueList,18);//饼图
                            getRoadPassengerReportInfoBar($scope.PortReportInfo.portTypeOneDimValueList, 19)//条形图

                        }

                    }
                })
            }


            /*公路客运*/
            function getRoadPassengerReportInfoBar(dataList, id) {
                var xdata = [];
                var yLeftData = [];
                var yRightData = [];
                if (dataList != undefined && dataList.length > 0) {
                    for (var i in dataList) {
                        if (i % 2 == 0) {
                            xdata.push(dataList[i].dima_value_name);
                            yRightData.push(dataList[i].metric_value * 1);//碳排

                        } else {
                            yLeftData.push(dataList[i].metric_value * 1);//能耗
                        }
                    }
                    $('#charts_id' + id).highcharts(reportService.getOption(xdata, yLeftData, yRightData));

                }
            }

            function getRoadPassengerReportInfoPie(dataList, id) {
                var data = [];
                var unit_name = null;
                if (dataList != undefined && dataList.length > 0) {
                    for (var i in dataList) {
                        data.push({name: dataList[i].dima_value_name, y: dataList[i].metric_value * 1})
                    }
                    unit_name = dataList[0].unit_name;
                }

                var name = "占比";
                $('#charts_id' + id).highcharts(reportService.getPie(name, data, unit_name));
            }


            /*宏观条形图*/
            function getOneDimMetricDimValuesDataBar(coalAndCarbonList) {
                var xdata = [];
                var yLeftData = [];
                var yRightData = [];
                if (coalAndCarbonList != undefined && coalAndCarbonList.length > 0) {
                    for (var i in coalAndCarbonList) {
                        xdata.push(coalAndCarbonList[i].industry_name);
                        yLeftData.push(coalAndCarbonList[i].energy_coal_value);
                        yRightData.push(coalAndCarbonList[i].energy_carbon_value);
                    }
                    $('#charts_id1').highcharts(reportService.getOption(xdata, yLeftData, yRightData));

                }
            }

            /*宏观饼图*/
            function getMetricDimValuesPie(dataList, id) {
                var data = [];
                var unit_name = null;
                if (dataList != undefined && dataList.length > 0) {
                    for (var i in dataList) {
                        data.push({name: dataList[i].metric_name, y: dataList[i].metric_value * 1})
                    }
                    unit_name = dataList[0].metric_unit_name;
                }
                var name = "占比";
                $('#charts_id' + id).highcharts(reportService.getPie(name, data, unit_name));
            }


            /*生成报告*/
            $scope.createComprehensiveReportInfo = function () {
                /*if ($scope.is_can_create == true) {*/
                reportService.createComprehensiveReportInfo($scope.periodValue).success(function (response) {
                    if (response.success) {
                        alert("生成报告成功");
                        reportService.getAllYearsComprehensiveReportState().success(function (response) {
                            if (response.success) {
                                $scope.yearState = response.data;
                                initParam($scope.periodValue);
                                moveDirection($scope.periodValue,'left');//初始化五个年份信息
                                moveDirection($scope.periodValue,'right');//初始化五个年份信息
                                $scope.changeYear($scope.periodValue);
                            }
                        })
                    }
                })
                /* } else {
                     alert("该年份不能生成报告");
                 }*/

            }


            /*导出*/
            $scope.downLoad = function () {
                if ($scope.state == 1) {
                    exportReport();
                }
            };


            //导出报告，参照青岛 综合报告
            /**
             * 导出报告
             * 1 保存报告里的图片信息
             * 2 导出报告
             */
            function exportReport() {
                var data = handleReportImage();
                var images = {
                    reportImages: data
                };
                reportService.saveReportImage($scope.reportId, images).success(function (response) {
                    window.location.href = "comp_report/down_report_info/" + $scope.reportId;
                });
            }

            function handleReportImage() {
                var result = [];
                for(var i =1;i<=19;i++){
                    var reportImageInfo = {
                        order_num: i,
                        image: getReportImage('charts_id'+i),
                        comp_report_id: $scope.reportId
                    };
                    result.push(reportImageInfo);
                }
                return result;
            }

            function getReportImage(id) {
                if(!$("#" + id) || !$("#" + id).highcharts()){
                    return ;
                }
                var chartData = $("#" + id).highcharts().getSVG();
                var canvas = document.getElementById('myCanvas');
                canvg(canvas, chartData);
                return canvas.toDataURL("image/png").split('base64,')[1];
            }




            function loadMap() {
                $scope.map = null;
                $scope.map = new AMap.Map("map", {
                    resizeEnable: true,
                    center: [119.471396, 31.994095],//地图中心点
                    zoom: 11 //地图显示的缩放级别
                });
                $scope.map.plugin(["AMap.ToolBar"], function () {
                    $scope.map.addControl(new AMap.ToolBar());
                });
                mapService.changeMapStyle('grey', $scope.map);

                $scope.map.setFitView();
                mapService.describeDistrict($scope.map,"镇江市","#CC66CC");


            }
        }])
})();