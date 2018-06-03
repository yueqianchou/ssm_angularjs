(function () {
    angular.module('sysconfig').controller('sysConfigCtrl', ['$rootScope', '$scope', '$state', '$http', '$filter',
        function ($rootScope, $scope, $state, $http, $filter) {

            init();
            function init() {
                $scope.selectedMenu='base-value';
                loadMenus();
                getCurrentTime();
            }

            function loadMenus() {
                $scope.menuList = [];
                var sysType = "system-config";
                var appStates = $rootScope.appStates;
                for (var key in appStates) {
                    if (appStates[key].menu_level != 1) {
                        continue;
                    }
                    if (appStates[key].sys_type == sysType) {
                        $scope.menuList.push(appStates[key]);
                    }
                }
                selectMenuFirst($scope.menuList);
            }

            function selectMenuFirst(menu) {
                $rootScope.mainLabel = menu[0].label;
                $state.go(menu[0].code);
            }
            $scope.openMenu=function(menu){
                /*$scope.selectedMenu=menu.code;*/
                if(menu.code=='emission-factor'){
                    $state.go(menu.code,{metric:'carbon'});
                    return;
                }
                if(menu.code=='standard-coal-ratio'){
                    $state.go(menu.code,{metric:'coal'});
                    return;
                }
                if(menu.code=='portal'){
                    window.location.href = menu.url;
                    return;
                }
                $state.go(menu.code);
                /* angular.forEach($scope.menuList,function(element){

                 });*/
            };


            //TODO 切换一级菜单
            $scope.selectMenu = function (menu) {
                $rootScope.mainLabel = menu.label;
                if(menu.code=='emission-factor'){
                    $state.go(menu.code,{metric:'carbon'});
                    return;
                }
                if(menu.code=='standard-coal-ratio'){
                    $state.go(menu.code,{metric:'coal'});
                    return;
                }
                if(menu.code=='portal'){
                    window.location.href = menu.url;
                    return;
                }
                $state.go(menu.code);

            };

            /**
             * 获取系统当前时间
             */
            function getCurrentTime() {
                //var url = "sys/current_time";
                //$http.get(url).success(function (response) {
                //    var timeLong = response.data;
                $scope.currentTime = $filter('date')(new Date(), "yyyy年MM月dd日");
                //    console.info($scope.currentTime);
                //})
            }

            //登出系统
            $scope.loginOut = function () {
                if (window.confirm("是否确认退出？")) {
                    $http.get('logout').success(function (response) {
                        if (response.success) {
                            window.location.href = response.data;
                        }
                    })
                }
            };
           // $scope.c_login_name =  $rootScope.user.login_name;
            //$scope.password =  $rootScope.user.password;
            $scope.showPersonalCenterHtml=function(){
                $scope.mask=true;
                $scope.showPersonalCenter=true;
                $scope.queryUserByLoginName();
            };
            $scope.backHome=function(){
                window.location.href="welcome.html";
            };

        }]);
})();
