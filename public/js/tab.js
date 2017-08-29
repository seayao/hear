/**
 * Created by Administrator on 2017/4/21.
 */
//关闭提示框（alert）功能设计
function closeAlertFunc() {
    $(".dialog").css("display", "none");
    $(".applyAlert").css("display", "none");
}
//当点击"X"或者"我知道了"或者空白区域时，执行该功能
$(".closeAlert").click(closeAlertFunc);
$(".closeAlertBottom").click(closeAlertFunc);
//$(".dialog").click(closeAlertFunc);

//点击下载客户端时执行的操作
$(".downloadClient").click(function () {
    $(".dialog").css("display", "block");
    $(".applyAlert").css("display", "block");
    $(".applyVipTip").text("客户端软件正在开发之中……");
    $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
    $(".applyVipTip").css("color", "#e33232");
});

//判断如果localStorage存在，则保持登录状态
if (localStorage.userPhone && localStorage.userId) {
    if (localStorage.rememberMe && localStorage.rememberMe == "true") {
        var userHead = localStorage.userHead;
        //用户头像
        $(".userDefHead").attr("src", userHead);
        $(".login").css("display", "none");
        $(".logUserInfo").css("display", "block");
    } else if (localStorage.rememberMe == "false") {
        localStorage.clear();
    }
}

//点击导航栏我的音乐时
$(".navMyMusic").click(function () {
    if (localStorage.userPhone && localStorage.userId) {
        window.location.href = urlHref + '#/tabs/user?id=' + localStorage.userId;
    } else {
        window.location.href = urlHref + '#/tabs/myMusicNoLogin';
    }
});

//进入个人主页
$(".enterMyHome").click(userWebJump);
//进入会员中心
$(".vipHome").click(updateWebJump);
function userWebJump() {
    window.location.href = urlHref + '#/tabs/user?id=' + localStorage.userId;
}
function updateWebJump() {
    window.location.href = urlHref + '#/tabs/upDate?id=' + localStorage.userId;
}

//进入管理中心-会员管理
$(".adminCenter").click(function () {
    if (localStorage.userType == 1) {
        window.location.href = urlHref + '#/tabs/manageMember';
    }
});

//当光标进入login时，会有登录方式的展示
$(".login").mouseover(function () {
    if ($(".loginPhoneBox").css("display") == "block") {
        this.style.cursor = "default";
        return false;
    } else {
        this.style.cursor = "pointer";
        $(".loginMethod").css("display", "block");
        $(".loginSp").css("color", "#eee");
    }
});
//当光标离开loginMethod时，登录方式界面消失
$(".login").mouseout(function () {
    $(".loginMethod").css("display", "none");
    $(".loginSp").css("color", "#aaa");
});
// 为loginMethod的li添加样式
$(".loginMethod li").mouseenter(function () {
    this.style.cursor = "pointer";
    this.style.backgroundColor = "#353535";
});
$(".loginMethod li").mouseleave(function () {
    this.style.backgroundColor = "#1a1a1a";
});

//登录成功时，当光标进入头像时，展示功能界面
$(".logUserInfo").mouseover(function () {
    $(".userHome").css("display", "block");
    if (localStorage.userType == 0) {
        $(".adminCenter").css("display", "none");
    }
});

//当光标离开头像时，功能界面消失
$(".logUserInfo").mouseout(function () {
    $(".userHome").css("display", "none");
});

//当点击搜索区域时，搜索界面消失
$(".serPubList").click(function () {
    $(".searchResult").css("display", "none");
    $(".searchInput").val("");
});

//当点击空白区域时，搜索界面消失
$(document.body).click(function () {
    $(".searchResult").css("display", "none");
    $(".searchInput").val("");
});

//当点击此区域时，搜索界面不消失
$(".searchResult").click(function (event) {
    event.stopPropagation();
});

//退出登录时的操作
$(".exitLoginBtn").click(function () {
    localStorage.clear();
    window.location.href = urlHref;
    $(".logUserInfo").css("display", "none");
    $(".login").css("display", "block");
    $(".loginPhoneBoxCover").css("display", "none");
    $(".userLogin").css("display", "block");
    $(".userLogSuccess").css("display", "none");
});

var phoneReg = /(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7}/;
var logBtnIsOk, logAccIsOk, logPwdIsOk, logVerIsOk;

// 为loginMethod的li添加点击事件，点击时登录界面展示
//手机号登录
$(".PhoneLogMethod").click(function () {
    drawCode();
    $(".loginPhoneBox").css("display", "block");
});

//管理员登录
$(".adminLogMethod").click(function () {
    $(".loginAdminBox").css("display", "block");
});

//登录时，对输入的帐号（手机号）进行的检测
$(".phoneBoxText input").keyup(function () {
    $(".loginTips").text("");
    if (!$(this).val()) {
        $(".accountTip").text("");
    } else {
        if ($(this).val().length == 11 && phoneReg.test($(this).val())) {
            $(".accountTip").text("手机号码合法");
            $(".accountTip").css("color", "#69b946");
            logAccIsOk = true;
        } else {
            $(".accountTip").text("手机号码不合法");
            $(".accountTip").css("color", "#e33232");
            logAccIsOk = false;
        }
    }
});
//登录时，对密码进行的简单初步检测
$(".phoneBoxPwd input").keyup(function () {
    $(".loginTips").text("");
    if (!$(this).val()) {
        $(".passwordTip").text("");
    } else {
        if ($(this).val().length < 6 || $(this).val().length > 16) {
            $(".passwordTip").text("长度为6-16个字符");
            $(".passwordTip").css("color", "#e33232");
            logPwdIsOk = false;
        } else {
            $(".passwordTip").text("");
            $(".passwordTip").css("color", "#69b946");
            logPwdIsOk = true;
        }
    }
});
//点击登录时，执行的操作
$(".loginBtn input[type='button']").click(function () {
    loginFunc();
});

//回车键触发登录事件与自身keyup事件冲突
//$(".loginPhoneBox .inputAccount").keydown(function (e) {
//    if (e.keyCode == 13) {
//        loginFunc();
//    }
//});
//
//$(".loginPhoneBox .inputPwd").keydown(function (e) {
//    if (e.keyCode == 13) {
//        loginFunc();
//    }
//});
//
//$(".loginPhoneBox .loginValidateInput").keydown(function (e) {
//    if (e.keyCode == 13) {
//        loginFunc();
//    }
//});

//记住我？
var rememberMe = $("#loginAuto").is(':checked');
$('#loginAuto').click(function () {
    if (!$(this).attr('checked')) {
        $(this).attr('checked', true);
        rememberMe = $("#loginAuto").is(':checked');
    } else {
        $(this).attr('checked', false);
        rememberMe = $("#loginAuto").is(':checked');
    }
});

function loginFunc() {
    logBtnIsOk = logAccIsOk && logPwdIsOk && logVerIsOk;
    if (!$(".phoneBoxText input").val()) {
        $(".accountTip").text("帐号不能为空");
        $(".accountTip").css("color", "#e33232");
    } else if (!$(".phoneBoxPwd input").val()) {
        $(".passwordTip").text("密码不能为空");
        $(".passwordTip").css("color", "#e33232");
    } else if (!$(".loginValidateInput").val()) {
        $(".logVerCodeTip").text("验证码不能为空");
        $(".logVerCodeTip").css("color", "#e33232");
    } else if (logBtnIsOk) {
        $(".loginPhoneBoxCover").css("display", "block");
        $.ajax({
            url: urlHref + 'login',
            method: 'POST',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            dataType: "json",
            data: {
                userPhone: $(".phoneBoxText input").val(),
                userPwd: $(".phoneBoxPwd input").val()
            },
            success: function (result) {
                if (result.state == 200) {
                    //console.log('从数据库返回的数据：',result);
                    //登录成功的逻辑处理
                    localStorage.userId = result.userMsg._id;
                    localStorage.userPhone = result.userMsg.userPhone;
                    localStorage.userPwd = result.userMsg.userPwd;
                    localStorage.nickname = result.userMsg.nickname || "";
                    localStorage.userHead = result.userMsg.fileName || "frameImg/default_avatar.jpg";
                    localStorage.userType = result.userMsg.userType;
                    localStorage.rememberMe = rememberMe;
                    setTimeout(function () {
                        //登录成功，隐藏悬浮球和播放列表
                        $(".float-menu").removeClass("open");
                        $(".openPlayerList").fadeOut();
                        //评论区头像和昵称
                        $(".commentMyHead").attr("src", localStorage.userHead);
                        commentUserName = localStorage.nickname || "匿名用户";
                        //如果数据库中有nickname就显示，否则显示userPhone
                        if (result.userMsg.nickname) {
                            $(".userLoginAccount").html(result.userMsg.nickname);
                        } else {
                            $(".userLoginAccount").html("去设置昵称吧！");
                        }
                        //如果数据库中有用户上传的头像就显示
                        if (result.userMsg.fileName) {
                            $(".userDefHead").attr("src", result.userMsg.fileName);
                            $(".userLogSuccessHead").attr("src", result.userMsg.fileName);
                        }
                        $(".login").css("display", "none");
                        $(".logUserInfo").css("display", "block");
                        $(".userLogin").css("display", "none");
                        $(".userLogSuccess").css("display", "block");
                        $(".loginPhoneBoxCover").css("display", "none");
                        closeLoginBox();
                    }, 1200);
                } else if (result.state == 0) {
                    drawCode();
                    $(".loginPhoneBoxCover").css("display", "none");
                    $(".phoneBoxPwd input").val("");
                    $(".loginValidateInput").val("");
                    $(".logVerCodeTip").text("");
                    $(".loginTips").text("提示：登录失败，帐号或密码错误。");
                } else if (result.state == -1) {
                    drawCode();
                    $(".loginPhoneBoxCover").css("display", "none");
                    $(".phoneBoxPwd input").val("");
                    $(".loginValidateInput").val("");
                    $(".logVerCodeTip").text("");
                    $(".loginTips").text("提示：该帐号已被禁用，请联系管理员。");
                }
            }
        });
    } else {
        drawCode();
        $(".loginValidateInput").val("");
        $(".logVerCodeTip").text("");
        $(".loginTips").text("提示：登录失败，信息填写有误。");
    }
}

//页面加载的时候就生成一个验证码
window.onload = function () {
    drawCode();
};
//点击验证码的时候刷新验证码
$("#myCan").click(function () {
    drawCode();
    //并将验证码输入框和验证码输入提示信息置空
    $(".logVerCodeTip").text("");
    $(".loginValidateInput").val("");
});
//随机生成一个最大值和一个最小值的函数
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
//随机生成一个颜色的函数
function randomColor(min, max) {
    var _r = randomNum(min, max);
    var _g = randomNum(min, max);
    var _b = randomNum(min, max);
    return "rgb(" + _r + "," + _g + "," + _b + ")";
}
//绘制验证码的函数
function drawCode() {
    var myCanvas = document.getElementById("myCan");
    var ctx = myCanvas.getContext("2d");
    //生成验证码的源数据
    var _str = "azxcvbnmsdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP0123456789";
    //初始化验证码
    var _picTxt = "";
    //验证码的长度
    var _num = 4;
    //获取canvas的宽和高
    var _width = myCanvas.width;
    var _height = myCanvas.height;
    //绘制验证码的文字对齐方式
    ctx.textBaseline = "bottom";
    //绘制canvas的颜色
    ctx.fillStyle = randomColor(150, 240);
    //绘制canvas
    ctx.fillRect(0, 0, _width, _height);
    //绘制验证码
    for (var i = 0; i < _num; i++) {
        var x = (_width - 10) / _num * i + 5;
        var y = randomNum(_height / 2, _height);
        var deg = randomNum(-30, 30);
        var txt = _str[randomNum(0, _str.length)];
        _picTxt += txt;
        ctx.fillStyle = randomColor(10, 100);
        ctx.font = randomNum(16, 30) + "px SimHei";
        ctx.translate(x, y);
        ctx.rotate(deg * Math.PI / 180);
        ctx.fillText(txt, 0, 0);
        ctx.rotate(-deg * Math.PI / 180);
        ctx.translate(-x, -y);
    }
    //在输入验证码时判断是否输入正确
    $(".loginValidateInput").keyup(function () {
        $(".loginTips").text("");
        if (!$(this).val()) {
            $(".logVerCodeTip").text("");
        } else {
            if ($(this).val().toLowerCase() == _picTxt.toLowerCase()) {
                $(".logVerCodeTip").text("验证码输入正确");
                $(".logVerCodeTip").css("color", "#69b946");
                logVerIsOk = true;
            } else {
                $(".logVerCodeTip").text("验证码输入错误");
                $(".logVerCodeTip").css("color", "#e33232");
                logVerIsOk = false;
            }
        }
    });
    //随机画num条干扰线
    for (var j = 0; j < _num; j++) {
        ctx.strokeStyle = randomColor(100, 180);
        ctx.beginPath();
        ctx.moveTo(randomNum(0, _width), randomNum(0, _height));
        ctx.lineTo(randomNum(0, _width), randomNum(0, _height));
        ctx.stroke();
    }
    //随机生成_num*15个干扰点
    for (var k = 0; k < _num * 15; k++) {
        ctx.fillStyle = randomColor(0, 255);
        ctx.beginPath();
        ctx.arc(randomNum(0, _width), randomNum(0, _height), 1, 0, 2 * Math.PI);
        ctx.fill();
    }
    return _picTxt;
}
// 为closeBox和other添加点击事件，点击时输入的内容及提示信息置空，登录界面消失
var closeLoginBox = function () {
    //关闭登录框并将输入内容和提示信息置空
    $(".loginPhoneBox").css("display", "none");
    $(".phoneBoxText input").val("");
    $(".phoneBoxPwd input").val("");
    $(".accountTip").text("");
    $(".passwordTip").text("");
    $(".loginValidateInput").val("");
    $(".logVerCodeTip").text("");
    $(".loginTips").text("");
    //关闭注册框并将输入内容和提示信息置空
    $(".registerBox").css("display", "none");
    $(".registerAccInput").val("");
    $(".registerPwdInput").val("");
    $(".validateInput").val("");
    $(".registerAccountTip").text("");
    $(".registerPwdTip").text("");
    $(".validate .verCode").text("");
    $(".validate .verCodeTip").text("");
    $(".registerTips").text("");
};
$(".closeBox").click(function () {
    closeLoginBox();
    reGetValidate();
    $(".validate .getValidate").val("获取短信");
});
//在线浏览，暂不登录
$(".loginPhoneBoxBottom .other").click(closeLoginBox);
//没有帐号？免费注册,并将输入内容和提示信息置空
$(".loginPhoneBoxBottom .register").click(function () {
    drawCode();
    $(".loginPhoneBox").css("display", "none");
    $(".registerBox").css("display", "block");
    $(".phoneBoxText input").val("");
    $(".phoneBoxPwd input").val("");
    $(".accountTip").text("");
    $(".passwordTip").text("");
    $(".loginValidateInput").val("");
    $(".logVerCodeTip").text("");
    $(".registerTips").text("");
});
//返回登录,并将输入内容和提示信息置空
$(".backLogin").click(function () {
    drawCode();
    $(".loginPhoneBox").css("display", "block");
    $(".registerBox").css("display", "none");
    $(".registerAccInput").val("");
    $(".registerPwdInput").val("");
    $(".validateInput").val("");
    $(".registerAccountTip").text("");
    $(".registerPwdTip").text("");
    $(".validate .verCode").text("");
    $(".validate .verCodeTip").text("");
    $(".registerTips").text("");
    reGetValidate();
    $(".validate .getValidate").val("获取短信");
});

//注册时帐号(手机号是否合法)的检测
var regAccIsOk;
$(".registerAccInput").keyup(function () {
    $(".registerTips").text("");
    if (!$(this).val()) {
        $(".registerAccountTip").text("");
    } else {
        if ($(this).val().length == 11 && phoneReg.test($(this).val())) {
            $(".registerAccountTip").text("手机号码合法");
            $(".registerAccountTip").css("color", "#69b946");
            regAccIsOk = true;
        } else {
            $(".registerAccountTip").text("手机号码不合法");
            $(".registerAccountTip").css("color", "#e33232");
            regAccIsOk = false;
        }
    }
});
//注册时密码设置是否合法的检测
var regPwdIsOk;
$(".registerPwdInput").keyup(function () {
    $(".registerTips").text("");
    //该正则：必须以大写或者小写字母开头，不能全是字母，长度6-16位
    var pwdReg = /^[a-zA-Z](?![a-zA-Z]+$)[0-9A-Za-z]{5,15}$/;
    if (!$(this).val()) {
        $(".registerPwdTip").text("");
    } else {
        if (pwdReg.test($(this).val())) {
            $(".registerPwdTip").text("设置的密码符合规则");
            $(".registerPwdTip").css("color", "#69b946");
            regPwdIsOk = true;
        } else if (/[a-zA-Z]/.test($(this).val().substr(0, 1)) == false) {
            $(".registerPwdTip").text("必须以大写或小写字母开头");
            $(".registerPwdTip").css("color", "#e33232");
            regPwdIsOk = false;
        } else if ($(this).val().length < 6 || $(this).val().length > 16) {
            $(".registerPwdTip").text("密码长度应为6-16个字符");
            $(".registerPwdTip").css("color", "#e33232");
            regPwdIsOk = false;
        } else if (/[a-zA-Z]/.test($(this).val().substr(-1)) == true) {
            $(".registerPwdTip").text("不能全为字母");
            $(".registerPwdTip").css("color", "#e33232");
            regPwdIsOk = false;
        }
    }
});

//点击显示密码的小眼睛即可显示密码
var pwdIsShow = false;
$(".showPwdEye").click(function () {
    if (!pwdIsShow) {
        $(this).css("background", "URL(../frameImg/pwdShow.png)");
        $(".registerPwdInput").attr("type", "text");
        pwdIsShow = true;
    } else {
        $(this).css("background", "URL(../frameImg/pwdHide.png)");
        $(".registerPwdInput").attr("type", "password");
        pwdIsShow = false;
    }
});
//定义验证码输入正误的变量
var regVerIsOk;
//点击获取短信执行的操作
var countDown;
$(".validate .getValidate").click(function () {
    if (!$(".registerAccInput").val()) {
        $(".registerAccountTip").text("手机号码不能为空");
        $(".registerAccountTip").css("color", "#e33232");
    } else if ($(".registerAccInput").val().length == 11 && phoneReg.test($(".registerAccInput").val())) {
        $(".registerAccountTip").text("手机号码合法");
        $(".registerAccountTip").css("color", "#69b946");
        //生成6位验证码
        var verCode = '';
        for (var i = 0; i < 6; i++) {
            verCode += parseInt(Math.random() * 10);
        }
        console.log(verCode);
        //获取手机验证码的操作
        var verCodeContent = "您的验证码是:" + verCode + "。在3分钟内输入有效。如非本人操作，请忽略。";
        var url = 'http://m.5c.com.cn/api/send/index.php?format=json&data={"type":"send","apikey":"e1edb78fa377c55cd10e6661fd34d8a3","username":"duolami","password_md5":"8cd8265879604fadb5da318bd9cf66b4","encode":"UTF-8","mobile":"' + $(".registerAccInput").val() + '","content":"' + encodeURI(verCodeContent) + '"}';
        $.ajax({
            url: url,
            type: 'POST',
            dataType: "jsonp",
            success: function (result) {
            },
            error: function (error) {
            }
        });
        //每次点击获取短信时，先将验证码清空
        $(".verCode").text("");
        //验证码过期时间
        setTimeout(function () {
            verCode = null;
        }, 180000);
        //先获取一个随机的时间
        var that = this;
        $(that).css("background", "#999");
        $(that).css("color", "#eee");
        $(that).attr("disabled", "true");
        that.style.cursor = 'wait';
        var sec = 59;
        countDown = setInterval(timeCount, 1000);
        //倒计时函数的设计
        function timeCount() {
            //当倒计时的时间小于10时，为前面加个0
            sec < 10 ? sec = "0" + sec : sec;
            $(that).val("00:" + sec);
            sec -= 1;
            if (sec < 0) {
                //当倒计时为0时，重新获取获取短信
                reGetValidate();
            }
        }

        //当输入的验证码与给定的验证码相等或不等时的提示信息展示
        $(".validateInput").keyup(function () {
            $(".registerTips").text("");
            if (!$(this).val()) {
                $(".verCodeTip").text("");
            } else {
                if ($(this).val() == verCode) {
                    $(".verCodeTip").text("您输入的验证码正确");
                    $(".verCodeTip").css("color", "#69b946");
                    regVerIsOk = true;
                } else {
                    $(".verCodeTip").text("您输入的验证码有误");
                    $(".verCodeTip").css("color", "#e33232");
                    regVerIsOk = false;
                }
            }
        });
    } else {
        $(".registerAccountTip").text("手机号码不合法");
        $(".registerAccountTip").css("color", "#e33232");
    }
});

//重新获取获取短信函数的实现
function reGetValidate() {
    clearInterval(countDown);
    $(".validate .getValidate").css("background", "#2e963d");
    $(".validate .getValidate").css("color", "#fff");
    $(".validate .getValidate").removeAttr("disabled");
    $(".validate .getValidate").val("重新发送");
    $(".validate .getValidate").css("cursor", "pointer");
}

//如果未选中我已阅读并同意条款的话，将禁止注册
var isRegisterBtn = true;
$("#readAndAgree").click(function () {
    if (isRegisterBtn) {
        $(".signUpBtn").attr("disabled", "true");
        $(".signUpBtn").css("background", "#999");
        $(".signUpBtn").css("cursor", "not-allowed");
        isRegisterBtn = false;
    } else {
        $(".signUpBtn").removeAttr("disabled");
        $(".signUpBtn").css("background", "#2e7ecb");
        $(".signUpBtn").css("cursor", "pointer");
        isRegisterBtn = true;
    }
});
var isRegisterLabel = true;
$(".registerBtn label").click(function () {
    if (isRegisterLabel) {
        $(".signUpBtn").attr("disabled", "true");
        $(".signUpBtn").css("background", "#999");
        $(".signUpBtn").css("cursor", "not-allowed");
        isRegisterLabel = false;
    } else {
        $(".signUpBtn").removeAttr("disabled");
        $(".signUpBtn").css("background", "#2e7ecb");
        $(".signUpBtn").css("cursor", "pointer");
        isRegisterLabel = true;
    }
});

//点击注册按钮时的操作
var regBtnIsOk;
$(".signUpBtn").click(function () {
    regBtnIsOk = regAccIsOk && regPwdIsOk && regVerIsOk;
    //如果注册时的手机号为空时
    if (!$(".registerAccInput").val()) {
        $(".registerAccountTip").text("手机号码不能为空");
        $(".registerAccountTip").css("color", "#e33232");
    }
    //如果注册时的密码框为空时
    else if (!$(".registerPwdInput").val()) {
        $(".registerPwdTip").text("密码不能为空");
        $(".registerPwdTip").css("color", "#e33232");
    }
    //如果注册时的验证码为空时
    else if (!$(".validateInput").val()) {
        $(".verCodeTip").text("验证码不能为空");
        $(".verCodeTip").css("color", "#e33232");
    } else if (regBtnIsOk) {
        $.ajax({
            url: urlHref + 'register',
            method: 'POST',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            dataType: "json",
            data: {
                userPhone: $(".registerAccInput").val(),
                userPwd: $(".registerPwdInput").val()
            },
            success: function (result) {
                if (result.state == 200) {
                    $(".validateInput").val("");
                    $(".registerTips").text("提示：您已成功注册帐号，去登录试试吧。");
                } else if (result.state == 1) {
                    $(".validateInput").val("");
                    $(".registerAccountTip").text("提示：用户名已存在！").css("color", "#e33232");
                } else {
                    $(".validateInput").val("");
                    $(".registerAccountTip").text("提示：注册失败，请稍后再试！").css("color", "#e33232");
                }
            }
        });
    } else {
        $(".validateInput").val("");
        $(".registerTips").text("提示：注册失败，请检查输入的信息是否正确。");
    }
});

//js为登录界面添加移动事件
var parent = document.documentElement;
var loginPhoneBoxTop = document.getElementsByClassName("loginPhoneBoxTop")[0];
var loginPhoneBox = document.getElementsByClassName("loginPhoneBox")[0];
loginPhoneBoxTop.addEventListener("mouseover", function () {
    this.style.cursor = 'move';
});
loginPhoneBoxTop.addEventListener("mousedown", function () {
    this.style.cursor = 'move';
    var moveAction;
    loginPhoneBox.addEventListener("mousemove", moveAction = function (e) {
        var x = this.offsetLeft + e.movementX;
        var y = this.offsetTop + e.movementY;
        this.style.left = x + "px";
        this.style.top = y + "px";
    });
    parent.addEventListener("mouseup", function () {
        loginPhoneBox.removeEventListener("mousemove", moveAction);
    });
});

//js为注册界面添加移动事件
var registerBoxTop = document.getElementsByClassName("registerBoxTop")[0];
var registerBox = document.getElementsByClassName("registerBox")[0];
registerBoxTop.addEventListener("mouseover", function () {
    this.style.cursor = 'move';
});
registerBoxTop.addEventListener("mousedown", function () {
    this.style.cursor = 'move';
    var mAction;
    registerBox.addEventListener("mousemove", mAction = function (e) {
        var x = this.offsetLeft + e.movementX;
        var y = this.offsetTop + e.movementY;
        this.style.left = x + "px";
        this.style.top = y + "px";
    });
    parent.addEventListener("mouseup", function () {
        registerBox.removeEventListener("mousemove", mAction);
    });
});

//js为修改密码界面添加移动事件
var changePwdBoxTop = document.getElementsByClassName("changePwdBoxTop")[0];
var changePwdBox = document.getElementsByClassName("changePwdBox")[0];
changePwdBoxTop.addEventListener("mouseover", function () {
    this.style.cursor = 'move';
});
changePwdBoxTop.addEventListener("mousedown", function () {
    this.style.cursor = 'move';
    var moveAction;
    changePwdBox.addEventListener("mousemove", moveAction = function (e) {
        var x = this.offsetLeft + e.movementX;
        var y = this.offsetTop + e.movementY;
        this.style.left = x + "px";
        this.style.top = y + "px";
    });
    parent.addEventListener("mouseup", function () {
        changePwdBox.removeEventListener("mousemove", moveAction);
    });
});

//js为管理员登录界面添加移动事件
var loginAdminBoxTop = document.getElementsByClassName("loginAdminBoxTop")[0];
var loginAdminBox = document.getElementsByClassName("loginAdminBox")[0];
loginAdminBoxTop.addEventListener("mouseover", function () {
    this.style.cursor = 'move';
});
loginAdminBoxTop.addEventListener("mousedown", function () {
    this.style.cursor = 'move';
    var moveAction;
    loginAdminBox.addEventListener("mousemove", moveAction = function (e) {
        var x = this.offsetLeft + e.movementX;
        var y = this.offsetTop + e.movementY;
        this.style.left = x + "px";
        this.style.top = y + "px";
    });
    parent.addEventListener("mouseup", function () {
        loginAdminBox.removeEventListener("mousemove", moveAction);
    });
});

//导航栏效果设计
$(".nav .one").mouseenter(function () {
    $(".nav .one").css("background", "URL(frameImg/topbar.png)");
    $(".nav .one").css("backgroundPosition", "left -268px");
    $(".nav .one>a").css("background", "URL(frameImg/topbar.png)");
    $(".nav .one>a").css("backgroundPosition", "right -268px");
});
$(".nav .one").mouseleave(function () {
    $(".nav .one").css("background", "");
    $(".nav .one>a").css("background", "");
});

$(".nav .two").mouseenter(function () {
    $(".nav .two").css("background", "URL(frameImg/topbar.png)");
    $(".nav .two").css("backgroundPosition", "left -268px");
    $(".nav .two>a").css("background", "URL(frameImg/topbar.png)");
    $(".nav .two>a").css("backgroundPosition", "right -268px");
});
$(".nav .two").mouseleave(function () {
    $(".nav .two").css("background", "");
    $(".nav .two>a").css("background", "");
});

$(".nav .three").mouseenter(function () {
    $(".nav .three").css("background", "URL(frameImg/topbar.png)");
    $(".nav .three").css("backgroundPosition", "left -268px");
    $(".nav .three>a").css("background", "URL(frameImg/topbar.png)");
    $(".nav .three>a").css("backgroundPosition", "right -268px");
});
$(".nav .three").mouseleave(function () {
    $(".nav .three").css("background", "");
    $(".nav .three>a").css("background", "");
});

$(".nav .four").mouseenter(function () {
    $(".nav .four").css("background", "URL(frameImg/topbar.png)");
    $(".nav .four").css("backgroundPosition", "left -268px");
    $(".nav .four>a").css("background", "URL(frameImg/topbar.png)");
    $(".nav .four>a").css("backgroundPosition", "right -268px");
});
$(".nav .four").mouseleave(function () {
    $(".nav .four").css("background", "");
    $(".nav .four>a").css("background", "");
});

$(".nav .five").mouseenter(function () {
    $(".nav .five").css("background", "URL(frameImg/topbar.png)");
    $(".nav .five").css("backgroundPosition", "left -268px");
    $(".nav .five>a").css("background", "URL(frameImg/topbar.png)");
    $(".nav .five>a").css("backgroundPosition", "right -268px");
});
$(".nav .five").mouseleave(function () {
    $(".nav .five").css("background", "");
    $(".nav .five>a").css("background", "");
});

$(".nav .six").mouseenter(function () {
    $(".nav .six").css("background", "URL(frameImg/topbar.png)");
    $(".nav .six").css("backgroundPosition", "left -268px");
    $(".nav .six>a").css("background", "URL(frameImg/topbar.png)");
    $(".nav .six>a").css("backgroundPosition", "right -268px");
});
$(".nav .six").mouseleave(function () {
    $(".nav .six").css("background", "");
    $(".nav .six>a").css("background", "");
});

//返回顶部设计
window.onscroll = function () {
    var distance = window.scrollY;
    if (distance >= 100) {
        $(".backTop a").css("display", "block");
    } else {
        $(".backTop a").css("display", "none");
    }
};

$(".backTop a").click(function () {
    $('body,html').animate({scrollTop: 0}, 500);
    return false;
});

//修改密码设计
//点击修改密码时，弹出修改密码框
$(".pwdChange").click(function () {
    $(".changePwdBox").css("display", "block");
});

//关闭修改密码框
function clearChangePwd() {
    $(".changePwdBox").css("display", "none");
    $(".oldPwdInput").val("");
    $(".newPwdInput").val("");
    $(".confirmPwdInput").val("");
    $(".oldPwdTip").text("");
    $(".newPwdTip").text("");
    $(".confirmPwdTip").text("");
    $(".changePwdTips").text("");
}

//关闭
$(".closeChangePwdBox").click(function () {
    clearChangePwd();
});

//去登录
$(".changePwdBoxLogin").click(function () {
    $(".loginPhoneBox").css("display", "block");
    clearChangePwd();
});

//去注册
$(".changePwdBoxReg").click(function () {
    $(".registerBox").css("display", "block");
    clearChangePwd();
});

//修改密码时，对旧密码进行的简单初步检测
var oldPwdIsOk;
$(".oldPwdInput").keyup(function () {
    $(".changePwdTips").text("");
    if (!$(this).val()) {
        $(".oldPwdTip").text("");
    } else {
        if ($(this).val().length < 6 || $(this).val().length > 16) {
            $(".oldPwdTip").text("长度为6-16个字符").css("color", "#e33232");
            oldPwdIsOk = false;
        } else {
            $(".oldPwdTip").text("");
            oldPwdIsOk = true;
        }
    }
});

//修改密码时，新密码设置是否合法的检测
var changeNewPwdIsOK;
$(".newPwdInput").keyup(function () {
    $(".changePwdTips").text("");
    //该正则：必须以大写或者小写字母开头，不能全是字母，长度6-16位
    var pwdReg = /^[a-zA-Z](?![a-zA-Z]+$)[0-9A-Za-z]{5,15}$/;
    if (!$(this).val()) {
        $(".newPwdTip").text("");
    } else {
        if (pwdReg.test($(this).val())) {
            $(".newPwdTip").text("设置的密码符合规则").css("color", "#69b946");
            changeNewPwdIsOK = true;
        } else if (/[a-zA-Z]/.test($(this).val().substr(0, 1)) == false) {
            $(".newPwdTip").text("必须以大写或小写字母开头").css("color", "#e33232");
            changeNewPwdIsOK = false;
        } else if ($(this).val().length < 6 || $(this).val().length > 16) {
            $(".newPwdTip").text("密码长度应为6-16个字符").css("color", "#e33232");
            changeNewPwdIsOK = false;
        } else if (/[a-zA-Z]/.test($(this).val().substr(-1)) == true) {
            $(".newPwdTip").text("不能全为字母").css("color", "#e33232");
            changeNewPwdIsOK = false;
        }
    }
});

//修改密码时，确认新密码
var newPwdContent;
var confirmPwdIsOK;
$(".confirmPwdInput").keyup(function () {
    newPwdContent = $(".newPwdInput").val();
    $(".changePwdTips").text("");
    if (!$(this).val()) {
        $(".confirmPwdTip").text("");
    } else if ($(this).val() !== newPwdContent) {
        $(".confirmPwdTip").text("两次输入密码不一致").css("color", "#e33232");
        confirmPwdIsOK = false;
    } else if ($(this).val() == newPwdContent) {
        $(".confirmPwdTip").text("");
        confirmPwdIsOK = true;
    }
});

//点击修改密码按钮时的操作
var changePwdBtnIsOk;
$(".changePwdBtn").click(function () {
    changePwdBtnIsOk = oldPwdIsOk && changeNewPwdIsOK && confirmPwdIsOK;
    //如果修改密码时的旧密码为空时
    if (!$(".oldPwdInput").val()) {
        $(".oldPwdTip").text("旧密码不能为空").css("color", "#e33232");
    }
    //如果修改密码时的新密码框为空时
    else if (!$(".newPwdInput").val()) {
        $(".newPwdTip").text("新密码不能为空").css("color", "#e33232");
    }
    //如果修改密码时的确认密码为空时
    else if (!$(".confirmPwdInput").val()) {
        $(".confirmPwdTip").text("确认密码不能为空").css("color", "#e33232");
    } else if (changePwdBtnIsOk) {
        if (!localStorage.userId) {
            $(".dialog").css("display", "block");
            $(".applyAlert").css("display", "block");
            $(".applyVipTip").text("登录状态异常，请重新登录！");
            $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
            $(".applyVipTip").css("color", "#e33232");
        } else {
            $.ajax({
                url: urlHref + 'changePassword',
                method: 'POST',
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                dataType: "json",
                data: {
                    userId: localStorage.userId,
                    oldPwd: $(".oldPwdInput").val(),
                    newPwd: $(".newPwdInput").val()
                },
                success: function (result) {
                    if (result.state == 200) {
                        $(".oldPwdInput").val("");
                        $(".newPwdInput").val("");
                        $(".confirmPwdInput").val("");
                        $(".changePwdTips").text("提示：修改密码成功。");
                    } else if (result.state == 1) {
                        $(".oldPwdInput").val("");
                        $(".newPwdInput").val("");
                        $(".confirmPwdInput").val("");
                        $(".changePwdTips").text("提示：修改密码失败，新密码不能与旧密码相同！").css("color", "#e33232");
                    } else if (result.state == 0) {
                        $(".oldPwdInput").val("");
                        $(".newPwdInput").val("");
                        $(".confirmPwdInput").val("");
                        $(".changePwdTips").text("提示：修改密码失败，旧密码输入错误！").css("color", "#e33232");
                    } else {
                        $(".oldPwdInput").val("");
                        $(".newPwdInput").val("");
                        $(".confirmPwdInput").val("");
                        $(".changePwdTips").text("提示：修改密码失败，请稍后再试！").css("color", "#e33232");
                    }
                }
            });
        }
    } else {
        $(".confirmPwdInput").val("");
        $(".changePwdTips").text("提示：修改密码失败，请检查输入的信息是否正确。");
    }
});

//管理员登录设计
//关闭管理员登录框
function closeAdminBox() {
    $(".loginAdminBox").css("display", "none");
    $(".adminAccount").val("");
    $(".adminPwd").val("");
    $(".adminLoginTips").text("");
}

//关闭
$(".closeAdminBox").click(function () {
    closeAdminBox();
});

$(".exitAdminBox").click(function () {
    closeAdminBox();
});

//点击登录时（管理员）
$(".adminLogBtn").click(function () {
    adminLoginFunc()
});

//管理员登录func
function adminLoginFunc() {
    if (!$(".adminAccount").val()) {
        $(".adminLoginTips").text("提示：帐号不能为空。");
    } else if (!$(".adminPwd").val()) {
        $(".adminLoginTips").text("提示：密码不能为空。");
    } else {
        $(".loginAdminBoxCover").css("display", "block");
        $.ajax({
            url: urlHref + 'login',
            method: 'POST',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            dataType: "json",
            data: {
                userPhone: $(".adminAccount").val(),
                userPwd: $(".adminPwd").val()
            },
            success: function (result) {
                if (result.state == 200) {
                    //console.log('从数据库返回的数据：',result);
                    //登录成功的逻辑处理
                    localStorage.userId = result.userMsg._id;
                    localStorage.userPhone = result.userMsg.userPhone;
                    localStorage.userPwd = result.userMsg.userPwd;
                    localStorage.nickname = result.userMsg.nickname || "";
                    localStorage.userHead = result.userMsg.fileName || "frameImg/default_avatar.jpg";
                    localStorage.userType = result.userMsg.userType;
                    localStorage.rememberMe = "true";
                    setTimeout(function () {
                        //登录成功，隐藏悬浮球和播放列表
                        $(".float-menu").removeClass("open");
                        $(".openPlayerList").fadeOut();
                        //评论区头像和昵称
                        $(".commentMyHead").attr("src", localStorage.userHead);
                        commentUserName = localStorage.nickname || "匿名用户";
                        //如果数据库中有nickname就显示，否则显示userPhone
                        if (result.userMsg.nickname) {
                            $(".userLoginAccount").html(result.userMsg.nickname);
                        } else {
                            $(".userLoginAccount").html("去设置昵称吧！");
                        }
                        //如果数据库中有用户上传的头像就显示
                        if (result.userMsg.fileName) {
                            $(".userDefHead").attr("src", result.userMsg.fileName);
                            $(".userLogSuccessHead").attr("src", result.userMsg.fileName);
                        }
                        $(".login").css("display", "none");
                        $(".logUserInfo").css("display", "block");
                        $(".userLogin").css("display", "none");
                        $(".userLogSuccess").css("display", "block");
                        $(".loginAdminBoxCover").css("display", "none");
                        closeAdminBox();
                    }, 1200);
                } else if (result.state == 0) {
                    $(".loginAdminBoxCover").css("display", "none");
                    $(".adminPwd").val("");
                    $(".adminLoginTips").text("提示：登录失败，帐号或密码错误。");
                } else if (result.state == -1) {
                    $(".loginAdminBoxCover").css("display", "none");
                    $(".adminPwd").val("");
                    $(".adminLoginTips").text("提示：您的帐号已被禁用，请联系管理员。");
                }
            }
        });
    }
}

//播放列表没有当前播放歌曲时，添加该歌曲
var songListHtml;
function addSong(songInfo) {
    songListHtml = '<li id="' + songInfo.songId + '" class="addSongMsg" data-songId="' + songInfo.songId + '" data-songName="' + songInfo.songName + '" data-songImg="' + songInfo.songImg + '" data-artist="' + songInfo.artist + '" data-mp3File="' + songInfo.mp3File + '">';
    songListHtml += '<div class="pubPlayIcon playIconChecked"></div>';
    songListHtml += '<div class="playSongName" title="歌曲">' + songInfo.songName + '</div>';
    songListHtml += '<div class="playerToolsWrap">';
    songListHtml += '<div class="playerTools">';
    songListHtml += '<div class="playerListFav" title="收藏"></div>';
    songListHtml += '<div class="playerListDown" title="下载"></div>';
    songListHtml += '<div class="playerListDel" title="删除"></div>';
    songListHtml += '</div>';
    songListHtml += '</div>';
    songListHtml += '<div class="playArtistName" title="歌手">' + songInfo.artist + '</div>';
    if (songInfo.createTime) {
        songListHtml += '<div class="playSongTime" title="创建时间">' + songInfo.createTime + '</div>';
    } else {
        songListHtml += '<div class="playSongTime" title="创建时间">' + new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + '</div>';
    }
    songListHtml += '<div class="playSongDetail" title="详情"></div>';
    songListHtml += '</li>';
    return songListHtml;
}
