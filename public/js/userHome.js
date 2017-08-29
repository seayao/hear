var userId;
if (localStorage.userId && localStorage.userPhone) {
    userId = localStorage.userId;
} else {
    window.location.href = urlHref;
}

//点击编辑资料的url处理
$(".editInfo").click(updateWebJump);

//获取当前时间
var date = new Date();
var year = date.getFullYear();
var mon = date.getMonth() + 1;
var day = date.getDate();
var hour = date.getHours();
var min = date.getMinutes();
if (min < 10) {
    min = '0' + min;
}
var loginTime = year + '年' + mon + '月' + day + '日' + hour + ':' + min

//通过userId来查询数据库的信息，并显示
$.ajax({
    url: urlHref + 'onlyQuery',
    method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    dataType: "json",
    data: {
        userId: userId
    },
    success: function (result) {
        if (result.state == 200) {
            var userMsgObj = result.data[0];
            $(".userHead img").attr("src", userMsgObj.fileName);
            if (userMsgObj.userType == 1) {
                $(".userNameTitle").html(userMsgObj.nickname);
                $(".userType").html("（系统管理员）");
            } else if (userMsgObj.userType == 0) {
                $(".userNameTitle").html(userMsgObj.nickname);
            }
            $(".latestLoginTime").html(loginTime);
            $(".userSignContent").html(userMsgObj.userSign);
            if (userMsgObj.sex == 2) {
                $(".userSex").css("background-position", "-41px -27px");
            }
            if (userMsgObj.contactInfo) {
                $(".socialContactInfo").html(userMsgObj.contactInfo);
                switch (userMsgObj.contactWay) {
                    case '邮箱':
                        $(".socialContactType").html("（邮箱）");
                        break;
                    case '新浪微博':
                        $(".socialContactType").html("（新浪微博）");
                        break;
                    case 'QQ':
                        $(".socialContactType").html("（腾讯QQ）");
                        break;
                    case '微信':
                        $(".socialContactType").html("（微信）");
                        break;
                    case '手机号码':
                        $(".socialContactType").html("（手机号码）");
                        break;
                }
            } else {
                $(".socialContactType").html("");
            }
        }
    }
});

//点击播放时，执行
$(document).on("click",".userFavSongHeadPlay",function(){
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
            if(result.state == 200){
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
            }
        },
        error: function (err) {
        }
    });
});




