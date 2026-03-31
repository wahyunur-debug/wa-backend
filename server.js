const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 TOKEN FONNTE LU TARUH DISINI
const TOKEN = "Ehb562oipTpZUcFXUYCk";

app.post("/cek", async (req, res) => {
  const { nomor } = req.body;

  try {
    const response = await fetch("https://api.fonnte.com/validate", {
      method: "POST",
      headers: {
        Authorization: TOKEN
      },
      body: new URLSearchParams({
        target: nomor
      })
    });

    const data = await response.json();

    res.json({
      nomor,
      registered: data.registered || false
    });

  } catch (err) {
    res.json({
      nomor,
      registered: false
    });
  }
});

app.listen(3000, () => console.log("Server jalan"));
