import requests
import json

GITHUB_API = "https://api.github.com"
HEADERS = {"Accept": "application/vnd.github.v3+json"}

def fetch_repo_data(owner, repo):
    repo_url = f"{GITHUB_API}/repos/{owner}/{repo}"
    commits_url = f"{GITHUB_API}/repos/{owner}/{repo}/commits"
    branches_url = f"{GITHUB_API}/repos/{owner}/{repo}/branches"
    pulls_url = f"{GITHUB_API}/repos/{owner}/{repo}/pulls?state=all"

    # Basic repo meta
    repo_data = requests.get(repo_url, headers=HEADERS).json()
    
    # Fetch first 50 commits
    commits_raw = requests.get(commits_url, headers=HEADERS).json()
    print(json.dumps(commits_raw, indent=5))
    commits = [
        {
            "sha": c["sha"],
            "message": c["commit"]["message"],
            "author": c["commit"]["author"]["name"],
            "date": c["commit"]["author"]["date"],
            "parents": [p["sha"] for p in c["parents"]]
        }
        for c in commits_raw if "commit" in c
    ]

    branches = requests.get(branches_url, headers=HEADERS).json()
    pulls = requests.get(pulls_url, headers=HEADERS).json()

    return {
        "repo": {
            "name": repo_data.get("name"),
            "full_name": repo_data.get("full_name"),
            "description": repo_data.get("description"),
            "stargazers_count": repo_data.get("stargazers_count"),
            "forks_count": repo_data.get("forks_count"),
            "updated_at": repo_data.get("updated_at"),
        },
        "commits": commits,
        "branches": branches,
        "pulls": pulls
    }
