/**
 * Created by Administrator on 2017/4/25.
 */
//进入管理中心-会员管理
$(".memberManageTitle").click(function () {
    window.location.href = urlHref + '#/tabs/manageMember?id=' + localStorage.userId;
});

//进入管理中心-歌曲管理
$(".songManageTitle").click(function () {
    window.location.href = urlHref + '#/tabs/manageSong';
});

//进入管理中心-歌手管理
$(".artistManageTitle").click(function () {
    window.location.href = urlHref + '#/tabs/manageArtist';
});

//进入管理中心-评论管理
$(".commentManageTitle").click(function () {
    window.location.href = urlHref + '#/tabs/manageComment';
});

//进入管理中心-问题管理
$(".problemrManageTitle").click(function () {
    window.location.href = urlHref + '#/tabs/manageProblem';
});

//返回我的主页
$(".backMyHomeTitle").click(function () {
    window.location.href = urlHref + '#/tabs/user?id=' + localStorage.userId;
});

//获取歌曲id
var songId = window.location.href.split("?")[1].split("=")[1];
$(".songId").val(songId);

//歌曲描述字数限制
$("#textAreaSongDes").keyup(function () {
    var currentLength = $(this).attr("maxlength") - $(this).val().length;
    $(".desLimit").text(currentLength);
    if (currentLength <= 0) {
        $(this).css("background", "#eee");
        $(this).keydown(function (e) {
            currentLength = $(this).attr("maxlength") - $(this).val().length;
            if (e.keyCode == 8 || e.keyCode == 116 || currentLength > 0) {
                $(this).css("background", "#fff");
                return true;
            } else {
                return false;
            }
        });
    }
});

//更换歌曲图片显示功能设计
function uploadSong(img) {
    var windowURL = window.URL || window.webkitURL;
    //获取图片的url路径是一个blob类型，BLOB就是使用二进制保存数据。如：保存位图。
    var imgUrl = windowURL.createObjectURL(img.files[0]);
    $(".songImgNature").attr("src", imgUrl);
    $(".uploadSongImgPreview").css("display", "block");
    $(".songImgLgSize").attr("src", imgUrl);
    $(".songImgSmSize").attr("src", imgUrl);
}

//当前上传歌曲
function uploadMp3(mp3) {
    $(".uploadMp3Btn").text(mp3.files[0].name).attr("title",mp3.files[0].name);
    $(".mp3NameHide").val(mp3.files[0].name);
}

//当前上传歌词名字
function modifyLrc(lrc) {
    //文件扩展名
    var fileExtension = lrc.files[0].name.substring(lrc.files[0].name.lastIndexOf('.') + 1);
    if(fileExtension == "lrc"){
        $(".uploadLrcBtn").text(lrc.files[0].name).attr("title",lrc.files[0].name);
        $(".lrcNameHide").val(lrc.files[0].name);
    }else {
        $(".dialog").css("display","block");
        $(".applyAlert").css("display","block");
        $(".applyVipTip").html("请选择lrc格式的文件！");
        $(".applyAlertContent i").css("backgroundPosition","-30px -450px");
        $(".applyVipTip").css("color","#e33232");
    }
}

//通过url中的songId来查询数据库的信息，并显示
$.ajax({
    url: urlHref + 'getSongByIdApi',
    method: 'POST',
    dataType: "json",
    data: {
        songId: songId
    },
    success: function (result) {
        if (result.state == 200) {
            var songInfo = result.data[0];
            //歌曲信息展示
            $(".uploadUser").html(songInfo.userPhone);
            if (songInfo.userNickName){
                $(".uploadNick").html(songInfo.userNickName);
            }else {
                $(".uploadNick").html("暂无昵称");
            }
            //榜单分类
            switch (songInfo.toplistType) {
                case "音乐新歌榜":
                    $(".toplist_new").attr("selected", "true");
                    break;
                case "音乐飙升榜":
                    $(".toplist_soar").attr("selected", "true");
                    break;
                case "原创音乐榜":
                    $(".toplist_original").attr("selected", "true");
                    break;
                case "音乐热度榜":
                    $(".toplist_hot").attr("selected", "true");
                    break;
            }
            $(".songListener").html(songInfo.listener);
            $(".songCollect").html(songInfo.collectNum);
            $(".uploadTime").html(songInfo.uploadTime);
            $(".songNameInput").val(songInfo.songName);
            $(".artistInput").val(songInfo.artist);
            $(".bigType").val(songInfo.bigType);
            $(".smallType").val(songInfo.smallType);
            $(".aWordInput").val(songInfo.aWord);
            $("#textAreaSongDes").val(songInfo.songDes);
            if ($("#textAreaSongDes").val()) {
                $(".desLimit").html($("#textAreaSongDes").attr("maxlength") - songInfo.songDes.length);
            }
            $(".songImgNature").attr("src", songInfo.imgName);
            $(".songImgSave").val(songInfo.imgName);
            $(".uploadMp3Btn").text(songInfo.mp3Name).attr("title",songInfo.mp3Name);
            $(".songMp3Save").val(songInfo.mp3File);
            if(songInfo.lrcName){
                $(".uploadLrcBtn").text(songInfo.lrcName).attr("title",songInfo.lrcName);
                $(".songLrcSave").val(songInfo.lrcFile);
            }
            var labelNum = $(".songLabelDiv input[type='checkbox']").length;
            var labelArry = [];
            for (var k =0;k<labelNum;k++){
                labelArry.push($(".songLabelDiv input[type='checkbox']")[k].value);
            }
            labelArry.forEach(function(v,i,a){
                if(songInfo.label.indexOf(v) > -1){
                    $(".songLabelDiv input[type='checkbox']")[i].setAttribute("checked",true);
                }
            });
        }
    }
});

//修改歌曲信息
$(".modifySongConfirm").click(function(){
    var s1 = $(".songNameInput").val();
    var s2 = $(".artistInput").val();
    var s3 = $(".bigType").val();
    var s4 = $(".smallType").val();
    var s5 = $(".aWordInput").val();
    if (!$(".songImg").val()){
        $(".songImg").remove();
    }else {
        $(".songImgSave").remove();
    }

    if (!$(".songMp3").val()){
        $(".songMp3").remove();
    }else {
        $(".songMp3Save").remove();
    }

    if (!$(".songLrc").val()){
        $(".songLrc").remove();
    }else {
        $(".songLrcSave").remove();
    }
    var labelNum = $(".songLabelDiv input[type='checkbox']:checked").length;
    var songInfoComplete = s1 && s2 && s3 && s4 && s5;
    if (songInfoComplete && labelNum > 1) {
        updateSongInfo();
    } else {
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").html("请完善歌曲信息");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    }
});

function updateSongInfo(){
    var formData = new FormData($("#songInfoForm")[0]);
    $.ajax({
        url: urlHref + 'updateSongInfoApi',
        method: 'POST',
        dataType: "json",
        data:formData,
        contentType: false,
        processData: false,
        success: function (result) {
            if (result.state == 200) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("修改歌曲资料成功！");
                $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                $(".applyVipTip").css("color", "#69b946");
            }else {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("修改歌曲资料失败，请稍后再试！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        }
    });
}