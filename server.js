from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

TOKEN = "Ehb562oipTpZUcFXUYCk"

@app.route('/cek', methods=['POST'])
def cek():
    try:
        data = request.get_json()
        nomor = str(data.get("nomor", "")).strip()

        # 🔧 NORMALISASI NOMOR
        nomor = ''.join(filter(str.isdigit, nomor))

        if nomor.startswith("0"):
            nomor = "62" + nomor[1:]

        if not nomor.startswith("62"):
            return jsonify({"registered": False, "note": "format salah"})

        # ⏳ DELAY BIAR GA KENA LIMIT
        time.sleep(0.5)

        # 🔥 KIRIM PESAN KOSONG (LEBIH AMAN)
        res = requests.post(
            "https://api.fonnte.com/send",
            headers={"Authorization": TOKEN},
            data={
                "target": nomor,
                "message": "."  # tidak ganggu user
            }
        )

        result = res.json()

        # 🔍 VALIDASI HASIL
        if result.get("status") == True:
            return jsonify({
                "registered": True,
                "detail": "message sent"
            })
        else:
            return jsonify({
                "registered": False,
                "detail": result
            })

    except Exception as e:
        return jsonify({
            "registered": False,
            "error": str(e)
        })

@app.route('/')
def home():
    return "Backend Aktif"
