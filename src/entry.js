import './style.scss';
import * as domElements from './domElements';
import * as globalFunctions from './functions';
import BlockOne from './BlockOne';

const blockOne = new BlockOne();

domElements.btnStart.addEventListener('click', function() {
  globalFunctions.hideDiv(domElements.introPhase);
  globalFunctions.showDiv(domElements.testPhase);

  blockOne.beginEvaluation();

  console.log(blockOne);
});
