$(document).ready(function() {

    var $modal = $('.modal');

    $('.section-list').on('click', '.btn-large', function() {
        $modal.addClass('in');
    });

    $modal.on('click', '.modal-close', function() {
        $modal.removeClass('in');
    });
});
