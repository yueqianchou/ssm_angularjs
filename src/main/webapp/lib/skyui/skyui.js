/*
    ----插件提供
    ----by UI设计部前端组
    ----如有疑问，请联系UI设计部前端组
    ----插件会不定时优化升级
*/
;(function ($) {

    //pc端滚动,不限任何形式，中结构自建
    $.fn.showSlide = function (options) {
        var defaults = {
            listEle: '.list',
            prevBtn: '.prev',
            nextBtn: '.next',
            autoPlay: true,
            autoPlayTime: 3000,
            progressBar: true,
            progressBarEvent: 'click',
            progressBarEle: '.barli',
            progressBarEleActiveClass: 'active'

        }
        var opts = $.extend(defaults, options);
        this.each(function () {
            var _this = $(this);
            _this.html(_this.html() + _this.html());
            var length = $(opts.listEle).length;
            var currWid = $(opts.listEle).eq(0).width();
            _this.css({width: (currWid) * length});
            var num = 0;
            $(opts.nextBtn).click(function () {
                num++;
                if (num >= length) {
                    _this.css({left: -(length / 2 - 1) * currWid});
                    num = length / 2;
                    _this.stop(!1).animate({left: -num * currWid});
                }
                _this.stop(!1).animate({left: -num * currWid});
                pgBar(num % (length / 2));
            });

            $(opts.prevBtn).click(function () {
                num--;
                if (num < 0) {
                    _this.css({left: -(length / 2) * currWid});
                    num = length / 2 - 1;
                    _this.stop(!1).animate({left: -num * currWid});
                }
                _this.stop(!1).animate({left: -num * currWid});

                pgBar(num % (length / 2));

            });

            //自动播放
            //var autoTimer = null;
            if (opts.autoPlay) {
                var autoTimer = setInterval(function () {
                    num++;
                    repeats();
                    pgBar(num % (length / 2));
                }, opts.autoPlayTime);

                _this.hover(function () {
                    clearInterval(autoTimer);
                }, function () {
                    autoTimer = setInterval(function () {
                        num++;
                        repeats();
                        pgBar(num % (length / 2));
                    }, opts.autoPlayTime);
                });
                $(opts.nextBtn).hover(function () {
                    clearInterval(autoTimer);
                }, function () {
                    autoTimer = setInterval(function () {
                        num++;
                        repeats();
                        pgBar(num % (length / 2));
                    }, opts.autoPlayTime);
                });
                $(opts.prevBtn).hover(function () {
                    clearInterval(autoTimer);
                }, function () {
                    autoTimer = setInterval(function () {
                        num++;
                        repeats();
                        pgBar(num % (length / 2));
                    }, opts.autoPlayTime);
                });

                $(opts.progressBarEle).hover(function () {
                    clearInterval(autoTimer);
                }, function () {
                    autoTimer = setInterval(function () {
                        num++;
                        repeats();
                        pgBar(num % (length / 2));
                    }, opts.autoPlayTime);
                });

            }
            var repeats = function () {
                if (num >= length) {
                    _this.css({left: -(length / 2 - 1) * currWid});
                    num = length / 2;
                    _this.stop(!1).animate({left: -num * currWid});
                }
                _this.stop(!1).animate({left: -num * currWid});
            }
            //进度
            if (opts.progressBar) {
                $(opts.progressBarEle).show();
                $(opts.progressBarEle).bind(opts.progressBarEvent, function () {
                    pgBar($(this).index());
                    if (num > length / 2 - 1) {
                        num = $(this).index() + length / 2;
                    } else {
                        num = $(this).index();
                    }
                    _this.stop(!1).animate({left: -num * currWid});
                });

            } else {
                opts.progressBarEle.hide();
            }
            var pgBar = function (num) {
                $(opts.progressBarEle).removeClass(opts.progressBarEleActiveClass);
                $(opts.progressBarEle).eq(num).addClass(opts.progressBarEleActiveClass);
            }

        });
        return this;
    };

    //移动端滚动
    $.fn.showSlideMobile = function (options){
        var defaults = {
            swipeFlag:true,
            height:200,
            prevBtn:'.prev',                            //上一个按钮
            nextBtn:'.next',                            //下一个按钮
            progressEleFlag:true,                       //是否显示进度条
            autoPlay:true,                              //是否自动播放
            autoPlayTime:3000,                          //自动播放时间
            progressBarEvent:'click',                   //进度条的事件
            progressBarEleActiveClass:'active',         //进度条active
            txtShow:true,                               //图片对应的文字是否显示
            picData:[{
                url:'',
                txt:'',
                link:''
            }]

        }
        var opts = $.extend(defaults,options);
        this.each(function (){

            var _this = $(this);
            _this.css({'position':'relative','overflow':'hidden',height:opts.height});
            //创建个数
            var arrEle = [];
            var ulMoveEle = '<ul class="mSlideMove"></ul>';
            for(var i=0; i<opts.picData.length;i++){
                var picLiEle = '<li class="mSlidePicList">'+
                        '<a href='+opts.picData[i].link+' target="_blank">'+
                        '<img src='+opts.picData[i].url+' width="100%" >'+
                        '</a>'+
                        '</li>';
                arrEle.push(picLiEle);
            };
            _this.append(ulMoveEle);
            _this.find('.mSlideMove').append(arrEle.join(''));
            _this.find('.mSlidePicList').css({width:$(window).width()});

            //创建图片对应文字
            if(opts.txtShow){
                var txtNew = '<div class="slideTxt"><a href="" target="_blank"></a></div>';
                _this.append(txtNew);
            }
            //创建进度个数
            var progressEle = [];
            var progressE = '<ul class="slideBar"></ul>';
            for(var j=0; j<opts.picData.length;j++){
                var proLiEle = '<li class="slideBarLi"></li>';
                progressEle.push(proLiEle);
            }
            _this.append(progressE);
            _this.find('.slideBar').append(progressEle.join(''));
            //设置初始值
            //文字
            _this.find('.slideTxt a').text(opts.picData[0].txt);

            //链接
            _this.find('.slideTxt a').attr('href',opts.picData[0].link);

            //进度
            _this.find('.slideBar .slideBarLi').eq(0).addClass('active');


            _this.find('.mSlideMove').html(_this.find('.mSlideMove').html()+_this.find('.mSlideMove').html());
            var length = _this.find('.mSlideMove .mSlidePicList').length;
            var currWid = _this.find('.mSlideMove').width();
            _this.find('.mSlideMove').css({width:(currWid)*length});
            var num=0;
            if(opts.swipeFlag){
                touch.on(_this, 'swipeleft', function(ev){
                    num++;
                    if(num>=length){
                        _this.find('.mSlideMove').css({'-webkit-transform':'translate('+(-(length/2-1)*currWid)+'px,0)',
                            '-webkit-transition':'all 0s ease'
                        });
                        num=length/2;
                        setTimeout(function (){
                            _this.find('.mSlideMove').css({'-webkit-transform':'translate('+(-num*currWid)+'px,0)',
                                '-webkit-transition':'all 1s ease'
                            });
                        },100)

                    }else{
                        _this.find('.mSlideMove').css({'-webkit-transform':'translate('+(-num*currWid)+'px,0)',
                            '-webkit-transition':'all 1s ease'
                        });
                    }
                    pgBar(num%(length/2));
                });
                touch.on(_this, 'swiperight', function(ev){

                    num--;
                    if(num < 0){
                        _this.find('.mSlideMove').css({'-webkit-transform':'translate('+(-(length/2)*currWid)+'px,0)',
                            '-webkit-transition':'all 0s ease'
                        });
                        num=length/2-1;
                        setTimeout(function (){
                            _this.find('.mSlideMove').css({'-webkit-transform':'translate('+(-num*currWid)+'px,0)',
                                '-webkit-transition':'all 1s ease'
                            });
                        },100)

                    }else{
                        _this.find('.mSlideMove').css({'-webkit-transform':'translate('+(-num*currWid)+'px,0)',
                            '-webkit-transition':'all 1s ease'
                        });
                    }
                    pgBar(num%(length/2));
                });

                touch.on(_this, 'touchmove', function(ev){
                    clearInterval(autoTimer);
                });
                touch.on(_this, 'touchend', function(ev){
                    if(opts.autoPlay){
                        autoTimer = setInterval(function (){
                            num++;
                            repeats();
                            pgBar(num%(length/2));
                        },opts.autoPlayTime);
                    }
                });

            }
            //自动播放
            var autoTimer = null;
            if(opts.autoPlay){
                autoTimer = setInterval(function (){
                    num++;
                    repeats();
                    pgBar(num%(length/2));
                },opts.autoPlayTime);
            }
            var repeats = function (){
                if(num>=length){
                    _this.find('.mSlideMove').css({'transform':'translate('+(length/2-1)*-currWid+'px,0px)'});
                    num=length/2;
                    _this.find('.mSlideMove').css({'transform':'translate('+num*-currWid+'px,0px)'});
                }
                _this.find('.mSlideMove').css({'transform':'translate('+num*-currWid+'px,0px)'});
            }
            //进度
            if(opts.progressEleFlag){
                _this.find('.slideBar').show();
                _this.find('.slideBar .slideBarLi').bind(opts.progressBarEvent,function (){
                    pgBar($(this).index());
                    if(num>length/2-1){
                        num = $(this).index()+length/2;
                    }else{
                        num = $(this).index();
                    }
                    _this.find('.mSlideMove').css({'transform':'translate('+num*-currWid+'px,0px)'});
                });

            }else{
                _this.find('.slideBar').hide();
            }

            var pgBar = function (num){
                _this.find('.slideBar .slideBarLi').removeClass(opts.progressBarEleActiveClass);
                _this.find('.slideBar .slideBarLi').eq(num).addClass(opts.progressBarEleActiveClass);
                _this.find('.slideTxt a').text(opts.picData[num].txt);
                _this.find('.slideTxt a').attr('href',opts.picData[num].link);
            }
        });
        return this;
    };

    //通过json，带有文字的图片滚动
    $.fn.showSlideData = function (options){
        var defaults = {
            width:500,
            height:400,
            prevBtn:'.prev',                            //上一个按钮
            nextBtn:'.next',                            //下一个按钮
            progressEleFlag:true,                       //是否显示进度条
            autoPlay:true,                              //是否自动播放
            autoPlayTime:3000,                          //自动播放时间
            progressBarEvent:'click',                   //进度条的事件
            progressBarEleActiveClass:'active',         //进度条active
            txtShow:true,                               //图片对应的文字是否显示
            picData:[{
                url:'',
                txt:'',
                link:''
            }]

        }
        var opts = $.extend(defaults,options);
        this.each(function (){

            var _this = $(this);
            _this.css({'position':'relative','overflow':'hidden',width:opts.width,height:opts.height});
            //创建个数
            var arrEle = [];
            var ulMoveEle = '<ul class="slidemove"></ul>';
            for(var i=0; i<opts.picData.length;i++){
                var picLiEle = '<li class="slidePiclist" style="width:'+opts.width+'px;height: '+opts.height+'px;">'+
                    '<img src='+opts.picData[i].url+' width="100%" height="100%">'+
                    '</li>';
                arrEle.push(picLiEle);
            };
            _this.append(ulMoveEle);
            _this.find('.slidemove').append(arrEle.join(''));

            //创建图片对应文字
            if(opts.txtShow){
                var txtNew = '<div class="slideTxt"><a href="" target="_blank"></a></div>';
                _this.append(txtNew);
            }
            //创建进度个数
            var progressEle = [];
            var progressE = '<ul class="slideBar"></ul>';
            for(var j=0; j<opts.picData.length;j++){
                var proLiEle = '<li class="slideBarLi"></li>';
                progressEle.push(proLiEle);
            }
            _this.append(progressE);
            _this.find('.slideBar').append(progressEle.join(''));



            //设置初始值

            //文字
            _this.find('.slideTxt a').text(opts.picData[0].txt);

            //链接
            _this.find('.slideTxt a').attr('href',opts.picData[0].link);

            //进度
            _this.find('.slideBar .slideBarLi').eq(0).addClass('active');



            _this.find('.slidemove').html(_this.find('.slidemove').html()+_this.find('.slidemove').html());
            var length = _this.find('.slidemove .slidePiclist').length;
            var currWid = _this.find('.slidemove .slidePiclist').eq(0).width();
            _this.find('.slidemove').css({width:(currWid)*length});
            var num=0;
            $(opts.nextBtn).click(function (){
                num++;
                if(num>=length){
                    _this.find('.slidemove').css({left:-(length/2-1)*currWid});
                    num=length/2;
                    _this.find('.slidemove').stop(!1).animate({left:-num*currWid});
                }
                _this.find('.slidemove').stop(!1).animate({left:-num*currWid});
                pgBar(num%(length/2));

            });
            $(opts.prevBtn).click(function (){
                num--;
                if(num < 0){
                    _this.find('.slidemove').css({left:-(length/2)*currWid});
                    num=length/2-1;
                    _this.find('.slidemove').stop(!1).animate({left:-num*currWid});
                }
                _this.find('.slidemove').stop(!1).animate({left:-num*currWid});
                pgBar(num%(length/2));

            });
            //自动播放
            var autoTimer = null;
            if(opts.autoPlay){
                autoTimer = setInterval(function (){
                    num++;
                    repeats();
                    pgBar(num%(length/2));
                },opts.autoPlayTime);

                _this.find('.slidemove').hover(function (){
                    clearInterval(autoTimer);
                },function (){
                    autoTimer = setInterval(function (){
                        num++;
                        repeats();
                        pgBar(num%(length/2));
                    },opts.autoPlayTime);
                });

                _this.find('.slideTxt').hover(function (){
                    clearInterval(autoTimer);
                },function (){
                    autoTimer = setInterval(function (){
                        num++;
                        repeats();
                        pgBar(num%(length/2));
                    },opts.autoPlayTime);
                });

                $(opts.nextBtn).hover(function (){
                    clearInterval(autoTimer);
                },function (){
                    autoTimer = setInterval(function (){
                        num++;
                        repeats();
                        pgBar(num%(length/2));
                    },opts.autoPlayTime);
                });
                $(opts.prevBtn).hover(function (){
                    clearInterval(autoTimer);
                },function (){
                    autoTimer = setInterval(function (){
                        num++;
                        repeats();
                        pgBar(num%(length/2));
                    },opts.autoPlayTime);
                });

                _this.find('.slideBarLi').hover(function (){
                    clearInterval(autoTimer);
                },function (){
                    autoTimer = setInterval(function (){
                        num++;
                        repeats();
                        pgBar(num%(length/2));
                    },opts.autoPlayTime);
                });

            }
            var repeats = function (){
                if(num>=length){
                    _this.find('.slidemove').css({left:-(length/2-1)*currWid});
                    num=length/2;
                    _this.find('.slidemove').stop(!1).animate({left:-num*currWid});
                }
                _this.find('.slidemove').stop(!1).animate({left:-num*currWid});
            }
            //进度
            if(opts.progressEleFlag){
                _this.find('.slideBar').show();
                _this.find('.slideBar .slideBarLi').bind(opts.progressBarEvent,function (){
                    pgBar($(this).index());
                    if(num>length/2-1){
                        num = $(this).index()+length/2;
                    }else{
                        num = $(this).index();
                    }
                    _this.find('.slidemove').stop(!1).animate({left:-num*currWid});

                });

            }else{
                _this.find('.slideBar').hide();
            }

            var pgBar = function (num){
                _this.find('.slideBar .slideBarLi').removeClass(opts.progressBarEleActiveClass);
                _this.find('.slideBar .slideBarLi').eq(num).addClass(opts.progressBarEleActiveClass);
                _this.find('.slideTxt a').text(opts.picData[num].txt);
                _this.find('.slideTxt a').attr('href',opts.picData[num].link);
            }
        });
        return this;
    };

    //时间选择
    $.fn.showDate = function (options) {
        var defaults = {
            format: '年月日'
        }
        var opts = $.extend(defaults, options);
        var myDate = new Date();

        var y = myDate.getFullYear();   //获取完整的年份(4位,1970-????)
        var m = myDate.getMonth();      //获取当前月份(0-11,0代表1月)
        var day = myDate.getDate();       //获取当前日(1-31)
        var week = myDate.getDay();        //获取当前星期X(0-6,0代表星期天)

        switch (week) {
            case 1:
                week = '一';
                break;
            case 2:
                week = '二';
                break;
            case 3:
                week = '三';
                break;
            case 4:
                week = '四';
                break;
            case 5:
                week = '五';
                break;
            case 6:
                week = '六';
                break;
            case 7:
                week = '日';
                break;
        }

        this.each(function () {
            var formatN = opts.format;
            if (formatN == '年月日') {
                var showTxt = y + '年' + (m + 1) + '月' + day + '日'
                $(this).text(showTxt);
            }
            if (formatN == '年月日周') {
                var showTxt = y + '年' + (m + 1) + '月' + day + '日' + ' 星期' + week;
                $(this).text(showTxt);
            }
            if (formatN == '///') {
                var showTxt = y + '/' + (m + 1) + '/' + day + '/' + '星期' + week;
                $(this).text(showTxt);
            }
            if (formatN == '...') {
                var showTxt = y + '.' + (m + 1) + '.' + day + '.' + '星期' + week;
                $(this).text(showTxt);
            }
        });
    };

    //图片新闻淡入淡出效果
    $.fn.showFade = function (options){
        var defaults = {
            width:400,
            height:300,
            listClassName:'.list',     //列表classname
            txtName:'.txtshow',         //要显示的文字div
            delay:3000,                 //时间间隔
            progressFlag:true,          //是否显示进度条
            progressCName:'.progressli',    //进度条classname
            data:[                      //数据
                {
                    url:'',
                    txt:'',
                    link:''
                }
            ]
        }
        var opts = $.extend(defaults,options);
        this.each(function (){
            var _this = $(this);

            //初始化
            _this.css({position:'absolute',overflow:'hidden',width:opts.width,height:opts.height});
            var arrEle = [];
            var cssList = {
                width:opts.width,
                height:opts.height,
                position:'absolute'
            }
            for(var i=0;i<opts.data.length;i++){
                var ele = '<li class="list"> ' +
                          '<img src='+opts.data[i].url+' width="100%" height="100%" >' +
                          '</li>';

                arrEle.push(ele);
            };


            _this.append(arrEle.join(''));
            _this.find('.list').css(cssList);
            if(opts.progressFlag){
                var progArr = [];
                for(var j=0;j<opts.data.length;j++){
                    var proEle = '<li class="progressli">'+'</li>';
                    progArr.push(proEle);
                }
                $('.progress').append(progArr.join(''));
            }

            var num = 0;
            var listLeng = opts.data.length;
            var timer = null;
            _this.find(opts.listClassName).eq(num%listLeng).addClass('cur');
            _this.find(opts.listClassName).eq((num+1)%listLeng).addClass('next');
            $('.txtshow a').text(opts.data[(num)%listLeng].txt);
            $('.txtshow a').attr('href',opts.data[num%listLeng].link);

            $('.progress').find('.progressli').eq(0).addClass('active');
            timer = setInterval(function (){
                _this.find(opts.listClassName).removeClass('cur next');
                _this.find(opts.listClassName).css({opacity:1});
                _this.find(opts.listClassName).eq(num%listLeng).addClass('cur').stop(!1).animate({opacity:0},1000);
                _this.find(opts.listClassName).eq((num+1)%listLeng).addClass('next');

                //进度移动
                $('.progress .progressli').removeClass('active');
                $('.progress .progressli').eq((num+1)%listLeng).addClass('active');
                $('.txtshow a').text(opts.data[(num+1)%listLeng].txt);
                $('.txtshow a').attr('href',opts.data[(num+1)%listLeng].link);
                num++;
            },opts.delay);

            //鼠标移入清除
            $('.txtshow,.progress').hover(function (){
                clearInterval(timer);
            },function (){
                timer = setInterval(function (){
                    moves(num);
                    num++;
                },opts.delay);
            });

            //进度条点击
            $('body').on('click',opts.progressCName,function (){
                num = $(this).index();
                moves($(this).index()-1);
            })

            //运动
            function moves(n){
                _this.find(opts.listClassName).removeClass('cur next');
                _this.find(opts.listClassName).css({opacity:1});
                _this.find(opts.listClassName).eq(n%listLeng).addClass('cur').stop(!1).animate({opacity:0},500);
                _this.find(opts.listClassName).eq((n+1)%listLeng).addClass('next');

                //进度移动
                $('.progress .progressli').removeClass('active');
                $('.progress .progressli').eq((n+1)%listLeng).addClass('active');
                $('.txtshow a').text(opts.data[(n+1)%listLeng].txt);
                $('.txtshow a').attr('href',opts.data[(n+1)%listLeng].link);
            }

        });
        return this;
    };

    //通过json，图片无缝滚动
    $.fn.seamLessMove = function (options){
        var defaults = {
            width:100,
            height:100,
            prevBtn:'.prev',                            //上一个按钮
            nextBtn:'.next',                            //下一个按钮
            speed:50,                          //自动播放时间
            range:10,
            picData:[{
                url:'',
                link:''
            }]

        }
        var opts = $.extend(defaults,options);
        this.each(function (){

            var _this = $(this);
            _this.css({'position':'relative','overflow':'hidden'});
            //创建个数
            var arrEle = [];
            var ulMoveEle = '<ul class="slidemove"></ul>';
            for(var i=0; i<opts.picData.length;i++){
                var picLiEle = '<li class="slidePiclist" style="width:'+opts.width+'px;height: '+opts.height+'px;margin-right: '+opts.range+'px">'+
                        '<a href='+opts.picData[i].link+' target="_blank">'+
                        '<img src='+opts.picData[i].url+' width="100%" height="100%">'+
                        '</a>'+
                        '</li>';
                arrEle.push(picLiEle);
            };
            _this.append(ulMoveEle);
            _this.find('.slidemove').append(arrEle.join(''));

            _this.find('.slidemove').html(_this.find('.slidemove').html()+_this.find('.slidemove').html());
            var length = _this.find('.slidemove .slidePiclist').length;
            var currWid = _this.find('.slidemove .slidePiclist').eq(0).width();
            var allWid = (currWid+opts.range)*length;
            _this.find('.slidemove').css({width:allWid});
            var num=0;

            //自动播放
            var autoTimer = null;

            autoTimer = setInterval(function (){
                num+=1;
                if(Math.abs(num) >= parseInt(allWid/2)){
                    num = 0;
                }
                _this.find('.slidemove').css({left:-num});
            },opts.speed);

            _this.hover(function (){
                clearInterval(autoTimer);
            },function (){
                autoTimer = setInterval(function (){
                    num+=1;
                    if(Math.abs(num) >= parseInt(allWid/2)){
                        num = 0;
                    }
                    _this.find('.slidemove').css({left:-num});
                },opts.speed);
            });
        });
        return this;
    };

})(jQuery);


