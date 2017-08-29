//播放条的大小随着窗口的大小而改变
window.onresize = function(){
    var screenW = document.body.clientWidth;
    $(".float-menu .menu-content").css("width",screenW);
};

//点击悬浮框上的播放按钮时,播放/暂停音乐
var myAudio = document.getElementById("myAudio");
$(".playOrPause").on("click",function(){
    //如果播放列表为空，则不能播放
    var defaultMp3File = myAudio.getAttribute("src");
    if(defaultMp3File){
        if (myAudio.paused){
            myAudio.play();
            $(this).removeClass("musicPlayerPlay").addClass("musicPlayerPause");
        }else{
            myAudio.pause();
            $(this).removeClass("musicPlayerPause").addClass("musicPlayerPlay");
        }
    }else{
        $(".dialog").css("display","block");
        $(".applyAlert").css("display","block");
        $(".applyVipTip").html("播放列表为空");
        $(".applyAlertContent i").css("backgroundPosition","-30px -450px");
        $(".applyVipTip").css("color","#c20c0c");
    }
});

//切换播放模式
$(".pubPlayMode").click(function(){
    var mode = $(this).attr("data-mode");
    if(mode == 1){
        $(this).attr("data-mode","2");
        $(this).removeClass("playMode1").addClass("playMode2");
        $(this).attr("title","列表循环");
        $(".musicModeTipIcon").html("列表循环");
        $(".musicModeTipDiv").css("display","block");
        setTimeout(function(){
            $(".musicModeTipDiv").css("display","none");
        },2000);
    }else if(mode == 2){
        $(this).attr("data-mode","3");
        $(this).removeClass("playMode2").addClass("playMode3");
        $(this).attr("title","随机播放");
        $(".musicModeTipIcon").html("随机播放");
        $(".musicModeTipDiv").css("display","block");
        setTimeout(function(){
            $(".musicModeTipDiv").css("display","none");
        },2000);
    }else if(mode == 3){
        $(this).attr("data-mode","1");
        $(this).removeClass("playMode3").addClass("playMode1");
        $(this).attr("title","单曲循环");
        $(".musicModeTipIcon").html("单曲循环");
        $(".musicModeTipDiv").css("display","block");
        setTimeout(function(){
            $(".musicModeTipDiv").css("display","none");
        },2000);
    }
});

//播放进度时间变化
var lrcContent = "";
var songTotalTime;
myAudio.addEventListener("durationchange", function() {
    songTotalTime = Math.ceil(myAudio.duration);
    var allTim = Math.ceil(myAudio.duration);
    $(".rangePlayer").attr("max", allTim);
    //把总时间转化成 分:秒 的形式
    var minT = parseInt(allTim / 60);
    var secT = allTim % 60;
    if (secT < 10){
        secT = "0" + secT;
        $(".TotalTime").text(minT+":"+secT);
    }else{
        $(".TotalTime").text(minT+":"+secT);
    }
    //获取当前歌曲的id
    var songId = $(".musicPlayerRange").attr("data-songId");
    var lrcSrc;
    lrcContent = "";
    //获取当前歌曲的信息
    $.ajax({
        type: 'POST',
        url: urlHref + 'getSongByIdApi',
        data: {
            songId:songId
        },
        success:function(result){
            if(result.state == 200){
                //如果歌词存在，则加载歌词
                if(result.data[0].lrcFile){
                    lrcSrc = result.data[0].lrcFile;
                    $.ajax({
                        type:'GET',
                        url:urlHref + lrcSrc,
                        contentType: "application/x-www-form-urlencoded; charset=utf-8",
                        //scriptCharset:'utf-8',
                        success:function(result){
                            lrcContent = result;
                            binlyric.txt = lrcContent;
                            binlyric.obj = ".playerListRight";
                            binlyric.lyricCSS = {"margin-top":"12px","text-align":"center","line-height":"30px"};
                            binlyric.analysis();
                        },
                        error:function(err){}
                    });
                }else {
                    lrcContent = "";
                    $(".playerListRight").html("").append("<p class='noLrcShow'>暂无歌词</p>");
                }
            }
        },
        error:function(){}
    });
});

myAudio.addEventListener("timeupdate", playAudio);
function playAudio() {
    var currentTime = Math.ceil(myAudio.currentTime);
    var bgW = currentTime*455/songTotalTime+"px";
    //var bgW = currentTime/songTotalTime*100+"%";
    $(".rangePlayerBg").css("width",bgW);
    if (myAudio.ended) {
        currentTime = 0;
        $(".playOrPause").removeClass("musicPlayerPause").addClass("musicPlayerPlay");
        $(".rangePlayerBg").css("width",0);
        //在音乐播放结束时，根据播放模式来进行下次播放
        var mode = $(".pubPlayMode").attr("data-mode");
        //单曲循环1，列表循环2，随机播放3
        if(mode == 1){
            myAudio.play();
            $(".playOrPause").removeClass("musicPlayerPlay").addClass("musicPlayerPause");
        }else if(mode == 2){
            var targetSongId = $(".playIconChecked").parent().attr("id");
            $(".playIconChecked").parent().next().click();
            if(targetSongId == $(".playIconChecked").parent().attr("id")){
                $(".playerListLeft li:first").click();
            }
        }else if(mode == 3){
            var totalNum = $(".addSongMsg").length;
            var randomNum = Math.floor(Math.random() * totalNum);
            $(".addSongMsg")[randomNum].click();
        }
    }
    $(".rangePlayer").val(currentTime);
    //把当前播放的时间转化成 分:秒 的形式
    var minC = parseInt(currentTime / 60);
    var secC = currentTime % 60;
    if (secC < 10){
        secC = "0" + secC;
        $(".currentTime").text(minC+":"+secC);
    }else{
        $(".currentTime").text(minC+":"+secC);
    }
    if (minC < 10){
        minC = "0" + minC;
    }
    //歌词同步显示
    $(".playerListRight p").css({"color":"#fff","font-size":"12px"});
    binlyric.play(minC+":"+secC,{
        color:"#e33232",
        fontSize:"14px"
    });
}

//手动控制播放进度条
$(".rangePlayer").mousedown(function() {
    var that = this;
    var targetMp3 = myAudio.getAttribute("src");
    if (targetMp3){
        myAudio.removeEventListener("timeupdate", playAudio);
        //鼠标移动时，样式和时间即时改变
        $(that).mousemove(function() {
            var targetTime = $(that).val();
            var currentTime = Math.ceil(targetTime);
            var bgW = currentTime*455/songTotalTime+"px";
            $(".rangePlayerBg").css("width",bgW);
            var minC = parseInt(currentTime / 60);
            var secC = currentTime % 60;
            if (secC < 10){
                secC = "0" + secC;
                $(".currentTime").text(minC+":"+secC);
            }else{
                $(".currentTime").text(minC+":"+secC);
            }
        });
        $(that).mouseup(function() {
            var targetTime = $(that).val();
            myAudio.currentTime = targetTime;
            myAudio.addEventListener("timeupdate", playAudio);
        });
    }else {
        return false;
    }
});

//点击音量键时弹出/隐藏音量条
$(".volumeControl").click(function(){
    $(".volumeBar").fadeToggle("fast");
});

//音量控制
$(".rangeVolume").on("change", function() {
    var vol = $(this).val();
    if (vol == 0) {
        myAudio.muted = true;
        $(".volumeControl").css("backgroundPosition", "-104px -68px");
    } else {
        myAudio.muted = false;
        $(".volumeControl").css("backgroundPosition", "-2px -248px");
    }
    myAudio.volume = vol;
    var volumeBgH = vol*80+"px";
    $(".rangeVolumeBg").css("height",volumeBgH);
});


//点击×时，关闭播放界面
$(".closePlayList").on("click",function(){
    $(".openPlayerList").css("display","none");
});

//当点击当前li的时候，移除其余li的红箭头，并为当前li添加红箭头
$(document.body).on('click','.addSongMsg',function(){
    $(".pubPlayIcon").addClass('playIconUnChecked').removeClass('playIconChecked');
    $(this).find(".pubPlayIcon").addClass('playIconChecked').removeClass('playIconUnChecked');
    //把所有li的背景颜色初始化，只为当前点击的li添加新的背景颜色
    $(".addSongMsg").css("backgroundColor","rgba(0,0,0,0.2)");
    $(this).css("backgroundColor","rgba(0,0,0,0.6)");
    var targetSongId = $(this).attr("data-songId");
    var targetSongImg = $(this).attr("data-songImg");
    var targetSongName = $(this).attr("data-songName");
    var targetArtist = $(this).attr("data-artist");
    var targetMp3File = $(this).attr("data-mp3File");
    myAudio.setAttribute("src",targetMp3File);
    myAudio.play();
    $(".playOrPause").removeClass("musicPlayerPlay").addClass("musicPlayerPause");
    $(".musicPlayerHead img").attr("src",targetSongImg);
    $(".rangeTextSong").html(targetSongName);
    $(".rangeTextSinger").html(targetArtist);
    $(".musicPlayerRange").attr("data-songId",targetSongId);
    $(".playerListSongName").html(targetSongName);
});

//下一曲
$(".musicPlayerNext").click(function(){
    var targetSongId = $(".playIconChecked").parent().attr("id");
    $(".playIconChecked").parent().next().click();
    if(targetSongId == $(".playIconChecked").parent().attr("id")){
        $(".playerListLeft li:first").click();
    }
});

//上一曲
$(".musicPlayerPrev").click(function(){
    var targetSongId = $(".playIconChecked").parent().attr("id");
    $(".playIconChecked").parent().prev().click();
    if(targetSongId == $(".playIconChecked").parent().attr("id")){
        $(".playerListLeft li:last").click();
    }
});


//清空列表
$(".clsAll").click(function(){
    var targetSongNum = $(".addSongMsg").length;
    var userId = localStorage.userId;
    if(targetSongNum > 0 && userId){
        $.ajax({
            type: 'POST',
            url: urlHref + 'delAllPlayListApi',
            data:{
                userId:userId
            },
            success: function (result) {
                if(result.state == 200){
                    $(".addSongMsg").remove();
                    //改变总歌曲数目(置零)
                    $(".totalSong").html(0);
                    $(".openPlayerTotalSong").html(0);
                    myAudio.setAttribute("src","");
                    $(".musicPlayerHead img").attr("src","frameImg/default_album.jpg");
                    $(".rangeTextSong").html("歌名");
                    $(".rangeTextSinger").html("歌手");
                    $(".TotalTime").html("0:00");
                    $(".playOrPause").removeClass("musicPlayerPause").addClass("musicPlayerPlay");
                    $(".playerListSongName").html("歌名");
                }
            },
            error: function (err) {
            }
        });
    }else if(targetSongNum > 0 && !userId){
        $(".addSongMsg").remove();
        localStorage.removeItem("localPlayLog");
        localStorage.removeItem("localPlaySongId");
        //改变总歌曲数目(置零)
        $(".totalSong").html(0);
        $(".openPlayerTotalSong").html(0);
        myAudio.setAttribute("src","");
        $(".musicPlayerHead img").attr("src","frameImg/default_album.jpg");
        $(".rangeTextSong").html("歌名");
        $(".rangeTextSinger").html("歌手");
        $(".TotalTime").html("0:00");
        $(".playOrPause").removeClass("musicPlayerPause").addClass("musicPlayerPlay");
        $(".playerListSongName").html("歌名");
    }
});

//当前歌曲展示的详情点击
$(".targetSongDetails").click(function(){
    var songId = $(this).parent().prev().attr("data-songId");
    if(songId){
        window.location.href = urlHref + '#/tabs/songDetails/' + songId;
    }
});

//当前歌曲展示的收藏点击
$(".musicFavBtn").click(function () {
    var userId = localStorage.userId;
    var userPhone = localStorage.userPhone;
    var beCollectId = $(".musicPlayerRange").attr("data-songId");
    var beCollectSongName = $(".rangeTextSong").html().trim();
    var beCollectArtist = $(".rangeTextSinger").html().trim();
    var beCollectImg = $(".musicPlayerHead img").attr("src");
    var beCollectMp3 = $("#myAudio").attr("src");
    if (userId && userPhone && beCollectId) {
        //收藏相关信息
        var collectInfo = {
            beCollectId: beCollectId,
            beCollectSongName: beCollectSongName,
            beCollectArtist: beCollectArtist,
            beCollectImg: beCollectImg,
            beCollectMp3: beCollectMp3,
            collectorId: localStorage.userId,
            collectorPhone: localStorage.userPhone,
            collectorNick: localStorage.nickname,
            collectorHead: localStorage.userHead,
            beizhu: ""
        };
        collectSongsApi(collectInfo);
    } else if(!userId || !userPhone){
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").html("请先登录吧！");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    }else if(!beCollectId){
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").html("收藏对象不存在！");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    }
});

//播放列表收藏操作
$(document.body).on("click",".playerListFav", function (event) {
    event.stopPropagation();
    var userId = localStorage.userId;
    var userPhone = localStorage.userPhone;
    var beCollectId = $(this).parent().parent().parent().attr("data-songId");
    var beCollectSongName = $(this).parent().parent().parent().attr("data-songName");
    var beCollectArtist = $(this).parent().parent().parent().attr("data-artist");
    var beCollectImg = $(this).parent().parent().parent().attr("data-songImg");
    var beCollectMp3 = $(this).parent().parent().parent().attr("data-mp3File");
    if (userId && userPhone && beCollectId) {
        //收藏相关信息
        var collectInfo = {
            beCollectId: beCollectId,
            beCollectSongName: beCollectSongName,
            beCollectArtist: beCollectArtist,
            beCollectImg: beCollectImg,
            beCollectMp3: beCollectMp3,
            collectorId: localStorage.userId,
            collectorPhone: localStorage.userPhone,
            collectorNick: localStorage.nickname,
            collectorHead: localStorage.userHead,
            beizhu: ""
        };
        collectSongsApi(collectInfo);
    } else if(!userId || !userPhone){
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").html("请先登录吧！");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    }else if(!beCollectId){
        $(".dialog").css("display", "block");
        $(".applyAlert").css("display", "block");
        $(".applyVipTip").html("收藏对象不存在！");
        $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
        $(".applyVipTip").css("color", "#e33232");
    }
});

//发送收藏请求
function collectSongsApi(collectInfo) {
    $.ajax({
        type: 'POST',
        url: urlHref + 'collectSongsApi',
        data: collectInfo,
        success: function (result) {
            if (result.state == 200) {
                var targetCollectNum = $(".collectNum").html();
                var onlyNum = targetCollectNum.replace(/[^0-9]/ig,"");
                onlyNum = parseInt(onlyNum) + 1;
                $(".collectNum").html("("+onlyNum+")");
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("收藏成功，可在个人主页查看！");
                $(".applyAlertContent i").css("backgroundPosition","0px -450px");
                $(".applyVipTip").css("color","#69b946");
                $(".collectNum")
            } else if (result.state == 1) {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("您已收藏过了！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }else {
                $(".dialog").css("display", "block");
                $(".applyAlert").css("display", "block");
                $(".applyVipTip").html("收藏失败，请稍后再试！");
                $(".applyAlertContent i").css("backgroundPosition", "-30px -450px");
                $(".applyVipTip").css("color", "#e33232");
            }
        },
        error: function (err) {
        }
    });
}

//播放列表下载操作
$(document.body).on("click",".playerListDown",function(event){
    event.stopPropagation();
    var mp3File = $(this).parent().parent().parent().attr("data-mp3File");
    window.open(urlHref + mp3File);
});

//播放列表详情操作
$(document.body).on("click",".playSongDetail",function(event){
    event.stopPropagation();
    var songId = $(this).parent().attr("data-songId");
    window.location.href = urlHref + '#/tabs/songDetails/' + songId;
});

//收藏全部操作
$(document.body).on("click",".collectAll",function(){
    $(".dialog").css("display","block");
    $(".applyAlert").css("display","block");
    $(".applyVipTip").html("暂未开通此功能！");
    $(".applyAlertContent i").css("backgroundPosition","-30px -450px");
    $(".applyVipTip").css("color","#e33232")
});

//歌词
if(typeof binlyric != 'object') {binlyric = {};}
binlyric = {
    edition:"1.1",
    obj:"",
    lyricCSS:new Object(),
    txt:"",
    index:0,
    time:new Array(),
    lyric:new Array(),
    sort:function(){ // 冒泡排序（从小到大）  
        var third;
        for(var j=0;j<this.index-1;j++)
        {
            for(var i=0;i<this.index-1;i++)
            {
                if(this.time[i]>this.time[i+1])
                {
                    third = this.time[i];
                    this.time[i] = this.time[i+1];
                    this.time[i+1] = third;
                    third = this.lyric[i];
                    this.lyric[i] = this.lyric[i+1];
                    this.lyric[i+1] = third;
                }
            }
        }
    },
    createPanel:function(){ // 创建歌词面板  
        var i=0;
        $(this.obj).html("");
        for(i=0;i<this.index;i++)
        {
            $(this.obj).append("<p>"+this.lyric[i]+"</p>");
        }
        for(i in this.lyricCSS)
        {
            $(this.obj).find("p").css(this.lyricCSS,this.lyricCSS[i]);
        }
    },
    findTags:function(index,strArray,number){ // 查找标签（包括任何扩展的标签）  
        // 此方法能匹配所有格式的标签  
        // 因为此方法是在后面写的，所以时间标签并没有使用此方法  
        number = number || this.txt.length;
        number = (number>this.txt.length) ? this.txt.length:number;
        var i,j,complete=0,value;
        var obj = new Object();
        obj.booble = false;
        obj.value = "[";
        for(i=index;i<number;i++)
        {
            if(this.txt.substr(i,1)==strArray[complete].s)
            {
                complete+=1;
                if(complete>1)
                {
                    if(complete<strArray.length)
                    {
                        obj.value += '{value:"'+this.txt.substr(value+1,i-value-1)+'"},';
                    }
                    else
                    {
                        obj.value += '{value:"'+this.txt.substr(value+1,i-value-1)+'"}]';
                    }
                }
                if(complete==strArray.length)
                {
                    obj.txt = this.txt.substr(index,i-index+1);
                    obj.value = eval('('+obj.value+')');
                    obj.index = i+1;
                    obj.booble = true;
                    break
                }
                value = i;
            }
            else if(this.txt.substr(i,1)=="\n")
            {
                obj.booble = false;
                return obj;
            }
            else if(this.txt.substr(i,1)==strArray[0].s && complete>0) // 遇到2次开始标志就退出  
            {
                obj.booble = false;
                return obj;
            }
        }
        return obj;
    },
    findlyric:function(index){ // 查找歌词： 有则返回 歌词、继续查找的位置， 否则只返回继续查找的位置  
        var obj = {};
        var str = this.txt;
        var i;
        for(i=index;i<str.length;i++)
        {
            if(str.charAt(i)=="[")
            {
                var _obj = this.findTags(i,[{s:"["},{s:":"},{s:"]"}]);
                if(_obj.booble)
                {
                    obj.index = i;//i + _obj.txt.length;  
                    obj.lyric = str.substr(index,i-index);
                    return obj;
                }
            }
            else if(str.charAt(i)=="\n")
            {
                obj.index = i+1;
                obj.lyric = str.substr(index,i-index);
                return obj
            }
        }
        if(i==str.length) // 专处理最后一句歌词（最后一句歌词比较特殊）  
        {
            obj.index = i+1;
            obj.lyric = str.substr(index,i-index);
            return obj;
        }
        obj.index = i;
        return obj;
    },
    findTime:function(index){ // 查找时间 ： 有则返回 时间、继续查找的位置， 否则只返回继续查找的位置  
        // 此功能可以用 findTags 方法实现，更简单、更强大、代码更少  
        // findTags方法 是在后面写的，所以这里就不改了，具体可参考 findID方法里的使用实例  
        var obj = {};
        var thisobj = this;
        var str = this.txt;
        obj.index = index;
        function recursion()
        {
            var _obj = thisobj.findTime(obj.index);
            if(_obj.time)
            {
                obj.time += _obj.time;
                obj.index = _obj.index;
            }
        }
        // --------------- 可以在这里 扩展 其它功能 ---------------  
        // lrc歌词只能精确到每句歌词，可以通过扩展lrc 精确 到 每个字  
        if(/\[\d{1,2}\:\d{1,2}\.\d{1,2}\]/.test(str.substr(index,10))) // [mm:ss.ff]  
        {
            obj.time = str.substr(index+1,8) + "|";
            obj.index = index+9+1;
            recursion();
        }
        else if(/\[\d{1,2}\:\d{1,2}\]/.test(str.substr(index,7))) // [mm:ss]  
        {
            obj.time = str.substr(index+1,5) + ".00" + "|";
            obj.index = index+6+1;
            recursion();
        }
        // 以下标签均属于合法标签，但很少被使用，请根据需要进行扩展  
        // [mm:ss.f] [mm:s.ff] [mm:s.f] [m:ss.ff] [m:s.ff] [m:s.f]  
        // [mm:s] [m:ss] [s:s]  
        return obj;
    },
    findID:function(index){ // 查找预定义标识  
        //[ar:艺人名]  
        //[ti:曲名]  
        //[al:专辑名]  
        //[by:编者（指编辑LRC歌词的人）]  
        //[offset:时间补偿值] 其单位是毫秒，正值表示整体提前，负值相反。这是用于总体调整显示快慢的。（很少被使用）  
        // 注：本程序也不支持 offset 功能（但是能取值），如需要 请自行在 sort 方法添加此功能  
        // 此处功能 使用 findTags方法 实现  
        var obj;
        obj = this.findTags(index,[{s:"["},{s:":"},{s:"]"}]);
        if(obj.booble)
        {
            if(obj.value[0].value=="ar")
            {
                this.ar = obj.value[1].value;
            }
            else if(obj.value[0].value=="ti")
            {
                this.ti = obj.value[1].value;
            }
            else if(obj.value[0].value=="al")
            {
                this.al = obj.value[1].value;
            }
            else if(obj.value[0].value=="by")
            {
                this.by = obj.value[1].value;
            }
            else if(obj.value[0].value=="offset") // 这里是 offset 的值  
            {
                this.offset = obj.value[1].value;
            }
        }
    },
    analysis:function(){ // 解析  
        if(this.txt=="") return false;
        var str = this.txt;
        this.index = 0;
        for(var i=0;i<str.length;i++)
        {
            if(str.charAt(i)=="[")
            {
                var time = this.findTime(i);
                if(time.time) // 时间标签  
                {
                    var lyric = this.findlyric(time.index);
                    if(lyric.lyric.trim()!="\n" && lyric.lyric.trim()!="" && lyric.lyric.trim()!=".") // 去掉无意义歌词  
                    {
                        var timeArray = time.time.split("|");
                        for(var j=0;j<timeArray.length;j++)
                        {
                            if(timeArray[j])
                            {
                                this.time[this.index] = timeArray[j];
                                this.lyric[this.index] = lyric.lyric;
                                this.index+=1;
                            }
                        }
                    }
                    i = time.index;
                }
                else // 预定义标签  
                {
                    this.findID(i);
                }
            }
        }
        this.sort();
        this.createPanel();
    },
    play:function(position,CSS){ // 定位指定时间的歌词  
        var time;
        var obj = this;
        function set(index)
        {
            var height = parseInt($(obj.obj).find("p").css("height"));
            var top = parseInt($(obj.obj).find("p").css("margin-top"));
            var moveDistance = index*height+index*top-parseInt($(obj.obj).css("height"))/2+height/2;
            $(obj.obj).animate({
                scrollTop:(moveDistance)
            },300);
            for(var i in CSS)
            {
                $(obj.obj).find("p").eq(index).css(CSS,CSS[i]);
            }
        }
        for(var i=0;i<this.index;i++)
        {
            if(position==this.time[i])
            {
                set(i);
                return;
            }
            else if(position>this.time[i])
            {
                time = i;
            }
        }
        set(time);// 没找到匹配时间 则就近最小选择  
    }
};









