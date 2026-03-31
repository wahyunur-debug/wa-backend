from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

TOKEN = "Ehb562oipTpZUcFXUYCk"

@app.route('/cek', methods=['POST'])
def cek():
    data = request.get_json()
    nomor = data.get("nomor")

    try:
        res = requests.post(
            "https://api.fonnte.com/validate",
            headers={"Authorization": TOKEN},
            data={"target": nomor}
        )

        return jsonify(res.json())

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/')
def home():
    return "Backend WA Checker Active"

if __name__ == "__main__":
    app.run()
