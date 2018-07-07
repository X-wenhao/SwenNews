var selected = 1
var edit_flag=false;
$(document).ready(function(){
    var slide_flag=false;
    get_user_info();
    get_my_news();
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
});
function get_my_news() {
    $.ajax({
        url: '/SwenNews/api/v1/news/list',
        type: 'GET',
        dataType: 'json'
    })
        .done(function(data) {
            $.each(data,function (index,item) {
                if(index!='status'&&index!='error_msg')
                {
                    $(".list").append(
                    "<li><span class='my_news_list' onclick='my_news_click("+item.id+")'>"+item.title+"</span></li>"
                )
                }
            })
        })
        .fail(function() {
            console.log("error")
        })
}
function my_news_click() {
    var text="window.location.href=\"detail.html?id="+newsid+"\"";
    var t=setTimeout(text,500);
}
function get_user_info() {
    $.ajax({
        url: '/SwenNews/api/v1/session',
        type: 'GET',
        dataType: 'json'
    })
        .done(function(data) {
            $(".name_user").text(data.username);
            $(".email_user").text(data.mail);
            $(".picture_frame").css('background-image',data.avatar);
        })
        .fail(function() {
            console.log("get user information error")
        })
}
function news_list() {
    $(".news_list").append("<li>新闻1</li>")
}
function mynews_mouse_cover() {
    if(1!=selected){
        $(".my_news").css('background-image','url(../static/images/buttonDown.png)')
    }
}

function mynews_mouse_out() {
    if(1==selected){
        $(".my_news").css('background-image','url(../static/images/selectedBg.png)')
    }
    else {
        $(".my_news").css('background-image','url(../static/images/blank.png)')
    }
}

function mynews_mouse_click(){
    selected=1;
    $(".my_favor").css('background-image','url(../static/images/blank.png)')
}

function exit_mouse_cover() {
    if(2!=selected){
        $(".my_favor").css('background-image','url(../static/images/buttonDown.png)')
    }
}

function exit_mouse_out() {
    if(2==selected){
        $(".my_favor").css('background-image','url(../static/images/selectedBg.png)')
    }
    else {
        $(".my_favor").css('background-image','url(../static/images/blank.png)')
    }
}

function exit_mouse_click(){
    selected=2;
    $(".my_news").css('background-image','url(../static/images/blank.png)')
}
function swen_news_click(){
    window.location.href="main.html"
}
function edit_info() {
    if(!edit_flag){
        $(".shelter_user_center").css('display','block');
        $(".info_edit").animate({
            top:'+=1100px'
        });
        edit_flag=true;
    }
    else
    {
        $(".shelter_user_center").css('display','none');
        $(".info_edit").animate({
            top:'-=1100px'
        });
        edit_flag=false;
    }
}

function keep_data() {

    $(".shelter_user_center").css('display','none');
    $(".info_edit").animate({
        top:'-=1100px'
    });
    edit_flag=false;
    var text="window.location.href=\"user_center.html\"";
    var t=setTimeout(text,500);
    saveInfo();
}

function previewHandle(fileDOM) {
    var file = fileDOM.files[0], // 获取文件
        imageType = /^image\//,
        reader = '';

    // 文件是否为图片
    if (!imageType.test(file.type)) {
        alert("请选择图片！");
        return;
    }
    // 判断是否支持FileReader
    if (window.FileReader) {
        reader = new FileReader();
    }
    // IE9及以下不支持FileReader
    else {
        alert("您的浏览器不支持图片预览功能，如需该功能请升级您的浏览器！");
        return;
    }

    // 读取完成
    reader.onload = function (event) {
        // 获取图片DOM
        var img = document.getElementById("user_image");
        // 图片路径设置为读取的图片
        var txt=event.target.result;
        img.src = txt;
    };
    reader.readAsDataURL(file);
}

function shelter_click() {
    $(".shelter_user_center").css('display','none');
    $(".info_edit").animate({
        top:'-=1100px'
    });
    edit_flag=false;
}

function saveInfo() {
    $.ajax({
        url: '/SwenNews/api/v1/user',
        type: 'PUT',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"username": $(".user_name").val()}),
    })
        .done(function(data) {
            if (!data.result) {
                alert("注册成功")
            } else {
                alert("注册失败")
            }
        })
        .fail(function() {
            console.log("error")
        })

    $.ajax({
        url: '/SwenNews/api/v1/avatar',
        type: 'PUT',
        contentType: false,
        data: new FormData($("#uploadForm")[1]),
        processData:false
    })
        .done(function(data) {
            if (!data.result) {
                alert("保存成功")
            } else {
                alert("保存失败")
            }
        })
        .fail(function() {
            console.log("error")
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