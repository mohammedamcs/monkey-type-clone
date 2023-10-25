import { initTest, resetTestWordsAndLetters, testLetters } from "./initTest.js";
import { testConfig } from "./testConfig.js";

// Queries
const typingTest = document.querySelector(".typing-test");
const testContainer = document.querySelector(".test");
const testText = document.querySelector(".test-text");
const userInput = document.getElementById("userInput");
const testInfo = document.querySelector(".time-word-info");
const testResult = document.querySelector(".test-results");
const testConfiguration = document.querySelector(".test-config");
const startingTextContainer = document.querySelector(".starting-text");
const textOverlay = document.querySelector(".overlay");
const wordPerMinuteContainer = document.querySelector(".wpm");
const accContainer = document.querySelector(".acc");
const testTypeResultInfo = document.querySelector(".test-type");
const timeInfoContainer = document.querySelector(".time");
const startBtn = document.getElementById("startBtn");

// Globals
let currentIndex = 0;
let userInputLetters = [];
let wrongLetters = [];
let timer;
let startDuration, endDuration, duration;
let numberOfWords = 0;
let allowUserInput = true;
let testStarted = false;

// Event Listeners
startBtn.addEventListener("click", () => {
  if (!testStarted) {
    typingTest.click();
  }

  // Prevent user from clicking on start btn after the test begin
  testStarted = true;

  // Allow user input
  allowUserInput = true;
});

typingTest.addEventListener("click", () => {
  // init test
  initTest();

  // Set up what needed for user input
  setUpUserInput();

  // Start Counting for duration
  setDuration();

  // prevent user click that start btn again
  testStarted = true;

  // Allow user input
  allowUserInput = true;
});

userInput.addEventListener("blur", () => allowUserInput && userInput.focus());

userInput.addEventListener("input", startTest);

function setUpUserInput() {
  // Focus on user input
  userInput.focus();

  // Adding cursor to the first letter
  testLetters[currentIndex].classList.add("cursor");

  // setting up test info
  if (testConfig["test-by"] === "words") {
    updateNumberOfWords();
    testInfo.innerHTML = `${numberOfWords} / ${testConfig["time-word-config"]}`;
  } else {
    setTimer(testConfig["time-word-config"]);
  }
}

function startTest() {
  // if user didn't reach the last letter
  if (currentIndex < testLetters.length - 1) {
    // Handle user input
    handleUserInput(this);
    // update number of words
    updateNumberOfWords();

    // update word info if the test type is by number of words
    if (testConfig["test-by"] === "words") {
      testInfo.innerHTML = `${numberOfWords} / ${testConfig["time-word-config"]}`;
    }
  } else {
    // User reach the end of test text

    // clear timer
    clearInterval(timer);
    // show test result
    showResult();
  }

  // Cursor on the current letter
  handleCursor();
}

function handleUserInput(input) {
  // User input
  userInputLetters = input.value.split("");

  const userCurrentLetter = userInputLetters[currentIndex];
  const testCurrentLetter = testLetters[currentIndex].textContent;

  if (userCurrentLetter !== undefined) {
    if (userCurrentLetter === testCurrentLetter) {
      // Handle Correct Letter
      correctLetter();
    } else {
      //Handle Wrong Letter
      wrongLetter();
    }
    // increase index
    currentIndex++;
  } else {
    //User Entered Back Space

    // decrease current index
    currentIndex--;
    // reset letter classes
    testLetters[currentIndex].className = "letter";
  }
}

function correctLetter() {
  if (!wrongLetters.includes(testLetters[currentIndex].id)) {
    testLetters[currentIndex].classList.add("correct");
  } else {
    if (testLetters[currentIndex].textContent !== " ") {
      testLetters[currentIndex].classList.add("updated");
    } else {
      testLetters[currentIndex].classList.add("updated-space");
    }
  }
}

function wrongLetter() {
  if (testLetters[currentIndex].textContent !== " ") {
    if (!wrongLetters.includes(testLetters[currentIndex])) {
      testLetters[currentIndex].classList.add("wrong");
    } else {
      testLetters[currentIndex].classList.add("updated");
    }
  } else {
    testLetters[currentIndex].classList.add("wrong-space");
  }

  wrongLetters.push(testLetters[currentIndex].id);
}

function handleCursor() {
  // Remove Cursor
  testLetters.map((elm) => elm.classList.remove("cursor"));
  // Add Cursor to the current index
  testLetters[currentIndex]?.classList.add("cursor");
}

function updateNumberOfWords() {
  const currentWordNumber = testLetters[currentIndex].parentNode.id;
  numberOfWords = parseInt(currentWordNumber) - 1;
}

function setDuration() {
  startDuration = Date.now();
}

function stopDuration() {
  endDuration = Date.now();
  duration = parseInt((endDuration - startDuration) / 1000);
}

function showResult() {
  // Stop Duration
  stopDuration();

  // Calculate user test result
  const [WPM, accuracy] = calculateUserTestResult();
  const [minutes, seconds] = handleMinutesAndSeconds(duration);

  wordPerMinuteContainer.innerHTML = WPM;
  accContainer.innerHTML = `${accuracy}%`;
  timeInfoContainer.innerHTML = `${minutes}:${seconds}`;

  // Test type info
  createTestTypeInfo();

  // Re-init test
  reInitTest();

  // Show result
  testResult.classList.add("show");
}

function calculateUserTestResult() {
  const avgEnglishWordLength = 5;
  const numberOfWrongWords = wrongLetters.length / avgEnglishWordLength;
  const numberOfCorrectWords = numberOfWords - Math.ceil(numberOfWrongWords);
  const acc = Math.floor((numberOfCorrectWords / numberOfWords) * 100);
  const wpm = Math.floor(numberOfCorrectWords / (duration / 60));

  const WPM = wpm >= 0 ? wpm : 0;
  const accuracy = acc >= 0 ? acc : 0;

  return [WPM, accuracy];
}

function createTestTypeInfo() {
  // Clear Prev test info
  testTypeResultInfo.innerHTML = "";

  const testBySpan = document.createElement("span");
  testBySpan.innerHTML = `test by ${testConfig["test-by"]}`;
  testTypeResultInfo.appendChild(testBySpan);

  testConfig["include-to-test"].map((elm) => {
    const span = document.createElement("span");
    span.innerHTML = `include ${elm}`;
    testTypeResultInfo.appendChild(span);
  });

  if (testConfig["test-by"] === "words") {
    const numberOfWordsSpan = document.createElement("span");
    numberOfWordsSpan.innerHTML = `test of ${testConfig["time-word-config"]} words`;
    testTypeResultInfo.appendChild(numberOfWordsSpan);
  } else {
    const testTime = document.createElement("span");
    testTime.innerHTML = `chosen time ${testConfig["time-word-config"]}s`;
    testTypeResultInfo.appendChild(testTime);
  }
}

function setTimer(seconds) {
  timer = setInterval(() => {
    let [numberOfMinutes, numberOfSeconds] = handleMinutesAndSeconds(seconds);
    testInfo.innerHTML = `${numberOfMinutes}:${numberOfSeconds}`;

    if (--seconds < 0) {
      // Stop
      clearInterval(timer);
      showResult();
    }
  }, 1000);
}

function handleMinutesAndSeconds(numberOfSeconds) {
  let minutes = parseInt(numberOfSeconds / 60);
  let seconds = numberOfSeconds % 60;
  seconds = seconds > 9 ? seconds : `0${seconds}`;

  return [minutes, seconds];
}

function reInitTest() {
  // Clear test text
  testText.innerHTML = "";

  // show test configuration
  testConfiguration.classList.remove("hide");

  // Clear test info
  testInfo.classList.add("hide");

  // Handle test shadow and show startingTextContainer
  testContainer.classList.add("shadow");
  textOverlay.classList.remove("hide");
  startingTextContainer.classList.remove("hide");

  // Allow clicking to activate test
  typingTest.classList.remove("no-click");

  // Reset Globals
  currentIndex = 0;
  numberOfWords = 0;
  wrongLetters = [];
  resetTestWordsAndLetters();
  duration = 0;

  // Clear Value of previous input if it exits
  userInput.value = "";
  // prevent user input
  allowUserInput = false;
  userInputLetters = [];
  userInput.blur();

  // allow user to use start btn again to activate test
  testStarted = false;
}
