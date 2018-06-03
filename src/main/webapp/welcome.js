/**
 * Created by yueqianchou on 2017/7/28.
 */
angular.module("app", []);

angular.module("app").controller('welcomeCtrl', welcomeCtrl);

function welcomeCtrl($scope, $rootScope, $http, $log) {
    var appStates=[ {code:'analysis'},{code:'system-config'}];

    $scope.openMenuPage = function(code){
        var ifCanOpen = false;
        for(var index in appStates){
            if(appStates[index].code==code){
                window.location.href = "./" + code;
            }
        }
    }

}
