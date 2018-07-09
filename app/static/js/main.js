var selected;
var tag_sel;//-1 未选中，1时政，2科技，3娱乐，4游戏，5体育，6财经
var create_flag=false;
var page=0;
var load_flag=false;
var login_flag=false;
var user_id=-1;
$(document).ready(function(){
    var num=0;
    var angle=0;
    var slide_flag=false;
    var tag_slide_flag=false;
    get_user_info();
    page=getParams("page");
    if(page==null){
        page=0;
    }
    selected=getParams("selected");
    if(selected==null){
        selected = 1;
    }
    else{
        selected=parseInt(selected);
    }
    set_sel();
    // switch (selected){
    //     case 1:getNewestNews(page);
    //         break;
    //     case 2:getHotNews(page);
    //     case 3:
    // }

    $("body").niceScroll({cursorborder:"",cursorcolor:"#9D9D9D",boxzoom:true});
    $(".user").click(function(){
        if(login_flag){
            if(!slide_flag)
            {
                $(".panel").slideDown("fast");
                slide_flag=true;
            }
            else{
                $(".panel").slideUp("fast");
                slide_flag=false;
            }
        }
        else{
            window.location.href="login.html"
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
function get_user_info() {
    $.ajax({
        url: '/SwenNews/api/v1/session',
        type: 'GET',
        dataType: 'json'
    })
        .done(function(data) {
            if(1==data.status)
            {
                login_flag=true;
                user_id=data.id;
                path='..'+data.avatar
                $(".user").attr('src',path);
            }
            else{
            }
        })
        .fail(function() {
            console.log("get user information error")
        })
}
function logout() {
    $.ajax({
        url: '/SwenNews/api/v1/session',
        type: 'DELETE',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"user_id": user_id}),
    })
        .done(function(data) {
            if(1==data.status)
            {
                login_flag=false;
            }
        })
        .fail(function() {
            console.log("log out error")
        })
}
function set_sel() {
    if(1==selected){
        $(".newest").css('background-image','url(../static/images/selectedBg.png)')
        $(".hot").css('background-image','url(../static/images/blank.png)')
        $(".tagged").css('background-image','url(../static/images/blank.png)')
        getNewestNews(page);
    }
    else if(2==selected){
        $(".hot").css('background-image','url(../static/images/selectedBg.png)')
        $(".newest").css('background-image','url(../static/images/blank.png)')
        $(".tagged").css('background-image','url(../static/images/blank.png)')
        getHotNews(page);
    }
    else{
        $(".tagged").css('background-image','url(../static/images/selectedBg.png)')
        $(".hot").css('background-image','url(../static/images/blank.png)')
        $(".newest").css('background-image','url(../static/images/blank.png)')
        tag_sel=getParams("tag_sel");
        if(null==tag_sel){
            tag_sel=1;
            document.getElementById("tags_t_1").style.color="#ff6f79";
            $(".tags").slideToggle("fast");
        }
        else{
            tag_sel=parseInt(tag_sel);
        }
        if(1==tag_sel)
        {
            getTypeNews(page,'时政');
        }
        else if(2==tag_sel){
            getTypeNews(page,'科技');
        }
        else if(3==tag_sel){
            getTypeNews(page,'娱乐');
        }
        else if(4==tag_sel){
            getTypeNews(page,'游戏');
        }
        else if(5==tag_sel){
            getTypeNews(page,'体育');
        }
        else{
            getTypeNews(page,'财经');
        }
    }
}
function load(load_flag) {
    if(!load_flag)
    {
        $(".main_block").animate({
            top:'-=1000px'
        });
        load_flag=true;
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
    page=0;
    var text="window.location.href=\"main.html?page="+0+"&selected="+selected+"\"";
    var t=setTimeout(text,0);
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
    page=0;
    var text="window.location.href=\"main.html?page="+0+"&selected="+selected+"\"";
    var t=setTimeout(text,0);
    $(".newest").css('background-image','url(../static/images/blank.png)')
    $(".tagged").css('background-image','url(../static/images/blank.png)')
}
function tagged_mouse_over() {
    if(3!=selected)
    {
        $(".tagged").css('background-image','url(../static/images/buttonDown.png)')
    }
    else{
        $(".tags").slideDown("fast");
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
    if(3!=selected){
        selected=3
        page=0;
        var text="window.location.href=\"main.html?page="+0+"&selected="+selected+"\"";
        var t=setTimeout(text,0);
        $(".newest").css('background-image','url(../static/images/blank.png)')
        $(".hot").css('background-image','url(../static/images/blank.png)')
    }
    $(".tags").slideToggle("fast");
}
function create_news() {
    if(login_flag){
        if(!create_flag)
        {
            $(".new").rotate({animateTo: 225});
            $(".shelter").css('display','block');
            $(".create_news").animate({
                top:'+=1013px'
            });
            $(".news_content").niceScroll({cursorborder:"",cursorcolor:"#cfcfcf",boxzoom:true});
            create_flag=true;
        }
        else
        {
            $(".new").rotate({animateTo: 0});
            $(".shelter").css('display','none');
            $(".create_news").animate({
                top:'-=1013px'
            });
            create_flag=false;
        }
    }
    else{
        window.location.href="login.html"
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
function tags_t_1_click() {
    page=0;
    tag_sel=1;
    $(".tags").slideToggle("fast");
    var text="window.location.href=\"main.html?page="+0+"&selected="+3+"&tag_sel="+1+"\"";
    var t=setTimeout(text,500);
    $(".tags_t").css('color','#474747');
    document.getElementById("tags_t_1").style.color="#ff6f79";
    tag_sel=1;
}
function tags_t_2_click() {
    page=0;
    tag_sel=2;
    $(".tags").slideToggle("fast");
    var text="window.location.href=\"main.html?page="+0+"&selected="+3+"&tag_sel="+2+"\"";
    var t=setTimeout(text,500);
    $(".tags_t").css('color','#474747');
    document.getElementById("tags_t_2").style.color="#ff6f79";
    tag_sel=2;
}
function tags_t_3_click() {
    page=0;
    tag_sel=3;
    $(".tags").slideToggle("fast");
    var text="window.location.href=\"main.html?page="+0+"&selected="+3+"&tag_sel="+3+"\"";
    var t=setTimeout(text,500);
    $(".tags_t").css('color','#474747');
    document.getElementById("tags_t_3").style.color="#ff6f79";
    tag_sel=3;
}
function tags_t_4_click() {
    page=0;
    tag_sel=4;
    $(".tags").slideToggle("fast");
    var text="window.location.href=\"main.html?page="+0+"&selected="+3+"&tag_sel="+4+"\"";
    var t=setTimeout(text,500);
    $(".tags_t").css('color','#474747');
    document.getElementById("tags_t_4").style.color="#ff6f79";
    tag_sel=4;
}
function tags_t_5_click() {
    page=0;
    tag_sel=5;
    $(".tags").slideToggle("fast");
    var text="window.location.href=\"main.html?page="+0+"&selected="+3+"&tag_sel="+5+"\"";
    var t=setTimeout(text,500);
    $(".tags_t").css('color','#474747');
    document.getElementById("tags_t_5").style.color="#ff6f79";
    tag_sel=5;
}
function tags_t_6_click() {
    page=0;
    tag_sel=6;
    $(".tags").slideToggle("fast");
    var text="window.location.href=\"main.html?page="+0+"&selected="+3+"&tag_sel="+6+"\"";
    var t=setTimeout(text,500);
    $(".tags_t").css('color','#474747');
    document.getElementById("tags_t_6").style.color="#ff6f79";
    tag_sel=6;
}
function tags_t_1_over(){
    if(1!=tag_sel){
        document.getElementById("tags_t_1").style.color="#ffa9af";
    }
}
function tags_t_1_out() {
    if(1!=tag_sel){
        document.getElementById("tags_t_1").style.color="#474747";
    }
    else{
        document.getElementById("tags_t_1").style.color="#ff6f79";
    }
}

function tags_t_2_over(){
    if(2!=tag_sel){
        document.getElementById("tags_t_2").style.color="#ffa9af";
    }
}
function tags_t_2_out() {
    if(2!=tag_sel){
        document.getElementById("tags_t_2").style.color="#474747";
    }
    else{
        document.getElementById("tags_t_2").style.color="#ff6f79";
    }
}

function tags_t_3_over(){
    if(3!=tag_sel){
        document.getElementById("tags_t_3").style.color="#ffa9af";
    }
}
function tags_t_3_out() {
    if(3!=tag_sel){
        document.getElementById("tags_t_3").style.color="#474747";
    }
    else{
        document.getElementById("tags_t_3").style.color="#ff6f79";
    }
}

function tags_t_4_over(){
    if(4!=tag_sel){
        document.getElementById("tags_t_4").style.color="#ffa9af";
    }
}
function tags_t_4_out() {
    if(4!=tag_sel){
        document.getElementById("tags_t_4").style.color="#474747";
    }
    else{
        document.getElementById("tags_t_4").style.color="#ff6f79";
    }
}

function tags_t_5_over(){
    if(5!=tag_sel){
        document.getElementById("tags_t_5").style.color="#ffa9af";
    }
}
function tags_t_5_out() {
    if(5!=tag_sel){
        document.getElementById("tags_t_5").style.color="#474747";
    }
    else{
        document.getElementById("tags_t_5").style.color="#ff6f79";
    }
}

function tags_t_6_over(){
    if(6!=tag_sel){
        document.getElementById("tags_t_6").style.color="#ffa9af";
    }
}
function tags_t_6_out() {
    if(6!=tag_sel){
        document.getElementById("tags_t_6").style.color="#474747";
    }
    else{
        document.getElementById("tags_t_6").style.color="#ff6f79";
    }
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
    publishNew();
}


function createNews() {
    $.getJSON("demo.json",function (data) {
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
}function last_page_click() {
    if(page!=0)
    {
        page=parseInt(page)-1;
        $(".main_block").animate({
            top:'+=1000px'
        });
        var text="window.location.href=\"main.html?page="+page+"&selected="+selected+"&tag_sel="+tag_sel+"\"";
        var t=setTimeout(text,500);
    }

}
function next_page_click() {
    page=parseInt(page)+1;
    $(".main_block").animate({
        top:'-=1000px'
    });
    var text="window.location.href=\"main.html?page="+page+"&selected="+selected+"&tag_sel="+tag_sel+"\"";
    var t=setTimeout(text,500);
}

function getParams(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
function publishNew() {
    $.ajax({
        url: '/SwenNews/api/v1/news/news',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"title": $(".news_title").val(), "content": $(".news_content").val(),"news_type":$(".tag_text").text()}),
    })
        .done(function(data) {
            if (1==data.status) {
                toastError('创建成功！','');
                var text="window.location.href=\"main.html?page="+0+"&selected="+selected+"\"";
                var t=setTimeout(text,500);
            } else {
                toastError('创建失败！','请重试！');
                $(".new").rotate({animateTo: 0});
            }
        })
        .fail(function() {
            console.log("error")
            toastError('创建失败！','请重试！');
            $(".new").rotate({animateTo: 0});
        })
}
function getNewestNews(pageNum) {
    $.ajax({
        url: '/SwenNews/api/v1/news?page_num='+pageNum+'&news_type=all&time=1&hot=0',
        type: 'GET',
        dataType: 'json'
    })
        .done(function(data) {
            $.each(data,function (index,item) {
                if(index!='status'&&index!='error_msg')
                {
                    $(".news_block_ul").append(
                        "<li><div class='main_block' id='main_block_"+index+"'>" +"<ul><li>"+
                        "<span class='news_block_tag'>来自话题："+item.news_type+"</span><li>" +
                        "<img class=\"collect\" id='collect_"+item.id+"' onmousedown=\"collect("+item.id+","+item.flag+")\">"+
                        // "<li><span class='collect' onclick='collect("+item.id+")'id='collect_"+item.id+"'></span></li>"+
                        "<li><span class='news_block_title' onmousedown='main_block_click("+item.id+")'>"+item.title+"</span><li>" +
                        "<li><span class='news_block_content'>"+item.content+"</span><li>"+
                        "<span class='head_icon'></span>"+
                        "<span class='date_time'></span>"+
                        "<li><span class='news_block_author'>"+item.username+"</span></li>"+
                        "<li><span class='news_block_date'>"+item.datetime+"<li>"+
                        "</ul></div><li>")
                    if(!item.flag){
                        $("#collect_"+item.id).attr('src','../static/images/uncollected.png');
                    }
                    else{
                        $("#collect_"+item.id).attr('src','../static/images/collected.png');
                    }
                }
            })
        })
        .fail(function() {
            console.log("error")
        })
}
function collect(news_id,collect_flag) {
    if(login_flag){
        var collect_id="#collect_"+news_id;
        if(!collect_flag)
        {
            $(collect_id).attr('src','../static/images/collected.png');
            collected(news_id);
            var text="window.location.href=\"main.html?page="+0+"&selected="+selected+"\"";
            setInterval(text,5000);
        }
        else{
            $(collect_id).attr('src','../static/images/uncollected.png');
            uncollected(news_id);
            var text="window.location.href=\"main.html?page="+0+"&selected="+selected+"\"";
            setInterval(text,5000);
        }
    }
    else{
        toastError('收藏失败！','请先登录！');
        var text="window.location.href=\"login.html\"";
        setInterval(text,5000);
    }
}
function uncollected(news_id) {
    $.ajax({
        url: '/SwenNews/api/v1/collection',
        type: 'DELETE',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"news_id":news_id,"user_id":user_id}),
    })
        .done(function(data) {
            if (1==data.status) {
                toastError('取消收藏成功！','');
            } else {
                toastError('取消收藏失败！','请重试！');
            }
        })
        .fail(function() {
            console.log("error")
            toastError('取消收藏失败！','请重试！');
        })
}
function collected(news_id) {
    $.ajax({
        url: '/SwenNews/api/v1/collection',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"news_id":news_id,"user_id":user_id}),
    })
        .done(function(data) {
            if (1==data.status) {
                toastError('收藏成功！','');
            } else {
                toastError('收藏失败！','请重试！');
            }
        })
        .fail(function() {
            console.log("error")
            toastError('收藏失败！','请重试！');
        })
}
function getHotNews(pageNum) {
    $.ajax({
        url: '/SwenNews/api/v1/news?page_num='+pageNum+'&news_type=all&time=0&hot=1',
        type: 'GET',
        dataType: 'json'
    })
        .done(function(data) {
            $.each(data,function (index,item) {
                if(index!='status'&&index!='error_msg'){
                    $(".news_block_ul").append(
                        "<li><div class='main_block' id='main_block_"+index+"'>" +"<ul><li>"+
                        "<span class='news_block_tag'>来自话题："+item.news_type+"</span><li>" +
                        "<img class=\"collect\" id='collect_"+item.id+"' src=\"../static/images/uncollected.png\" onmousedown=\"collect("+item.id+","+item.flag+")\">"+
                        "<li><span class='news_block_title' onmousedown='main_block_click("+item.id+")'>"+item.title+"</span><li>" +
                        "<li><span class='news_block_content'>"+item.content+"</span><li>"+
                        "<span class='head_icon'></span>"+
                        "<span class='date_time'></span>"+
                        "<li><span class='news_block_author'>"+item.username+"</span></li>"+
                        "<li><span class='news_block_date'>"+item.datetime+"<li>"+
                        "</ul></div><li>"
                    );
                    if(!item.flag){
                        $("#collect_"+item.id).attr('src','../static/images/uncollected.png');
                    }
                    else{
                        $("#collect_"+item.id).attr('src','../static/images/collected.png');
                    }
                }
            })
        })
        .fail(function() {
            console.log("error")
        })
}

function getTypeNews(pageNum,newsType) {
    $.ajax({
        url: '/SwenNews/api/v1/news?page_num='+pageNum+'&news_type='+newsType+'&time=0&hot=0',
        type: 'GET',
        dataType: 'json'
    })
        .done(function(data) {
            $.each(data,function (index,item) {
                if(index!='status'&&index!='error_msg'){
                    $(".news_block_ul").append(
                        "<li><div class='main_block' id='main_block_"+index+"'>" +"<ul><li>"+
                        "<span class='news_block_tag'>来自话题："+item.news_type+"</span><li>" +
                        "<img class=\"collect\" id='collect_"+item.id+"' src=\"../static/images/uncollected.png\" onmousedown=\"collect("+item.id+","+item.flag+")\">"+
                        "<li><span class='news_block_title' onmousedown='main_block_click("+item.id+")'>"+item.title+"</span><li>" +
                        "<li><span class='news_block_content'>"+item.content+"</span><li>"+
                        "<span class='head_icon'></span>"+
                        "<span class='date_time'></span>"+
                        "<li><span class='news_block_author'>"+item.username+"</span></li>"+
                        "<li><span class='news_block_date'>"+item.datetime+"<li>"+
                        "</ul></div><li>"
                    );
                    if(!item.flag){
                        $("#collect_"+item.id).attr('src','../static/images/uncollected.png');
                    }
                    else{
                        $("#collect_"+item.id).attr('src','../static/images/collected.png');
                    }
                }
            })
        })
        .fail(function() {
            console.log("error")
        })
}
function toastError(title,message) {
    iziToast.show({
        class: 'test',
        color: '#ffffff',
        icon: 'icon-contacts',
        title: title,
        message: message,
        position: 'topCenter',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        progressBarColor: 'rgb(0, 255, 184)',
        image: '../static/images/error_dog.gif',
        imageWidth: 70,
        layout:2,
        onClose: function(){
            console.info('onClose');
        },
        iconColor: 'rgb(0, 255, 184)'
    });
}
