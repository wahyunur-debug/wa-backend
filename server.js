const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// ambil dari environment (AMAN)
const TOKEN = process.env.FONNTE_TOKEN || "Ehb562oipTpZUcFXUYCk";

app.get("/", (req, res) => {
  res.send("WA Checker API Ready");
});

app.post("/cek", async (req, res) => {
  const { nomor } = req.body;

  if (!nomor) {
    return res.status(400).json({ error: "Nomor kosong" });
  }

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
    console.log(err);
    res.json({
      nomor,
      registered: false
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan di port " + PORT));
