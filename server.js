const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// TOKEN LU (langsung pake)
const TOKEN = "Ehb562oipTpZUcFXUYCk";

app.get("/", (req, res) => {
  res.send("API WA CHECKER READY");
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

    console.log("RESULT:", result);

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
      status: "ERROR"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan di port " + PORT));
