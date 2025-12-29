require("dotenv").config();
const express = require("express");
const routes = require("./routes/routes");

const app = express();
app.use(express.json());

app.use("/api", routes);

app.listen(process.env.PORT, () =>
  console.log(`Image service running on ${process.env.PORT}`)
);
