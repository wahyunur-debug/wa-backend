from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

TOKEN = "Ehb562oipTpZUcFXUYCk"

@app.route('/')
def home():
    return "WA Checker Backend Aktif"

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
            return jsonify({
                "nomor": nomor,
                "keterangan": "TIDAK AKTIF",
                "wa": "TIDAK TERDAFTAR"
            })

        # ⏳ DELAY BIAR GA KENA LIMIT
        time.sleep(0.5)

        # 🔥 HIT API FONNTE
        res = requests.post(
            "https://api.fonnte.com/send",
            headers={"Authorization": TOKEN},
            data={
                "target": nomor,
                "message": "."  # tidak ganggu
            }
        )

        result = res.json()

        # 🔍 CEK STATUS
        if result.get("status") == True:
            wa = "TERDAFTAR"
            keterangan = "AKTIF"
        else:
            wa = "TIDAK TERDAFTAR"
            keterangan = "TIDAK AKTIF"

        return jsonify({
            "nomor": nomor,
            "keterangan": keterangan,
            "wa": wa
        })

    except Exception as e:
        return jsonify({
            "nomor": nomor,
            "keterangan": "ERROR",
            "wa": "ERROR",
            "error": str(e)
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
