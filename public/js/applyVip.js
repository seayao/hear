/**
 * Created by lx on 2016/11/7.
 */
//如果未选中我已阅读并同意条款的话，将禁止申请会员
var isApplyVipBtn = true;
$("#readAndAgreeVip").click(function(){
    if(isApplyVipBtn){
        $(".applyVipBtn").attr("disabled","true");
        $(".applyVipBtn").css("background","#999");
        $(".applyVipBtn").css("cursor","not-allowed");
        isApplyVipBtn = false;
    }else{
        $(".applyVipBtn").removeAttr("disabled");
        $(".applyVipBtn").css("background","#2e7ecb");
        $(".applyVipBtn").css("cursor","pointer");
        isApplyVipBtn = true;
    }
});

//当点击注册时，弹出提示
$(".applyVipBtn").click(function(){
    if(localStorage.userId){
        $(".dialog").css("display","block");
        $(".applyAlert").css("display","block");
        $(".applyVipTip").text("您已登录，退出登录即可重新注册！");
        $(".applyAlertContent i").css("backgroundPosition","-30px -450px");
        $(".applyVipTip").css("color","#e33232");
    }else {
        $(".loginPhoneBox").css("display","none");
        $(".registerBox").css("display","block");
        $(".phoneBoxText input").val("");
        $(".phoneBoxPwd input").val("");
        $(".accountTip").text("");
        $(".passwordTip").text("");
        $(".loginValidateInput").val("");
        $(".logVerCodeTip").text("");
        $(".registerTips").text("");
    }
});
