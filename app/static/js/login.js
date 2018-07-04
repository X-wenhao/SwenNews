function signIn(){
    var loginName = $("#loginName"),password = $("#Password");
    var loginName = loginName.val(),password = password.val();
    $.post("url",{
            username:loginName,
            password:password
        },
        function(data,status){
            alert("数据: \n" + data + "\n状态: " + status);
        });
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





