/**
 * Created by Administrator on 2017/4/24.
 */
//进入管理中心-会员管理
$(".memberManageTitle").click(function(){
    window.location.href = urlHref + '#/tabs/manageMember?id=' + localStorage.userId;
});

//进入管理中心-歌曲管理
$(".songManageTitle").click(function(){
    window.location.href = urlHref + '#/tabs/manageSong';
});

//进入管理中心-歌手管理
$(".artistManageTitle").click(function(){
    window.location.href = urlHref + '#/tabs/manageArtist';
});

//进入管理中心-问题管理
$(".problemrManageTitle").click(function(){
    window.location.href = urlHref + '#/tabs/manageProblem';
});

//返回我的主页
$(".backMyHomeTitle").click(function(){
    window.location.href = urlHref + '#/tabs/user?id=' + localStorage.userId;
});

//点击检测详情时
$(document).on("click",".modifyCommentBtn",function(){
    var comType = $(this).parent().attr("data-comType");
    var beComId = $(this).attr("data-beComId");
    $.ajax({
        type: 'POST',
        url: urlHref + 'checkCommentApi',
        data: {
            comType: comType,
            beComId: beComId
        },
        success: function (result) {
            if (result.state == 200) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("状态：正常！");
                $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                $(".applyVipTip").css("color", "#69b946");
            }else if(result.state == -1){
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("状态：被评论对象异常，可点击【详情】查看评论内容。");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        },
        error: function (err) {
        }
    });
});

//点击详情时
$(document).on("click",".commentDetailsBtn",function(){
    var commentId = $(this).parent().attr("data-comId");
    $.ajax({
        type: 'POST',
        url: urlHref + 'getCommentByIdApi',
        data: {
            commentId: commentId
        },
        success: function (result) {
            if (result.state == 200) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html(result.data[0].content+"<br/><br/>"+result.data[0].createTime);
                $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                $(".applyVipTip").css("color", "#69b946");
            }else if(result.state == 0){
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("数据不存在！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        },
        error: function (err) {
        }
    });
});

