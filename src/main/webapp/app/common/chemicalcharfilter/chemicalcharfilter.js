(function () {
    'use strict';

    angular
        .module('common', [])
        .filter("chemicalcharfilter",function($sce){

            var gasCollections = ["CO2", "N2O", "CH4", "SF6", "NF3", "Na2CO3","K2CO3", "Li2CO3", "BaCO3","(CO3)2", "CO3", ")2","CO2e",
                "CH3F", "CHF3", "CH2F2", "CF4", "C2F6", "C3F8", "C4F6", "C5F8", "C-C4F8", "c-C4F8",
                "C-C4F8O", "c-C4F8O"];
            var unitCollections = ["m3"];

            return function (input_string) {
                if (!input_string) return input_string;

                for (var index in gasCollections) {
                    if (input_string.indexOf(gasCollections[index]) > -1) {
                        input_string = formatGas(input_string, gasCollections[index]);
                        break;
                    }
                }

                for (var index in unitCollections) {
                    if (input_string.indexOf(unitCollections[index]) > -1) {
                        input_string = formatUnit(input_string, unitCollections[index]);
                        break;
                    }
                }

                return input_string;

                function formatGas(input_string, gasName) {
                    var returnStr = "";
                    var charArr = gasName.split("");
                    for (var i = 0; i < charArr.length; i++) {
                        if (!isNaN(charArr[i])) {
                            charArr[i] = subNum(charArr[i]);
                        }
                        returnStr += charArr[i];
                        if(returnStr=="(CO₃)₂"){
                            input_string = input_string.substring(0, input_string.length-returnStr.length) + returnStr ; //碳酸盐-CaMg(CO3)2
                            return input_string;
                        }
                    }
                    var reg = new RegExp(gasName, 'g');
                    return input_string.replace(reg, returnStr);
                    function subNum(num) {
                        var result;
                        switch (num) {
                            case '0' :
                                result = '₀';
                                break;
                            case '1' :
                                result = '₁';
                                break;
                            case '2' :
                                result = '₂';
                                break;
                            case '3' :
                                result = '₃';
                                break;
                            case '4' :
                                result = '₄';
                                break;
                            case '5' :
                                result = '₅';
                                break;
                            case '6' :
                                result = '₆';
                                break;
                            case '7' :
                                result = '₇';
                                break;
                            case '8' :
                                result = '₈';
                                break;
                            case '9' :
                                result = '₉';
                                break;
                        }
                        return result;
                    }
                }

                function formatUnit(input_string, unitName) {
                    var returnStr = "";
                    var charArr = unitName.split("");
                    for (var i = 0; i < charArr.length; i++) {
                        if (!isNaN(charArr[i])) {
                            charArr[i] = supNum(charArr[i]);
                        }
                        returnStr += charArr[i]
                    }
                    var reg = new RegExp(unitName, 'g');
                    return input_string.replace(reg, returnStr);

                    function supNum(num) {
                        var result;
                        switch (num) {
                            case '0' :
                                result = 'º';
                                break;
                            case '1' :
                                result = '¹';
                                break;
                            case '2' :
                                result = '²';
                                break;
                            case '3' :
                                result = '³';
                                break;
                            default:
                                result = num;
                                break;
                        }
                        return result;
                    }
                }
            }
    })
})();
