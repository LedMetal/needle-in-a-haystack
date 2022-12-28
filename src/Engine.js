import * as domElements from "./domElements"
import * as globalFunctions from "./functions"
import BlockOne from "./BlockOne"
import BlockOneExample from "./BlockOneExample"
import BlockTwo from "./BlockTwo"
import BlockTwoExample from "./BlockTwoExample"

const blockOne = new BlockOne()
const blockOneExample = new BlockOneExample()

const blockTwo = new BlockTwo(blockOne.participantID, blockOne.evaluationDate)
const blockTwoExample = new BlockTwoExample()

let currentBlock = 1

/* -------------------- EVENT LISTENERS -------------------- */

/*
  "Try An Example!" button on Intro Phase

  Clicking this button takes user to a practice test round.
*/
domElements.btnExample.addEventListener("click", () => {
	goToTestPhase()

	if (currentBlock === 1) {
		// Hide the additional header info on test page
		globalFunctions.hideDiv(domElements.additionalHeader)
		globalFunctions.hideDiv(domElements.partnerIcon)

		console.log("showing pre message")
		globalFunctions.showDiv(domElements.preButtonMessage)

		blockOneExample.beginExample()
	} else if (currentBlock === 2) {
		// Display the additional header info on test page
		globalFunctions.showDiv(domElements.additionalHeader)
		globalFunctions.showDiv(domElements.partnerIcon)

		// Display the example-done button and hide the next page button
		globalFunctions.showDiv(domElements.btnExampleDone)
		globalFunctions.hideDiv(domElements.btnNextPage)

		console.log("showing pre message")
		globalFunctions.showDiv(domElements.preButtonMessage)

		blockTwoExample.beginExample()
	}

	setIconsOnClickHandlers()
})

/*
  "Start!" button on Intro Phase

  Clicking this button starts the timer and begins Block One's evaluation.
*/
domElements.btnStart.addEventListener("click", () => {
	goToTestPhase()

	console.log("hiding pre message")
	globalFunctions.hideDiv(domElements.preButtonMessage)

	if (currentBlock === 1) {
		blockOne.beginEvaluation()
	} else if (currentBlock === 2) {
		blockTwo.beginEvaluation()
	}

	setTimer()
	setIconsOnClickHandlers()
})

/*
  "Done Example" button on Test Phase

  Clicking this button ends the Example evaluation and returns user to the intro phase
*/
domElements.btnExampleDone.addEventListener("click", () => {
	goToIntroPhase()

	globalFunctions.hideDiv(domElements.btnExample)
	globalFunctions.showDiv(domElements.btnStart)

	domElements.introHeader.innerText = "Great Work!"

	if (currentBlock === 1) {
		domElements.introInstructions.innerHTML = `
      Now, you will be given a different target icon at the top of the screen. Your task is to click on all the target icons in the grid.
      <br /><br />
      Once you find all the icons on one page, go onto the next page. The exercise will end after 3 minutes.
      <br /><br />
      If you accidentally choose the wrong icon, you can click on it again to de-select it.
      <br /><br />
      Please try to pay attention to how you are solving the task, as the experimenter will ask you about your approach to the task later.
    `
	} else if (currentBlock === 2) {
		domElements.introInstructions.innerHTML = `
      Now, you will be given a different set of icons at the top of the screen. Your task is to click on all the target icons in the grid according to the rule.
      <br /><br />
      Once you finish one page, go onto the next page. The exercise will end after 3 minutes.
      <br /><br />
      If you accidentally choose the wrong icon, you can click on it again to de-select it.
      <br /><br />
      Try to pay attention to how you're approaching the task.
    `
	}
})

/*
  "Next Page" button on Test Phase

  Clicking this button:
    - saves current page data (selections, timestamp, etc)
    - creates a new grid for the next page
*/
domElements.btnNextPage.addEventListener("click", () => {
	if (currentBlock === 1) {
		blockOne.evaluatePage()
		// blockOne.savePage()

		blockOne.init()
		blockOne.beginEvaluation()
	} else if (currentBlock === 2) {
		blockTwo.evaluatePage()
		// blockTwo.savePage()

		blockTwo.init()
		blockTwo.beginEvaluation()
	}

	// Reset onCLick Handlers for icons
	setIconsOnClickHandlers()
})

/*
  Icons on Test Phase

  Clicking an icon should toggle whether it is selected it or not
*/
const setIconsOnClickHandlers = () => {
	const icons = document.getElementsByClassName("icons")

	for (let i = 0; i < icons.length; i++) {
		icons[i].addEventListener("click", function () {
			if (this.classList.contains("selected")) {
				this.classList.remove("selected")
			} else {
				this.classList.add("selected")
			}
		})
	}
}

/*
  Continue Button on Block One Results Page

  Clicking on this button sends the user to Block Two's phase
*/
domElements.btnBlockTwo.addEventListener("click", () => {
	currentBlock++

	goToIntroPhase()

	domElements.introHeader.innerText = "Needle in a Haystack"
	domElements.introInstructions.innerHTML = `
    In this exercise, you will be given a target icon at the top of the screen.
    <br />
    This time, you should only click it if it appears after another specified icon.
    <br /><br />
    Your task is to click on all the target icons in the grid.
  `

	globalFunctions.showDiv(domElements.btnExample)
	globalFunctions.hideDiv(domElements.btnStart)
})

/* --------------------------------------------------------- */

const goToIntroPhase = () => {
	globalFunctions.hideDiv(domElements.testPhase)
	globalFunctions.hideDiv(domElements.resultPhase)

	globalFunctions.showDiv(domElements.introPhase)
}

const goToTestPhase = () => {
	globalFunctions.hideDiv(domElements.introPhase)
	globalFunctions.hideDiv(domElements.resultPhase)

	globalFunctions.showDiv(domElements.testPhase)
}

const goToResultsPhase = () => {
	globalFunctions.hideDiv(domElements.introPhase)
	globalFunctions.hideDiv(domElements.testPhase)

	globalFunctions.showDiv(domElements.resultPhase)

	if (currentBlock === 1) {
		domElements.resultsJumbotron.innerHTML = blockOne.resultsHTML
	} else {
		domElements.resultsJumbotron.innerHTML = blockTwo.resultsHTML

		globalFunctions.hideDiv(domElements.btnBlockTwo)
	}
}

const setTimer = () => {
	setTimeout(() => {
		if (currentBlock === 1) {
			blockOne.evaluatePage()
			// blockOne.savePage()

			blockOne.endEvaluation()
			// blockOne.saveBlock()

			blockOne.prepareResultsHTML()
		} else if (currentBlock === 2) {
			blockTwo.evaluatePage()
			// blockTwo.savePage()

			blockTwo.endEvaluation()
			// blockTwo.saveBlock()

			blockTwo.prepareResultsHTML()
		}

		alert("Time's Up!")

		goToResultsPhase()
	}, 10000)
}
