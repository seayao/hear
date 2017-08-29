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

var userId = window.location.href.split("?")[1].split("=")[1];

$(".userPhoneHide").val(userId);

//会员等级输入0-9限制
var onlyInt = /[0-9]\d*/;
$(".memberLevel").keyup(function(){
   if(onlyInt.test($(this).val())){
       return $(this).val();
   } else {
       $(this).val("");
   }
});

//个性签名字数限制
$("#textAreaSign").keyup(function () {
    var currentLength = $(this).attr("maxlength") - $(this).val().length;
    $(".wordLimit").text(currentLength);
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

//更换头像显示功能设计
function uploadHead(img) {
    var windowURL = window.URL || window.webkitURL;
    //获取图片的url路径是一个blob类型，BLOB就是使用二进制保存数据。如：保存位图。
    var imgUrl = windowURL.createObjectURL(img.files[0]);
    //console.log(imgUrl);
    $(".userHeadNature").attr("src", imgUrl);
    $(".upLoadImgPreview").css("display", "block");
    $(".userHeadLgSize").attr("src", imgUrl);
    $(".userHeadSmSize").attr("src", imgUrl);
}

$(".modifyMebConfirm").click(function () {
    upMsgToServer();
});

//上传用户编辑的个人资料
function upMsgToServer() {
    var formData = new FormData($("#userMsgTable")[0]);
    $.ajax({
        url: urlHref + 'updateUser',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (result) {
            if (result.state == 200) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("修改会员资料成功！");
                $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                $(".applyVipTip").css("color", "#69b946");
            } else {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("修改失败，请稍后再试！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        },
        error: function (err) {
            //console.log(err);
        }
    });
}

//通过url中的userId来查询数据库的信息，并显示
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
            $(".nickname").val(userMsgObj.nickname);
            //性别显示
            if (userMsgObj.sex == 2) {
                $("#female").attr("checked", "true");
            }
            //会员等级显示
            $(".memberLevel").val(userMsgObj.vipGrade);
            //权限显示
            switch (userMsgObj.userType) {
                case "0":
                    $(".powerMember").attr("selected", "true");
                    break;
                case "1":
                    $(".powerAdmin").attr("selected", "true");
                    break;
            }
            //联系方式
            switch (userMsgObj.contactWay) {
                case '邮箱':
                    $(".WYEmail").attr("selected", "true");
                    break;
                case '新浪微博':
                    $(".SINAWB").attr("selected", "true");
                    break;
                case 'QQ':
                    $(".TXQQ").attr("selected", "true");
                    break;
                case '微信':
                    $(".WEIXIN").attr("selected", "true");
                    break;
                case '手机号码':
                    $(".PHONE").attr("selected", "true");
                    break;
            }
            $(".contactMethod").val(userMsgObj.contactInfo);
            $("#textAreaSign").val(userMsgObj.userSign);
            $(".userHeadNature").attr("src", userMsgObj.fileName);
            if ($("#textAreaSign").val()) {
                $(".wordLimit").html($("#textAreaSign").attr("maxlength") - userMsgObj.userSign.length);
            }
        }
    }
});

