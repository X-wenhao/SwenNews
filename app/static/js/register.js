

function checkUsername(us){
    if(us.length>5&&us.length<16){

        return true;
    }
    toastError("用户名长度应为6到16","请重试");
    return false;
}

function checkPwd(password){
    if(password.length>5&&password.length<16){

        return true;
    }
    toastError("密码长度应为6到16","请重试");
    return false;
}

function  checkEmail(email){
    if (email != "") {
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        var isok= reg.test(email );
        if (isok) {
            return true;
        } else {
            toastError("邮箱格式错误","请重试");
            return false;
        }
    };
}

function checkPwdAgain(pwdAgain,password){
    if(pwdAgain==password){
        return true;
    }
    toastError("两次密码不一致","请重试");

return false;
}
function check_if_exist(username,email) {
    $.ajax({
        url: '/SwenNews/api/v1/user?username='+username+'&mail='+email,
        type: 'GET',
        dataType: 'json',
    })
        .done(function(data) {
            if(1==data.status)
            {
                if(data.exist){
                    alert("exist!");
                }
            }
        })
        .fail(function() {
            console.log("get user information error")
        })
}
function register(){
    var username = $("#loginName").val();
    var password = $("#password").val();
    var email = $("#email").val();
    check_if_exist(username,email);
    var pwdAgain = $("#passwordAgain").val();
    var isRight= checkUsername(username)&&checkEmail(email)&&checkPwd(password)&&checkPwdAgain(pwdAgain);
    if(isRight) {
        $.ajax({
            url: '/SwenNews/api/v1/user',
            type: 'POST',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({"username": username,"mail":email, "password": password}),
        })
            .done(function(data) {
                if (!data.result) {
                    alert("注册成功")
                    window.location.href="tips.html";
                } else {
                    alert("注册失败")
                }
            })
            .fail(function() {
                console.log("error")
            })
        // }
    }
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


// $(function () {
//     if((!$("#loginName").hasFocus())||(!$("#password").hasFocus())||(!$("#passwordAgain").hasFocus())||(!$("#email").hasFocus())){
//         preCheck();
//     }
// })
function confirm(index){
    if(1==index)
    {
        window.location.href="tips.html"
    }
    else{
        alert("注册失败！");
    }
}