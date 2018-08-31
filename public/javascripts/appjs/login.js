$(function() {
    $("#login-form").on('submit', function(event) {
        var code = checkLogin();
        if (code == 0) {
            $.post('/login', {
                loginWay: $('loginWay').val(),
                password: $('password').val()
            }, function(data, textStatus) {
                if (textStatus == "success") {
                    if (data.code == 0) {
                        window.location.href = "http://127.0.0.1:4000/main";
                    } else {
                        showAlert(data.code);
                    }
                } else {
                    window.location.href = "http://127.0.0.1:4000/login";
                }
            })
        } else {
            switch (code) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        }
        return false;
    })
});

function showAlert(code) {
    var tips = "";
    switch (code) {
        case 1:
            tips = '密码错误，重新输入密码';
            break;
        case 2:
            tips = '账号未注册';
        case 3:
            tips = '账号有问题';
            break;
        case 4:
            tips = '服务器出错';
            break;
        case 6:
            tips = '密码中必须包含字母、数字、特称字符，至少8个字符，最多30个字符';
            break;
        case 5:
            tips = '请输入正确的邮箱账号'
            break;
    }
    if (tips.length > 0) {
        alert(tips);
    }
}

var reg = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}/

function checkLogin() {
    var loginWay = $("loginWay").val();
    if (loginWay.length < 5) {
        return 1;
    }
    var psw = $("password").val();
    if (psw.length == 0) {
        return 2;
    } else if (reg.test(psw) == false) {
        return 3;
    }
    return 0;
}