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
  console.log(req.body);
  res.json({ ok: true });
});

app.post("/lambda2", (req, res) => {
  console.log(req.body);
  res.json({ ok: true });
});

app.listen(port, () =>
  console.log(`Lambda emulator REST endpoint listening on port ${port}!`)
);
