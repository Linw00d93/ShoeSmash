const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/mainPage.html');
  });
// API route for updating JSON data
app.get('/api/data/:jordanNumber', (req, res) => {
  const filePath = 'results.json';
  const numberOfJordan = req.params.jordanNumber;
  //console.log(numberOfJordan);
  let shoeNumberArray =["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven",
  "Twelve", "Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen",
  "Twenty","Twenty-one","Twenty-two","Twenty-three","Twenty-four","Twenty-five","Twenty-six",
  "Twenty-seven","Twenty-eight","Twenty-nine","Thirty","Thirty-one","Thirty-two","Thirty-three",
  "Thirty-four","Thirty-five","Thirty-six","Thirty-seven"]
  let increaseVote = "Jordan-" + shoeNumberArray[numberOfJordan];
  console.log(increaseVote)
  // Read the JSON file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    try {
      // Parse the JSON data into a JavaScript object
      const jsonData = JSON.parse(data);
        //console.log(jsonData);
      // Update the object (for example, add or modify a property)
      //results[increaseVote] = results[increaseVote] + 1; 
      let results = jsonData
      results[increaseVote] = results[increaseVote] + 1; 
      //jsonData.updatedProperty = 'This property was added or updated';
      // Write the updated object back to the JSON file
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing file:', writeErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        console.log('JSON file updated successfully.');
      });
      
      // Respond with the updated JSON data
      data = jsonData
      console.log(JSON.stringify(jsonData));
      res.json(JSON.stringify(jsonData));
      res.status(200);
      
      return(data);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

// Start serving the static files and handling other routes
app.listen(5431, () => {
  console.log('Server is running on port 5431');
});
