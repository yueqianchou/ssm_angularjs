/**
 * 辅助功能--密码修改
 */
(function () {
    angular.module('pwdUpdate',[]).directive('updatePassword', function ( $rootScope,$http) {

        return {
            templateUrl: 'app/common/update-password/update-password.html',
            controller: function ($scope) {
                init();
                var password = $scope.password;
                function init() {
                    $scope.passWordObj={oldPassWord:null,newPassWord:null,againPassWord:null};
                }


                $scope.showPassword = function (boolean){
                    $scope.mask = boolean;
                    $scope.showPasswordDiv = boolean;
                    if(!boolean){
                        $scope.passWordObj={oldPassWord:null,newPassWord:null,againPassWord:null};
                    }
                };

                $scope.updatePassword=function (){
                    //先查询最新密码
                    var url ="get/user_manager/query_info_by_username";
                    var param ={login_name:$scope.c_login_name};
                    $http.post(url,param).success(function(response){
                        if(response.success){
                            password=response.data[0].password;//重新拿到密码
                            verifyPassword();
                        }
                    })
                }

                 function verifyPassword(){
                    if(!$scope.passWordObj.oldPassWord||!$scope.passWordObj.newPassWord||!$scope.passWordObj.againPassWord){
                        alert("密码不能为空");
                        return;
                    }
                    if(hex_md5($scope.passWordObj.oldPassWord) != password){
                        alert("原密码输入错误");
                        $scope.passWordObj.oldPassWord = null;
                        return;
                    }
                    if ($scope.passWordObj.newPassWord.length<6){
                        alert("密码必须不少于6位，请重新输入");
                        $scope.passWordObj.newPassWord = null;
                        return;
                    }
                    if ($scope.passWordObj.newPassWord.length>16){
                        alert("密码必须不超过16位，请重新输入");
                        $scope.passWordObj.newPassWord = null;
                        return;
                    }
                    var reg = /\d/;
                    var reg1 = /[A-Za-z]/;
                    var reg2 = /[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\=)(\+)(\{)(\[)(\])(\})(\\)(\|)(\;)(\:)(\')(\")(\,)(\<)(\.)(\>)(\/)(\?)(\)]+/;
                    var reg3 = /[\u4E00-\u9FA5]/g;

                    $scope.passWordObj.newPassWord = $scope.passWordObj.newPassWord.trim();
                    if(!(reg.test($scope.passWordObj.newPassWord)&&
                        reg1.test($scope.passWordObj.newPassWord)&&
                        reg2.test($scope.passWordObj.newPassWord)&&
                        !reg3.test($scope.passWordObj.newPassWord)&&
                        $scope.passWordObj.newPassWord.indexOf(" ")==-1
                        )
                    ){
                        alert("需包括数字、特殊字符、英文字母,且不包括汉字和空格。");
                        $scope.passWordObj.newPassWord = null;
                        return;
                    }

                    if(hex_md5($scope.passWordObj.newPassWord) == password){
                        alert("新密码不能与原密码相同");
                        $scope.passWordObj.newPassWord = null;
                        return;
                    }
                    if($scope.passWordObj.againPassWord != $scope.passWordObj.newPassWord){
                        alert("确认密码输入错误，请重新输入");
                        $scope.passWordObj.againPassWord = null;
                        return;
                    }
                    updatePassword();
                };

                /*修改密码*/
                function updatePassword(){
                    var url ="get/user_manager/update_user_password";
                    var param ={passwd:$scope.passWordObj.newPassWord,loginCode:$scope.c_login_name};
                    $http.post(url,param).success(function(response){
                        if(response.success){
                            response.data.flag?alert("密码修改成功"):alert(response.data.error);
                            password = hex_md5($scope.passWordObj.newPassWord);
                            $scope.showPasswordDiv = false;
                            $scope.mask = false;
                            $scope.passWordObj={oldPassWord:null,newPassWord:null,againPassWord:null};
                        }
                    })
                }

            }}
        });
})();