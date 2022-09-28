//const { wordsToNumbers } = require('words-to-numbers');
const express = require('express');
const fs = require('fs');
const upload = require("express-fileupload")
const app = express();
const port = process.env.PORT || 3000;
app.use(upload())


app.listen(port);
app.set("view engine", "ejs")

app.get("/healthCheck", (req, res, next) => {


  res.status(200).send('Ok')
  next();
})

app.get("/", (req, res, next) => {
  res.render("index.ejs");
  next();

})

app.post('/fileRequest', (req, res, next) => {
  starttime = (new Date()).getTime();
  let file = req.files.dataFile;

  //console.log(Buffer(file.data).toString("utf-8"));
  var str = "";

  for (var i = 0; i < file.data.length; i++) {

    str += String.fromCharCode(file.data[i]);

  }
  var arr = [];
  arr = str.split("\r\n")

  try {
    fs.unlink("output.txt")
  } catch (err) {
    console.error(err)
  }



  for (var i = 0; i < arr.length; i++) {

    var x = arr[i].split(",");

    var a = parseInt(x[0]);
    var b = parseInt(x[1]);

    var c = (a + b) / 2;


    var contents = "The average between " + a + " and " + b + " is " + c + "\n";

    fs.writeFile("output.txt", contents, { flag: 'a' }, (err) => { console.log(err) })
  }

  endtime = (new Date()).getTime();

  var time = (endtime - starttime) / 1000;

  var str = "Processing time: " + time;

  fs.writeFile("output.txt", str, { flag: 'a' }, (err) => { console.log(err) });


  res.render("result.ejs", { time: time })

  next();

})
app.post("/download", (req, res, next) => {
  const fileName = "output.txt";
  const directoryPath = "./";

  console.log(directoryPath)

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });

  
  

})

module.exports = app