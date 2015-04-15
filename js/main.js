---
campaignId: md-hogan-vote
---

jQuery( document ).ready(function( $ ) {
    var trackEvent = function(ev) {
        window['optimizely'] = window['optimizely'] || [];
        window.optimizely.push(["trackEvent", ev]);

        ga('send', 'event', ev);
    };

    var fieldError = function(name, text) {
        var f = $('input[name="'+name+'"]');
        f.addClass('ak-error');

        var err = $('ul#ak-errors');
        err.append('<li>'+text+'</li>');
        return false;
    };

    var validatePhone = function(num) {
        num = num.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
        num = num.replace("+", "").replace(/\-/g, '');

        if (num.charAt(0) == "1")
            num = num.substr(1);

        if (num.length != 10)
            return false;

        return num;
    };

    onWidgetSubmit = function(e) {
//        e.preventDefault();

        // clear validation errors
        $('form[name="act"] input').removeClass('ak-error');
        $('ul#ak-errors').empty();

        var email = $('#id_email').val();
        if (!validateEmail(email)) {
            return fieldError('email','Please enter a valid email address');
        }

        var phone = $('#id_phone').val();
        if (!validatePhone(phone)) {
            return fieldError('phone','Please enter a valid US phone number');
        }

        var data = {
            campaignId: '{{page.campaignId}}',
            userPhone: validatePhone(phone)
        };

        $.ajax({
            url: 'https://call-server-coc.herokuapp.com/create',
            type: "get",
            dataType: "json",
            data: data,
            success: function(res) {
                trackEvent('call');
                console.log('Placed call: ', data, res);
            }
        });
        showOverlay();
        return true;
    };
    $('#phoneForm').submit(onWidgetSubmit);

    $('a.twitter').click(function(e) {
        trackEvent('share');
    });

    $('.a.facebook').click(function(e) {
        trackEvent('share');
    });

    $('a.close').click(function (e){
        $('.overlay').removeClass('visible');
    });

});

function showOverlay() {
    $('.overlay').css('display', 'table');
        setTimeout(function() {
            $('.overlay').addClass('visible');
            setTimeout(function() {
                $('.overlay .modal .inner').addClass('visible');
            }, 10);
        }, 100);
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}