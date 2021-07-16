/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// DATA
const $form = $("#submit-tweet");
const $tweetBox = $("#tweet-text");
const $tweetsContainer = $("#tweets-container");
const $writeTweet = $("#arrow");

//FUNCTIONs

// Escape creates safe text DOM node to prevent cross-site scripting
// Return the user created Tweet

const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Creates HTML template for tweet App
// tweet is the parameter we using for the data base
// make use of the escape function to create safe text 
// Finally returns a Tweet with the user handle, avatar, name, message, and time created.

const createTweetElement = (tweet) => {
  const safeHTML = `${escape(tweet.content.text)}`;
  let $tweet = $(`
  <br>
  <article class="tweet"> 
  <h3 class="handle">${tweet.user.handle}</h3>
  <p id="name"><img class="avatars" src="${tweet.user.avatars}"/>${
    tweet.user.name
  }</p>
  <br>
  <body>
  <h3 class="text">${safeHTML}</h3>
  </body>
  <footer>
  <a class="time"><bold>${timeago.format(tweet.created_at)}</bold></a>
  <div class="icon">
    <i class="fas fa-flag"></i>
    <i class="fas fa-retweet"></i>
    <i class="fas fa-heart"></i>
  </div>
  </footer>
</article>
<br>
  `);

  return $tweet;
};

// Renders tweets for user to see
// Tweets is the parameter we using to get database

const renderTweets = (tweets) => {

  // Use empty to clear duplicated tweets
  $tweetsContainer.empty();
  for (const tweet of tweets) {

    // Prepend renders tweets in descending order
    const $tweet = createTweetElement(tweet);
    $tweetsContainer.prepend($tweet);
  }
};

// Makes a GET request to use the action /tweet directly with an AJAX
// Renders onto a page once GET request is successful

const loadTweets = () => {
  $.get("/tweets")
  .then((data) => {
    renderTweets(data);
  });
};

// Handles user tweet submission with a POST request
// event.preventDefault() is used to prevent reload and redirect of the page
// Conditions will prompt an error and stop invalid input from being submitted

$form.on("submit", function (event) {
  event.preventDefault();

  const text = $(this).serialize();
  const $error = $("#error");
  const tweetChars = $tweetBox.val();

  if (tweetChars === "" || $.trim(tweetChars) === "" || tweetChars === null) {
    $error.text("⛔️ Your tweet cannot be empty!");
    $error.slideDown("fast").css({ display: "flex"}).delay(3500).fadeOut('fast');
   
  } else if (tweetChars.length > 140) {
    $error.text("⛔️ Your tweet is too long!");
    $error.slideDown("fast").css({ display: "flex"}).delay(3500).fadeOut('fast');

  } else {
    $.post("/tweets", text, (response) => {
      $form.trigger("reset");
      loadTweets();
    });
  }
});

// Bring user to textbox whenever "write a new tweet" is clicked

const writeTweet = function() {
  $writeTweet.on('click', function() {
    $tweetBox.focus();
  });
};

$(document).ready(() => {
  writeTweet();
  loadTweets();
})