export default class BlockTwoExample {
  constructor() {
    this.targetIcon = '🎪';
    this.partnerIcon = '🎀';
    this.nonTargetIcons = ['💀', '👻', '🙉', '💘', '💥', '💣', '🖖', '💂', '💻', '💑', '👣', '🐎', '🌻', '🌎', '🗽'];
    this.grid = [];
    this.gridHTML = '';
    this.iconCount = {
      total: 40,
      target: 12,
      partner: 8,
      nonTarget: 20
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
    // First, shuffle the grid, which does not currently include the 8 partner icons
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    // Find 8 random target icons to place a partner icon next to
    for (let i = 0; i < this.iconCount.partner; i++) {
      let randomIcon = '';
      let needRandom = true;

      do {
        // Pick random icon in grid
        randomIcon = this.grid[Math.floor(Math.random * this.grid.length)];

        /*
          We need to play a partner icon to the left of a target icon.
          This means that this random icon cannot be the first icon in the grid.
          
          This also means that this random icon cannot be the first in any row,
          since the placed partner icon would appear as the last icon in the previous row.
        */

        // Verify it is one of our 12 target icons
        if (randomIcon === this.targetIcon) {
          
        } else {
          needRandom = true;
        }

      } while (needRandom);
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
