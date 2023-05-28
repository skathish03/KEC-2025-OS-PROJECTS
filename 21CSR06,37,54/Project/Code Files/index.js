class fcfsalogithm {
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

  
function validate()                                  
{
    event.preventDefault()
    function calculate(){
        const algo1 = new fcfsalogithm(Number(n2))
        arr = n1.split(" ").map(Number)
        algo1.accessPage(arr)
        console.log(algo1.pageFaults,arr)
        document.getElementById("t1").innerHTML="FIRST-COME FIRST-SERVE";
        document.getElementById("a1").innerHTML="NUMBER OF PAGE FAULTS : "+algo1.pageFaults;
        
        const algo2 = new Optimal(Number(n2))
        algo2.accessPage(arr)
        document.getElementById("t2").innerHTML="OPTIMAL";
        document.getElementById("a2").innerHTML="NUMBER OF PAGE FAULTS : "+algo2.pageFaults;
        
        const algo3 = new leastrecentlyused(Number(n2))
        algo3.accessPage(arr)
        document.getElementById("t3").innerHTML="LEAST RECENTLY USED";
        document.getElementById("a3").innerHTML="NUMBER OF PAGE FAULTS : "+algo3.pageFaults;
    }

    var n1 = document.getElementById("inp1").value;
    var n2 = document.getElementById("inp2").value;

    document.getElementById("s1").innerHTML="PAGE REFERENCE STRING: "+n1;
    document.getElementById("s2").innerHTML="PAGE FRAME VALUE: "+n2;
    
    calculate()

    document.getElementById("tit1").innerHTML="PROJECT BY";
    document.getElementById("tit2").innerHTML="Aishwarya Sree V  |  Dharshana V  |  Gokulsundar S";
}