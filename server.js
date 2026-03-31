// 🔥 WAJIB PALING ATAS
const crypto = require("crypto")
global.crypto = crypto

const express = require("express")
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")

const app = express()
app.use(express.json())

let sock

async function startWA() {
    const { state, saveCreds } = await useMultiFileAuthState("session")

    sock = makeWASocket({
        auth: state
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        const { connection, qr } = update

        if (qr) {
            console.log("🔥 SCAN QR INI:")
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

startWA()

app.post("/cek", async (req, res) => {
    try {
        let nomor = req.body.nomor || ""

        nomor = nomor.replace(/\D/g, "")
        if (nomor.startsWith("0")) nomor = "62" + nomor.slice(1)

        const jid = nomor + "@s.whatsapp.net"

        const result = await sock.onWhatsApp(jid)

        return res.json({
            registered: result.length > 0
        })

    } catch (e) {
        return res.json({
            registered: false,
            error: e.message
        })
    }
})

app.listen(3000, () => {
    console.log("🚀 SERVER JALAN DI PORT 3000")
})
