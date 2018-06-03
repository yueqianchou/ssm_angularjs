/**
 * 指标体系
 */
(function(){
    angular.module('sysconfig').controller('baseValueCtrl',['$scope','baseValueService','$filter',
        function($scope,baseValueService,$filter){
            init();

            function init () {
                $(".addScroll").perfectScrollbar();//加入滚动条
                initParam();
            }

            function initParam(){
                $scope.show=true;
                $scope.isEdit=false;
                $scope.deduce = false;
                $scope.menu='economy';
                $scope.rightDiv='economy';
                $scope.leftMenus=[
                    {type_code:'economy',type_name:'经济指标',period_type:'A01',format: "yyyy"},
                    {type_code:'green_traffic',type_name:'绿色交通',period_type:'A01',format: "yyyy"},
                    {type_code:'overview',type_name:'概览指标',period_type:'A01',format: "yyyy"},
                    {type_code:'general_report',type_name:'综合报告',period_type:'A01',format: "yyyy"},
                    {type_code:'data_deduction',type_name:'数据推演',period_type:'A01',format: "yyyy"},
                    {type_code:'trend_forecast',type_name:'趋势预测',period_type:'A00',format: "yyyy"}
                ];
                $scope.metricTypes=[
                    {type_code:'green_travel',type_name:'绿色出行',rows:0},
                    {type_code:'green_equipment',type_name:'绿色装备',rows:0},
                    {type_code:'green_circulation',type_name:'绿色循环',rows:0},
                    {type_code:'green_construction',type_name:'绿色建设',rows:0},
                    {type_code:'infrastructure',type_name:'基础设施',rows:0},
                    {type_code:'pollution_prevention',type_name:'污染防治',rows:0},
                    {type_code:'intelligent_transportation',type_name:'智能交通',rows:0}
                ];
                yearInit();
            }
            //获取填报表那边的年份
            function getReportYear() {
                baseValueService.getReportYears().success(function (response) {
                    if (response.success) {
                        $scope.years = response.data.years;
                        $scope.period_value=$scope.years[0].code;
                        getDebucesDataList($scope.industry,$scope.period_value);
                    }
                })
            }
            //除去数据推演的年份外的其他几个menu的年份是用空间实现的
            function yearInit(){
                getDateClass($scope.leftMenus[0]);//初始化时间控件
                getMetricValueList($scope.leftMenus[0].type_code,$scope.leftMenus[0].period_type);
            }
            //填报表年份的改变
            $scope.changeYear=function(){
                getDebucesDataList($scope.industry,$scope.period_value);
            };
            function getDateClass(periodType){
                $scope.dateFmt = periodType.format;
                $scope.periodType = periodType.period_type;//改变时间控件样式
                $scope.periodValue=$filter('date')(new Date().getTime(), $scope.dateFmt);//初始化时间控件
            }
            //查询指标列表按年份
            $scope.selectBaseValue = function() {
                $scope.isEdit=false;
                $scope.show = true;
                $scope.periodValue=$('#time_idA01').val();
                getMetricValueList($scope.menu,$scope.periodType);
            };
            $scope.editMetric=function(){
                $scope.show=false;
                $scope.isEdit=true;
            };
            //菜单选择不同的查询和展示
            $scope.changeMenu=function(leftMenu){
                $scope.isEdit=false;
                $scope.show = true;
                $scope.menu=leftMenu.type_code;
                $scope.rightDiv=leftMenu.type_code;
                //改变时间控件样式
                getDateClass(leftMenu);
                if($scope.menu=="data_deduction"){
                    $scope.deduce=true;
                    $scope.industries=[
                        {code:'N01',name:'公路客运'},
                        {code:'N02',name:'公路货运'},
                        {code:'N03',name:'城市公交'},
                        {code:'N04',name:'城市出租车'},
                        {code:'N07',name:'水路运输'},
                        {code:'N08',name:'港口生产'}
                    ];
                    $scope.industry=$scope.industries[0].code;
                    getReportYear();
                }else if($scope.menu=="trend_forecast"){
                    $scope.deduce=false;
                    getTendencyMetric();
                }else {
                    $scope.deduce=false;
                    getMetricValueList(leftMenu.type_code, leftMenu.period_type);
                }
            };
            //趋势预测的指标查询
            function getTendencyMetric(){
                baseValueService.get_tend_metric_value().success(function (response){
                    $scope.tendMetric=response.data;
                    var  tendMetric=response.data;
                    $scope.allYears=[
                        {code:'2017',tend:[]},{code:'2018',tend:[]},
                        {code:'2019',tend:[]}, {code:'2020',tend:[]},
                        {code:'2021',tend:[]}, {code:'2022',tend:[]},
                        {code:'2023',tend:[]}, {code:'2024',tend:[]},
                        {code:'2025',tend:[]}, {code:'2026',tend:[]},
                        {code:'2027',tend:[]}, {code:'2028',tend:[]},
                        {code:'2029',tend:[]}, {code:'2030',tend:[]
                        }
                    ];
                    baseValueService.getTendMetricValue().success(function (response){
                        $scope.tendMetricValue=response.data;
                        getTypeTendMetricValue(tendMetric,$scope.tendMetricValue,$scope.allYears)
                    })
                })
            }
            //处理趋势预测指标值进行拼出数组
            function getTypeTendMetricValue(datalist,metric,typeYear){
                if (metric.length == 0) {
                    for (var index in  datalist) {
                        for (var k in typeYear) {
                            typeYear[k].tend.push({name: datalist[index], value: ''})
                        }
                    }
                } else {
                    for (var index in  datalist) {
                        for (var j in metric) {
                            for (var i in typeYear) {
                                if (metric[j].scene_code == datalist[index].scene_code) {
                                    if (metric[j].year ==  typeYear[i].code) {
                                        typeYear[i].tend.push({
                                            name: datalist[index],
                                            value: metric[j].scene_value
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //从数据查询数据推演的指标
            function getDebucesDataList(industry,year){
                $scope.isEdit=false;
                $scope.show = true;
                baseValueService.get_metric_type_name(industry).success(function (response){
                    $scope.DebuceLists=response.data;
                    var dataList = response.data;
                    $scope.season=[
                        {name: '第一季度', code: '-Q1',deduce:[]},
                        {name: '第二季度', code: '-Q2',deduce:[]},
                        {name: '第三季度', code: '-Q3',deduce:[]},
                        {name: '第四季度', code: '-Q4',deduce:[]}
                    ];
                    $scope.month=[
                        {'name': '一月', 'code': '-01',deduce:[]},
                        {'name': '二月', 'code': '-02',deduce:[]},
                        {'name': '三月', 'code': '-03',deduce:[]},
                        {'name': '四月', 'code': '-04',deduce:[]},
                        {'name': '五月', 'code': '-05',deduce:[]},
                        {'name': '六月', 'code': '-06',deduce:[]},
                        {'name': '七月', 'code': '-07',deduce:[]},
                        {'name': '八月', 'code': '-08',deduce:[]},
                        {'name': '九月', 'code': '-09',deduce:[]},
                        {'name': '十月', 'code': '-10',deduce:[]},
                        {'name': '十一月', 'code': '-11',deduce:[]},
                        {'name': '十二月', 'code': '-12',deduce:[]}
                    ];
                    baseValueService.get_metric_value(industry,year).success(function(response){
                        $scope.DeduceValue=response.data;
                        if ($scope.DebuceLists[0].industry == 'N03' || $scope.DebuceLists[0].industry == 'N04') {
                            $scope.debuceType = 'month';
                            getTypeMetricValue(dataList,$scope.DeduceValue,$scope.month,year);
                        }else{
                            $scope.debuceType = 'season';
                            getTypeMetricValue(dataList,$scope.DeduceValue,$scope.season,year);
                        }
                    });
                    console.log($scope.season);
                });

            }
            //处理数据推演指标值和季度或者月，进行拼出数组
            function getTypeMetricValue(datalist,metric,typeYear,period_value){
                if (metric.length == 0) {
                    for (var index in  datalist) {
                        for (var k in typeYear) {
                            typeYear[k].deduce.push({name: datalist[index], value: ''})
                        }
                    }
                } else {
                    for (var index in  datalist) {
                        for (var j in metric) {
                            for (var i in typeYear) {
                                if (metric[j].metric_code == datalist[index].metric_code) {
                                    if (metric[j].period_value == period_value + typeYear[i].code) {
                                        typeYear[i].deduce.push({
                                            name: datalist[index],
                                            value: metric[j].metric_value
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //数据推演行业的切换
            $scope.changeIndustry =function(industry){
                getDebucesDataList(industry,$scope.period_value);
            };
            //查询除去数据推演和趋势预测的指标值列表
            function getMetricValueList(type_code,periodType){
                var param={type_code:type_code,period_value:$scope.periodValue,period_type:periodType}
                baseValueService.get_metric_value_noDim(param).success(function(response){
                    if(response.success){
                        if("green_traffic"==type_code){
                            var temp=response.data;
                            $scope.metricGreenValueList=[];
                            for(var i in $scope.metricTypes){
                                var metricList=[]
                                for(var j in temp){
                                    if($scope.metricTypes[i].type_code==temp[j].type_code){
                                        metricList.push(temp[j]);
                                    }
                                }
                                $scope.metricGreenValueList.push({"type_name":$scope.metricTypes[i].type_name,value:metricList});
                            }
                        }
                        else{
                            $scope.metricValueList=response.data;
                        }
                    }})
            }
            //取消保存
            $scope.cancel=function(){
                if(confirm("确定放弃编辑吗")){
                    $scope.show=true;
                    $scope.isEdit=false;
                    getMetricValueList($scope.rightDiv);
                    // initParam();
                }
            }
            //所有的保存公用一个保存函数，根据menu的code不同执行不同的保存动作
            $scope.updateMetric=function(){
                var param=[];
                if($scope.rightDiv=='green_traffic'){
                    for(var i in $scope.metricGreenValueList){
                        for(var j in $scope.metricGreenValueList[i].value){
                            param.push({
                                    id:$scope.metricGreenValueList[i].value[j].mid,
                                    metric_value:$scope.metricGreenValueList[i].value[j].metric_value,
                                    period_type:$scope.metricGreenValueList[i].value[j].period_type,
                                    period_value:$scope.periodValue,
                                    metric_code:$scope.metricGreenValueList[i].value[j].metric_code

                                }
                            );
                        }
                    }
                }
                else if($scope.rightDiv=='data_deduction'){
                    if($scope.debuceType=='season'){
                        param=saveByYearType($scope.season,param);
                    }else{
                        param=saveByYearType($scope.month,param);
                    }
                }else if($scope.rightDiv=='trend_forecast'){
                    for(var i in $scope.allYears){
                        var period = $scope.allYears[i].code;
                        for(var j in $scope.allYears[i].tend){
                            param.push({
                                year:period,
                                tend:$scope.allYears[i].tend[j].name,
                                scene_value:$scope.allYears[i].tend[j].value
                            })
                        }
                    }
                }else{
                    for(var i in $scope.metricValueList){
                        param.push({
                            id:$scope.metricValueList[i].mid,
                            metric_value:$scope.metricValueList[i].metric_value,
                            period_type:$scope.metricValueList[i].period_type,
                            period_value:$scope.periodValue,
                            metric_code:$scope.metricValueList[i].metric_code
                        })
                    }
                }
                if($scope.rightDiv=='data_deduction'){
                    baseValueService.update_debuce_metric_value(param).success(function(response){
                        if(response.success){
                            alert("修改成功");
                            $scope.show=true;
                            $scope.isEdit=false;
                        }})
                }else if($scope.rightDiv=='trend_forecast'){
                    baseValueService.update_tendency_metric_value(param).success(function(response){
                        if(response.success){
                            alert("修改成功");
                            $scope.show=true;
                            $scope.isEdit=false;
                        }})
                }else{
                    baseValueService.update_metric_value_no_dim(param).success(function(response){
                        if(response.success){
                            alert("修改成功");
                            $scope.show=true;
                            $scope.isEdit=false;
                        }})
                }
            };
            //数据推演保存月和季的数据进行处理成json格式
            function saveByYearType(saveData, param) {
                for (var i in saveData) {
                    var period = $scope.period_value + saveData[i].code;
                    for (var j in saveData[i].deduce) {
                        param.push({
                            metric: saveData[i].deduce[j].name,
                            period_value: period,
                            metric_value: saveData[i].deduce[j].value
                        })
                    }
                }
                return param;
            }

        }])
})();
