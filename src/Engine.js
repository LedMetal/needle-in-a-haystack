import * as domElements from './domElements';
import * as globalFunctions from './functions';
import BlockOne from './BlockOne';
import BlockOneExample from './BlockOneExample';

export const blockOne = new BlockOne();
export const blockOneExample = new BlockOneExample();

/* ---------- EVENT LISTENERS ---------- */
/*
  "Try An Example!" button on Intro Phase

  Clicking this button takes user to a practice test round.
*/
domElements.btnExample.addEventListener('click', function() {
  globalFunctions.hideDiv(domElements.introPhase);
  globalFunctions.showDiv(domElements.testPhase);

  blockOneExample.beginExample();

  setIconsOnClickHandlers();
});

/*
  "Start!" button on Intro Phase

  Clicking this button starts the timer and begins Block One's evaluation.
*/
domElements.btnStart.addEventListener('click', function() {
  globalFunctions.hideDiv(domElements.introPhase);
  globalFunctions.showDiv(domElements.testPhase);

  blockOne.beginEvaluation();
});

/*
  "Done Example" button on Test Phase

  Clicking this button ends the Example evaluation and returns user to the intro phase
*/
domElements.btnExampleDone.addEventListener('click', function() {
  globalFunctions.hideDiv(domElements.testPhase);
  globalFunctions.showDiv(domElements.introPhase);
  
  globalFunctions.hideDiv(domElements.btnExample);
  globalFunctions.showDiv(domElements.btnStart);

  domElements.introHeader.innerText = "Great Work!";
  domElements.introInstructions.innerHTML = `
    Now you will be given a differnt target icon at the top of the screen. Your tast is to click on all the target icons in the grid.
    <br /><br />
    Once you find all the icons on one page, go onto the next page. The exercise will end after 3 minutes.
    <br /><br />
    If you accidentally choose the wrong icon, you can click on it again to de-select it.
    <br /><br />
    Try to pay attention to how you're approaching the task.
  `;
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
/* ------------------------------------- */
