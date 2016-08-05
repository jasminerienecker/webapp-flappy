/*
jQuery("#scoresbtn").on("click", function() {
  jQuery("#content").empty();

});
*/

jQuery("#scoresbtn").on("click", function() {
  jQuery("#scoreBoard").toggle();
});


jQuery("#creditsbtn").on("click", function() {
  jQuery("#content").empty();
});

jQuery("#creditsbtn").on("click", function() {
  jQuery("#creditsBoard").toggle();
  jQuery("#content").append(
    "<div>" + "Game and website created by Jasmine Rienecker" + "</div>"
  );;
});

jQuery("#helpbtn").on("click", function() {
  jQuery("#content").empty();
  jQuery("#content").append(
    "<ul>" +
      "<li>" + "Press SPACE to flap your wings" + "</li>" +
      "<li>" + "Avoid the incoming pipes" + "</li>" +
      "<li>" + "Fish decrease the gravity of the game while sharks increase it" + "</li>" +
      "<li>" + "Collect coins to increase your score" + "</li>" +
    "</ul>"
  );
});

function registerScore(score) {
  var playerName = prompt("What's your name?");
  var scoreEntry = "<li>" + playerName + ":" + score.toString() + "</li>";
  jQuery("#scoreBoard").append(
    scoreEntry
  );
}
