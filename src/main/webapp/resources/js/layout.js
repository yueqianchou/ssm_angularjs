/**
 * Created by q on 2017/6/30.
 */


$(function (){
    pageInit();
})

function pageInit() {
    var page = {
        //设置时间
        showDate:function (){
            $('.showDate').showDate({
                format:'年月日周'
            });
        },
        scroll:function(){
            if($(".addScroll").length>0){
                $(".addScroll").perfectScrollbar();
            }
        },
        tab:function(){
            $(".mic li").click(function(){
                $(this).addClass("active").siblings().removeClass("active");
            });
            $(".navRight_senior_line li").click(function(){
                $(this).addClass("active").siblings().removeClass("active");
            });
            $(".navRight_senior_sort li").click(function(){
                $(this).addClass("active").siblings().removeClass("active");
            });
            $(".main_content_td tr").click(function(){
                $(this).addClass("active").siblings().removeClass("active");
            });
            $(".main_content_td i").click(function(){
                $(".main_content_td i").removeClass("active");
                $(this).addClass("active");
            });
            $(".vehicle li").click(function(){
                $(".vehicle li").removeClass("active");
                $(this).addClass("active");
                if($(".vehicle .list1").hasClass("active")){
                    $(".show2").hide();
                    $(".show1").show();
                }else{
                    $(".show1").hide();
                    $(".show2").show();
                }
            });
        },
        select:function (){
            $('.selBtn').click(function () {
                $(this).siblings('.selCont').toggle();
            });
            $('.selCont li').click(function () {
                 var curTxt = $(this).text();
                $(this).parents('.selCont').siblings('.selTxt').text(curTxt);
            });
            $(document).click(function(e){
                var obj=e.target||e.srcElement;
                if($(obj).closest('.selBtn').length==0&&$(obj).closest('').length==0){
                    $('.selCont').hide();
                }
            });
        },
        listSlide:function () {
            $('.navRight_next').click(function () {
                if ($(this).hasClass('active')){
                    $(this).removeClass('active');
                    $(this).parents('.nav_regList').stop(!1).animate({right:-327});
                }else {
                    $(this).addClass('active');
                    $(this).parents('.nav_regList').stop(!1).animate({right:15});
                }
            });
        },
        carShow:function(){
            $(".map_numb i").click(function(){
                if($(this).hasClass("active")){
                    $(this).removeClass("active");
                    $(".car_detail_pop").hide();
                }else{
                   $(this).addClass("active"); 
                   $(".car_detail_pop").show();
                }
            });
            $(".marig15 .btn_blue_small").click(function(){
                $(".mask").show();
            });
            $(".tabText .btn_gray_small").click(function(){
                $(".popData").show();
                $(".filter").show();
            });
        },
        close:function(){
            $(".close").click(function(){
                $(this).parent().parent().hide();
                $(this).parent().parent().siblings().filter('.filter').hide();
            });
            $(".closeBtn1").click(function(){
                $(".mask").hide();
            });
            $(".closeTb").click(function(){
                $(".popData").hide();
                $(".filter").hide();
            });
            $(".djClose").click(function(){
                $(".drivingBehavior").hide();
            });
        },
        tabShow:function(){
            $(".dataCont_btn .btn_blue_small").click(function(){
                $(this).hide();
                $(".dataCont_btn .btn_gray_small").show();
                $(".dataCont_btn .btn_blue_save").show();
                $(".dataCont span").hide();
                $(".dataCont input").show();
            });
            $(".dataCont_btn .btn_gray_small,.dataCont_btn .btn_blue_save").click(function(){
                $(".dataCont_btn .btn_gray_small").hide();
                $(".dataCont_btn .btn_blue_save").hide();
                $(".dataCont_btn .btn_blue_small").show();
                $(".dataCont input").hide();
                $(".dataCont span").show();
            });
        },
        show:function(){
            $(".testInput").focus(function (){
                $(this).css("border","1px solid #448fdb");
            });
            $(".testInput").blur(function (){
                $(this).css("border","1px solid #dbdbdb");
            });
        }
    }
    page.showDate();
    page.scroll();
    page.tab();
    page.select();
    page.listSlide();
    page.carShow();
    page.close();
    page.tabShow();
    page.show();
}

