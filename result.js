const quit = document.getElementById("quiter");

quit.onclick = () =>{
  location.href = "index.html";
};

const next = document.getElementById("next");

next.onclick = () =>{

  location.href = "game-play.html";
};

let score = localStorage.getItem('score');

    // Display the score on the page
    document.getElementById('displayScore').innerText = score;

    document.addEventListener("DOMContentLoaded", function () {
    // Get the score element
    var displayScore = document.getElementById("displayScore");
      
    // Get the h1 element
    var resultMessage = document.querySelector("h1");
      
    // Set up phrases for winning and losing
    var winningPhrases = [
        "Congratulations, space warrior! You are victorious!",
        "Incredible job! You conquered the galaxy!",
        "You're a true space hero! Well done!"
    ];
      
    var losingPhrases = [
        "Better luck next time, space warrior.",
        "Don't give up! The stars await your return.",
        "It's okay, space adventures have their ups and downs."
    ];
      
    // Get the score value
    var score = parseInt(displayScore.innerText);
      
    // Determine whether the player won or lost
    if (score >= 10000) {
    // Display a random winning phrase
        resultMessage.textContent = getRandomPhrase(winningPhrases);
    }
    else {
    // Display a random losing phrase
        resultMessage.textContent = getRandomPhrase(losingPhrases);
    }
      
    // Function to get a random phrase from an array
    function getRandomPhrase(array) {
        var randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }
});
      