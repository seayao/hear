/**
 * Created by Administrator on 2017/4/23.
 */
//判断登录状态
if (localStorage.userPhone && localStorage.userId) {
    window.location.href = urlHref + '#/tabs/user?id=' + localStorage.userId;
}else {
    window.location.href = urlHref + '#/tabs/myMusicNoLogin';
}

//点击登录时
$(".myMusicBtn").click(function(){
    drawCode();
    $(".loginPhoneBox").css("display", "block");
});