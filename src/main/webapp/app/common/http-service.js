(function () {
    /**
     * 前台请求服务类
     */
    "use strict";
    angular.module("ui.http",[]);
    angular.module("ui.http").service("httpService", function ($http,$log) {
        return {
            get: function (url, text) {
                $log.debug("[请求]" + text + ":" + url);
                return $http.get(url).success(function (response) {
                    $log.debug("[返回]" + text);
                    $log.debug(response);
                    if (!response.success) {
                        alert(response.errormsg);
                    }
                });
            },
            post: function (url, param, text) {
                $log.debug("[请求]" + text + ":" + url);
                return $http.post(url, param).success(function (response) {
                    $log.debug("[返回]" + text);
                    $log.debug(response);
                    if (!response.success) {
                        alert(response.errormsg);
                    }
                });
            },
            delete: function (url, param, text) {
                $log.debug("[请求]" + text + ":" + url);
                return $http.delete(url, param).success(function (response) {
                    $log.debug("[返回]" + text);
                    $log.debug(response);
                    if (!response.success) {
                        alert(response.errormsg);
                    }
                });
            },
            put: function (url, param, text) {
                $log.debug("[请求]" + text + ":" + url);
                return $http.put(url, param).success(function (response) {
                    $log.debug("[返回]" + text);
                    $log.debug(response);
                    if (!response.success) {
                        alert(response.errormsg);
                    }
                });
            }
        }
    })
})();
