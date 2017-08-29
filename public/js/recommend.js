//在首页，进入个人主页
$(".dialog").css("display","block");
$(".applyAlert").css("display","block");
$(".applyVipTip").html("本网站仅供学习交流使用，严禁用于商业用途！<br /><br />详情请访问：<a href='http://music.163.com/' style='color: #000;'>网易云音乐</a>");
$(".applyAlertContent i").css("backgroundPosition","-30px -450px");
$(".applyVipTip").css("color","#e33232");

$(".userLoginHome").click(userWebJump);
function userWebJump() {
    window.location.href = urlHref + '#/tabs/user?id=' + localStorage.userId;
}

//首页登录成功的样式
if (localStorage.userPhone && localStorage.userId) {
    var nickName = localStorage.nickname;
    var userHead = localStorage.userHead;
    //如果数据库没有nickname，就显示手机号作用户名，否则就显示nickname
    if (nickName) {
        $(".userLoginAccount").html(nickName);
    } else {
        $(".userLoginAccount").html("未设置昵称");
    }
    //用户头像
    $(".userLogSuccessHead").attr("src", userHead);
    $(".userLogin").css("display", "none");
    $(".userLogSuccess").css("display", "block");
}


//首页，点击用户登录时的操作
$(".userLoginHref").click(function () {
    drawCode();
    $(".loginPhoneBox").css("display", "block");
});

//点击下载客户端时(首页)
$(".clientDownload").click(function () {
    $(".dialog").css("display", "block");
    $(".applyAlert").css("display", "block");
    $(".applyVipTip").text("客户端软件正在开发之中……");
    $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
    $(".applyVipTip").css("color", "#e33232");
});

//页面加载完时执行
$(document).ready(function () {
    lunbo();
    newAlbumBanner();
});

//banner轮播图
var bannerTimer;
var targetIndex = 0;
function show(arg) {
    $(".bannerIndex").eq(arg).addClass("indexBg").siblings().removeClass("indexBg");
    $(".bannerShow").eq(arg).fadeIn("slow").siblings().fadeOut("slow");
}

function lunbo() {
    clearInterval(localStorage.bannerTimer);
    // 轮播开始；
    bannerTimer = setInterval(function () {
        if (targetIndex == $(".bannerShow").length)
            targetIndex = 0;
        else {
            show(targetIndex);
            targetIndex++;
        }
    }, 5000);
    localStorage.bannerTimer = bannerTimer;
}

$(".bannerIndex").hover(function () {
    var t = $(this).index();
    show(t);
    // 清除轮播；
    clearInterval(bannerTimer);
}, function () {
    lunbo();
});

$(".bannerBefore").click(function () {
    clearInterval(bannerTimer);
    if (targetIndex < 0) {
        targetIndex = 4;
    }
    show(targetIndex);
    targetIndex--;
    lunbo();
});

$(".bannerAfter").click(function () {
    clearInterval(bannerTimer);
    if (targetIndex > 4) {
        targetIndex = 0;
    }
    show(targetIndex);
    targetIndex++;
    lunbo();
});

//用一个函数来控制轮播图无限自动滚动
function newAlbumBanner() {
    //单个li滚动的时间
    var speed = 40;
    //单个单位的宽度
    var lis = 130;
    var i = 0;
    var t = true;
    var a = parseInt($(".newCD").css('width'));
    //var b = parseInt($(".newCD li").length * lis);
    var b = parseInt(10 * lis);
    $(".newCD ul").css('width', b);
    var distance = b - a;

    function add() {
        i++;
    }

    function reduce() {
        i--;
    }

    var ele = $(".newCD ul");

    function jia() {
        if ((i < distance || i < i) && t) {
            add();
        } else if (i >= distance || !t) {
            t = false;
            reduce();
        }
        if (i == 0) {
            t = true;
        }
        ele.css('left', -i)
    }

    clearInterval(ele.timerAuto);
    ele.timerAuto = setInterval(jia, speed);
    $(".newCD").mouseover(function () {
        clearInterval(ele.timerAuto);
    });
    $(".newCD").mouseleave(function () {
        ele.timerAuto = setInterval(jia, speed);
    });
}

//首页热门推荐点击播放时，执行
$(document).on("click", ".iconPlay", function () {
    $(".musicPlayTipDiv").css("display", "block");
    setTimeout(function () {
        $(".musicPlayTipDiv").css("display", "none");
    }, 2000);
    var that = this;
    var targetListener = parseInt($(that).parent().find(".personNum").html());
    var songId = $(that).parent().attr("data-songId");
    var userId = localStorage.userId;
    //听众数量加+1
    $.ajax({
        type: 'POST',
        url: urlHref + 'postSongListenerApi',
        data: {
            songId: songId
        },
        success: function (result) {
            if (result.state == 200) {
                $(that).parent().find(".personNum").html(targetListener + 1);
            }
            var songName = $(that).parent().attr("data-songName");
            var artist = $(that).parent().attr("data-artist");
            var songImg = $(that).parent().attr("data-songImg");
            var mp3File = $(that).parent().attr("data-mp3");
            var targetSong = {
                userId: userId,
                songId: songId,
                songName: songName,
                artist: artist,
                songImg: songImg,
                mp3File: mp3File,
                createTime:new Date().getFullYear()+"-"+(new Date().getMonth() + 1)+"-"+new Date().getDate()
            };
            //如果用户已经登录，记录播放过的歌曲
            if (userId) {
                $.ajax({
                    type: 'POST',
                    url: urlHref + 'postPlayListApi',
                    data: targetSong,
                    success: function (result) {
                        myAudio.setAttribute("src", mp3File);
                        myAudio.play();
                        $(".playOrPause").removeClass("musicPlayerPlay").addClass("musicPlayerPause");
                        $(".musicPlayerHead img").attr("src", songImg);
                        $(".rangeTextSong").html(songName);
                        $(".rangeTextSinger").html(artist);
                        $(".musicPlayerRange").attr("data-songId", songId);
                        if (result.state == 200) {
                            $(".pubPlayIcon").removeClass("playIconChecked").addClass("playIconUnChecked");
                            var floatMenu = document.querySelector(".float-menu");
                            if (floatMenu.className.indexOf("open") > -1) {
                                addSong(result.data);
                                $(".playerListLeft ul").prepend(songListHtml);
                                $(".openPlayerTotalSong").html(parseInt($(".openPlayerTotalSong").html()) + 1);
                                $(".totalSong").html(parseInt($(".totalSong").html()) + 1);
                                $(".playerListSongName").html(songName);
                            }
                        } else if (result.state == 1) {
                            var songPlayNow = $(".musicPlayerRange").attr("data-songId");
                            $(".pubPlayIcon").removeClass("playIconChecked").addClass("playIconUnChecked");
                            $("#" + songPlayNow).find(".pubPlayIcon").addClass("playIconChecked");
                        }
                    },
                    error: function (err) {
                    }
                });
            } else {
                myAudio.setAttribute("src", mp3File);
                myAudio.play();
                $(".playOrPause").removeClass("musicPlayerPlay").addClass("musicPlayerPause");
                $(".musicPlayerHead img").attr("src", songImg);
                $(".rangeTextSong").html(songName);
                $(".rangeTextSinger").html(artist);
                $(".musicPlayerRange").attr("data-songId", songId);
                //播放日志
                var localPlayLog,localPlaySongId;
                if(localStorage.localPlayLog){
                    localPlayLog = JSON.parse(localStorage.localPlayLog);
                }else {
                    localPlayLog = [];
                }

                if(localStorage.localPlaySongId){
                    localPlaySongId = JSON.parse(localStorage.localPlaySongId);
                }else {
                    localPlaySongId = [];
                }
                if (!localPlaySongId) {
                    //本地存储播放歌曲id
                    localPlaySongId.push(songId);
                    localStorage.localPlaySongId = JSON.stringify(localPlaySongId);
                    //本地存储播放歌曲基本信息
                    localPlayLog.push(targetSong);
                    localStorage.localPlayLog = JSON.stringify(localPlayLog);
                    $(".pubPlayIcon").removeClass("playIconChecked").addClass("playIconUnChecked");
                    addSong(targetSong);
                    $(".playerListLeft ul").prepend(songListHtml);
                    $(".openPlayerTotalSong").html(parseInt($(".openPlayerTotalSong").html()) + 1);
                    $(".totalSong").html(parseInt($(".totalSong").html()) + 1);
                    $(".playerListSongName").html(songName);
                } else if (localPlaySongId.indexOf(songId) <= -1) {
                    //本地存储播放歌曲id
                    localPlaySongId.push(songId);
                    localStorage.localPlaySongId = JSON.stringify(localPlaySongId);
                    //本地存储播放歌曲基本信息
                    localPlayLog.push(targetSong);
                    localStorage.localPlayLog = JSON.stringify(localPlayLog);
                    $(".pubPlayIcon").removeClass("playIconChecked").addClass("playIconUnChecked");
                    if(document.querySelector(".float-menu").className.indexOf("open") > -1){
                        addSong(targetSong);
                        $(".playerListLeft ul").prepend(songListHtml);
                        $(".openPlayerTotalSong").html(parseInt($(".openPlayerTotalSong").html()) + 1);
                        $(".totalSong").html(parseInt($(".totalSong").html()) + 1);
                        $(".playerListSongName").html(songName);
                    }
                } else {
                    var songPlayNow = $(".musicPlayerRange").attr("data-songId");
                    $(".pubPlayIcon").removeClass("playIconChecked").addClass("playIconUnChecked");
                    $("#" + songPlayNow).find(".pubPlayIcon").addClass("playIconChecked");
                }
            }
        },
        error: function (err) {
        }
    });
});

//首页点击收藏（榜单音乐收藏）时，执行
$(".songMenu").on("click", ".songMenuFavBtn", function () {
    var userId = localStorage.userId;
    var userPhone = localStorage.userPhone;
    var beCollectId = $(this).parent().attr("data-songId");
    var beCollectSongName = $(this).parent().attr("data-songName");
    var beCollectArtist = $(this).parent().attr("data-artist");
    if (userId && userPhone && beCollectId) {
        //收藏相关信息
        var collectInfo = {
            beCollectId: beCollectId,
            beCollectSongName: beCollectSongName,
            beCollectArtist: beCollectArtist,
            collectorId: localStorage.userId,
            collectorPhone: localStorage.userPhone,
            collectorNick: localStorage.nickname,
            collectorHead: localStorage.userHead,
            beizhu: ""
        };
        collectSongsApi(collectInfo);
    } else if(!userId || !userPhone){
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").html("请先登录吧！");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    }else if(!beCollectId){
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").html("收藏对象不存在！");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    }
});

//首页榜单歌曲点击播放时，执行
$(document).on("click", ".songMenuPlayBtn", function () {
    $(".musicPlayTipDiv").css("display", "block");
    setTimeout(function () {
        $(".musicPlayTipDiv").css("display", "none");
    }, 2000);
    var that = this;
    var songId = $(that).parent().attr("data-songId");
    var userId = localStorage.userId;
    //听众数量更新
    $.ajax({
        type: 'POST',
        url: urlHref + 'postSongListenerApi',
        data: {
            songId: songId
        },
        success: function (result) {
            var songName = $(that).parent().attr("data-songName");
            var artist = $(that).parent().attr("data-artist");
            var songImg = $(that).parent().attr("data-songImg");
            var mp3File = $(that).parent().attr("data-mp3");
            var targetSong = {
                userId: userId,
                songId: songId,
                songName: songName,
                artist: artist,
                songImg: songImg,
                mp3File: mp3File,
                createTime:new Date().getFullYear()+"-"+(new Date().getMonth() + 1)+"-"+new Date().getDate()
            };
            //如果用户已经登录，记录播放过的歌曲
            if (userId) {
                $.ajax({
                    type: 'POST',
                    url: urlHref + 'postPlayListApi',
                    data: targetSong,
                    success: function (result) {
                        myAudio.setAttribute("src", mp3File);
                        myAudio.play();
                        $(".playOrPause").removeClass("musicPlayerPlay").addClass("musicPlayerPause");
                        $(".musicPlayerHead img").attr("src", songImg);
                        $(".rangeTextSong").html(songName);
                        $(".rangeTextSinger").html(artist);
                        $(".musicPlayerRange").attr("data-songId", songId);
                        if (result.state == 200) {
                            $(".pubPlayIcon").removeClass("playIconChecked").addClass("playIconUnChecked");
                            var floatMenu = document.querySelector(".float-menu");
                            if (floatMenu.className.indexOf("open") > -1) {
                                addSong(result.data);
                                $(".playerListLeft ul").prepend(songListHtml);
                                $(".openPlayerTotalSong").html(parseInt($(".openPlayerTotalSong").html()) + 1);
                                $(".totalSong").html(parseInt($(".totalSong").html()) + 1);
                                $(".playerListSongName").html(songName);
                            }
                        } else if (result.state == 1) {
                            var songPlayNow = $(".musicPlayerRange").attr("data-songId");
                            $(".pubPlayIcon").removeClass("playIconChecked").addClass("playIconUnChecked");
                            $("#" + songPlayNow).find(".pubPlayIcon").addClass("playIconChecked");
                        }
                    },
                    error: function (err) {
                    }
                });
            } else {
                myAudio.setAttribute("src", mp3File);
                myAudio.play();
                $(".playOrPause").removeClass("musicPlayerPlay").addClass("musicPlayerPause");
                $(".musicPlayerHead img").attr("src", songImg);
                $(".rangeTextSong").html(songName);
                $(".rangeTextSinger").html(artist);
                $(".musicPlayerRange").attr("data-songId", songId);
                //播放日志
                var localPlayLog,localPlaySongId;
                if(localStorage.localPlayLog){
                    localPlayLog = JSON.parse(localStorage.localPlayLog);
                }else {
                    localPlayLog = [];
                }

                if(localStorage.localPlaySongId){
                    localPlaySongId = JSON.parse(localStorage.localPlaySongId);
                }else {
                    localPlaySongId = [];
                }
                if (!localPlaySongId) {
                    //本地存储播放歌曲id
                    localPlaySongId.push(songId);
                    localStorage.localPlaySongId = JSON.stringify(localPlaySongId);
                    //本地存储播放歌曲基本信息
                    localPlayLog.push(targetSong);
                    localStorage.localPlayLog = JSON.stringify(localPlayLog);
                    $(".pubPlayIcon").removeClass("playIconChecked").addClass("playIconUnChecked");
                    addSong(targetSong);
                    $(".playerListLeft ul").prepend(songListHtml);
                    $(".openPlayerTotalSong").html(parseInt($(".openPlayerTotalSong").html()) + 1);
                    $(".totalSong").html(parseInt($(".totalSong").html()) + 1);
                    $(".playerListSongName").html(songName);
                } else if (localPlaySongId.indexOf(songId) <= -1) {
                    //本地存储播放歌曲id
                    localPlaySongId.push(songId);
                    localStorage.localPlaySongId = JSON.stringify(localPlaySongId);
                    //本地存储播放歌曲基本信息
                    localPlayLog.push(targetSong);
                    localStorage.localPlayLog = JSON.stringify(localPlayLog);
                    $(".pubPlayIcon").removeClass("playIconChecked").addClass("playIconUnChecked");
                    if(document.querySelector(".float-menu").className.indexOf("open") > -1){
                        addSong(targetSong);
                        $(".playerListLeft ul").prepend(songListHtml);
                        $(".openPlayerTotalSong").html(parseInt($(".openPlayerTotalSong").html()) + 1);
                        $(".totalSong").html(parseInt($(".totalSong").html()) + 1);
                        $(".playerListSongName").html(songName);
                    }
                } else {
                    var songPlayNow = $(".musicPlayerRange").attr("data-songId");
                    $(".pubPlayIcon").removeClass("playIconChecked").addClass("playIconUnChecked");
                    $("#" + songPlayNow).find(".pubPlayIcon").addClass("playIconChecked");
                }
            }
        },
        error: function (err) {
        }
    });
});

//发送收藏请求
function collectSongsApi(collectInfo) {
    $.ajax({
        type: 'POST',
        url: urlHref + 'collectSongsApi',
        data: collectInfo,
        success: function (result) {
            if (result.state == 200) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("收藏成功，可在个人主页查看！");
                $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                $(".applyVipTip").css("color", "#69b946");
            } else if (result.state == 1) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("您已收藏过了！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            } else {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("收藏失败，请稍后再试！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        },
        error: function (err) {
        }
    });
}







