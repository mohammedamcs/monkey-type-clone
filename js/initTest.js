import { testConfig } from "./testConfig.js";

// Queries
const typingTest = document.querySelector(".typing-test");
const testContainer = document.querySelector(".test");
const testText = document.querySelector(".test-text");
const textOverlay = document.querySelector(".overlay");
const startingTextContainer = document.querySelector(".starting-text");
const testConfiguration = document.querySelector(".test-config");
const testResult = document.querySelector(".test-results");
const testInfo = document.querySelector(".time-word-info");

// Globals
const punctuation = `+",.-'"&!?:;#~=/$^()_<>`;
const letters = "abcdefghijklmnopqrstuvwxyz";
let testWords = [];
export let testLetters = [];

export function initTest() {
  // hide test configuration
  testConfiguration.classList.add("hide");

  // hide test result
  testResult.classList.remove("show");

  // Show test info
  testInfo.innerHTML = "";
  testInfo.classList.remove("hide");

  // Handle test shadow and start test text
  testContainer.classList.remove("shadow");
  textOverlay.classList.add("hide");
  startingTextContainer.classList.add("hide");

  // Prevent clicking
  typingTest.classList.add("no-click");

  // Generate Test Text
  testWords = generateTestText();

  // Create test words and letters
  createWords();
}

function generateTestText() {
  const numberOfWords = decideNumberOfWords();
  const includeToTest = testConfig["include-to-test"];
  const words = [];

  for (let i = 0; i < numberOfWords; i++) {
    let wordLength = random(8) + 1;
    let word = "";

    for (let j = 0; j < wordLength; j++) {
      let randomLetter = letters[random(letters.length)];
      if (random(8) === 4) {
        word += randomLetter.toLocaleUpperCase();
      } else {
        word += randomLetter;
      }
    }

    if (includeToTest.includes("punctuation")) {
      if (random(8) % 2 === 0) {
        word += punctuation[random(punctuation.length)];
      }
    }

    if (includeToTest.includes("numbers")) {
      if (random(8) % 2 === 0) {
        word += " " + random(10);
      }
    }

    words.push(word);
  }
  return words;
}

function createLetter(letter, parentContainer, i, j) {
  const letterSpan = document.createElement("span");
  letterSpan.innerText = letter;
  letterSpan.className = "letter";
  letterSpan.id = `${i}:${j}`;
  parentContainer.appendChild(letterSpan);
  testLetters.push(letterSpan);
}

function createWords() {
  for (let i = 0; i < testWords.length; i++) {
    const wordDiv = document.createElement("div");
    wordDiv.id = i + 1;
    wordDiv.className = "word";

    [...testWords[i]].forEach((letter, j) => {
      createLetter(letter, wordDiv, i + 1, j + 1);
    });

    if (i < testWords.length - 1) {
      // space between words
      createLetter(" ", wordDiv, i + 1, testWords[i].length + 1);
    }

    testText.appendChild(wordDiv);
  }
}

function decideNumberOfWords() {
  return testConfig["test-by"] === "words"
    ? testConfig["time-word-config"]
    : 40;
}

function random(limit) {
  return Math.floor(Math.random() * limit);
}

export function resetTestWordsAndLetters(params) {
  testWords = [];
  testLetters = [];
}
