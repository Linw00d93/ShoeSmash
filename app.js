const path = require("path");
const fs = require("fs");
const https = require('https');
const express = require("express");
const app = express();
const cors = require("cors");
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;


/*Enable CORS for all routes*/
app.use(cors());

/*Serve static files from the 'public' directory*/
app.use(express.static("public"));
app.get("/", function (req, res){
    res.sendFile(__dirname + "/public/mainPage.html");
  });
app.get("/results", function(req, res){
  const filePath = "results.json";
  fs.readFile(filePath, "utf8", function (err, data){
    if (err) {
    console.error("Error reading file:", err);
    res.status(500).json({ error: "Internal Server Error" });
    console.log("Error")
    return;
    }
        try {
        // Parse the JSON data into a JavaScript object
        const jsonData = JSON.parse(data);
        res.send(jsonData);
        console.log(data);
        return(data);
        } 
        catch (parseError) {
    console.error("Error parsing JSON:", parseError);
    res.status(500).json({ error: "Internal Server Error" });
    }
  });
});
app.get("/graph", function(req, res){
  res.sendFile(__dirname + "/public/results.html");
});
// API route for updating JSON data
app.get("/api/data/:jordanNumber", (req, res) => {
  const filePath = "results.json";
  const numberOfJordan = req.params.jordanNumber;
  console.log(numberOfJordan);
  let shoeNumberArray =["ERROR","One","Two","Three","Four","Five","Six","Seven","Eight",
  "Nine","Ten","Eleven", "Twelve", "Thirteen","Fourteen","Fifteen","Sixteen",
  "Seventeen","Eighteen","Nineteen","Twenty","Twenty-one","Twenty-two",
  "Twenty-three","Twenty-four","Twenty-five","Twenty-six",
  "Twenty-seven","Twenty-eight","Twenty-nine","Thirty","Thirty-one",
  "Thirty-two","Thirty-three","Thirty-four","Thirty-five","Thirty-six",
  "Thirty-seven"];
  let increaseVote = "Jordan-" + shoeNumberArray[numberOfJordan];
  //console.log(increaseVote)
  //Read the JSON file
  fs.readFile(filePath, "utf8", function (err, data){
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    try {
      // Parse the JSON data into a JavaScript object
      const jsonData = JSON.parse(data);
        //console.log(jsonData);
      // Update the object (for example, add or modify a property)
      //results[increaseVote] = results[increaseVote] + 1; 
      let results = jsonData;
      results[increaseVote] = results[increaseVote] + 1;
      //jsonData.updatedProperty = 'This property was added or updated';
      // Write the updated object back to the JSON file
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Error writing file:", writeErr);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }
        console.log("JSON file updated successfully.");
      });
      
      // Respond with the updated JSON data
      data = jsonData;
      const date = new Date();
      const formattedDate = date.toLocaleString();
      console.log(formattedDate + " "+ JSON.stringify(jsonData));
      res.json(JSON.stringify(jsonData));
      res.status(200);
      
      return(data);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    // Listen for worker exit events
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
  } else {
  // Read the SSL/TLS certificate and private key files
  const privateKey = fs.readFileSync('shoesmash.linw00djr.com/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/shoesmash.linw00djr.com/cert.pem', 'utf8');

  // Create credentials using the certificate and private key
  const credentials = {
    key: privateKey,
    cert: certificate,
  };

  // Create an HTTPS server
  const httpsServer = https.createServer(credentials, app);

  // Start serving the static files and handling other routes over HTTPS
  httpsServer.listen(443, () => {
    console.log('Server is running on port 443');
  });
}