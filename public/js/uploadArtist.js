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

//点击上传歌曲时页面跳转处理
$(".upLoadSongTitle").click(function () {
    window.location.href = urlHref + '#/tabs/uploadSong?id=' + uerId;
});

//点击我的主页时页面跳转处理
$(".backMyHomeTitle").click(function () {
    window.location.href = urlHref + '#/tabs/user?id=' + userId;
});

//歌手简介字数限制
$("#textAreaArtistDes").keyup(function () {
    wordLimit(this);
});

//主打歌曲字数限制
$("#textAreaSongDes").keyup(function () {
    wordLimit(this);
});

//所获荣誉字数限制
$("#textAreaFameDes").keyup(function () {
    wordLimit(this);
});

function wordLimit(temp) {
    var currentLength = $(temp).attr("maxlength") - $(temp).val().length;
    $(temp).parent().find(".desLimit").text(currentLength);
    if (currentLength <= 0) {
        $(temp).css("background", "#eee");
        $(temp).keydown(function (e) {
            currentLength = $(temp).attr("maxlength") - $(temp).val().length;
            if (e.keyCode == 8 || e.keyCode == 116 || currentLength > 0) {
                $(temp).css("background", "#fff");
                return true;
            } else {
                return false;
            }
        });
    }
}

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

//上传按钮
$(".saveArtistBtn").click(function () {
    var s1 = $(".artistInput").val();
    var s2 = $('input[name="sex"]:checked').val();
    var s3 = $(".bigType").val();
    var s4 = $(".smallType").val();
    var s5 = $("#textAreaArtistDes").val();
    var s6 = $(".songImg").val();
    var songInfoComplete = s1 && s2 && s3 && s4 && s5 && s6;
    if (songInfoComplete) {
        upArtistToServer();
    } else {
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").text("请完善歌手信息");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    }
});

//提交用户上传歌手信息到数据库
function upArtistToServer() {
    var formData = new FormData($("#artistInfoForm")[0]);
    $.ajax({
        url: urlHref + 'uploadArtistApi',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (result) {
            if (result.state == 200) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("成功上传歌手信息，感谢您的奉献！");
                $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                $(".applyVipTip").css("color", "#69b946");
            } else {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("上传失败，请稍后再试！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        },
        error: function (err) {
            //console.log(err);
        }
    });
}
