const PORT = 8000;
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();

app.get("/", (req, res) => {
  res.json("This is a real-time Nepali gold rate generator API.");
});

app.get("/gold-price", (req, res) => {
  axios
    .get("https://www.fenegosida.org/rate-history.php")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      // Initialization
      const rates = {
        date: "",
        source: "Federation of Nepal Gold and Silver Dealers' Association",
        metals: [
          {
            name: "Gold",
            types: [
              {
                type: "Fine Gold (9999)",
                per10gram: 0,
                per1tola: 0,
                currency: "Nrs",
              },
              {
                type: "Tejabi Gold",
                per10gram: 0,
                per1tola: 0,
                currency: "Nrs",
              },
            ],
          },
          {
            name: "Silver",
            types: [
              {
                type: "Silver",
                per10gram: 0,
                per1tola: 0,
                currency: "Nrs",
              },
            ],
          },
        ],
      };

      // Extract gold rates
      $("#header-rate .rate-gold").each((i, el) => {
        const rateDetails = extractRateDetails($(el));
        const goldType = rates.metals[0].types.find((type) => {
          console.log("type from returned", rateDetails.type);
          console.log("type form structure", type.type);
          // rateDetails.type.includes(type.type.split(" ")[0]);
          type.type == rateDetails.type;
        });
        console.log("gold type", goldType);
        if (goldType) {
          goldType[rateDetails.quantity] = rateDetails.rate;
          console.log("check");
        }
      });

      // Extract silver rates
      $("#header-rate .rate-silver").each((i, el) => {
        const rateDetails = extractRateDetails($(el));
        const silverType = rates.metals[1].types[0];
        silverType[rateDetails.quantity] = rateDetails.rate;
      });

      // console.log(rates);
      res.json(rates);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      res.status(500).send("Error fetching data");
    });
});

app.listen(PORT, () => {
  console.log(`The app is running on ${PORT}`);
});

const extractRateDetails = ($element) => {
  const typeText = $element.find("p").html().split("<br>")[0].trim();
  const rateText = $element.find("b").text().replace(",", "").trim();
  const quantityText = $element.find("span").text();
  const currencyText = quantityText.match(/Nrs|रु/)[0];

  const rate = parseFloat(rateText);
  const quantity = quantityText.includes("10 grm") ? "per10gram" : "per1tola";
  const currency = currencyText;
  // console.log(rate);
  return { type: typeText, quantity, rate, currency };
};
