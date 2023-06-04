'use-strict';

const addProcessButton = document.querySelector('.add-process-button');
const addMaxResourceButton = document.querySelector('.add-resource-button');
const calculateButton = document.querySelector('.calculate-button');

const processResource1Input = document.getElementById(
  'input-process-resource1'
);
const processResource2Input = document.getElementById(
  'input-process-resource2'
);
const processResource3Input = document.getElementById(
  'input-process-resource3'
);

const maxResource1Input = document.getElementById('input-max-resource1');
const maxResource2Input = document.getElementById('input-max-resource2');
const maxResource3Input = document.getElementById('input-max-resource3');

const availableResource1 = document.getElementById('input-available-resource1');
const availableResource2 = document.getElementById('input-available-resource2');
const availableResource3 = document.getElementById('input-available-resource3');

const tableAllocationBody = document.getElementById('table-allocation-body');
const tableNeedBody = document.getElementById('table-need-body');
const tableMaxBody = document.getElementById('table-max-body');
const tableAvailableBody = document.getElementById('table-available-body');
const tableAllocatedBody = document.getElementById('table-allocated-body');

const answerText = document.getElementById('answer');

const allocationErrorText = document.getElementById('allocation-error');
const maxErrorText = document.getElementById('max-error');
const availableErrorText = document.getElementById('available-error');

const tables = document.querySelectorAll('.table');

const allocationTable = [];
const maxTable = [];
let maxCounter = 0;
let processNumber = 0;

const isEmpty = function (string) {
  return typeof string === 'string' && string.length === 0;
};

const allNumbers = function (num1, num2, num3) {
  return !(isNaN(num1) || isNaN(num2) || isNaN(num3));
};

const greaterEqualThanZero = function (num1, num2, num3) {
  return num1 >= 0 && num2 >= 0 && num3 >= 0;
};

const needMatrix = function (need) {
  for (let i = 0; i < need.length; i++) {
    const element = `
    <tr>
        <td>P${i}</td>
        <td>${need[i][0]}</td>
        <td>${need[i][1]}</td>
        <td>${need[i][2]}</td>
    </tr>`;
    tableNeedBody.insertAdjacentHTML('beforebegin', element);
  }
};

const availMatrixTable = function (available) {
  const element = `
        <tr>
            <td>${available[0]}</td>
            <td>${available[1]}</td>
            <td>${available[2]}</td>
        </tr>`;
  tableAvailableBody.insertAdjacentHTML('beforebegin', element);
};

const allocatedTable = function (alloc) {
  const element = `
        <tr>
            <td>P${alloc} allocated</td>
        </tr>`;
  tableAllocatedBody.insertAdjacentHTML('beforebegin', element);
};

const bankersAlgorithm = function (allocationArr, maxArr, availableArr) {
  let i, j, k;
  let numProcess = allocationArr.length; // Number of processes
  let numResources = allocationArr[0].length; // Number of resources
  let alloc = allocationArr.slice();
  let max = maxArr.slice();
  let avail = availableArr.slice();

  let finished = [];
  let answerSequence = [];
  let index = 0;

  for (let k = 0; k < numProcess; k++) {
    finished[k] = 0;
  }

  let need = [];
  for (let i = 0; i < numProcess; i++) {
    let need1 = [];
    for (let j = 0; j < numResources; j++) {
      need1.push(max[i][j] - alloc[i][j]);
    }
    need.push(need1);
  }

  needMatrix(need);
  availMatrixTable(avail);

  for (let k = 0; k < numProcess; k++) {
    for (let i = 0; i < numProcess; i++) {
      if (finished[i] == 0) {
        let flag = 0;
        for (let j = 0; j < numResources; j++) {
          if (need[i][j] > avail[j]) {
            flag = 1;
            break;
          }
        }

        if (flag == 0) {
          answerSequence[index++] = i;
          for (let y = 0; y < numResources; y++) {
            avail[y] += alloc[i][y];
          }
          finished[i] = 1;
          allocatedTable(i);
          availMatrixTable(avail);
        }
      }
    }
  }

  console.log('Finished', finished);

  if (finished.every(num => num === 1)) {
    answerText.textContent = 'Safe Sequence!';
    answerText.style.color = 'green';

    for (let i = 0; i < numProcess - 1; i++) {
      console.log(' P' + answerSequence[i] + ' ->');
    }
    console.log(' P' + answerSequence[numProcess - 1]);
  } else {
    answerText.textContent = 'Un-Safe Sequence!';
    answerText.style.color = 'red';
  }
};

// Add Process Button
addProcessButton.addEventListener('click', function () {
  const resource1Input = processResource1Input.value;
  const resource2Input = processResource2Input.value;
  const resource3Input = processResource3Input.value;

  if (
    !isEmpty(resource1Input) &&
    !isEmpty(resource2Input) &&
    !isEmpty(resource3Input) &&
    allNumbers(resource1Input, resource2Input, resource3Input) &&
    greaterEqualThanZero(resource1Input, resource2Input, resource3Input)
  ) {
    allocationTable.push([
      Number(resource1Input),
      Number(resource2Input),
      Number(resource3Input),
    ]);
    const element = `
    <tr>
        <td>P${processNumber++}</td>
        <td>${resource1Input}</td>
        <td>${resource2Input}</td>
        <td>${resource3Input}</td>
    </tr>`;
    tableAllocationBody.insertAdjacentHTML('beforebegin', element);

    tables[0].scrollTo(0, tables[0].scrollHeight);

    allocationErrorText.style.display = 'none';
  } else {
    allocationErrorText.textContent =
      'Enter all 3 resource values, all values must be numbers greater than or equal zero!';
    allocationErrorText.style.display = 'block';
  }

  processResource1Input.value = '';
  processResource2Input.value = '';
  processResource3Input.value = '';
  processResource1Input.focus();
});

// Add Max Button
addMaxResourceButton.addEventListener('click', function () {
  const resource1Input = maxResource1Input.value;
  const resource2Input = maxResource2Input.value;
  const resource3Input = maxResource3Input.value;

  if (
    !isEmpty(resource1Input) &&
    !isEmpty(resource2Input) &&
    !isEmpty(resource3Input) &&
    allNumbers(resource1Input, resource2Input, resource3Input) &&
    greaterEqualThanZero(resource1Input, resource2Input, resource3Input)
  ) {
    maxTable.push([
      Number(resource1Input),
      Number(resource2Input),
      Number(resource3Input),
    ]);
    const element = `
    <tr>
        <td>P${maxCounter++}</td>
        <td>${resource1Input}</td>
        <td>${resource2Input}</td>
        <td>${resource3Input}</td>
    </tr>`;
    tableMaxBody.insertAdjacentHTML('beforebegin', element);

    tables[2].scrollTo(0, tables[2].scrollHeight);

    maxErrorText.style.display = 'none';
  } else {
    maxErrorText.textContent =
      'Enter all 3 resource values, all values must be numbers greater than or equal to zero !';
    maxErrorText.style.display = 'block';
  }

  maxResource1Input.value = '';
  maxResource2Input.value = '';
  maxResource3Input.value = '';
  maxResource1Input.focus();
});

// calculate Button
calculateButton.addEventListener('click', function () {
  const resource1Input = availableResource1.value;
  const resource2Input = availableResource2.value;
  const resource3Input = availableResource3.value;

  if (
    !isEmpty(resource1Input) &&
    !isEmpty(resource2Input) &&
    !isEmpty(resource3Input) &&
    allNumbers(resource1Input, resource2Input, resource3Input) &&
    greaterEqualThanZero(resource1Input, resource2Input, resource3Input)
  ) {
    available = [
      Number(resource1Input),
      Number(resource2Input),
      Number(resource3Input),
    ];
    if (
      allocationTable.length === maxTable.length &&
      allocationTable.length > 0
    ) {
      availableErrorText.style.display = 'none';
      bankersAlgorithm(allocationTable, maxTable, available);
    } else if (allocationTable.length !== maxTable.length) {
      availableErrorText.textContent =
        'Allocation table and Max Allocation table should have the same number of processes!';
      availableErrorText.style.display = 'block';
    } else if (allocationTable.length <= 1) {
      availableErrorText.textContent =
        'Enter more than 1 process to calculate the safety of the sequence';
      availableErrorText.style.display = 'block';
    }
  } else {
    availableErrorText.textContent =
      'Enter all 3 resource values, all values must be numbers greater than or equal to zero!';
    availableErrorText.style.display = 'block';
  }

  availableResource1.value = '';
  availableResource2.value = '';
  availableResource3.value = '';
  availableResource1.blur();
  availableResource2.blur();
  availableResource3.blur();
});
