from flask import Flask, request, jsonify
from services.github import fetch_repo_data
from services.storyGen import generate_repo_story
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

@app.route("/api/repo", methods=["GET"])
def get_repo():
    owner = request.args.get("owner")
    repo = request.args.get("repo")
    print(owner, repo)
    if not owner or not repo:
        return jsonify({"error": "Missing owner or repo"}), 400
    return jsonify(fetch_repo_data(owner, repo))



@app.route("/api/story", methods=["POST"])
def story():
    data = request.get_json()
    if not data or "commits" not in data:
        return jsonify({"error": "Missing commit data"}), 400

    story = generate_repo_story(data["commits"])
    response = jsonify({"story": story})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == "__main__":
    app.run(debug=True, port=5000)
