
(function () {
    var appStates = [
        {
            code: "base-value",
            url: '/base-value',
            templateUrl: 'app/systemconfig/basevalue/base-value.html',
            controller: "baseValueCtrl",
            label: "基础数据",
            menu_level:1,
            sys_type:"system-config"
        }
        /*,{
            code: "emission-factor",
            url: '/emission-factor?:metric',
            templateUrl: 'app/gov/system-config/emission-and-coal/emission-and-coal.html',
            controller: "emissionAndCoalCtrl",
            label: "排放因子",
            menu_level:1,
            sys_type:"system-config"
        },
        {
            code: "standard-coal-ratio",
            url: '/standard-coal-ratio?:metric',
            templateUrl: 'app/gov/system-config/emission-and-coal/emission-and-coal.html',
            controller: "emissionAndCoalCtrl",
            label: "折标煤系数",
            menu_level:1,
            sys_type:"system-config"
        },
        {
            code: "data-adjust",
            url: '/data-adjust',
            templateUrl: 'app/gov/system-config/data-adjust/data-adjust.html',
            controller: "dataAdjustCtrl",
            label: "数据校正",
            menu_level:1,
            sys_type:"system-config"
        },
        {
            code: "account-maintenance",
            url: '/account-maintenance',
            templateUrl: 'app/gov/system-config/account-maintenance/account-maintenance.html',
            controller: "accountMaintenanceCtrl",
            label: "台帐维护",
            menu_level:1,
            sys_type:"system-config"
        }, {
            code: "data-adjust.data-industry-adjust",
            url: '/data-industry-adjust',
            templateUrl: 'app/gov/system-config/data-adjust/data-industry-adjust.html',
            controller: "dataIndustryAdjustCtrl",
            label: "行业指标",
            menu_level:2,
            sys_type:"system-config"
        },
        {
            code: "data-adjust.data-city-adjust",
            url: '/data-city-adjust',
            templateUrl: 'app/gov/system-config/data-adjust/data-city-adjust.html',
            controller: "dataCityAdjustCtrl",
            label: "城市指标",
            menu_level:2,
            sys_type:"system-config"
        },
        {
            code: "user-manager",
            url: '/user-manager',
            templateUrl: 'app/gov/system-config/user-manager/user-manager.html',
            controller: "userManagerCtrl",
            label: "用户管理",
            menu_level:1,
            sys_type:"system-config"
        },

        {
            code: "sys-log",
            url: '/sys-log',
            templateUrl: 'app/gov/system-config/sys-log/sys-log.html',
            controller: "sysLogCtrl",
            label: "登录日志",
            menu_level:1,
            sys_type:"system-config"
        },
        {
            code: "portal",
            url: './portal',
            templateUrl: 'portal.html',
            controller: "portalCtrl",
            label: "新闻发布",
            menu_level:1,
            sys_type:"system-config"
        }*/
    ];

    //module 声明
    angular.module("sysconfig",['ui.router','ngFileUpload','map']);

   // angular.module('zenjiang',['a','b']);

//状态机注册
    angular.module("sysconfig")
    .run(['$rootScope','$state',function ($rootScope,$state) {
                    $rootScope.$state=$state;
                    $rootScope.appStates=appStates;
                    //$rootScope.user=userInfo.user;
                }])
    .config(['$stateProvider','$urlRouterProvider',
                function ($stateProvider,$urlRouterProvider) {
                    for (var key in appStates){
                        if(appStates.hasOwnProperty(key)){
                            $stateProvider.state(appStates[key].code,appStates[key]);
                        }
                    }

                 }]);

    })()