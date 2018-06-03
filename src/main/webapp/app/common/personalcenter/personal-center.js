/**
 * 个人中心-修改用户信息
 */
(function () {
    angular.module('center',[]).directive('personalCenter', function ( $rootScope,$http) {

        return {
            templateUrl: 'app/common/personal-center/personal-center.html',
            controller: function ($scope) {
                init();
                function init() {
                    initparam();
                }

                function initparam() {
                    $scope.userInfo = {
                        name: "",
                        contact: "",
                        telephone: "",
                        phone: "",
                        email: ""
                    }

                }

                //获取用户信息
               $scope.queryUserByLoginName= function (){
                    var url="get/user_manager/query_user_by_login_name";
                    $http.post(url, {login_name: $scope.c_login_name }).success(function(response){
                        if(response.success){
                            var temp=response.data;
                            if(temp.length>0){
                                $scope.userInfo=temp[0];
                            }
                        }})
                }

                //修改用户信息
                $scope.updateUserInfo=function(){
                    if (!input_verify()) {
                        return;
                    }
                    var url="get/user_manager/update_user_info";
                    $http.post(url, $scope.userInfo).success(function(response){
                        if(response.success){
                            alert("修改成功");
                            $scope.showPersonalCenter=false;
                            $scope.mask=false;
                        }})
                }

                //校验
                function  input_verify(){
                    var regUserName = /^[\u4e00-\u9fa5|a-zA-Z]{1,30}$/;//姓名-单位名称
                    var regMobile =  /^(1[3|4|5|7|8][0-9]{9})$/;//手机号码正则
                    var regPhone =   /^(0[0-9]{2,3}-)?([1-9][0-9]{6,7})(-[0-9]{1,4})?$/; //座机正则
                    var regMail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;//邮箱正则
                    if(!$scope.userInfo.contact || !regUserName.test($scope.userInfo.name)){
                        alert("请输入正确的联系人(30字以内)！");
                        return false;
                    }
                    if(!$scope.userInfo.phone || !regPhone.test($scope.userInfo.phone)){
                        alert("请输入正确的固定电话！");
                        return false;
                    }
                    if(!$scope.userInfo.telephone || !regMobile.test($scope.userInfo.telephone)){
                        alert("请输入正确的移动电话！");
                        return false;
                    }
                    if(!$scope.userInfo.email || !regMail.test($scope.userInfo.email)){
                        alert("请输入正确的邮箱！");
                        return false;
                    }
                    return true;
                }

                //取消
                $scope.closeUserInfo=function(){
                    $scope.showPersonalCenter=false;
                    $scope.mask=false;
                }

            }}
        });
})();