
(function () {
    var appStates=[{
        code:'compute',
        url:'/compute',
        templateUrl:'compute.html',
        controller:'computeCtrl',
        label:'',
        menu_level:'',
        sys_type:'',
        industry:''
    }];

    //module 声明
    angular.module("analysis",['ui.router','ngFileUpload','map','common','map_common']);

   // angular.module('zenjiang',['a','b']);

//状态机注册
    angular.module("analysis")
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