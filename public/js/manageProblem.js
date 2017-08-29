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

//进入管理中心-评论管理
$(".commentManageTitle").click(function(){
    window.location.href = urlHref + '#/tabs/manageComment';
});

//返回我的主页
$(".backMyHomeTitle").click(function(){
    window.location.href = urlHref + '#/tabs/user?id=' + localStorage.userId;
});