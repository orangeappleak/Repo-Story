import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_repo_story(commits):
    commit_summary = "\n".join([
        f"{c['author']} committed on {c['date'][:10]}: {c['message']}"
        for c in commits[:30]
    ])

    prompt = f"""Given this commit history, write a short story summarizing the repository's development:

{commit_summary}

Use an engaging, narrative tone. Mention the growth, refactors, and milestones as a journey. Make it like a story from one piece."""

    chat_completion = client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {"role": "system", "content": "You are a creative storyteller summarizing GitHub projects."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=700
    )

    return chat_completion.choices[0].message.content
