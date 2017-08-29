/**
 * Created by lx on 2016/10/28.
 */
//通过ajax加载广告
$.ajax({
    type: 'GET',
    url: '/database/songDetails.txt',
    success: function (data) {
        var ajaxMsg = JSON.parse(data);
        advertisementShow(ajaxMsg.advertisement, ajaxMsg.advertisement.length);
    }
});

//随机生成一个广告
function advertisementShow(advertisement, length) {
    var random = parseInt(Math.random() * length);
    var adHtml = '<a href="' + advertisement[random].adHref + '" target="_blank"><img src="' + advertisement[random].imgSrc + '" title="买买买"></a>';
    $(".songDetailsLeftWrap ul:nth-of-type(1)").append(adHtml);
}

//点击评论滑动，类似锚点效果
$(document.body).on("click", ".commentBtn", function () {
    $("html, body").animate({
        scrollTop: $(".topListComment").offset().top
    }, {duration: 500, easing: "swing"});
    return false;
});

//点击播放时，执行
$(document).on("click", ".playBtn", function () {
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
                createTime: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()
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
                var localPlayLog, localPlaySongId;
                if (localStorage.localPlayLog) {
                    localPlayLog = JSON.parse(localStorage.localPlayLog);
                } else {
                    localPlayLog = [];
                }

                if (localStorage.localPlaySongId) {
                    localPlaySongId = JSON.parse(localStorage.localPlaySongId);
                } else {
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
                    if (document.querySelector(".float-menu").className.indexOf("open") > -1) {
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

//收藏操作
$(".songDetailsContent").on("click", ".collectBtn", function () {
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
    } else if (!userId || !userPhone) {
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").html("请先登录吧！");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    } else if (!beCollectId) {
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
                var targetCollectNum = $(".collectNum").html();
                var onlyNum = targetCollectNum.replace(/[^0-9]/ig, "");
                onlyNum = parseInt(onlyNum) + 1;
                $(".collectNum").html("(" + onlyNum + ")");
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("收藏成功，可在个人主页查看！");
                $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                $(".applyVipTip").css("color", "#69b946");
                $(".collectNum")
            } else if (result.state == 1) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("您已收藏过了！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            } else {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("收藏失败，请稍后再试！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        },
        error: function (err) {
        }
    });
}

//歌曲列表收藏
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
        songListCollect(collectInfo);
    } else if (!userId || !userPhone) {
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").html("请先登录吧！");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    } else if (!beCollectId) {
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").html("收藏对象不存在！");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    }
});

//发送收藏请求
function songListCollect(collectInfo) {
    $.ajax({
        type: 'POST',
        url: urlHref + 'collectSongsApi',
        data: collectInfo,
        success: function (result) {
            if (result.state == 200) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("收藏成功，可在个人主页查看！");
                $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                $(".applyVipTip").css("color", "#69b946");
                $(".collectNum")
            } else if (result.state == 1) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("您已收藏过了！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            } else {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("收藏失败，请稍后再试！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        },
        error: function (err) {
        }
    });
}

//歌曲列表点击播放时，执行
$(document).on("click", ".tablePlay", function () {
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
                createTime: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()
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
                var localPlayLog, localPlaySongId;
                if (localStorage.localPlayLog) {
                    localPlayLog = JSON.parse(localStorage.localPlayLog);
                } else {
                    localPlayLog = [];
                }

                if (localStorage.localPlaySongId) {
                    localPlaySongId = JSON.parse(localStorage.localPlaySongId);
                } else {
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
                    if (document.querySelector(".float-menu").className.indexOf("open") > -1) {
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





















