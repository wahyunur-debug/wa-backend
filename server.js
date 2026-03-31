const express = require("express")
const makeWASocket = require("@whiskeysockets/baileys").default
const { useMultiFileAuthState } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")

const app = express()
app.use(express.json())

let sock

// 🚀 START WA
async function startWA() {
    const { state, saveCreds } = await useMultiFileAuthState("session")

    sock = makeWASocket({
        auth: state
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        const { connection, qr } = update

        if (qr) {
            console.log("\n🔥 SCAN QR INI:\n")
            qrcode.generate(qr, { small: true })
        }

        if (connection === "open") {
            console.log("✅ WA CONNECTED")
        }

        if (connection === "close") {
            console.log("❌ WA DISCONNECT, RECONNECT...")
            startWA()
        }
    })
}

// 🔍 CEK NOMOR
app.post("/cek", async (req, res) => {
    try {
        let nomor = String(req.body.nomor || "").trim()

        // normalisasi
        nomor = nomor.replace(/\D/g, "")
        if (nomor.startsWith("0")) nomor = "62" + nomor.slice(1)

        if (!nomor.startsWith("62")) {
            return res.json({ registered: false })
        }

        const jid = nomor + "@s.whatsapp.net"

        // 🔥 INI VALIDASI REAL
        const result = await sock.onWhatsApp(jid)

        if (result && result.length > 0) {
            return res.json({ registered: true })
        } else {
            return res.json({ registered: false })
        }

    } catch (err) {
        console.log(err)
        res.json({ registered: false })
    }
})

// ROOT
app.get("/", (req, res) => {
    res.send("WA BACKEND AKTIF")
})

// START SERVER
const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
    console.log("🚀 Server jalan di port", PORT)
    await startWA()
})
