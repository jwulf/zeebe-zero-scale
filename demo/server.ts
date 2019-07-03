import express from "express";
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/lambda1", (req, res) => {
  console.log("/lambda1", req.body);
  res.json({ exampleResponse: true });
});

app.get("/getExample", (req, res) => {
  console.log("/getExample", req.query);
  res.json({
    name: "John Doe",
    address: { street: "Infinity Loop 1", zip: "12345" },
  });
});

app.post("/postExample", (req, res) => {
  console.log("/postExample", req.headers, req.body);
  res.json({
    id: 101,
    title: "foo",
    body: "bar",
    userId: 1,
  });
});

app.listen(port, () =>
  console.log(`Lambda emulator REST endpoint listening on port ${port}!`)
);
