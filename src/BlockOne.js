import $ from 'jquery';

export default class BlockOne {
  constructor() {
    this.participantID = this.getParticipantID();
    this.evaluationDate = this.setEvaluationDate();
    this.evaluationTime = this.setEvaluationTime();
    this.targetIcon = '⏰';
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
      target: 8,
      disSimilar: 16,
      visuallySimilar: 8,
      semanticallySimilar: 8
    };

    this.init();

    /* ----- DEBUG ----- */
    console.log('participantID: ', this.participantID);
  }

  init() {
    this.chooseIcons();
    this.shuffleGrid(this.grid);
    this.prepareGridHTML();

    this.currentPage++;
  }

  setEvaluationDate() {
    let now = new Date();
    
    return now.getFullYear() + '-' + (now.getMonth() + 1).toString().padStart(2, '0') + '-' + now.getDate().toString().padStart(2, '0');
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

  shuffleGrid(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }

  prepareGridHTML() {
    let gridIndex = 0;

    this.gridHTML = '<tbody>';

    for (let row = 1; row <= 5; row++) {
      let rowHTML = '<tr>';

      for (let col = 1; col <= 8; col++, gridIndex++) {
        rowHTML += `
          <td class='icons' id='${row}-${col}'>${this.grid[gridIndex]}</td>
        `;
      }

      rowHTML += '</tr>';
      this.gridHTML += rowHTML;
    }

    this.gridHTML += '</tbody>';
  }

  beginEvaluation() {
    const targetIcon = document.querySelector('.target-icon');
    const iconsTable = document.querySelector('.icons-table');
    const btnExampleDone = document.querySelector('.btn-example-done');
    const btnNext = document.querySelector('.btn-next');

    targetIcon.innerHTML = this.targetIcon;
    iconsTable.innerHTML = this.gridHTML;

    btnExampleDone.style.setProperty('display', 'none');
    btnNext.style.setProperty('display', 'inline-block');

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
    this.score[`page${this.currentPage}`].dissimilarsSelected = 0;
    this.score[`page${this.currentPage}`].visuallySimilarsSelected = 0;
    this.score[`page${this.currentPage}`].semanticallySimilarsSelected = 0;
    this.categorizeSelectedIcons();
  }

  categorizeSelectedIcons() {
    let selectedIcons = this.score[`page${this.currentPage}`].selectedIcons;

    for (let i = 0; i < selectedIcons.length; i++) {
      if (selectedIcons[i] === this.targetIcon) {
        this.score[`page${this.currentPage}`].targetsSelected++;
      } else if (this.disSimilars.indexOf(selectedIcons[i]) >= 0) {
        this.score[`page${this.currentPage}`].dissimilarsSelected++;
      } else if (this.visuallySimilars.indexOf(selectedIcons[i]) >= 0) {
        this.score[`page${this.currentPage}`].visuallySimilarsSelected++;
      } else if (this.semanticallySimilars.indexOf(selectedIcons[i]) >= 0) {
        this.score[`page${this.currentPage}`].semanticallySimilarsSelected++;
      }
    }
  }

  savePage() {
    $.post('./b1_SavePage.php', {
      participantID: this.participantID,
      page: this.currentPage,
      duration: this.score[`page${this.currentPage}`].timeOnPage,
      totalSelected: this.score[`page${this.currentPage}`].totalSelected,
      targetsSelected: this.score[`page${this.currentPage}`].targetsSelected,
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
        correctSelections += page.selectedIcons[j] === this.targetIcon ? 1 : 0;
      }

      totalTargetsSelected += correctSelections;
    }

    return totalTargetsSelected;
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
        incorrectSelections += page.selectedIcons[j] !== this.targetIcon ? 1 : 0;
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

  getParticipantID() {
    let appendedVariable = document.location.href.split('?')[1];
    let participantID = '';

    if (appendedVariable === undefined) {
      participantID = this.generateParticipantID();
    } else {
      if (appendedVariable.split('=')[0] === "id") {
        participantID = appendedVariable.split('=')[1];
      }
    }

    return participantID;
  }

  generateParticipantID() {
    return `smart-${Math.random().toString(36).substr(2, 5)}`;
  }

  getSelectedIcons() {
    const selectedElements = document.getElementsByClassName('selected');

    let selectedIcons = [];

    for (let i = 0; i < selectedElements.length; i++) {
      selectedIcons.push(selectedElements[i].innerHTML);
    }

    return selectedIcons;
  }

  saveBlock() {
    $.post('./b1_SaveBlock.php', {
      participantID: this.participantID,
      evaluationDate: this.evaluationDate,
      evaluationTime: this.evaluationTime,
      totalPages: this.score.totalPages,
      totalIconsViewed: this.score.totalIconsViewed,
      timePerPage: this.score.timePerPage.join(' | '),
      averageTimePerPage: this.score.averageTimePerPage,
      totalTargetsViewed: this.score.totalTargetsViewed,
      totalTargetsSelected: this.score.totalTargetsSelected,
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
        Thank you for completing the first block of this task.
        <br />
        <br />
        Please minimize your browser window, but <strong>DO NOT</strong> close it.
        <br />
        You will be returning to this task in a few minutes.
      </div>
    `;

    this.resultsHTML = resultsHTML;
  }
}
