export default class BlockOneExample {
  constructor() {
    this.targetIcon = '🎪';
    this.nonTargetIcons = ['💀', '👻', '🙉', '💘', '💥', '💣', '🖖', '💂', '💻', '💑', '👣', '🐎', '🌻', '🌎', '🗽'];
    this.grid = [];
    this.gridHTML = '';
    this.iconCount = {
      total: 40,
      target: 8,
      nonTarget: 32
    };

    this.init();
  }

  init() {
    this.chooseIcons();
    this.shuffleGrid(this.grid);
    this.prepareGridHTML();
  }

  chooseIcons() {
    this.grid = [];

    for (let i = 0; i < this.iconCount.target; i++) {
      this.grid.push(this.targetIcon);
    }

    for (let i = 0; i < this.iconCount.nonTarget; i++) {
      this.grid.push(this.nonTargetIcons[Math.floor(Math.random() * this.nonTargetIcons.length)]);
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

  beginExample() {
    const targetIcon = document.querySelector('.target-icon');
    const iconsTable = document.querySelector('.icons-table');

    targetIcon.innerHTML = this.targetIcon;
    iconsTable.innerHTML = this.gridHTML;
  }
}
