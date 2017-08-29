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

//获取歌手id
var artistId = window.location.href.split("?")[1].split("=")[1];
$(".artistId").val(artistId);

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

//通过url中的artistId来查询数据库的信息，并显示
$.ajax({
    url: urlHref + 'getArtistByIdApi',
    method: 'POST',
    dataType: "json",
    data: {
        artistId: artistId
    },
    success: function (result) {
        if (result.state == 200) {
            var artistInfo = result.data[0];
            //歌手信息展示
            $(".uploadUser").html(artistInfo.userPhone);
            if (artistInfo.userNickName){
                $(".uploadNick").html(artistInfo.userNickName);
            }else {
                $(".uploadNick").html("暂无昵称");
            }
            $(".artistVisitor").html(artistInfo.visitor);
            $(".uploadTime").html(artistInfo.uploadTime);
            $(".artistInput").val(artistInfo.artistName);
            if(artistInfo.artistNick){
                $(".artistNickInput").val(artistInfo.artistNick);
            }
            if (artistInfo.sex == 1) {
                $("#male").attr("checked", "true");
            }else {
                $("#female").attr("checked", "true");
            }
            $(".bigType").val(artistInfo.bigType);
            $(".smallType").val(artistInfo.smallType);
            //歌手简介显示与字数显示
            $("#textAreaArtistDes").val(artistInfo.artistDes);
            $("#textAreaArtistDes").parent().find(".desLimit").html($("#textAreaArtistDes").attr("maxlength") - artistInfo.artistDes.length);
            //主打歌曲显示与字数显示
            if(artistInfo.famousSong){
                $("#textAreaSongDes").val(artistInfo.famousSong);
                $("#textAreaSongDes").parent().find(".desLimit").html($("#textAreaSongDes").attr("maxlength") - artistInfo.famousSong.length);
            }
            //所获荣誉显示与字数显示
            if(artistInfo.fameDes){
                $("#textAreaFameDes").val(artistInfo.fameDes);
                $("#textAreaFameDes").parent().find(".desLimit").html($("#textAreaFameDes").attr("maxlength") - artistInfo.fameDes.length);
            }
            if(artistInfo.otherDes){
                $(".otherInput").val(artistInfo.otherDes);
            }
            $(".songImgNature").attr("src", artistInfo.artistImg);
            $(".artistImgSave").val(artistInfo.artistImg);
        }
    }
});

//修改歌曲信息
$(".modifyArtistConfirm").click(function(){
    var s1 = $(".artistInput").val();
    var s2 = $('input[name="sex"]:checked').val();
    var s3 = $(".bigType").val();
    var s4 = $(".smallType").val();
    var s5 = $("#textAreaArtistDes").val();
    if (!$(".artistImg").val()){
        $(".artistImg").remove();
    }else {
        $(".artistImgSave").remove();
    }
    var songInfoComplete = s1 && s2 && s3 && s4 && s5;
    if (songInfoComplete) {
        updateArtist();
    } else {
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").text("请完善歌曲信息");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    }
});

function updateArtist(){
    var formData = new FormData($("#artistInfoForm")[0]);
    $.ajax({
        url: urlHref + 'updateArtistInfoApi',
        method: 'POST',
        dataType: "json",
        data:formData,
        contentType: false,
        processData: false,
        success: function (result) {
            if (result.state == 200) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("修改歌手资料成功！");
                $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                $(".applyVipTip").css("color", "#69b946");
            }else {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("修改歌手资料失败，请稍后再试！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        }
    });
}