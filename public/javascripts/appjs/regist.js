var emailFormat = false;
var loginnameFormat = false;
$(document).ready(function() {
    $('#login-form').on('submit', function(event) {
        var checkResult = canRegister();
        showAlert(checkResult);
        if (checkResult == 0) {
            $.post('/register', {
                agree: $("#agree").val(),
                loginname: $("#loginname").val(),
                firstname: $("#firstname").val(),
                lastname: $("#lastname").val(),
                email: $("#email").val(),
                password: $("#password").val(),
                phoneNum: $("#phoneNum").val(),
                retype_password: $('#retype_password').val()
            }, function(data, textStatus) {
                if (textStatus == "success") {
                    if (data.code == 0) {
                        window.location.href = "http://127.0.0.1:4000/login";
                    } else {
                        showAlert(data.code);
                    }
                } else {
                    window.location.href = "http://127.0.0.1:4000/register";
                }
            })
        }
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
    })
})
$("#email").blur(function() {
    return;
    var email = $("#email").val();
    var reg = /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})[; ,])*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/;
    var result = reg.test(email);
    console.log(result);
    if (result) {
        $.post("/checkEmail", {
                email: $("#email").val()
            },
            function(data, textStatus) {
                if (data == 0) {
                    console.log("can register");
                    emailFormat = true;
                } else {
                    console.log("can not register");
                }
            })
    } else {
        console.log("can not register by RegEx check");
    }

});

$("#loginname").blur(function() {
    return;
    var loginname = $("#loginname").val();
    $.post("/checkLoginname", {
            loginname: loginname
        },
        function(data, textStatus) {
            if (data == 0) {
                loginnameFormat = true;
            } else {
                console.log("can not register");
            }
        }
    )

});

function showAlert(code) {
    var tips = "";
    switch (code) {
        case 1:
            tips = '请同意条款和协议';
            break;
        case 2:
            tips = '请输入全名';
        case 3:
            tips = '请输入相同密码';
            break;
        case 4:
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

function canRegister() {
    return 0;
    var firstname = $("#firstname").val();
    var lastname = $("#lastname").val();
    var password = $("#password").val();
    var pswRepeat = $("#retype_password").val();
    var agree = $("#agree").val();
    if (agree == 'on') {
        return 1;
    }
    if (firstname.lenght < 2) {
        return 2;
    }
    var regExp = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}');
    if (!regExp.test(password)) {
        return 4;
    }
    if (password != pswRepeat) {
        return 3;
    }
    if (!emailFormat) {
        return 5;
    }
    return 0;
}