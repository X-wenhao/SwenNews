function signIn(){
    var loginName = $("#loginName"),password = $("#Password");
    var loginName = loginName.val(),password = password.val();
    $.ajax({
        url: '/SwenNews/api/v1/session',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"username": loginName, "password": password}),
    })
        .done(function(data) {
            if (!data.result) {
                window.location.href="main.html"
            } else {
                toastError("密码或用户名错误")
            }
        })
        .fail(function() {
            console.log("error")
        })

}

// 错误信息提醒
//
//监听回车键提交
$(function(){
    document.onkeydown=keyDownSearch;
    function keyDownSearch(e) {
        // 兼容FF和IE和Opera
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13) {
            $('#submit').click();//具体处理函数
            return false;
        }
        return true;
    }
});
function jump(url) {
    window.location.href=url;
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
        image: '../static/images/error_cat.gif',
        imageWidth: 70,
        layout:2,
        onClose: function(){
            console.info('onClose');
        },
        iconColor: 'rgb(0, 255, 184)'
    });
}