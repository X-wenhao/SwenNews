var selected=1;
$(document).ready(function(){
    var slide_flag=false;
    var load_flag=false;
    var id=getParams("id");
    $("body").niceScroll({cursorborder:"",cursorcolor:"#9D9D9D",boxzoom:true});
    $(".user").click(function(){
        if(!slide_flag)
        {
            $(".panel").slideDown("fast");
            slide_flag=true;
        }
        else{
            $(".panel").slideUp("fast");
            slide_flag=false;
        }
    });
    t=setTimeout(load(load_flag),5000)

});
function load(load_flag) {
    if(!load_flag)
    {
        $(".main_in_main").animate({
            top:'-=500px'
        });
        load_flag=true;
    }
}
function newest_mouse_over() {
    if(1!=selected)
    {
        $(".newest").css('background-image','url(../static/images/buttonDown.png)')
    }
}
function newest_mouse_out() {
    if(1==selected)
    {
        $(".newest").css('background-image','url(../static/images/selectedBg.png)')
    }
    else
    {
        $(".newest").css('background-image','url(../static/images/blank.png)')
    }
}
function newest_click() {
    selected=1;
    dowm_slide();
    var text="window.location.href=\"main.html?selected="+1+"\"";
    var t=setTimeout(text,500);
}
function hot_mouse_over() {
    if(2!=selected)
    {
        $(".hot").css('background-image','url(../static/images/buttonDown.png)')
    }
}
function hot_mouse_out() {
    if(2==selected)
    {
        $(".hot").css('background-image','url(../static/images/selectedBg.png)')
    }
    else
    {
        $(".hot").css('background-image','url(../static/images/blank.png)')
    }
}
function hot_click() {
    selected=2;
    dowm_slide();
    var text="window.location.href=\"main.html?selected="+2+"\"";
    var t=setTimeout(text,500);
}
function tagged_mouse_over() {
    if(3!=selected)
    {
        $(".tagged").css('background-image','url(../static/images/buttonDown.png)')
    }
}
function tagged_mouse_out() {
    if(3==selected)
    {
        $(".tagged").css('background-image','url(../static/images/selectedBg.png)')
    }
    else
    {
        $(".tagged").css('background-image','url(../static/images/blank.png)')
    }
}
function tagged_click() {
    selected=3
    dowm_slide();
    var text="window.location.href=\"main.html?selected="+3+"\"";
    var t=setTimeout(text,500);
}
function swen_news_click(){
    window.location.href="main.html"
}
function dowm_slide(){
    $(".main_in_main").animate({
        top:'+=1000px'
    });
}
function getParams(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};