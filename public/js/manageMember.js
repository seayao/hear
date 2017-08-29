/**
 * Created by Administrator on 2017/4/24.
 */
//进入管理中心-歌曲管理
$(".songManageTitle").click(function(){
    window.location.href = urlHref + '#/tabs/manageSong';
});

//进入管理中心-歌手管理
$(".artistManageTitle").click(function(){
    window.location.href = urlHref + '#/tabs/manageArtist';
});

//进入管理中心-评论管理
$(".commentManageTitle").click(function(){
    window.location.href = urlHref + '#/tabs/manageComment';
});

//进入管理中心-问题管理
$(".problemrManageTitle").click(function(){
    window.location.href = urlHref + '#/tabs/manageProblem';
});

//返回我的主页
$(".backMyHomeTitle").click(function(){
    window.location.href = urlHref + '#/tabs/user?id=' + localStorage.userId;
});

//重置密码
$(document).on("click",".resetPwdBtn",function(){
    var userId = $(this).parent().attr("data-userId");
    $.ajax({
        type: 'POST',
        url: urlHref+'resetPwdApi',
        data: {
            userId: userId
        },
        success: function (result) {
            if (result.state == 200) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("重置密码成功，新密码：abc123");
                $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                $(".applyVipTip").css("color", "#69b946");
            } else {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").text("重置密码失败，请稍后再试！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        },
        error: function (err) {
        }
    });
});

//点击修改时
$(document).on("click",".modifyMemberBtn",function(){
    var userId = $(this).parent().attr("data-userId");
    window.location.href = urlHref + '#/tabs/modifyMember?userId=' + userId;
});