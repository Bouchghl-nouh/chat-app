require("dotenv").config();
const express = require("express");
const routes = require("./routes/routes");
const cors = require("cors");
const app = express();
app.use(
  cors({
      origin: process.env.CLIENT_URL || "http://localhost:3001",
      credentials: true,
    })
)
app.use(express.json());

app.use("/api", routes);

app.listen(process.env.PORT, () =>
  console.log(`Image service running on ${process.env.PORT}`)
);
