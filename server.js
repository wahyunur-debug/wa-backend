const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend jalan");
});

app.post("/cek", (req, res) => {
  const { nomor } = req.body;

  res.json({
    nomor,
    registered: true
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan"));
