//点击标签时，样式做出改变
$(".artistContentLeftWrap li a").click(function(){
    $(".artistContentLeftWrap li a").attr("class","unChecked");
    $(this).attr('class','checked');
    $(".hotArtistTitle").text($(this).text());
});

