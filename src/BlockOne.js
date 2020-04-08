export default class BlockOne {
  constructor() {
    this.targetIcon = '⏰';
    this.disSimilars = ['\u{1F955}', '🐶', '🔑', '💰', '📺'];
    this.visuallySimilars = ['\u{1F9ED}', '🚫', '⭕', '💿', '🎯'];
    this.semanticallySimilars = ['⏳', '⌚', '⏱', '⏲', '🕰'];
    this.grid = [];
    this.gridHTML = '';
    this.currentPage = 0;
    this.score = {};
    this.resultsHTML = '';
    this.iconCount = {
      total: 40,
      target: 8,
      disSimilar: 16,
      visuallySimilar: 8,
      semanticallySimilar: 8
    };

    this.init();
  }

  init() {
    this.chooseIcons();
    this.shuffleGrid(this.grid);
    this.prepareGridHTML();
    this.currentPage++;
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

  endEvaluation() {
    // Set end time for current page
    this.score[`page${this.currentPage}`].timestamps.end = new Date();

    // Set array of selected icons
    this.score[`page${this.currentPage}`].selectedIcons = [];
    const selectedIcons = document.getElementsByClassName('selected');
    for (let i = 0; i < selectedIcons.length; i++) {
      this.score[`page${this.currentPage}`].selectedIcons.push(selectedIcons[i].innerHTML);
    }
  }

  prepareResultsHTML() {
    let html = `
      
    `;
  }
}
