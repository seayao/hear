//当文本域的内容超过maxlength(300)字，则文本域背景变灰并禁止输入，但可以使用Backspace键删除内容再进行输入
//当文本区域的内容小于300字时，背景是白色并可以继续输入直到输入300字为止
//存在bug：第一次输入时可以按着键盘不松手一直输入，以后每次则不可以。
//bug解决：在textarea中加入 maxlength 属性来限制内容的最大长度
$("#textAreaContent").keyup(function () {
    var currentLength = $(this).attr("maxlength") - $(this).val().length;
    $(".wordLength").text(currentLength);
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

//动态生成问题列表函数
var detailsHtml = '';
function detailsLoad(msg) {
    detailsHtml += '<li data-problemId="' + msg[0]._id + '">';
    detailsHtml += '<div class="problemListsTop">';
    detailsHtml += '<span class="problemListsTitle">';
    detailsHtml += '<span class="problemListsIco"></span>';
    detailsHtml += '<span class="problemTxt">' + msg[0].problemTitle + '</span>';
    detailsHtml += '</span>';
    detailsHtml += '<span class="problemListsDetail">查看详情</span>';
    detailsHtml += '</div>';
    detailsHtml += '<div class="problemListsContent">';
    detailsHtml += '<h4 class="createProTitle">问题详情：</h4>';
    detailsHtml += '<p class="createProDes">' + msg[0].problemDes + '</p>';
    detailsHtml += '<div class="problemFootBar">';
    detailsHtml += '<div class="problemFootBarLeft">';
    detailsHtml += '<span class="proTypeTxt">问题分类：</span>';
    detailsHtml += '<span class="proType">' + msg[0].problemType + '</span>';
    detailsHtml += '<span class="createProTimeTxt">创建时间：</span>';
    detailsHtml += '<span class="createProTime">' + msg[0].uploadTime + '</span>';
    detailsHtml += '<span class="createUserTxt">创建人：</span>';
    if (msg[0].userNick){
        detailsHtml += '<span class="createUser">' + msg[0].userNick + '</span>';
    }else {
        detailsHtml += '<span class="createUser">匿名用户</span>';
    }
    detailsHtml += '</div>';
    detailsHtml += '<div class="problemFootBarRight">';
    if (msg[0].whoPraise.indexOf(userId) > -1) {
        detailsHtml += '<i class="praiseIcon publicPraiseIcon" data-problemId="' + msg[0]._id + '" data-praiseNum="' + msg[0].praise + '"></i>';
    } else {
        detailsHtml += '<i class="unPraiseIcon publicPraiseIcon" data-problemId="' + msg[0]._id + '" data-praiseNum="' + msg[0].praise + '"></i>';
    }
    detailsHtml += '<span>(</span>';
    detailsHtml += '<span class="praiseNum">' + msg[0].praise + '</span>';
    detailsHtml += '<span>)</span>';
    detailsHtml += '</div>';
    detailsHtml += '</div>';
    detailsHtml += '</div>';
    detailsHtml += '</li>';
}

//您可能遇到了？功能设计
$(".threeDNav").on('click', '.problemItem', function () {
    var that = this;
    var problemId = $(that).attr("data-problemId");
    //清空，避免重复生成html片段
    detailsHtml = '';
    $.ajax({
        type: 'POST',
        url: urlHref + 'getProblemDetailsByIdApi',
        data: {_id: problemId},
        success: function (result) {
            if (result.state == 200) {
                detailsLoad(result.data);
                $(".problemLists").append(detailsHtml);
                $(that).remove();
            }
        }
    });
});


//点击查看详情时弹出问题的详情界面
$(".problemLists").on('click', '.problemListsDetail', function () {
    $(this).parent().next().slideToggle("normal");
});

//点赞处理
$(".problemLists").on('click', '.publicPraiseIcon', function () {
    if (!localStorage.userId) {
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").text("登录后才能点赞，请先登录吧！");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    } else {
        var that = this;
        var problemId = $(that).attr("data-problemId");
        var praiseNum = parseInt($(that).attr("data-praiseNum")) + 1;
        var isMePraise = $(that).hasClass("praiseIcon");
        if (isMePraise) {
            $(".dialog").css("display", "block");
            $(".applyAlert").css("display", "block");
            $(".applyVipTip").text("请勿重复点赞！");
            $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
            $(".applyVipTip").css("color", "#e33232");
        } else {
            $.ajax({
                url: urlHref + 'updateFeedBackApi',
                type: 'POST',
                data: {
                    problemId: problemId,
                    userId:localStorage.userId,
                    userPhone: localStorage.userPhone,
                    userHead:localStorage.userHead
                },
                success: function (result) {
                    if (result.state == 200) {
                        $(that).removeClass("unPraiseIcon").addClass("praiseIcon");
                        $(that).next().next().html(praiseNum);
                    } else {
                        $(".dialog").css("display", "block");
                        $(".applyAlert").css("display", "block");
                        $(".applyVipTip").text("操作失败，请稍后再试！");
                        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                        $(".applyVipTip").css("color", "#e33232");
                    }
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }
    }

});

//获取用户id
var userId = null;
var userNick = null;
if (localStorage.userId) {
    userId = localStorage.userId;
    userNick = localStorage.nickname || "";
    $(".userIdHide").val(userId);
    $(".userNickHide").val(userNick);
}

//提交意见反馈的信息到数据库
$(".subAdviceBtn").click(function () {
    var s1 = $(".serverUserName").val();
    var s2 = $(".problemType").val();
    var s3 = $(".userIdHide").val();
    if (!s1 || !s2) {
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").text("请完善问题信息!");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    } else if (!s3) {
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").text("请先登录！");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    } else if (s1 && s2 && s3) {
        upProblemToServer();
    }
});

function upProblemToServer() {
    var formData = new FormData($("#problemTable")[0]);
    $.ajax({
        url: urlHref + 'postFeedBackApi',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (result) {
            if (result.state == 200) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("问题提交成功，感谢您的反馈！");
                $(".applyAlertContent i").css("backgroundPosition", "0px -450px");
                $(".applyVipTip").css("color", "#69b946");
            } else {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("提交问题失败，请稍后再试！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        },
        error: function (result) {
            console.log(result);
        }
    });
}


