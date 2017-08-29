/**
 * Created by lx on 2016/10/28.
 */
//通过ajax加载页面
$.ajax({
    type:'GET',
    url:'/database/songDetails.txt',
    success:function(data){
        var ajaxMsg = JSON.parse(data);
        songListShow(ajaxMsg.songDetails,ajaxMsg.songDetails.length);
        advertisementShow(ajaxMsg.advertisement,ajaxMsg.advertisement.length);
    }
});


//歌曲列表数据的加载
function songListShow(songLists,length){
    //加载的页面内容
    for(var i=0;i<length;i++){
        songListLoad(songLists,i);
    }
    $(".topListSong_list tbody").append(songListsHtml);
    //为奇数行和偶数行添加不同的颜色
    for(var j=0;j<length;j++){
        if(j%2 != 0){
            $(".topListSong_list tbody .topOne").eq(j).addClass('topTwo');
        }
    }
}

//动态生成页面内容（歌曲列表部分）的函数
var songListsHtml = '';
function songListLoad(msg,i){
    songListsHtml += '<tr class="topOne">';
    songListsHtml += '<td>';
    songListsHtml += '<span class="tableSongNth">'+ msg[i].songOrder +'</span>';
    songListsHtml += '<i></i>';
    songListsHtml += '</td>';
    songListsHtml += '<td class="rank">';
    songListsHtml += '<div class="topOneBody">';
    songListsHtml += '<span class="tablePlay"></span>';
    songListsHtml += '<div class="topOneInfo">';
    songListsHtml += '<span class="tableTxt">';
    songListsHtml += '<span class="tableSongName">' + msg[i].songName + '</span>';
    songListsHtml += '<span class="tableSongInfo">' + msg[i].songTitle + '</span>';
    songListsHtml += '</span>';
    songListsHtml += '</div>';
    songListsHtml += '</div>';
    songListsHtml += '</td>';
    songListsHtml += '<td class="tableSongTime">';
    songListsHtml += '<span class="tableSongDuration">' + msg[i].songTime + '</span>';
    songListsHtml += '<div class="tableSongShow">';
    songListsHtml += '<a class="tableSongAdd" href="javascript:;" title="添加到播放列表"></a>';
    songListsHtml += '<a class="tableSongFav" href="javascript:;" title="收藏"></a>';
    songListsHtml += '<a class="tableSongDown" href="javascript:;" title="下载"></a>';
    songListsHtml += '</div>';
    songListsHtml += '</td>';
    songListsHtml += '<td class="tableSinger">';
    songListsHtml += '<span class="tableSingerName">' + msg[i].artist + '</span>';
    songListsHtml += '</td>';
    songListsHtml += '</tr>';
}

//随机生成一个广告
function advertisementShow(advertisement,length){
    var random = parseInt(Math.random()*length);
    var adHtml ='<a href="'+ advertisement[random].adHref +'" target="_blank"><img src="'+ advertisement[random].imgSrc +'" title="买买买"></a>';
    $(".songDetailsLeftWrap ul:nth-of-type(1)").append(adHtml);
}
























