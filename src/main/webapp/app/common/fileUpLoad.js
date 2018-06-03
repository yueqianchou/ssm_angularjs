/**
 * Created by Administrator on 2016/10/13.
 */
angular.module('common').directive('fileUpLoad', function () {

    return {
        templateUrl: 'app/common/file-up-load/fileUpLoad.html',
        controller: function ($scope, Upload) {
            $scope.upFile = null;
            // TODO 点击上传图片

            $scope.showUploadFile = function () {
                $scope.confirmUpLoadShow=false;
                $('#uploadFile').click();
            };

            $scope.uploadFile = function (file) {
                if (file == null && $scope.reportTableCaseId == "") {
                    return;
                }

                var name = file.name;
                var index = name.lastIndexOf(".");
                var fileType = name.substr(index + 1, name.length);
                if (fileType != "xls" && fileType != "xlsx") {
                    alert("该文件不是Excel文件，请重新上传！");
                    $scope.upFile = null;
                    return;
                }
                $scope.waitingShow=true;

                file.upload = Upload.upload({
                    url: "report/file/upload",
                    data: {
                        file: $scope.upFile,
                        reportTableCaseId: $scope.reportTableCaseId,
                        reportProjectCaseId:$scope.reportParseDataBO.project_case_id ? $scope.reportParseDataBO.project_case_id : ''
                    }
                });

                file.upload
                    .progress(function (evt) {
                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    })
                    .success(function (data, status, headers, config) {
                        $scope.waitingShow=false;
                        $scope.upFile = null;
                        var reportParseResult=data.data;
                        if(reportParseResult.check_result == true){
                            $scope.tipInfo="报表导入成功";
                            $scope.successShow=true;
                        }else{
                            if(reportParseResult.check_result_bo.errDescription){
                                $scope.errDescriptionInfo=reportParseResult.check_result_bo.errDescription;
                                $scope.errDescription=true;
                                $scope.notShowGoOn=true;
                                return ;
                            }
                            var errInfos = checkResult(data.data);
                            if (errInfos.length > 0) {
                                $scope.notShowGoOn = true;
                                $scope.showErr = true;
                            }
                            setTimeout(function () {
                                $scope.errInfoList = errInfos;
                                $scope.$apply();
                                $(".addScroll").scrollTop(0);
                            });
                        }
                    })
                    .error(function (data, status, headers, config) {
                        $scope.waitingShow=false;
                        $scope.errorMessage = status + ": " + data;
                    });
            };

            function checkResult(reportParseResult){
                var arr=[];
                if(reportParseResult.check_result==false){
                    var checkResult = reportParseResult.check_result_bo;
                    for(var j in checkResult.head_rule_data){
                        var head_data = checkResult.head_rule_data[j];
                        if(head_data.warn_type == 1 || head_data.warn_type == 2){
                            head_data.location= convert(head_data.col_num) + (head_data.row_num*1+1);
                            arr.push(head_data);
                        }
                    }
                    for(var m in checkResult.table_rule_data){
                        var table_data = checkResult.table_rule_data[m];
                        if(table_data.warn_type == 1 || table_data.warn_type == 2){
                            table_data.location= convert(table_data.col_num) + (table_data.row_num*1+1);
                            arr.push(table_data);
                        }
                    }
                }
                return arr;
            }

            $scope.convert = function (num) {
                return convert(num);
            };

            /**
             * 数字转换为英文字母 例: 0 --  A
             * @param number
             * @returns {string}
             */
            function convert(number){
                var s ='';
                var num =number+1;
                while(num > 0){
                    var m =num % 26;
                    if(m === 0){
                        m= 26;
                    }
                    s =(m+9).toString(36)+s;
                    num =(num - m-1) / 26;
                }
                return s.toUpperCase();
            }

        }
    }
});
