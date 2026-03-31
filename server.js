import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.FONNTE_TOKEN;

// health check
app.get("/", (req, res) => {
  res.send("API WA VALIDATOR AKTIF");
});

// 🔥 VALIDASI NOMOR WA (TANPA KIRIM PESAN)
app.post("/cek", async (req, res) => {
  try {
    let { nomor } = req.body;

    if (!nomor) {
      return res.status(400).json({ error: "nomor kosong" });
    }

    // normalisasi
    nomor = nomor.toString().replace(/\D/g, "");
    if (nomor.startsWith("0")) nomor = "62" + nomor.slice(1);

    if (!nomor.startsWith("62")) {
      return res.json({ nomor, registered: false });
    }

    const response = await fetch("https://api.fonnte.com/validate", {
      method: "POST",
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: nomor,
      }),
    });

    const result = await response.json();

    res.json({
      nomor,
      registered: result.registered || false,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log("SERVER RUNNING DI PORT " + PORT);
});
