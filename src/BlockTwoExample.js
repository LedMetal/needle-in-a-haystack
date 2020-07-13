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
    this.shuffleGrid();
    this.prepareGridHTML();
  }

  chooseIcons() {
    this.grid = [];

    // Push the target icons into grid array
    for (let i = 0; i < this.iconCount.target; i++) {
      this.grid.push(this.targetIcon);
    }

    // Push the non-target icons into grid array
    for (let i = 0; i < this.iconCount.nonTarget; i++) {
      this.grid.push(this.nonTargetIcons[Math.floor(Math.random() * this.nonTargetIcons.length)]);
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
      for (let i = 0; i < this.iconCount.partner; i++) {
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
    const partnerIcon = document.querySelector('.test-phase .partner-icon');
    const iconsTable = document.querySelector('.icons-table');

    targetIcon.innerHTML = this.targetIcon;
    partnerIcon.innerHTML = this.partnerIcon;
    iconsTable.innerHTML = this.gridHTML;
  }
}
