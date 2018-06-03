/**
 * 公用组件 分页插件
 */
angular.module('common').directive('pagination', function () {

    return {
        templateUrl: '/app/common/pagination/pagination.html',
        link: function (scope) {
            scope.clickToJump = function (page) {
                if (page != scope.pageNow) {
                    page = checkPage(page, scope.pageCountNum);
                    scope.goPage = page;
                    scope.selectPage(page);
                }
            };

            scope.initPageButtons = function (total, size, current) {
                scope.pageCount = initPageButtons(total, size, current);
            };

            function initPageButtons(total, size, current) {
                var pages = [];
                scope.pageCountNum = getPageNumber(total, size);
                for (var index = 1; index <= scope.pageCountNum; index++) {
                    if (scope.pageCountNum <= 5) {
                        pages.push(index);
                    } else {
                        if (current <= 2 && index <= 5) {
                            pages.push(index);
                        } else if (current > 2 && current + 2 <= scope.pageCountNum && index <= current + 2 && index >= current - 2) {
                            pages.push(index);
                        } else if (current > 2 && current + 2 > scope.pageCountNum && index + 5 > scope.pageCountNum) {
                            pages.push(index);
                        }
                    }
                }
                return pages;
            }

        }
    }
});

function getPageNumber(total, size) {
    return Math.ceil(total / size);
}

//检验跳转的页数是否正确
function checkPage(page, pageCountNum) {
    if (page > pageCountNum) {
        page = pageCountNum;
        return page;
    } else if (page <= 0) {
        page = 1;
        return page;
    } else if (page <= pageCountNum && page >= 1) {
        return page;
    } else {
        return pageCountNum;
    }
}