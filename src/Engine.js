import * as domElements from './domElements';
import * as globalFunctions from './functions';
import BlockOne from './BlockOne';
import BlockOneExample from './BlockOneExample';
import BlockTwo from './BlockTwo';
import BlockTwoExample from './BlockTwoExample';

const blockOne = new BlockOne();
const blockOneExample = new BlockOneExample();


const blockTwo = new BlockTwo(blockOne.participantID, blockOne.evaluationDate);
const blockTwoExample = new BlockTwoExample();

console.log('Block Two: ', blockTwo);
console.log('Block Two Example: ', blockTwoExample);


let currentBlock = 1;

/* -------------------- EVENT LISTENERS -------------------- */

/*
  "Try An Example!" button on Intro Phase

  Clicking this button takes user to a practice test round.
*/
domElements.btnExample.addEventListener('click', () => {
  goToTestPhase();

  blockOneExample.beginExample();
  setIconsOnClickHandlers();
});

/*
  "Start!" button on Intro Phase

  Clicking this button starts the timer and begins Block One's evaluation.
*/
domElements.btnStart.addEventListener('click', () => {
  goToTestPhase();

  blockOne.beginEvaluation();

  setTimer();
  setIconsOnClickHandlers();
});

/*
  "Done Example" button on Test Phase

  Clicking this button ends the Example evaluation and returns user to the intro phase
*/
domElements.btnExampleDone.addEventListener('click', () => {
  goToIntroPhase();
  
  globalFunctions.hideDiv(domElements.btnExample);
  globalFunctions.showDiv(domElements.btnStart);

  domElements.introHeader.innerText = "Great Work!";
  domElements.introInstructions.innerHTML = `
    Now you will be given a different target icon at the top of the screen. Your task is to click on all the target icons in the grid.
    <br /><br />
    Once you find all the icons on one page, go onto the next page. The exercise will end after 3 minutes.
    <br /><br />
    If you accidentally choose the wrong icon, you can click on it again to de-select it.
    <br /><br />
    Try to pay attention to how you're approaching the task.
  `;
});

/*
  "Next Page" button on Test Phase

  Clicking this button:
    - saves current page data (selections, timestamp, etc)
    - creates a new grid for the next page
*/
domElements.btnNextPage.addEventListener('click', () => {
  blockOne.evaluatePage();
  blockOne.savePage();

  blockOne.init();
  blockOne.beginEvaluation();

  // Reset onCLick Handlers for icons
  setIconsOnClickHandlers();
});

/*
  Icons on Test Phase

  Clicking an icon should toggle whether it is selected it or not
*/
const setIconsOnClickHandlers = () => {
  const icons = document.getElementsByClassName('icons');
  
  for (let i = 0; i < icons.length; i++) {
    icons[i].addEventListener('click', function() {
      if (this.classList.contains('selected')) {
        this.classList.remove('selected');
      } else {
        this.classList.add('selected');
      }
    });
  }
};

/*
  Continue Button on Block One Results Page

  Clicking on this button sends the user to Block Two's phase
*/
domElements.btnBlockTwo.addEventListener('click', () => {
  currentBlock++;

  goToIntroPhase();

  domElements.introHeader.innerText = "Needle in a Haystack";
  domElements.introInstructions.innerHTML = `
    In this exercise, you will be given a target icon at the top of the screen.
    <br />
    This time, you should only click it if it appears after another specified icon.
    <br /><br />
    Your task is to click on all the target icons in the grid.
  `;
});

/* --------------------------------------------------------- */

const goToIntroPhase = () => {
  globalFunctions.hideDiv(domElements.testPhase);
  globalFunctions.hideDiv(domElements.resultPhase);

  globalFunctions.showDiv(domElements.introPhase);
};

const goToTestPhase = () => {
  globalFunctions.hideDiv(domElements.introPhase);
  globalFunctions.hideDiv(domElements.resultPhase);
  
  globalFunctions.showDiv(domElements.testPhase);
};

const goToResultsPhase = () => {
  globalFunctions.hideDiv(domElements.introPhase);
  globalFunctions.hideDiv(domElements.testPhase);
  
  globalFunctions.showDiv(domElements.resultPhase);
  
  if (currentBlock === 1) {
    domElements.resultsJumbotron.innerHTML = blockOne.resultsHTML;
  }
};

const setTimer = () => {
  setTimeout(() => {
    alert('Time\'s Up!');

    blockOne.evaluatePage();
    blockOne.savePage();

    blockOne.endEvaluation();
    blockOne.saveBlock();

    blockOne.prepareResultsHTML();
    goToResultsPhase();

    window.blockOne = blockOne;
    console.log(blockOne);
  }, 30000);
};
