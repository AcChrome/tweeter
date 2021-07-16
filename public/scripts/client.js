/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const $form = $("#submit-tweet");
const $tweetBox = $("#tweet-text");
const $tweetsContainer = $("#tweets-container");

// Escape creates  safe text DOM node to prevent cross-site.
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = (tweet) => {
  const safeHTML = `${escape(tweet.content.text)}`;
  let $tweet = $(`
  <br>
  <article class="tweet-header">
  <h3 class="handle">${tweet.user.handle}</h3>
  <p id="name"><img class="avatars" src="${tweet.user.avatars}"/>${
    tweet.user.name
  }</p>
  <br>
  <h3 class="text">${safeHTML}</h3>
  <a class="time"><bold>${timeago.format(tweet.created_at)}</bold></a>
  <div class="icon">
    <i class="fas fa-flag"></i>
    <i class="fas fa-retweet"></i>
    <i class="fas fa-heart"></i>
  </div>
</article>
<br>
  `);

  return $tweet;
};

const renderTweets = (tweets) => {
  $tweetsContainer.empty();
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $tweetsContainer.prepend($tweet);
  }
};

const loadTweets = () => {
  $.get("/tweets").then((data) => {
    renderTweets(data);
  });
};

loadTweets();

$form.on("submit", function (event) {
  event.preventDefault();

  const text = $(this).serialize();
  const $error = $("#error");
  const tweetChars = $tweetBox.val();

  if (tweetChars === "" || $.trim(tweetChars) === "" || tweetChars === null) {
    $error.text("⛔️ Your tweet cannot be empty!");
    $error.slideDown("fast").css({ display: "flex"});
   
  } else if (tweetChars.length > 140) {
    $error.text("⛔️ Your tweet is too long!");
    $error.slideDown("fast").css({ display: "flex"});
  } else {
    $.post("/tweets", text, (response) => {
      console.log(response);
      $error.slideDown("fast").css({ display: "none"});
      $form.trigger("reset");
      loadTweets();
    });
  }
});


