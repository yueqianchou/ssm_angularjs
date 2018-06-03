(function () {
    "use strict";
    angular.module("sysconfig").service("baseValueService", function ($http, $log) {
        return {
            getReportYears:function(){
                var url = '';
                return $http.get(url).success(function (response) {
                        console.info("查询年份。");
                        $log.debug(response.data);
                    });
            },
            get_metric_value_noDim: function (param) {
                var url = '';
                return $http.post(url, param).success(function (response) {
                        console.info("【除去数据推演和趋势预测的数据指标值查询】");
                        $log.debug(response.data);
                    });
            },
            //除去数据推演和趋势预测的保存
            update_metric_value_no_dim: function (param) {
                var url = '';
                return $http.post(url, param).success(function (response) {
                        console.info("除去数据推演和趋势预测的保存和修改的指保存");
                        $log.debug(response.data);
                    });
            },
            get_metric_type_name: function (industry) {
                var url = "";
                return $http.get(url).success(function (response) {
                        console.info("【数据推演,不同行业的不同指标】");
                        $log.debug(response.data);
                    });
            },
            //数据推演查询
            get_metric_value: function (industry, period) {
                var url = "" ;
                return $http.get(url).success(function (response) {
                        console.info("【数据推演查询指标值】");
                        $log.debug(response.data);
                    });
            },
            //数据推演的保存
            update_debuce_metric_value: function (param) {
                var url = '';
               return $http.post(url,param).success(function (response) {
                        console.info("数据推演的保存和修改指标值");
                        $log.debug(response.data);
                    })
              },
            //趋势预测查询
            get_tend_metric_value: function () {
                var url = "";
                return $http.get(url).success(function (response) {
                    console.info("【趋势预测查询指标】");
                    $log.debug(response.data);
                });
            },
            //趋势预测指标值的查询
            getTendMetricValue:function(){
                var url = "";
                return $http.get(url).success(function (response) {
                    console.info("【趋势预测查询指标值】");
                    $log.debug(response.data);
                });
            },
            //趋势预测的保存
            update_tendency_metric_value: function (param) {
                var url = '';
                return $http.post(url,param).success(function (response) {
                    console.info("趋势预测的保存和修改指标值");
                    $log.debug(response.data);
                })
            }


        }
    })
})();