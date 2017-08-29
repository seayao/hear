//通过ajax加载页面榜单图片
$.ajax({
    type:'GET',
    url:'/database/topList.txt',
    success:function(data){
        var ajaxMsg = JSON.parse(data);
        specialTopListShow(ajaxMsg.specialTopList,ajaxMsg.specialTopList.length);
        worldTopListShow(ajaxMsg.worldTopList,ajaxMsg.worldTopList.length);
        topListNameMsgShow(ajaxMsg.topListNameMsg,ajaxMsg.topListNameMsg.length);
    }
});

//音乐特色榜的数据加载
function specialTopListShow(specialTopList,length){
    specialTopListHtml ='';
    topListFunc(specialTopList,length);
    $(".topListLeftWrap ul:nth-of-type(1)").append(specialTopListHtml);
    //设置li的默认样式
    var toplistName = $(".topListInfoRightTitle h3").html().trim();
    if(toplistName == "音乐新歌榜"){
        $(".topListLeftWrap li:nth-of-type(1)").addClass('topListChecked');
    }else if(toplistName == "音乐飙升榜"){
        $(".topListLeftWrap li:nth-of-type(2)").addClass('topListChecked');
    }else if(toplistName == "原创音乐榜"){
        $(".topListLeftWrap li:nth-of-type(3)").addClass('topListChecked');
    }
    //点击榜单时，样式做出改变
    $(".topListLeftWrap li").click(function(){
        $(".topListLeftWrap li").addClass("topListUnChecked");
        $(this).removeClass('topListUnChecked').addClass("topListChecked");
    });
}

//全球媒体榜的数据加载
function worldTopListShow(worldTopList,length){
    specialTopListHtml ='';
    topListFunc(worldTopList,length);
    $(".topListLeftWrap ul:nth-of-type(2)").append(specialTopListHtml);
    //点击榜单时，样式做出改变
    $(".topListLeftWrap li").click(function(){
        $(".topListLeftWrap li").addClass("topListUnChecked");
        $(this).removeClass('topListUnChecked').addClass("topListChecked");
    });
}

//榜单图片的加载
function topListNameMsgShow(topListNameMsg,length){
    $(".topListLeftWrap").on('click','li',function(){
        for(var i=0;i<length;i++){
            if($(this).find(".topName").text() == topListNameMsg[i].topName){
                $(".topListInfoLeft img").attr("src",topListNameMsg[i].imgSrc);
            }
        }
    });
}

//动态生成页面内容（音乐榜单）的函数
var specialTopListHtml = '';
function topListFunc(msg,length){
    for(var i=0;i<length;i++){
        specialTopListHtml +='<li class="pubTopListItem">';
        specialTopListHtml +='<div class="item">';
        specialTopListHtml +='<div class="itemLeft">';
        specialTopListHtml +='<img src="'+ msg[i].imgSrc +'" alt="加载失败">';
        specialTopListHtml +='</div>';
        specialTopListHtml +='<p class="topName">'+ msg[i].topName +'</p>';
        specialTopListHtml +='<p class="update">'+ msg[i].updateTime +'</p>';
        specialTopListHtml +='</div>';
        specialTopListHtml +='</li>';
    }
}

//当点击榜单li的时候，改变榜单的名字
$(".topListLeftWrap").on('click','li',function(){
    $(".topListInfoRightTitle h3").text($(this).find(".topName").text());
});

//点击收藏时，执行
$(document).on("click", ".tableSongFav", function () {
    var userId = localStorage.userId;
    var userPhone = localStorage.userPhone;
    var beCollectId = $(this).parent().attr("data-songId");
    var beCollectSongName = $(this).parent().attr("data-songName");
    var beCollectArtist = $(this).parent().attr("data-artist");
    var beCollectImg = $(this).parent().attr("data-songImg");
    var beCollectMp3 = $(this).parent().attr("data-mp3");
    if (userId && userPhone && beCollectId) {
        //收藏相关信息
        var collectInfo = {
            beCollectId: beCollectId,
            beCollectSongName: beCollectSongName,
            beCollectArtist: beCollectArtist,
            beCollectImg: beCollectImg,
            beCollectMp3: beCollectMp3,
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
                $(".applyAlertContent i").css("backgroundPosition","0px -450px");
                $(".applyVipTip").css("color","#69b946");
            } else if (result.state == 1) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("您已收藏过了！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }else {
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

//点击播放时，执行
$(document).on("click",".tablePlayTopList",function(){
    $(".musicPlayTipDiv").css("display","block");
    setTimeout(function(){
        $(".musicPlayTipDiv").css("display","none");
    },2000);
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
                songId:songId,
                songName:songName,
                artist:artist,
                songImg:songImg,
                mp3File:mp3File,
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























