/**
 * Created by Administrator on 2017/5/3.
 */
//点击播放时，执行
$(document).on("click",".userDetailsPlay",function(){
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
            if (result.state == 200){
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