/**
 * 综合分析
 */
(function () {
    angular.module('analysis').controller('analysisCtrl', ['$scope','mapService',
        function ($scope,mapService) {
            $scope.backHome = function () {
                window.location.href = "welcome.html";
            };


            init();
            function init() {
                $('.addScroll').perfectScrollbar();
                $scope.mask=false;
                //getTrackYears();//获取年份
               // $scope.typeCodeValue = 'green_travel';
                //$scope.showDiv = 'green_travel';
               // pageInit();
                loadMap();
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
                mapService.describeDistrict($scope.map,"镇江市","#CC66CC");
            }

            /*获取年份信息*/
            function getTrackYears() {
                analysisService.query_all_report_year().success(function (response) {
                    if (response.success) {
                        $scope.years = response.data.years;
                        $scope.periodValue = $scope.years[0].code;//当前年份
                        getMetricTypeValue('overview', 'right')//右侧值
                        getMetricTypeValue('green_travel', 'left')//左侧默认值
                    }
                });
            }

            //左侧菜单
            $scope.metricTypes = [
                {type_code: 'green_travel', type_name: '绿色出行', type_class: 'sMenuIcon sMenuIcon1'},
                {type_code: 'green_equipment', type_name: '绿色装备', type_class: 'sMenuIcon sMenuIcon2'},
                {type_code: 'green_circulation', type_name: '绿色循环', type_class: 'sMenuIcon'},
                {type_code: 'green_construction', type_name: '绿色建设', type_class: 'sMenuIcon'},
                {type_code: 'infrastructure', type_name: '基础设施', type_class: 'sMenuIcon'},
                {type_code: 'pollution_prevention', type_name: '污染防治', type_class: 'sMenuIcon'},
                {type_code: 'intelligent_transportation', type_name: '智能交通', type_class: 'sMenuIcon'}
            ]

            //左侧指标类型改变
            $scope.changeLeftMenu = function (typeCode) {
                $scope.typeCodeValue = typeCode;
                $scope.showDiv = typeCode;
                //getMetricTypeValue(typeCode, 'left');
            }

            function getMetricTypeValue(typeCode, result) {
                var param = {
                    period_value: $scope.periodValue,
                    type_code: typeCode
                }
                analysisService.query_metric_type_value(param).success(function (response) {
                    if (response.success) {
                        if (result == 'right') {
                            $scope.rightMetricValues = response.data;
                        }
                        if (result == 'left') {
                            $scope.metricValues = response.data;
                        }

                    }
                })
            }

            $scope.changeYear = function () {
                getMetricTypeValue('overview', 'right')//右侧值
                getMetricTypeValue($scope.showDiv, 'left')//左侧默认值
            }

            //右侧弹出框伸缩
            $scope.flag = true;
            $scope.rightMenu = function () {
                $scope.flag = !$scope.flag;
                if(!$scope.flag){
                    $("#rightMenuId").stop(!1).animate({"right":'-386px'},1000, function (){
                    })
                }else{
                    $("#rightMenuId").stop(!1).animate({"right":'0px'},1000, function (){
                    })
                }
            }

            $scope.closeDiv = function () {
                $scope.showDiv = false;
            }
        }])
})();