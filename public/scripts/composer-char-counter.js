const $tweetText = $('#tweet-text');

//Character counter function, if exceeds limit, it will go red.

const charCount = () => {

  $tweetText.on('input', function() {
    const max = 140 - $(this).val().length;
    const count = $(this).parent().find('#counter');
    count.val(max);
    if (max < 0) {

      count.addClass('limit');
    } else {

      // Word count will stay red when below limit again without this condition.
      count.removeClass('limit');
    }
  });
};

$(document).ready(function() {
  charCount();
});