from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

TOKEN = "Ehb562oipTpZUcFXUYCk"

@app.route('/')
def home():
    return "Backend Aktif 🚀"

@app.route('/cek', methods=['POST'])
def cek():
    try:
        data = request.get_json()
        nomor = str(data.get("nomor", "")).strip()

        # FORMAT NOMOR
        if nomor.startswith("0"):
            nomor = "62" + nomor[1:]

        if not nomor.startswith("62"):
            return jsonify({"registered": False})

        res = requests.post(
            "https://api.fonnte.com/validate",
            headers={"Authorization": TOKEN},
            data={"target": nomor},
            timeout=10
        )

        return jsonify(res.json())

    except Exception as e:
        return jsonify({
            "registered": False,
            "error": str(e)
        })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
