/*var getCurrentUser=function () {
    var url='ceshi.do';
    var responseDate=$.ajax({
        type:"GET",
        url:url,
        dataType:"json",
        async:false
    }).responseText;
    console.info("获取用户登录信息",JSON.parse(responseDate).message);
    return JSON.parse(responseDate).message;
};
var userInfo = getCurrentUser();*/


/*以下用户登录使用不删 除*/
var getCurrentUser=function () {
    var url='getCurrentUserInfo';
    var responseDate=$.ajax({
        type:"GET",
        url:url,
        dataType:"json",
        async:false
    }).responseText;
    console.info("获取用户登录信息");
    return JSON.parse(responseDate).data;
};
var userInfo = getCurrentUser();
