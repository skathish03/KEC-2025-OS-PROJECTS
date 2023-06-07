class Firstcomefirstserve {
  constructor(frameSize) {
    this.frameSize = frameSize;
    this.frames = [];
    this.pageFaults = 0;
    this.pointer = 0;
  }

  accessPage(pageSequence) {
    for (let i = 0; i < pageSequence.length; i++) {
      let page = pageSequence[i];
      if (!this.frames.includes(page)) {
        this.pageFaults++;
        if (this.frames.length < this.frameSize) {
          this.frames.push(page);
        } else {
          this.frames[this.pointer] = page;
          this.pointer = (this.pointer + 1) % this.frameSize;
        }
      }
    }
  }
}
class Optimal{
  constructor(frameSize) {
    this.frameSize = frameSize;
    this.frames = [];
    this.pageFaults = 0;
  }

  accessPage(pageSequence) {
    for (let i = 0; i < pageSequence.length; i++) {
      let page = pageSequence[i];
      if (!this.frames.includes(page)) {
        this.pageFaults++;
        if (this.frames.length < this.frameSize) {
          this.frames.push(page);
        } else {
          let index = this.findOptimalPage(page, i, pageSequence);
          this.frames[index] = page;
        }
      }
    }
  }

  findOptimalPage(page, currentIndex, pageSequence) {
    let farthestIndex = -1;
    let index = -1;

    for (let i = 0; i < this.frames.length; i++) {
      let frame = this.frames[i];
      let found = false;

      for (let j = currentIndex + 1; j < pageSequence.length; j++) {
        if (frame === pageSequence[j]) {
          found = true;
          if (j > farthestIndex) {
            farthestIndex = j;
            index = i;
          }
          break;
        }
      }

      if (!found) {
        return i;
      }
    }

    if (index === -1) {
      index = 0;
    }

    return index;
  }
}
class leastrecentlyused{
  constructor(frameSize) {
    this.frameSize = frameSize;
    this.frames = [];
    this.pageFaults = 0;
  }

  accessPage(pageSequence) {
    for (let i = 0; i < pageSequence.length; i++) {
      let page = pageSequence[i];
      if (!this.frames.includes(page)) {
        this.pageFaults++;
        if (this.frames.length < this.frameSize) {
          this.frames.push(page);
        } else {
          let index = this.findLRUPage(pageSequence, i);
          this.frames[index] = page;
        }
      }
    }
  }

  findLRUPage(pageSequence, currentIndex) {
    let index = 0;
    let leastRecentlyUsed = currentIndex;

    for (let i = 0; i < this.frames.length; i++) {
      let frame = this.frames[i];
      let lastIndex = pageSequence.slice(0, currentIndex).lastIndexOf(frame);

      if (lastIndex === -1) {
        return i;
      }

      if (lastIndex < leastRecentlyUsed) {
        leastRecentlyUsed = lastIndex;
        index = i;
      }
    }

    return index;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const pageForm = document.getElementById('pageForm');
  const pageSequenceInput = document.getElementById('pageSequenceInput');
  const pageFaultsDisplay = document.getElementById('pageFaultsDisplay');
  pageForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const pageSequence = pageSequenceInput.value.split(',').map(Number);
    const method = document.getElementById("methodSelect").value;
    if(method == 'FIFO'){
      const firstcomefirstserve = new Firstcomefirstserve(Number(document.getElementById('pageSequenceInput1').value)); // Frame size is 3
      firstcomefirstserve.accessPage(pageSequence);
      pageFaultsDisplay.value = firstcomefirstserve.pageFaults;
    }
    else if(method == 'OPT'){
      const optimal = new Optimal(Number(document.getElementById('pageSequenceInput1').value));
      optimal.accessPage(pageSequence);
      pageFaultsDisplay.value = optimal.pageFaults;
    }
    else{
      const lru = new leastrecentlyused(Number(document.getElementById('pageSequenceInput1').value));
      lru.accessPage(pageSequence);
      pageFaultsDisplay.value = lru.pageFaults;
    }
  });
});