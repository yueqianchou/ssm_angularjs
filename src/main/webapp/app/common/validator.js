/**
 * Created by Administrator on 2017/3/10.
 */
angular.module("validator", [])
    .run(function () {
        angular.isEmpty = function (value) {
            return value == null || value === "";
        };
    })

    .directive("inputNumber", function () {
        return {
            restrict: 'AC',
            link: function (scope, element, attrs) {
                var regex = /^-?\d+(\.|(\.\d+))?$/;
                var regexDesc = /^-{1}?$/;
                var model = attrs["ngModel"];
                var maxDecimal = attrs["maxDecimal"];
                scope.$watch(model, function (newVal, oldVal) {
                    if (!angular.isEmpty(newVal) && !(regex.test(newVal) || regexDesc.test(newVal))) {
                        eval("scope." + model + "=oldVal");
                    } else {
                        newVal = newVal + "";
                        //format number decimal
                        if (!angular.isEmpty(maxDecimal)) {
                            maxDecimal = parseInt(maxDecimal);
                            var position = newVal.indexOf(".");
                            if (position != -1) {
                                var number = newVal.substring(0, position);
                                var decimal = newVal.substring(position + 1);
                                if (decimal.length > maxDecimal) {
                                    decimal = decimal.substring(0, maxDecimal);
                                }
                                var result = number + "." + decimal;
                                eval("scope." + model + "=result");
                            }
                        }
                    }
                });

                element.bind("blur", function () {
                    var value = eval("scope." + model) + "";
                    if (!angular.isEmpty(value)) {
                        var lastChar = value.substring(value.length - 1);
                        if (lastChar == ".") {
                            scope.$apply(function () {
                                eval("scope." + model + "=" + value.substring(0, value.length - 1));
                            });
                        }
                    }
                });
            }
        };
    });
