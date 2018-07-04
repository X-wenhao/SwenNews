var selected=1;
var tag_sel=-1;//-1 未选中，1时政，2科技，3娱乐，4游戏，5体育，6财经
var create_flag=false;
var page=0;
var load_flag=false;
$(document).ready(function(){
    var num=0;
    var angle=0;
    var slide_flag=false;
    var tag_slide_flag=false;
    //selected=getParams("seleceted");
    createNews();
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
    $(".three_points").click(function(){
        $(".tag_panel").slideToggle("fast");
    });
    var waypoints = $('#handler-first').waypoint(function(direction) {
        notify(this.element.id + ' hit 25% from top of window')
    }, {
        offset: '25%'
    })
});
function load(load_flag) {
    if(!load_flag)
    {
        $(".main_block").animate({
            top:'-=1000px'
        });
        load_flag=true;
    }
    if(1==selected){
        $(".newest").css('background-image','url(../static/images/selectedBg.png)');
        $(".hot").css('background-image','url(../static/images/blank.png)');
        $(".tagged").css('background-image','url(../static/images/blank.png)');
    }
    else if(2==selected)
    {
        $(".hot").css('background-image','url(../static/images/selectedBg.png)');
        $(".newest").css('background-image','url(../static/images/blank.png)');
        $(".tagged").css('background-image','url(../static/images/blank.png)');
    }
    else{
        $(".tagged").css('background-image','url(../static/images/selectedBg.png)');
        $(".hot").css('background-image','url(../static/images/blank.png)');
        $(".newest").css('background-image','url(../static/images/blank.png)');
    }
}
function main_block_click(newsid) {
    $(".main_block").animate({
        top:'+=2000px',
    });
    var text="window.location.href=\"detail.html?id="+newsid+"\"";
    var t=setTimeout(text,500);
    // var t=setTimeout("window.location.href=\"detail.html\"",500);
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

    $(".hot").css('background-image','url(../static/images/blank.png)')
    $(".tagged").css('background-image','url(../static/images/blank.png)')
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
    $(".newest").css('background-image','url(../static/images/blank.png)')
    $(".tagged").css('background-image','url(../static/images/blank.png)')
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
function tags_move_out() {
    if(3==selected)
    {
        $(".tags").slideToggle("fast");
    }
}
function tagged_click() {
    selected=3
    $(".newest").css('background-image','url(../static/images/blank.png)')
    $(".hot").css('background-image','url(../static/images/blank.png)')
    $(".tags").slideToggle("fast");
}
function create_news() {
    if(!create_flag)
    {
        $(".shelter").css('display','block');
        $(".create_news").animate({
            top:'+=1013px'
        });
        $(".news_content").niceScroll({cursorborder:"",cursorcolor:"#cfcfcf",boxzoom:true});
        create_flag=true;
    }
    else
    {
        $(".shelter").css('display','none');
        $(".create_news").animate({
            top:'-=1013px'
        });
        create_flag=false;
    }

}
function user_center_click() {
    window.location.href="user_center.html"
}
function my_news_click() {
    window.location.href="user_center.html"
}
function init(selected)
{
    if(1==selected)
    {

    }
    else if(2==selected)
    {

    }
    else
    {

    }
}
// $(".main").scroll(function(){
//     var scrollTop = $(this).scrollTop();
//     var scrollHeight = $(this).height();
//     var windowHeight = $(this).height();
//     alert("已经到最底部了！");
//     if(scrollTop == scrollHeight){
//         alert("已经到最底部了！");
//     }
// });
function three_points() {

}
function tag_1_click() {
    $(".tag_text").text("时政");
    $(".tag_text").css('color','#000000');
    $(".tag_panel").slideToggle("fast");
}
function tag_2_click() {
    $(".tag_text").text("科技");
    $(".tag_text").css('color','#000000');
    $(".tag_panel").slideToggle("fast");
}
function tag_3_click() {
    $(".tag_text").text("娱乐");
    $(".tag_text").css('color','#000000');
    $(".tag_panel").slideToggle("fast");
}
function tag_4_click() {
    $(".tag_text").text("游戏");
    $(".tag_text").css('color','#000000');
    $(".tag_panel").slideToggle("fast");
}
function tag_5_click() {
    $(".tag_text").text("体育");
    $(".tag_text").css('color','#000000');
    $(".tag_panel").slideToggle("fast");
}
function tag_6_click() {
    $(".tag_text").text("财经");
    $(".tag_text").css('color','#000000');
    $(".tag_panel").slideToggle("fast");
}
function create_confirm() {
    $(".shelter").css('display','none');
    $(".create_news").animate({
        top:'-=1013px'
    });
    var t=setTimeout("window.location.href=\"main.html\"",500);
}


function createNews() {
    console.log("fwe");
    $.getJSON("/SwenNews/api/v1/news?page_num=0&news_type=all&time=0&hot=0",function (data) {
        console.log("fwe");
        console.log(data);
        // alert("yeah")
        $.each(data,function (index,item) {
            // alert(index+item.title);
            $(".news_block_ul").append(
                "<li><div class='main_block' id='main_block_"+index+"'onmousedown='main_block_click("+item.id+")'>" +"<ul><li>"+
                "<span class='news_block_tag'>来自话题："+item.news_type+"</span><li>" +
                "<li><span class='news_block_title'>"+item.title+"</span><li>" +
                "<li><span class='news_block_content'>"+item.content+"</span><li>"+
                "<span class='head_icon'></span>"+
                "<span class='date_time'></span>"+
                "<li><span class='news_block_author'>"+item.username+"</span></li>"+
                "<li><span class='news_block_date'>"+item.datetime+"<li>"+
                "</ul></div><li>"
            );
        })
    })
}
function shelter_click() {
    $(".shelter").css('display','none');
    $(".create_news").animate({
        top:'-=1013px'
    });
    create_flag=false;
}
function swen_news_click(){
    window.location.href="main.html"
}
function last_page_click() {
    page=page-1;
    $(".main_block").animate({
        top:'+=1000px'
    });
    var text="window.location.href=\"main.html?page="+page+"\"";
    var t=setTimeout(text,500);
}
function next_page_click() {
    page=page+1;
    $(".main_block").animate({
        top:'-=1000px'
    });
    var text="window.location.href=\"main.html?page="+page+"\"";
    var t=setTimeout(text,500);
}
function getParams(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};
