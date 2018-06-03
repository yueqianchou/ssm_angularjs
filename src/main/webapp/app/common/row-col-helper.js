/**
 * Created by Administrator on 2018/1/6.
 */
(function () {
    "use strict";
    angular.module("zjtec.collect").service("rowColHelper", function ($sce) {
        return {
            calculateRowColSpan: function(rowColSpanInfoList) {
                var rowList = [];
                var rowNums = getAllHeadRow(rowColSpanInfoList);

                for(var index in rowNums){
                    var rowNum = rowNums[index];
                    var someRowSpanInfoList = rowColSpanInfoList.filter(function(element){
                        return element.rowNum === rowNum;
                    });
                    dealColName(someRowSpanInfoList);
                    rowList.push(someRowSpanInfoList);
                }
                setHideSpan(rowList);
                return rowList;
            }
        };

        function setHideSpan(rowList){
            for(var i in rowList){
                var row = rowList[i];
                for(var j in row){
                    if(j > 0 && row[j].name === row[j - 1].name){
                        row[j].hideSpan = true;
                    }
                    if(i > 0 && row[j].name === rowList[i - 1][j].name){
                        row[j].hideSpan = true;
                    }
                }
            }
        }

        function getAllHeadRow(rowColSpanInfoList){
            var rows = [];
            for(var index in rowColSpanInfoList){
                if(rows.indexOf(rowColSpanInfoList[index].rowNum) === -1){
                    rows.push(rowColSpanInfoList[index].rowNum);
                }
            }
            rows = rows.sort(function(a, b){
                return a - b;
            });
            return rows;
        }

        /**
         * 处理列名中包含 html的，将其编译
         * @param columns
         */
        function dealColName(columns){
            for(var i in columns){
                var valueStr=angular.copy(columns[i].name);
                if(valueStr){
                    valueStr = replaceMathSymbol(valueStr);
                }
                columns[i].html_name =  $sce.trustAsHtml(valueStr);
            }
        }

        /**
         * 将字符串中的大于号(>)（&gt;）和小于号(<)（&lt;）替换为html
         * @param Str
         * @returns {string}
         */
        function replaceMathSymbol(Str){
            var resultStr = "";
            var len = Str.length;
            for(var i = 0; i < len; i++){
                if(Str[i] == "<" && i != 0 && !isNaN(parseInt(Str[i - 1], 10))){
                    resultStr += "&lt;";
                } else if(Str[i] == ">" && i != len -1 && !isNaN(parseInt(Str[i + 1], 10))){
                    resultStr += "&gt;";
                } else{
                    resultStr += Str[i];
                }
            }
            return resultStr;
        }
    })
})();