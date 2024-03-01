// Array to hold questions and answers
let questionObject = [];
// Array to store unique random numbers
let randomNumberArray = [];

// Push unique random numbers for later use
while (randomNumberArray.length < 10) {
  let randomNum = Math.floor(Math.random() * 19);
  if (!randomNumberArray.includes(randomNum)) {
    randomNumberArray.push(randomNum);
  }
}

// Select the question element
let questionElement = document.querySelector(".question");
let answerElements = document.querySelectorAll(".answer");
let answersContainer = document.querySelectorAll(".answers");
// Retrieve the current level from sessionStorage, default to 1 if not found
let levelCount = sessionStorage.getItem("level")
  ? parseInt(sessionStorage.getItem("level"))
  : 1;
// Index to keep track of the current question
let questionIndex = 0;

// Function to fetch data from a JSON file based on the level number
function getJsonFile(levelNumber) {
  fetch(`./level-${levelCount}.json`)
    .then((result) => {
      let data = result.json();
      console.log(data);
      return data;
    })
    .then((data) => {
      // Populate questionObject with data from the JSON file
      randomNumberArray.map((randomNum, index) =>
        questionObject.push(data[randomNumberArray[index]])
      );
      // Display initial question and answers
      displayQuestionAndAnswer(questionIndex);
      console.log(questionObject);
      // Event listener for handling clicks on answers
      answersContainer[0].addEventListener("click", function (event) {
        if (
          event.target.classList.contains("answer") &&
          event.target.textContent.trim() !== ""
        ) {
          if (
            event.target.textContent ==
            Object.values(questionObject[questionIndex])[5]
          ) {
            handleAnswer(true, event.target);
          } else {
            handleAnswer(false, event.target);
          }
        }
      });
    });
}

// Call the function to fetch JSON file for the current level
getJsonFile(levelCount);

// Score initialization
let score = 0;

// Select the element to display the score
let scoreDisplay = document.querySelector(".scorecount");
// Select the quiz box element
let quizBox = document.querySelector(".quiz-box");
// Select all level images
let levelImages = document.querySelectorAll(".level");
// Set the src attribute of level images based on the current level
Array.from(levelImages).forEach((element) => {
  element.setAttribute("src", `level/level-${levelCount}.png`);
});

function handleAnswer(correct, selectedTarget) {
  let audio = new Audio(correct ? "correct.mp3" : "wrong.mp3");
  selectedTarget.style.backgroundColor = correct ? "green" : "red";
  selectedTarget.style.color = "white";
  score = correct ? score + 4 : score - 2;
  quizBox.classList.add("pointer-events");
  timer = 0;

  if (correct) {
    setTimeout(() => {
      if (questionIndex != 9) {
        questionIndex++;
        displayQuestionAndAnswer(questionIndex);
        quizBox.classList.remove("pointer-events");
      } else {
        quizBox.classList.add("pointer-events");
        checkForLevel(questionIndex);
      }
    }, 700);
  } else {
    quizBox.classList.add("pointer-events");
    setTimeout(() => {
      if (questionIndex != 9) {
        questionIndex++;
        displayQuestionAndAnswer(questionIndex);
        quizBox.classList.remove("pointer-events");
      } else {
        quizBox.classList.add("pointer-events");
        checkForLevel(questionIndex);
      }
    }, 700);
  }

  scoreDisplay.textContent = score;
  startTimer(30 * 1, display);
  audio.play();
  setTimeout(() => {
    selectedTarget.style.backgroundColor = "white";
    selectedTarget.style.color = "#031e4cc4";
  }, 700);
}

// Select the element to display the question count
let questionCount = document.querySelector(".question-count");
// Set the initial time
let time = 30 * 1;

// Display questions and answers
function displayQuestionAndAnswer(number) {
  let questionGroup = Object.values(questionObject[number]);

  // if the number of quetion =10
  if (number === 10) {
    timer = 0;
    quizBox.classList.add("pointer-events");
  }

  questionCount.textContent = `${number + 1}/10`;
  questionElement.textContent = questionGroup[0];
  // remove previous answer spans
  let previousAnswers = document.querySelectorAll(".answer");
  previousAnswers.forEach((answer) => answer.remove());
  // add new answer spans
  for (let i = 0; i < 4; i++) {
    let answer = document.createElement("span");
    answer.classList.add("answer");
    answer.textContent = questionGroup[i + 1];
    Array.from(answersContainer)[0].appendChild(answer);
  }
  // insert question answers for new cretead span
  Array.from(answerElements).forEach((ele, index) => {
    ele.textContent = questionGroup[index + 1];
  });
}

// Next button function
let next = document.querySelector(".next");
next.addEventListener("click", function () {
  if (questionIndex != 9) {
    score -= 2;
    scoreDisplay.textContent = score;
    let audio = new Audio("wrong.mp3");
    audio.play();
    setTimeout(() => {
      questionIndex++;
      displayQuestionAndAnswer(questionIndex);
    }, 700);
  }
});

// Help button function
let help = document.querySelector(".help");

help.addEventListener("click", helpClickHandler);

function helpClickHandler() {
  let correctAnswer = Object.values(questionObject[questionIndex])[5];
  help.style.backgroundColor = "grey";
  help.classList.add("pointer-events");
  let deletedAnswers = [];
  let numberOfAnswersToDelete = 2;
  let count = 0;

  while (count < numberOfAnswersToDelete) {
    let indexToDelete = Math.floor(Math.random() * 3);

    if (
      answersContainer[0].children[indexToDelete].textContent !==
        correctAnswer &&
      !deletedAnswers.includes(indexToDelete)
    ) {
      answersContainer[0].children[indexToDelete].remove();
      deletedAnswers.push(indexToDelete);
      count++;
    }
  }
  help.removeEventListener("click", helpClickHandler);
}

// Timer function
let display = document.querySelector(".timer");

var timer = time,
  minutes,
  seconds;

function startTimer(duration, display) {
  var intervalId = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(intervalId);
      timer = duration;
    }
    if (questionIndex == 10) {
      clearInterval(intervalId);
      timer = 0;
      checkForLevel(questionIndex);
      console.log(questionIndex);
    }
    // Repeat time if it ends
    if (timer == 0) {
      console.log("the time end");
      console.log(questionIndex);
      if (questionIndex != 9) {
        setTimeout(() => {
          questionIndex++;
          displayQuestionAndAnswer(questionIndex);
          startTimer(30 * 1, display);
        }, 700);
      } else {
        console.log("this is working");
        checkForLevel(questionIndex);
      }
    }
  }, 1000);
}

// Start the timer
startTimer(30 * 1, display);

// Function to check for level completion
let popup = document.querySelector(".popup");
function checkForLevel(number) {
  let congrats = document.querySelector(".congrats");
  let span = document.querySelector(".popup").children[2];

  if (score >= 10 && number == 9 && levelCount != 4) {
    levelCount++;
    Array.from(levelImages).forEach((element) => {
      element.setAttribute("src", `level/level-${levelCount}.png`);
    });
    popup.style.display = "flex";
    span.textContent = `لقد انتقلت إلى المرحلة ${levelCount}`;
    stars();
    let audio = new Audio(`applause.mp3`);
    audio.play();
    setTimeout(() => {
      console.log(levelCount);
      sessionStorage.setItem("level", levelCount);
      window.location.reload();
    }, 4000);
  } else if (number == 9 && score < 10) {
    popup.style.display = "flex";
    popup.children[4].remove();
    let gameOverSpan = document.querySelector(".game-over");
    gameOverSpan.style.display = "block";
    congrats.children[0].textContent = "حاول مرّة أُخرى";
    congrats.children[0].style.color = "red";
    gameOver();
    span.textContent = "لم تتخطى هذه المرحلة لأن مجموع النقاط أقل من 10";
    span.style.fontSize = "16px";
    setTimeout(() => {
      sessionStorage.setItem("level", levelCount);
      window.location.reload();
    }, 4000);
  }
  if (levelCount == 4) {
    popup.style.display = "flex";
    congrats.children[0].textContent = "رائع جداً !";
    span.textContent = "لقد اكملت جميع المراحل";
    popup.children[4].remove();
    setTimeout(() => {
      sessionStorage.setItem("level", 1);
      window.location.reload();
    }, 4000);
  }
}

// Function to handle game over animation
function gameOver() {
  setInterval(() => {
    document.querySelector(".game-over").innerHTML = "Game Over";

    setTimeout(function () {
      document.querySelector(".game-over").innerHTML = "";
    }, 500);
  }, 1000);
}

// Function to display stars animation
function stars() {
  var numberOfStars = 30;
  var congrats = document.querySelector(".congrats");

  setInterval(function () {}, 1000); // Every second
  setTimeout(() => {
    animateBlobs();
  }, 1000);
  animateBlobs();

  function animateBlobs() {
    var xSeed = _.random(100, 380);
    var ySeed = _.random(120, 170);

    document.querySelectorAll(".blob").forEach(function (blob) {
      var speed = _.random(1, 5);
      var rotation = _.random(5, 100);
      var scale = _.random(0.8, 1.5);
      var x = _.random(-xSeed, xSeed);
      var y = _.random(-ySeed, ySeed);

      gsap.to(blob, {
        duration: speed,
        x: x,
        y: y,
        ease: "power1.out",
        opacity: 0,
        rotation: rotation,
        scale: scale,
        onStart: function () {
          blob.style.display = "block";
        },
        onComplete: function () {
          blob.style.display = "none";
        },
      });
    });
  }

  for (var i = 0; i < numberOfStars; i++) {
    var blob = document.createElement("div");
    blob.className = "blob fa fa-star " + i;
    blob.style.transform = "translate(-20px,-50px)";
    congrats.appendChild(blob);
  }
}

// Call the stars animation function
stars();
