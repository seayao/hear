// 绑定表情
$('.face-icon').SinaEmotion($('.text'));

var commentUserName;
if(localStorage.userId && localStorage.userPhone){
    $(".commentMyHead").attr("src",localStorage.userHead);
    commentUserName = localStorage.nickname;
}else {
    commentUserName = "匿名用户";
}

//动态添加评论，点击头像时
$(document.body).on("click",".commentorHead",function(){
    var otherId = $(this).parent().attr("data-commentorId");
    window.location.href = urlHref + '#/tabs/userDetails?userId=' + otherId;
});

//动态添加评论，点击昵称时
$(document.body).on("click",".commentUserName",function(){
    var otherId = $(this).parent().parent().prev().attr("data-commentorId");
    window.location.href = urlHref + '#/tabs/userDetails?userId=' + otherId;
});

var createTime;
//点击评论按钮时，添加评论
$(".submit-btn input[type=button]").click(function () {
    var userId = localStorage.userId;
    var userPhone = localStorage.userPhone;
    var inputText = $('.text').val();
    if(!userId || !userPhone){
        $(".dialog").css("display","block");
        $(".applyAlert").css("display","block");
        $(".applyVipTip").text("请先登录吧！");
        $(".applyAlertContent i").css("backgroundPosition","-30px -450px");
        $(".applyVipTip").css("color","#e33232");
    }else if(!inputText){
        $(".dialog").css("display","block");
        $(".applyAlert").css("display","block");
        $(".applyVipTip").text("评论内容不能为空！");
        $(".applyAlertContent i").css("backgroundPosition","-30px -450px");
        $(".applyVipTip").css("color","#e33232");
    }else if (userId && userPhone && inputText){
        //获取评论时间
        var timer = new Date();
        var currYear = timer.getFullYear();
        var currMonth = timer.getMonth() + 1;
        var currDay = timer.getDate();
        var currHour = timer.getHours();
        var currMin = timer.getMinutes();
        if (currMin < 10){
            currMin = '0' + currMin;
        }
        createTime = currYear + "年" + currMonth + "月" + currDay + "日" + currHour + ":" + currMin;
        //评论相关信息
        var commentInfo = {
            beCommentId:$(".songDetailsInfo").attr("data-beCommentId"),
            beCommentType:$(".songDetailsInfo").attr("data-beCommentType"),
            beCommentor:$(".songDetailsInfo").attr("data-beCommentor"),
            commentorId:localStorage.userId,
            commentorPhone:localStorage.userPhone,
            commentorNick:localStorage.nickname,
            commentorHead:localStorage.userHead,
            createTime:createTime,
            content:AnalyticEmotion(inputText),
            praiseNum:0,
            beizhu:""
        };
        postCommentApi(commentInfo);
    }
});

function postCommentApi(commentInfo){
    $.ajax({
        type: 'POST',
        url: urlHref + 'postCommentApi',
        data:commentInfo,
        success:function(result){
            if(result.state == 200){
                $('#info-show ul').prepend(reply(commentInfo.content));
                $(".commentTotal").html(parseInt($(".commentTotal").html()) + 1);
                $('.text').val("");
                $(".wordLength").text($(".text").attr("maxlength"));
                $('.text').css("background", "#fff");
            }else {
                $(".dialog").css("display","block");
                $(".applyAlert").css("display","block");
                $(".applyVipTip").text("发表失败，请稍后再试！");
                $(".applyAlertContent i").css("backgroundPosition","-30px -450px");
                $(".applyVipTip").css("color","#e33232");
            }
        },
        error:function(err){

        }
    });
}

//评论时字数限制设计
$(".text").keyup(function () {
    var currentLength = $(this).attr("maxlength") - $(this).val().length;
    $(".wordLength").text(currentLength);
    if (currentLength <= 0) {
        $(this).css("background", "#eaeaea");
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


//添加评论内容
var comHtml;
function reply(content) {
    comHtml = '<li>';
    comHtml += '<div class="head-face" data-commentorId="'+localStorage.userId+'">';
    comHtml += '<img class="commentorHead" src="'+localStorage.userHead+'" alt="加载失败"/>';
    comHtml += '</div>';
    comHtml += '<div class="reply-cont" data-commentorId="'+localStorage.userId+'">';
    comHtml += '<span class="username">' + '<span class="commentUserName">' +commentUserName + '</span>' + '<b>' + "：" + '</b>' + '</span>';
    comHtml += '<span class="comment-body">' + content + '</span>';
    comHtml += '<div class="resBody">' + "" + '</div>';
    comHtml += '<div class="comment-footer">';
    comHtml += '<span class="comment-footer-time">' + createTime + '</span>';
    comHtml += '<span class="comment-footer-res">' + "回复" + '</span>';
    comHtml += '<span class="comment-footer-line">' + "|" + '</span>';
    comHtml += '<span class="comment-footer-zanSign">' + ")" + '</span>';
    comHtml += '<span class="comment-footer-zanNum">' + "0" + '</span>';
    comHtml += '<span class="comment-footer-zanSign">' + "(" + '</span>';
    comHtml += '<span class="comment-footer-zan" title="赞一个" >';
    comHtml += '</span>';
    comHtml += '</div>';
    comHtml += '</div>';
    comHtml += '</li>';
    return comHtml;
}

//评论点赞api
function commentPraiseApi(comId,userId){
    $.ajax({
        type: 'POST',
        url: urlHref + 'postCommentPraiseApi',
        data:{
            commentId:comId,
            userId:userId
        },
        success:function(result){

            if(result.state == 200){

            }else {
                $(".dialog").css("display","block");
                $(".applyAlert").css("display","block");
                $(".applyVipTip").text("操作失败，请稍后再试！");
                $(".applyAlertContent i").css("backgroundPosition","-30px -450px");
                $(".applyVipTip").css("color","#e33232");
            }
        },
        error:function(err){

        }
    });
}


//点赞时，执行的操作
//delegate()方法可以为当前或者未来元素（通过脚本创建的新元素）添加事件；
// 但jQuery 3.0中已弃用此方法，请用 on()代替。
//$(this).prev().prev()：用来获取点赞数量的元素
$(".commentArea").on('click', '.comment-footer-zan', function () {
    var userId = localStorage.userId;
    var userPhone = localStorage.userPhone;
    if(!userId || !userPhone){
        $(".dialog").css("display","block");
        $(".applyAlert").css("display","block");
        $(".applyVipTip").text("请先登录吧！");
        $(".applyAlertContent i").css("backgroundPosition","-30px -450px");
        $(".applyVipTip").css("color","#e33232");
    }else if ($(this).attr("title") == "赞一个") {
        var commentId = $(this).parent().parent().parent().attr("data-comId");
        commentPraiseApi(commentId,userId);
        $(this).css("backgroundPosition", "-170px 0");
        $(this).attr("title", "取消赞?");
        //点击时，赞的数量加1
        $(this).prev().prev().text(parseInt($(this).prev().prev().text()) + 1);

    } else {
        $(this).css("backgroundPosition", "-150px 0");
        $(this).attr("title", "赞一个");
        //点击时，赞的数量减1，相当于取消赞
        $(this).prev().prev().text(parseInt($(this).prev().prev().text()) - 1);
        var commentId = $(this).parent().parent().parent().attr("data-comId");
        commentPraiseApi(commentId,userId);
    }
});

//点击回复标签时，添加回复框
$("#info-show").on('click', '.comment-footer-res', function () {
    //如果当前的li有没有回复框resWrap，没有则添加，
    if ($(this).parent().parent().parent().find(".resWrap").length == 0) {
        //首先移除所有的回复框，再进行添加，保证每次只能出现一个回复框
        $("#info-show ul li").find(".resWrap").remove();
        //下面两行：当前点击的变成“回复”，其他均变为“收起”
        $(".comment-footer-res").text("回复");
        $(this).text("收起");
        //相当于找到当前的$("#info-show li")
        $(this).parent().parent().parent().append(response());
        $('.resFaceIcon').SinaEmotion($(".resText"));
        //相当于找到当前的$(".resText").attr("placeholder","回复"+$('.username').text());
        $(".resText").attr("placeholder", "回复" + $(this).parent().parent().children().first().text());
        //回复时字数限制设计
        $(".resText").keyup(function () {
            var currentLength = $(this).attr("maxlength") - $(this).val().length;
            $(".resWordLength").text(currentLength);
            if (currentLength <= 0) {
                $(this).css("background", "#eaeaea");
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
    } else {
        //有则删除。
        $(this).parent().parent().next().remove();
        $(this).text("回复");
    }
    //点击回复按钮时，将回复内容添加上去
    $(".resBtn").click(function () {
        //相当于找到当前的$('.resText')并获取它的val值
        var resText = $(this).parent().parent().find('.resText').val();
        if (resText) {
            //相当于找到当前的$(".reply-cont .resBody")
            $(this).parent().parent().parent().find(".resBody").append(resContent(AnalyticEmotion(resText)));
            //点击回复后，移除当前回复框
            $(this).parent().parent().remove();
            $(".comment-footer-res").text("回复");
            $(".resText").val("");
            $(".resWordLength").text($(".resText").attr("maxlength"));
            $(".resText").css("background", "white");
        } else {
            $(".dialog").css("display","block");
            $(".applyAlert").css("display","block");
            $(".applyVipTip").text("回复内容不能为空！！！");
            $(".applyAlertContent i").css("backgroundPosition","-30px -450px");
            $(".applyVipTip").css("color","#e33232");
        }
    });
});

//把回复内容添加到页面中
var houQiUserName = "回复用户" + parseInt(Math.random() * 999);
var resText;
function resContent(content) {
    resText = '<div class="resContent">';
    resText += '<span class="resArrow">' + '</span>';
    //谁回复的，后期获取用户名
    resText += '<b>' + houQiUserName + '</b>';
    //回复的内容
    resText += '<span>' + "：" + content + '</span>';
    resText += '</div>';
    return resText;
}

//动态生成回复框设计
var resHtml;
function response() {
    resHtml = '<div class="resWrap">';
    resHtml += '<textarea class="resText" maxlength="140" placeholder="">';
    resHtml += '</textarea>';
    resHtml += '<div class="resTool">';
    resHtml += '<span class="resFaceIcon" title="添加表情">' + "☺" + '</span>';
    resHtml += '<button class="resBtn">' + "回复" + '</button>';
    resHtml += '<span  class="resWordLength">' + "140" + '</span>';
    resHtml += '</div>';
    resHtml += '</div>';
    return resHtml;
}


