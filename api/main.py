from flask import Flask, jsonify, request
from flask_cors import CORS
import bucket

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route("/", methods=["POST"])
def home():
    data = request.get_json()

    if not data:
        return jsonify({"error": True, "error_msg": "No JSON data received"}), 400

    if "folder" not in data:
        return jsonify(
            {
                "error": True,
                "error_msg": "'folder' MUST be in POST request. If you want to view the root directory, set 'folder' to be an empty string.",
            }
        )

    backend_rsp = bucket.getItems(data["folder"])

    return jsonify({"error": False, "folders": backend_rsp[0], "files": backend_rsp[1]})


if __name__ == "__main__":
    app.run(debug=True)
