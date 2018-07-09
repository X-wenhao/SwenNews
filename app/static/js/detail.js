var selected=1;
var id=-1;
var login_flag=false;
var extra=0;
var extra_2=0;
var comment_amount=0;
var news_id=-1;
$(document).ready(function(){
    var slide_flag=false;
    var load_flag=false;
    id=parseInt(getParams("id"));
    get_user_info();
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
    t=setTimeout(getNews(load_flag),500)
    //t=setTimeout(load_(load_flag),0)
});
function replace_br(str) {
    var s=str.toString().replace(/\r\n\r\n/g, '<br/>');
    return s;
}
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
function getNews(load_flag) {

    $.ajax({
        url: '/SwenNews/api/v1/news/'+id+'',
        type: 'GET',
        dataType: 'json'
    })
    .done(function(data) {
            console.log(data.id);
            news_id=data.id;
            var s=replace_br(data.content);
            extra=data.content.toString().split("\r\n\r\n").length;
            var array=data.content.toString().split("\r\n\r\n")
            for(var i=0;i<array.length;i++){
                extra_2=extra_2+parseInt(array[i].length/40);
            }
            $.each(data.comments,function (index,item) {
                comment_amount=comment_amount+1;

            })
            load(load_flag,data.news_type,data.title,s,data.username,data.datetime,data.comments);
        })
        .fail(function() {
            console.log("error")
        })
}
function load(load_flag,news_type,title,content,username,datetime,comments) {
    if(!load_flag)
    {
        $(".main_in_main").append(
            "<ul><li>"+
            "<span class='news_type'>来自话题："+news_type+"</span>" +
            "<span class='head_icon'></span>"+
            "<span class='date_time_pic'></span>"+
            "<span class='comment_pic'onclick='comment_click()'></span>"+
            "<span class='comment_amount' onclick='comment_click()'>"+comment_amount+"条评论</span>"+
            "<span class='user_name'>"+username+"</span>"+
            "<span class='date_time'>"+datetime+"</span>"+
            "<li><span class='news_title'>"+title+"</span><li>" +
            "<li><span class='news_content'>"+content+"</span><li>"+
            "</ul>"
        )
            .animate({
            top:'-=600px'
        });
        $.each(comments,function (index,item) {
            $(".comment_ul").append(
                "<li class=\"comment_li\">" +
                " <img src="+item.avatar+" class=\"comment_head_icon\">" +
                " <span class=\"comment_user_name\">"+item.user_name+"</span><br>" +
                "<span class=\"comment_content\">"+item.content+"</span>" +
                "</li>"
            )
        })
        //var extra=$(".news_content").text().split('<br/>').length;
        var count=$(".news_content").text().length
        var height=137+37*(extra+extra_2);
        $(".date_time_pic").css('margin-top',height+27);
        $(".head_icon").css('margin-top',height+27);
        $(".comment_pic").css('margin-top',height+27);
        $(".comment_amount").css('margin-top',height+19);
        $(".date_time").css('margin-top',height+19);
        $(".user_name").css('margin-top',height+17);
        // $(".main_in_main").css('height',height+70);
        load_flag=true;
        var comment_extra=89*comment_amount;
        var comment_height=height+116+comment_extra;
        // $(".main_in_main").css('height',comment_height+300);
        $(".main").css('height',comment_height+240);
        $(".comment_btn").css('margin-top',comment_extra+50);
        $(".comment_text").css('margin-top',comment_extra+50);
        $(".comment_block").css('height',120+comment_extra);
    }
}
function load_(load_flag) {
    if(!load_flag)
    {
        $(".main_in_main")
            .animate({
                top:'-=600px'
            });
        load_flag=true;
    }
    s=replace_br($(".news_content").html());
    alert(s)
    $(".news_content").html(s);
    var count=$(".news_content").text().length
    var height=137+37*(count/40);
    $(".date_time_pic").css('margin-top',height+27);
    $(".head_icon").css('margin-top',height+27);
    $(".date_time").css('margin-top',height+19);
    $(".user_name").css('margin-top',height+17);
    // $(".main_in_main").css('height',height+70);
    // $(".main").css('height',height+240);
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
function user_center_click() {
    window.location.href="user_center.html"
}
function my_news_click() {
    window.location.href="user_center.html"
}
function comment_confirm() {
    // if(-1==$(".comment_block").css('z-index')){
    //     $(".comment_block").css('z-index',100);
    // }
    // else{
    //     $(".comment_block").css('z-index',-1);
    // }
    if(login_flag){
        comment();
    }
    else{
        toastError('评论失败！','请先登录！');
        var text="window.location.href=\"login.html\"";
        setInterval(text,5000);
    }
    $(".comment_block").slideToggle("fast");
}
function comment() {
    $.ajax({
        url: '/SwenNews/api/v1/comment',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"content": $(".comment_text").val(), "news_id":news_id,"user_id":user_id}),
    })
        .done(function(data) {
            if (1==data.status) {
                toastError('评论成功！','');
            } else {
                toastError('评论失败！','请重试！');
            }
        })
        .fail(function() {
            console.log("error")
            toastError('评论失败！','请重试！');
        })
}
function comment_click() {
    // if(-1==$(".comment_block").css('z-index')){
    //     $(".comment_block").css('z-index',100);
    // }
    // else{
    //     $(".comment_block").css('z-index',-1);
    // }
    $(".comment_block").slideToggle("fast");
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
        layout: 2,
        onClose: function () {
            console.info('onClose');
        },
        iconColor: 'rgb(0, 255, 184)'
    });
}