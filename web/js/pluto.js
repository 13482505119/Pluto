$(document).ready(function() {
    var $body = $('body');
    var message = {
        fail: '服务器错误'
    };
    
    //tips
    var $tips = $('<div class="tips"></div>');
    $body.append($tips);
    $.tips = function(text, time) {
        time = time || 3000;
        var $tip = $('<div class="tips-tip" style="display: none"></div>').html(text);
        $tips.append($tip.fadeIn());
        setTimeout(function() {
            $tip.fadeOut(function() {
                $tip.remove();
            });
        }, time);
    };

    //alert
    var alertHtml = '<div class="alert"><div class="alert-content"><div class="alert-body"><h3></h3><p></p></div><div class="alert-footer"><button class="btn btn-3d btn-large"><span>　取消　</span></button> <button class="btn btn-3d btn-large active"><span>　确定　</span></button></div></div></div>'
    $.alert = function(title, content, ok) {
        var $alert = $(alertHtml);
        $alert.find('button:contains("取消")').remove();
        $alert.find('button').click(function() {
            if ($.isFunction(ok)) {
                ok();
            }
            $alert.remove();
        });
        $alert.find('h3').html(title);
        $alert.find('p').html(content);

        $body.append($alert);
    };
    $.confirm = function(title, content, ok, cancel) {
        var $alert = $(alertHtml);
        $alert.find('button:contains("确定")').click(function() {
            if ($.isFunction(ok)) {
                ok();
            }
            $alert.remove();
        });
        $alert.find('button:contains("取消")').click(function() {
            if ($.isFunction(cancel)) {
                cancel();
            }
            $alert.remove();
        });
        $alert.find('h3').html(title);
        $alert.find('p').html(content);

        $body.append($alert);
    };

    //modal
    $.fn.modal = function(option) {
        var index = $.inArray(option, ['show', 'hide', 'toggle']);
        var modalMethods = ['addClass', 'removeClass', 'toggleClass'];
        index = index == -1 ? 0 : index;

        return this[modalMethods[index]]('in');
    };
    $('.modal').on('click', '.modal-close', function() {
        $(this).closest('.modal').removeClass('in');
    });

    var $container = $('#container'),
        $modalGuess = $('#modalGuess'),
        $modalComment = $('#modalComment');
    var guessDefault = {
            title: '',
            balance: 0,
            min: 1,
            max: 100,
            step: 1,
            value: 1,
            a: '',
            b: ''
        },
        guess = {};
    $container.on('click', '.btn-large', function() {
        guess = $.extend(guessDefault, $(this).data("data"));

        $.getJSON('ajax-balance.html', function(json) {
            guess = $.extend(guess, json);
            $modalGuess.find('a.btn-circle').removeClass('active');
            $modalGuess.find('#coinMax').text(guess.max);
            $modalGuess.find('#coinBalance').text(guess.balance);
            $modalGuess.find('#coinValue').text(guess.value);
            $modalGuess.find('.text-title').html(guess.title);

            $modalGuess.modal();
        }).fail(function() {
            $.tips(message.fail);
        });
    }).on('click', '.fa-commenting', function() {
        $modalComment.modal();
        return false;
    });
    $modalGuess.on('click', '.btn-square:has(.fa-plus)', function() {
        var value = guess.value + guess.step;
        if (value <= Math.min(guess.balance, guess.max)) {
            guess.value = value;
        }
        $modalGuess.find('#coinValue').text(guess.value);
    }).on('click', '.btn-square:has(.fa-minus)', function() {
        var value = guess.value - guess.step;
        if (value >= guess.min && value <= guess.balance) {
            guess.value = value;
        }
        $modalGuess.find('#coinValue').text(guess.value);
    }).on('click', 'a.btn-circle', function() {
        $(this).addClass('active').siblings('a').removeClass('active');
    }).on('click', '.btn-shadow', function() {
        var index = $modalGuess.find('a.btn-circle.active').index(),
            text = '支持';
        if (index == -1) {
            $.tips('请选择支持甲方还是乙方！');
        } else {
            if (index == 0) {
                text += '甲方：<strong>' + guess.a + '</strong>，';
            } else {
                text += '乙方：<strong>' + guess.b + '</strong>，';
            }
            text += '贡献 <strong class="text-number">' + guess.value + '</strong> 猜币。';
            $.confirm(guess.title, text, function() {
                $modalGuess.modal('hide');
                //todo submit
                $.tips('您的贡献提交成功！');
            }, function() {});
        }
    });

    //tabs
    $('.nav-tabs a').on('click', function() {
        var $this = $(this),
            id = $this.attr('href'),
            $li = $this.parent(),
            $pane = $(id);

        $li.addClass('active').siblings().removeClass('active');
        $pane.addClass('active').siblings().removeClass('active');

        initPullLoad('#' + $pane.find('.pull-wrapper').attr('id'));

        return false;
    }).eq(0).click();

    initPullLoad('#myguess-scroll');

    function initPullLoad(selector) {
        var $e = $(selector);

        if ($e.length != 1 || $e.hasClass('IScroll')) {
            return;
        }
        var $list = $e.find('.list-guess'),
            url = $e.data("url"),
            data = $.extend({
                page: 1
            }, $e.data("data"));

        var myIScroll = pullLoad(selector, {
            bounce: false,
            click: false,
            disableMouse: true,
            disablePointer: true,
            momentum: false,
            mouseWheel: false,
            preventDefault: false,
            scrollbars: false,
            scrollX: false,
            scrollY: false,
            fadeScrollbars: false,
            interactiveScrollbars: false,
            resizeScrollbars: false,
            //pullUpTexts: ['&nbsp;', '松开切换', ''],
            //pullDownLock: true,
            pullDownAction: function() {
                data.page = 1;
                $.get(url, data, function(html) {
                    $list.html(html);

                    myIScroll.refresh();
                }).fail(function() {
                    $.tips(message.fail);
                    myIScroll.refresh();
                });
            },
            pullUpAction: function() {
                data.page++;
                $.get(url, data, function(html) {
                    $list.append(html);

                    myIScroll.refresh();
                }).fail(function() {
                    $.tips(message.fail);
                    myIScroll.refresh();
                });
            }
        });
    }
});
