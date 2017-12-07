$(document).ready(function() {
    //modal
    $.fn.modal = function (option) {
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
    $container.on('click', '.btn-large', function() {
        //title, max, min
        $modalGuess.modal();
    });
    $container.on('click', '.fa-commenting', function () {
        $modalComment.modal();
        return false;
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
            pullDownAction: function () {
                data.page = 1;
                $.get(url, data, function (html) {
                    $list.html(html);

                    myIScroll.refresh();
                }).error(function () {
                    //todo alert
                    myIScroll.refresh();
                });
            },
            pullUpAction: function () {
                data.page++;
                $.get(url, data, function (html) {
                    $list.append(html);

                    myIScroll.refresh();
                }).error(function () {
                    //todo alert
                    myIScroll.refresh();
                });
            }
        });
    }
});
