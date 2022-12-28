import $ from 'jquery';

export default class BlockTwo {
  constructor(participantID, evaluationDate) {
    this.participantID = participantID;
    this.evaluationDate = evaluationDate;
    this.evaluationTime = this.setEvaluationTime();
    this.targetIcon = '⏰';
    this.partnerIcon = '\u{1F6CF}';
    this.disSimilars = ['\u{1F955}', '🐶', '🔑', '💰', '📺'];
    this.visuallySimilars = ['\u{1F9ED}', '🚫', '⭕', '💿', '🎯'];
    this.semanticallySimilars = ['⏳', '⌚', '⏱', '⏲', '🕰'];
    this.grid = [];
    this.gridHTML = '';
    this.resultsHTML = '';
    this.currentPage = 0;
    this.score = {
      totalPages: 0,
      timePerPage: [],
      averageTimePerPage: 0,
      totalIconsViewed: 0,
      totalTargetsViewed: 0,
      totalTargetsSelected: 0,
      targetsSelectedRatio: 0,
      totalNonTargetsSelected: 0
    };
    this.resultsHTML = '';
    this.iconCount = {
      total: 40,
      target: 12,
      partnerIcon: 8,
      disSimilar: 12,
      visuallySimilar: 4,
      semanticallySimilar: 4
    };

    this.init();
  }

  init() {
    this.chooseIcons();
    this.shuffleGrid();
    this.prepareGridHTML();

    this.currentPage++;
  }

  setEvaluationTime() {
    let date = new Date();

    return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0');
  }

  chooseIcons() {
    this.grid = [];

    for (let i = 0; i < this.iconCount.target; i++) {
      this.grid.push(this.targetIcon);
    }

    for (let i = 0; i < this.iconCount.disSimilar; i++) {
      this.grid.push(this.disSimilars[Math.floor(Math.random() * this.disSimilars.length)]);
    }

    for (let i = 0; i < this.iconCount.visuallySimilar; i++) {
      this.grid.push(this.visuallySimilars[Math.floor(Math.random() * this.visuallySimilars.length)]);
    }

    for (let i = 0; i < this.iconCount.semanticallySimilar; i++) {
      this.grid.push(this.semanticallySimilars[Math.floor(Math.random() * this.semanticallySimilars.length)]);
    }
  }

  shuffleGrid() {
    let reshuffle = true;

    do {
      // First, shuffle the grid, which does not currently include the 8 partner icons
      for (let i = this.grid.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.grid[i], this.grid[j]] = [this.grid[j], this.grid[i]];
      }
  
      // Find 8 random target icons to place a partner icon next to
      for (let i = 0; i < this.iconCount.partnerIcon; i++) {
        let randomIcon = '';
        let randomIndex = 0;
        let reselectRandom = true;
  
        /*
          We need to place a partner icon to the left of a target icon.
          This means that this random icon cannot be the first icon in the grid.
          
          This also means that this random icon cannot be the first in any row,
          since the placed partner icon would appear as the last icon in the previous row.
        */
  
        do {
          // Pick random non-first index
          randomIndex = Math.floor(Math.random() * (this.grid.length - 1)) + 1;
  
          // Grab icon in grid at random index
          randomIcon = this.grid[randomIndex];
  
          // Verify the random icon is one of our 12 target icons
          if (randomIcon === this.targetIcon) {
            // Verify ihat there isn't already a partner icon placed to the left of this randomly selected target icon
            if (this.grid[randomIndex - 1] !== this.partnerIcon) {              
              // We are green lit to place a partner icon to the left of this randomly selected target icon
              this.grid.splice(randomIndex, 0, this.partnerIcon);
  
              reselectRandom = false;
            } else {
              reselectRandom = true;
            }
          } else {
            reselectRandom = true;
          }
        } while (reselectRandom);
      }
  
      // Verify that no partner icons are the last icon in their row (causing the target icon to be on the next row)
      if (this.grid[7] === this.partnerIcon || (this.grid[15] === this.partnerIcon) || (this.grid[23] === this.partnerIcon) || (this.grid[31] === this.partnerIcon)) {
        // Reset the grid
        this.chooseIcons();
  
        reshuffle = true;
      } else {
        // YAY ... the grid is done and complete! No need for reshuffling!
        reshuffle = false;
      }
    } while (reshuffle);
  }

  prepareGridHTML() {
    let gridIndex = 0;

    this.gridHTML = '<tbody>';

    for (let row = 1; row <= 5; row++) {
      let rowHTML = '<tr>';

      for (let col = 1; col <= 8; col++, gridIndex++) {
        rowHTML += `
          <td class='icons ${gridIndex != 0 && this.grid[gridIndex - 1] === this.partnerIcon ? 'partnered' : ''}' id='${row}-${col}'>${this.grid[gridIndex]}</td>
        `;
      }

      rowHTML += '</tr>';
      this.gridHTML += rowHTML;
    }

    this.gridHTML += '</tbody>';
  }

  // ${this.grid[gridIndex] === this.partnerIcon ? 'partner' : ''}

  beginEvaluation() {
    const targetIcon = document.querySelector('.target-icon');
    const partnerIcon = document.querySelector('.test-phase .partner-icon');
    const iconsTable = document.querySelector('.icons-table');
    const btnExampleDone = document.querySelector('.btn-example-done');
    const btnNext = document.querySelector('.btn-next');

    targetIcon.innerHTML = this.targetIcon;
    partnerIcon.innerHTML = this.partnerIcon;
    iconsTable.innerHTML = this.gridHTML;

    btnExampleDone.style.setProperty('display', 'none');
    btnExampleDone.style.setProperty('visibility', 'hidden');
    btnNext.style.setProperty('display', 'inline-block');
    btnNext.style.setProperty('visibility', 'visible');

    this.score[`page${this.currentPage}`] = {
      timestamps: {
        start: new Date()
      }
    };
  }

  evaluatePage() {
    // Set end time for current page
    this.score[`page${this.currentPage}`].timestamps.end = new Date();

    // Set time spent on current page
    this.score[`page${this.currentPage}`].timeOnPage = this.setTimeOnPage();

    // Set array of selected icons
    this.score[`page${this.currentPage}`].selectedIcons = this.getSelectedIcons();

    // Set total icons selected
    this.score[`page${this.currentPage}`].totalSelected = this.score[`page${this.currentPage}`].selectedIcons.length;

    // Categorize the selected icons (increment appropriate icon types)
    this.score[`page${this.currentPage}`].targetsSelected = 0;
    this.score[`page${this.currentPage}`].pairedTargetsSelected = 0;
    this.score[`page${this.currentPage}`].unparteneredTargetsSelected = 0;
    this.score[`page${this.currentPage}`].dissimilarsSelected = 0;
    this.score[`page${this.currentPage}`].visuallySimilarsSelected = 0;
    this.score[`page${this.currentPage}`].semanticallySimilarsSelected = 0;
    this.categorizeSelectedIcons();
  }

  getSelectedIcons() {
    const selectedElements = document.getElementsByClassName('selected');

    let selectedIcons = [];

    for (let i = 0; i < selectedElements.length; i++) {
      selectedIcons.push({ icon: selectedElements[i].innerHTML, partnered: selectedElements[i].classList.contains('partnered') });
    }

    return selectedIcons;
  }

  categorizeSelectedIcons() {
    let selectedIcons = this.score[`page${this.currentPage}`].selectedIcons;

    for (let i = 0; i < selectedIcons.length; i++) {
      if (selectedIcons[i].icon === this.targetIcon) {
        this.score[`page${this.currentPage}`].targetsSelected++;

        if (selectedIcons[i].partnered) {
          this.score[`page${this.currentPage}`].pairedTargetsSelected++;
        } else {
          this.score[`page${this.currentPage}`].unparteneredTargetsSelected++;
        }
      } else if (this.disSimilars.indexOf(selectedIcons[i].icon) >= 0) {
        this.score[`page${this.currentPage}`].dissimilarsSelected++;
      } else if (this.visuallySimilars.indexOf(selectedIcons[i].icon) >= 0) {
        this.score[`page${this.currentPage}`].visuallySimilarsSelected++;
      } else if (this.semanticallySimilars.indexOf(selectedIcons[i].icon) >= 0) {
        this.score[`page${this.currentPage}`].semanticallySimilarsSelected++;
      }
    }
  }

  savePage() {
    $.post('./b2_SavePage.php', {
      participantID: this.participantID,
      page: this.currentPage,
      duration: this.score[`page${this.currentPage}`].timeOnPage,
      totalSelected: this.score[`page${this.currentPage}`].totalSelected,
      targetsSelected: this.score[`page${this.currentPage}`].pairedTargetsSelected,
      unparteneredTargetsSelected: this.score[`page${this.currentPage}`].unparteneredTargetsSelected,
      dissimilarsSelected: this.score[`page${this.currentPage}`].dissimilarsSelected,
      visuallySimilarsSelected: this.score[`page${this.currentPage}`].visuallySimilarsSelected,
      semanticallySimilarsSelected: this.score[`page${this.currentPage}`].semanticallySimilarsSelected
    }, data => {
      console.log(data);
    });
  }

  endEvaluation() {
    // Set total pages viewed
    this.score.totalPages = this.currentPage;

    // Set total icons viewed (40 per page * total pages viewed)
    this.score.totalIconsViewed = 40 * this.score.totalPages;

    // Set time per page (concatinated string)
    this.score.timePerPage = this.setTimePerArray();

    // Set average time per page (total time / total pages)
    this.score.averageTimePerPage = this.getAverageTimePerArray();

    // Set total number of target icons viewed (8 * total pages viewed)
    this.score.totalTargetsViewed = 8 * this.score.totalPages;

    // Set total number of correct selections (target icons)
    this.score.totalTargetsSelected = this.getTotalTargetsSelected();

    // Set total number of un-partnered targets selected
    this.score.totalUnpartneredTargetsSelected = this.getTotalUnpartneredTargetsSelected();

    // Set ratio of correctly selected target icons to total target icons
    this.score.targetsSelectedRatio = this.getTargetsSelectedRatio();

    // Set total number of incorrect selections (non-target icons)
    this.score.totalNonTargetsSelected = this.getTotalNonTargetsSelected();
  }

  setTimeOnPage() {
    return parseFloat(((this.score[`page${this.currentPage}`].timestamps.end.getTime() - this.score[`page${this.currentPage}`].timestamps.start.getTime()) / 1000).toFixed(3));
  }

  getAverageTimePerArray() {
    let realTotalTime = this.score.timePerPage.reduce((sum, curr) => {
      return sum += curr;
    });

    return parseFloat((realTotalTime / this.score.totalPages).toFixed(2));
  }

  getTotalTargetsSelected() {
    let totalTargetsSelected = 0;

    for (let i = 0; i < this.score.totalPages; i++) {
      let correctSelections = 0;
      let page = this.score[`page${i + 1}`];

      for (let j = 0; j < page.selectedIcons.length; j++) {
        correctSelections += page.selectedIcons[j].icon === this.targetIcon && page.selectedIcons[j].partnered ? 1 : 0;
      }

      totalTargetsSelected += correctSelections;
    }

    return totalTargetsSelected;
  }

  getTotalUnpartneredTargetsSelected() {
    let totalUnpartneredTargetsSelected = 0;

    for (let i = 0; i < this.score.totalPages; i++){
      let unpartneredSelection = 0;
      let page = this.score[`page${i + 1}`];

      for (let j = 0; j < page.selectedIcons.length; j++) {
        unpartneredSelection += page.selectedIcons[j].icon === this.targetIcon && !page.selectedIcons[j].partnered ? 1 : 0;
      }

      totalUnpartneredTargetsSelected += unpartneredSelection;
    }

    return totalUnpartneredTargetsSelected;
  }

  getTargetsSelectedRatio() {
    return parseFloat((this.score.totalTargetsSelected / this.score.totalTargetsViewed).toFixed(3));
  }

  getTotalNonTargetsSelected() {
    let totalNonTargetsSelected = 0;

    for (let i = 0; i < this.score.totalPages; i++) {
      let incorrectSelections = 0;
      let page = this.score[`page${i + 1}`];

      for (let j = 0; j < page.selectedIcons.length; j++) {
        incorrectSelections += page.selectedIcons[j].icon !== this.targetIcon ? 1 : 0;
      }

      totalNonTargetsSelected += incorrectSelections;
    }

    return totalNonTargetsSelected;
  }

  setTimePerArray() {
    let timePerArray = [];

    for (let i = 0; i < this.score.totalPages; i++) {
      timePerArray.push(this.score[`page${i + 1}`].timeOnPage);
    }

    return timePerArray;
  }

  saveBlock() {
    $.post('./b2_SaveBlock.php', {
      participantID: this.participantID,
      evaluationDate: this.evaluationDate,
      evaluationTime: this.evaluationTime,
      totalPages: this.score.totalPages,
      totalIconsViewed: this.score.totalIconsViewed,
      timePerPage: this.score.timePerPage.join(' | '),
      averageTimePerPage: this.score.averageTimePerPage,
      totalTargetsViewed: this.score.totalTargetsViewed,
      totalTargetsSelected: this.score.totalTargetsSelected,
      totalUnpartneredTargetsSelected: this.score.totalUnpartneredTargetsSelected,
      targetsSelectedRatio: this.score.targetsSelectedRatio,
      totalNonTargetsSelected: this.score.totalNonTargetsSelected
    }, data => {
      console.log(data);
    });
  }

  prepareResultsHTML() {
    let resultsHTML = `
      <h1 class="display-4">Block Complete</h1>
  
      <p class="lead">You found ${this.score.totalTargetsSelected} out of ${this.score.totalTargetsViewed} <span>${this.targetIcon}</span> - that's ${Math.round(this.score.targetsSelectedRatio * 100)}%!</p>

      <div class="progress-bar-container">
        <div class="progress">
          <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" aria-valuenow="${this.score.targetsSelectedRatio * 100}" aria-valuemin="0" aria-valuemax="100" style="width: ${this.score.targetsSelectedRatio * 100}%">${Math.round(this.score.targetsSelectedRatio * 100)}%</div>
        </div>

        <div class="progress-bar-label">
          <span class="label-start">0</span>
          <span class="label-end">100</span>
        </div>
      </div>

      <br />

      <table class="table table-bordered table-hover">
        <thead class="thead-dark">
          <tr>
            <th colspan="2">Results Summary</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <th>Total Number of Icons</th>
            <td>${this.score.totalIconsViewed}</td>
          </tr>
          <tr>
            <th>Incorrect Icons</th>
            <td>${this.score.totalNonTargetsSelected}</td>
          </tr>
          <tr>
            <th>Average Time per Page</th>
            <td>${this.score.averageTimePerPage} sec</td>
          </tr>
        </tbody>
      </table>

      <br />
      <hr />
      <br />

      <div class="thank-you-message">
        Thank you for completing the second block of the task.
        <br /><br />
        You may close your browser window.
        <br />
        The experimenter will provide instructions for what to do next.
      </div>
    `;

    this.resultsHTML = resultsHTML;
  }
}
