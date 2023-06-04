function stringToMatrix(inputString) {
    var lines = inputString.split("\n");
    var matrix = [];
    for (var i = 0; i < lines.length; i++) {
      var values = lines[i].split(" "); // Splitting by space; use "," if values are comma-separated
      var row = [];
      for (var j = 0; j < values.length; j++) {
        row.push(parseInt(values[j]));
      }
      matrix.push(row);
    }
    return matrix;
  }
  
  const express = require('express');
  const bodyParser = require('body-parser');
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  app.post('/output', (req, res) => {
    try {
      var { Process, Resources, Allocation, Max, Available } = req.body;
      Process = parseInt(Process);
      Resources = parseInt(Resources);
      Allocation = stringToMatrix(Allocation);
      Max = stringToMatrix(Max);
      Available = stringToMatrix(Available)[0];
      console.log(Process);
      console.log(Resources);
      console.log(Allocation);
      console.log(Max);
      console.log(Available);
  
      function isSafeState(processes, resources, allocation, max, available) {
        const numProcesses = processes;
        const numResources = resources;
  
        const work = available.slice();
        const finish = Array(numProcesses).fill(false);
  
        const need = [];
        for (let i = 0; i < numProcesses; i++) {
          const row = [];
          for (let j = 0; j < numResources; j++) {
            row.push(max[i][j] - allocation[i][j]);
          }
          need.push(row);
        }
  
        let safeSequence = [];
        let isSafe = false;
  
        while (safeSequence.length < numProcesses) {
          let found = false;
  
          for (let i = 0; i < numProcesses; i++) {
            if (!finish[i] && checkResourcesAvailable(need[i], work)) {
              for (let j = 0; j < numResources; j++) {
                work[j] += allocation[i][j];
              }
  
              safeSequence.push(i);
              finish[i] = true;
              found = true;
            }
          }
  
          if (!found) {
            break;
          }
        }
  
        if (safeSequence.length === numProcesses) {
          isSafe = true;
        }
  
        return { isSafe, safeSequence, need };
      }
  
      function checkResourcesAvailable(need, work) {
        const numResources = need.length;
  
        for (let i = 0; i < numResources; i++) {
          if (need[i] > work[i]) {
            return false;
          }
        }
  
        return true;
      }
  
      const result = isSafeState(Process, Resources, Allocation, Max, Available);
  
      res.send('<h1>Output:</h1> <br>Is the system in a safe state?' + result.isSafe + '<br>Safe sequence: ' + result.safeSequence + '<br>Need matrix: ' + JSON.stringify(result.need));
    } catch (error) {
      res.send('<h1>Output:</h1> Error, invalid input');
    }
  });
  
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });