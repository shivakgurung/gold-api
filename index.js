const PORT = 8000;
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();

app.get("/", (req, res) => {
  res.json("This is a real time Nepali gold rate generator api.");
});

app.get("/gold-price", (req, res) => {
  axios.get("https://www.fenegosida.org/rate-history.php").then((response) => {
    const html = response.data;
    // console.log(html);
    const $ = cheerio.load(html);

    //initialization
    const rates = {
      date: "",
      source: "fde",
      metals: [
        { name: "Gold", types: [] },
        { name: "Silver", types: [] },
      ],
    };
  });
});

app.listen(PORT, () => {
  console.log(`The app is running on ${PORT}`);
});
