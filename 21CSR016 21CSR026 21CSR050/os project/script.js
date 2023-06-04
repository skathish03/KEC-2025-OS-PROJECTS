function pageFaultsFIFO(pages, n, capacity) {
  let s = new Set();
  var indexes = [];

  let r = capacity + 3,
    c = pages.length + 2,
    val = ' ';
  let arr = new Array(r);
  for (let i = 0; i < r; i++) {
    arr[i] = Array(c).fill(val);
  }
  arr[0][0] = 'steps';
  arr[1][0] = 'values';
  for (let i = 2; i < r - 1; i++) arr[i][0] = 'faults';
  arr[r - 1][0] = 'hit';
  for (let j = 0; j <= pages.length; j++) arr[0][j + 1] = j;

  let page_faults = 0;
  for (let i = 0; i < n; i++) {
    arr[1][2 + i] = pages[i];
    let prev_page_faults = page_faults;
    if (s.size < capacity) {
      if (!s.has(pages[i])) {
        s.add(pages[i]);
        page_faults++;
        // console.log(page_faults);
        indexes.push(pages[i]);
        // console.log(indexes);
      }
    } 
    else {
      if (!s.has(pages[i])) {
        let val = indexes[0];
        indexes.shift();
        s.delete(val);
        s.add(pages[i]);
        indexes.push(pages[i]);
        page_faults++;
      }
    }
    if (prev_page_faults === page_faults) {
      arr[r - 1][i + 2] = '✓';
    } else {
      arr[r - 1][i + 2] = '✗';
    }
    let k = indexes.length - 1,
      ind = 0;
    while (k >= 0) {
      arr[2 + ind][2 + i] = indexes[k];
      ind++;
      k--;
    }
  }
  // console.log(arr);
  buildTable(arr);
  return page_faults;
}

function pageFaultsLRU(pages, n, capacity) {

  let s = new Set();
  let indexes = new Map();
  let page_faults = 0;

  let r = capacity + 3,
    c = pages.length + 2,
    val = ' ';
  let arr2 = new Array(r);
  for (let i = 0; i < r; i++) {
    arr2[i] = Array(c).fill(val);
  }
  arr2[0][0] = 'steps';
  arr2[1][0] = 'values';
  for (let i = 2; i < r - 1; i++) arr2[i][0] = 'faults';
  arr2[r - 1][0] = 'hit';
  for (let j = 0; j <= pages.length; j++) arr2[0][j + 1] = j;

  for (let i = 0; i < n; i++) {
    let prev_page_faults = page_faults;
    arr2[1][2 + i] = pages[i];
    if (s.size < capacity) {
      if (!s.has(pages[i])) {
        s.add(pages[i]);
        page_faults++;
      }
      indexes.set(pages[i], i);
    } else {
      if (!s.has(pages[i])) {
        let lru = Number.MAX_VALUE,
          val = Number.MIN_VALUE;

        for (let itr of s.values()) {
          let temp = itr;
          if (indexes.get(temp) < lru) {
            lru = indexes.get(temp);
            val = temp;
          }
        }
        s.delete(val);
        indexes.delete(val);
        s.add(pages[i]);
        page_faults++;
      }
      indexes.set(pages[i], i);
    }
    if (prev_page_faults === page_faults) {
      arr2[r - 1][i + 2] = '✓';
    } else {
      arr2[r - 1][i + 2] = '✗';
    }
    let k = indexes.size - 1,
      ind = 0;
    for (let itr of indexes) {
      arr2[2 + ind][2 + i] = itr[0];
      ind++;
    }
  }
  console.log(arr2);
  buildTable(arr2);
  return page_faults;
}

function pageFaultsOPT(pages, n, capacity) {

  let s = new Set();
  let indexes = new Map();
  let page_faults = 0;

  let r = capacity + 3,
    c = pages.length + 2,
    val = ' ';
  let arr3 = new Array(r);
  for (let i = 0; i < r; i++) {
    arr3[i] = Array(c).fill(val);
  }
  arr3[0][0] = 'steps';
  arr3[1][0] = 'values';
  for (let i = 2; i < r - 1; i++) arr3[i][0] = 'faults';
  arr3[r - 1][0] = 'hit';
  for (let j = 0; j <= pages.length; j++) arr3[0][j + 1] = j;

  for (let i = 0; i < n; i++) {
    let prev_page_faults = page_faults;
    arr3[1][2 + i] = pages[i];
    if (s.size < capacity) {
      if (!s.has(pages[i])) {
        s.add(pages[i]);
        page_faults++;
      }
      indexes.set(pages[i], i);
    } else {
      if (!s.has(pages[i])) {
        let farthest = -1,
          val = -1;

        for (let itr of s.values()) {
          let temp = itr;
          let found = false;
          for (let j = i + 1; j < n; j++) {
            if (pages[j] === temp) {
              found = true;
              if (j > farthest) {
                farthest = j;
                val = temp;
              }
              break;
            }
          }
          if (!found) {
            val = temp;
            break;
          }
        }
        s.delete(val);
        indexes.delete(val);
        s.add(pages[i]);
        page_faults++;
      }
      indexes.set(pages[i], i);
    }
    if (prev_page_faults === page_faults) {
      arr3[r - 1][i + 2] = '✓';
    } else {
      arr3[r - 1][i + 2] = '✗';
    }
    let k = indexes.size - 1,
      ind = 0;
    for (let itr of indexes) {
      arr3[2 + ind][2 + i] = itr[0];
      ind++;
    }
  }
  console.log(arr3);
  buildTable(arr3);
  return page_faults;
}

function pushData() {
  let summaryCheck = document.querySelector('#Summary').checked;
  if (!summaryCheck) {
    const part1 = document.querySelector('.part1');
    part1.innerHTML = '';
  }

  let pra = document.querySelector('#algorithm').value;
  pra = pra.toString();
  pages = [];
  let inputText = document.getElementById('references').value;

  let frames = Number(document.querySelector('.noofframes').value);
  inputText = inputText.split(' ');
  for (let i = 0; i < inputText.length; i++) {
    inputText[i] = Number(inputText[i]);
    pages.push(Number(inputText[i]));
  }

  let faults = 0;
  if (pra === 'LRU') {
    faults = pageFaultsLRU(pages, pages.length, frames);
  } else if (pra === 'FIFO') {
    faults = pageFaultsFIFO(pages, pages.length, frames);
  }
  else if(pra == 'OPT') {
    faults = pageFaultsOPT(pages,pages.length,frames);
  }
  buildSchedule(frames, pra, pages, faults, summaryCheck);
}


function buildSchedule(frames, str, pages, faults, summaryCheck) {
  
  if (summaryCheck) {
    const part1 = document.querySelector('.part1');
    part1.innerHTML = '';
    const head = document.createElement('div');
    head.id = 'head';
    head.innerHTML = `<h2>Summary - ${str} Algorithm</h2>`;
    part1.appendChild(head);
    const base = document.createElement('div');
    base.id = 'base';
    base.innerHTML = ` <ul>
        <li>Total frames: ${frames}</li>
        <li>Algorithm: ${str}</li>
        <li>Values length: ${pages.length} </li>
        <li>Values: ${pages}</li>
      </ul>`;
    part1.appendChild(base);
  }

  const count = {};
  pages.forEach((element) => {
    count[element] = (count[element] || 0) + 1;
  });
  const distinctPages = Object.keys(count).length;
  const part3 = document.querySelector('.part3');
  part3.innerHTML = '';
  const calcs = document.createElement('div');
  calcs.innerHTML = `<ul><li>Total length: ${pages.length}</li>
        <li>Total distinct values: ${distinctPages}</li>
        <li>Hits: ${pages.length - faults}</li>
        <li>Faults: ${faults}</li>
        <li><b>Hit rate:</b> <b>${((1 - faults / pages.length) * 100).toFixed(2)}</b>%</li>
        <li><b>Miss rate:</b> <b>${((faults / pages.length) * 100).toFixed(2)}</b>%</li></ul>`;
        part3.appendChild(calcs);
        // ${faults}/${pages.length} 
}

function buildTable(arr) {
  const part2 = document.querySelector('.part2');
  part2.innerHTML = '';
  var mytable = '<table>';
  let i = 0,j = 0;
  for (var CELL of arr) {
    mytable += `<tr class="r${i}">`;
    for (var CELLi of CELL) {
      if (CELLi === '✗' || CELLi == '✓') {
        mytable += `<td class="c${j} ${CELLi}">` + CELLi + '</td>';
      } else {
        mytable += `<td class="c${j} ">` + CELLi + '</td>';
      }
      j++;
    }
    j = 0;
    mytable += '</tr>';
    i++;
  }

  mytable += '</table>';
  part2.innerHTML = mytable;
}

function resetForm() {
  document.querySelector(".noofframes").value = "";
  document.querySelector("#algorithm").selectedIndex = 0;
  document.querySelector("#references").value = "";
  document.querySelector("#Summary").checked = true;
}
