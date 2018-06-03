/**
 * 时间控件指令 可通过js控制时间格式
 * 在所调用的js 中  给scope.dateFmt赋值（日期格式 例： 'yyyy-MM-dd'）
 */
angular.module('common').directive('dateSwitch', function () {
    return {
        restrict: 'EA',
        link: function (scope, element) {
            element.bind("click", function () {
                window.WdatePicker({
                    skin: 'twoer',
                    dateFmt: scope.dateFmt,
                    isShowClear:false, //是否显示清空，否
                    isShowToday:false, //是否显示今天
                    onpicked: function () {
                        scope.changeDate(this.value);
                    }
                });
            });
        }
    }
});
