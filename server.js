const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const TOKEN = "Ehb562oipTpZUcFXUYCk"; // token lu

app.get("/", (req, res) => {
  res.send("API READY");
});

app.post("/cek", async (req, res) => {
  const { nomor } = req.body;

  if (!nomor) {
    return res.json({ nomor, status: "KOSONG" });
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

    const result = await response.json();

    console.log(result);

    // 🔥 FIX INTI DI SINI
    let status = "TIDAK TERDAFTAR";

    if (result && result.status === true) {
      status = "TERDAFTAR";
    }

    res.json({
      nomor,
      status
    });

  } catch (err) {
    console.log(err);
    res.json({
      nomor,
      status: "ERROR SERVER"
    });
  }
});

app.listen(3000, () => console.log("Server jalan"));
