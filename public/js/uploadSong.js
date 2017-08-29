/**
 * Created by lx on 2016/11/11.
 */
var userId;
if (localStorage.userId && localStorage.userPhone) {
    uerId = localStorage.userId;
    $(".userId").val(uerId);
    $(".userPhoneHide").val(localStorage.userPhone);
    $(".userNickName").val(localStorage.nickname);
    $(".userHead").val(localStorage.userHead);
}else{
    window.location.href = urlHref;
}

//点击基本资料时页面跳转处理
$(".userBaseMsgTitle").click(function () {
    window.location.href = urlHref + '#/tabs/upDate?id=' + uerId;
});

//点击上传歌手时页面跳转处理
$(".upLoadArtistTitle").click(function(){
    window.location.href = urlHref + '#/tabs/uploadArtist?id='+ uerId;
});

//点击我的主页时页面跳转处理
$(".backMyHomeTitle").click(function () {
    window.location.href = urlHref + '#/tabs/user?id=' + userId;
});

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

//当前上传歌曲名字
function uploadMp3(mp3) {
    $(".uploadMp3Btn").text(mp3.files[0].name).attr("title",mp3.files[0].name);
    $(".mp3NameHide").val(mp3.files[0].name);
}

//当前上传歌词名字
function uploadLrc(lrc) {
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

$(".saveSongBtn").click(function () {
    var s1 = $(".songNameInput").val();
    var s2 = $(".artistInput").val();
    var s3 = $(".bigType").val();
    var s4 = $(".smallType").val();
    var s5 = $(".aWordInput").val();
    var s6 = $(".songImg").val();
    var s7 = $(".songMp3").val();
    var labelNum = $(".songLabelDiv input[type='checkbox']:checked").length;
    var songInfoComplete = s1 && s2 && s3 && s4 && s5 && s6 && s7;
    if (songInfoComplete && labelNum > 1) {
        upSongToServer();
    } else {
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").text("请完善歌曲信息");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    }
});

//提交用户上传歌曲信息到数据库
function upSongToServer() {
    var formData = new FormData($("#songInfoForm")[0]);
    $.ajax({
        url: urlHref + 'uploadSongs',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (result) {
            if(result.state == 200){
                $(".dialog").css("display","block");
                $(".applyAlert").css("display","block");
                $(".applyVipTip").text("成功上传歌曲信息，感谢您的奉献！");
                $(".applyAlertContent i").css("backgroundPosition","0px -450px");
                $(".applyVipTip").css("color","#69b946");
            }else{
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("上传失败，请稍后再试！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        },
        error: function (result) {
            //console.log(result);
        }
    });
}



