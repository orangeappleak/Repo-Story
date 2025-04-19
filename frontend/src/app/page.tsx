'use client';

import { useState, useEffect } from 'react';
import CommitGraph from '@/components/CommitGraph';
import axios from 'axios';
import StorySection from '@/components/StorySection';

const mockCommits = [
  {
    sha: 'a1',
    message: 'Initial commit',
    author: 'karthik',
    date: '2023-01-01',
    parents: [],
  },
  {
    sha: 'b2',
    message: 'Added auth logic',
    author: 'karthik',
    date: '2023-01-02',
    parents: ['a1'],
  },
  {
    sha: 'c3',
    message: 'Fix logout bug',
    author: 'karthik',
    date: '2023-01-03',
    parents: ['b2'],
  },
];

export default function HomePage() {
  const [owner, setOwner] = useState('');
  const [story, setStory] = useState('');
  const [repo, setRepo] = useState('');
  const [commits, setCommits] = useState(mockCommits);

  const fetchRepoData = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/api/repo?owner=${owner}&repo=${repo}`);
    const commits = res.data.commits;
    commits.reverse();
    console.log(commits);
    setCommits(commits);
  };

  const fetchStory = async () => {
    const res = await fetch('http://127.0.0.1:5000/api/story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commits }),
    });
    const data = await res.json();
    setStory(data.story);
  }



  return (
    <main className="p-10 bg-black min-h-screen">
      <input
        type="text"
        placeholder="Enter repo owner"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
        className="mr-2 p-2 border rounded text-white"
      />
      <input
        type="text"
        placeholder="Enter repo name"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
        className="mr-2 p-2 border rounded text-white"
      />
      <button
        onClick={fetchRepoData}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
      <h1 className="text-3xl font-bold mt-4">Repo Visualizer</h1>
      <CommitGraph commits={commits} />
      <div className="mt-6 p-4 bg-black rounded shadow">
        <StorySection
          repoId={`${owner}/${repo}`} // or just repo.full_name
          commits={commits}
        />
      </div>
    </main>
  );
}
