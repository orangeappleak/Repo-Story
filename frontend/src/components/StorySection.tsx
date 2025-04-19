'use client';

import { useState, useRef } from 'react';

interface Props {
    repoId: string; // e.g., "vercel/next.js"
    commits: any[];
}

export default function StorySection({ repoId, commits }: Props) {
    const [story, setStory] = useState('');
    const [loading, setLoading] = useState(false);
    const cache = useRef<Map<string, string>>(new Map());

    const handleStoryGeneration = async () => {
        if (cache.current.has(repoId)) {
            setStory(cache.current.get(repoId) || '');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:5000/api/story', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commits }),
            });

            const data = await res.json();
            cache.current.set(repoId, data.story);
            setStory(data.story);
        } catch (err) {
            console.error('Story generation failed:', err);
            setStory('[Error generating story]');
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:5000/api/story', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commits }),
            });

            const data = await res.json();
            cache.current.set(repoId, data.story);
            setStory(data.story);
        } catch (err) {
            console.error('Story regeneration failed:', err);
            setStory('[Error regenerating story]');
        } finally {
            setLoading(false);
        }
    };

    const hasCachedStory = cache.current.has(repoId);

    return (
        <div className="mt-6 p-4 bg-black border-2 border-white rounded shadow max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">📜 Repo Story</h2>
                <div className="flex gap-2">
                    {!hasCachedStory && (
                        <button
                            onClick={handleStoryGeneration}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Generating...' : 'Generate Story'}
                        </button>
                    )}
                    {hasCachedStory && (
                        <button
                            onClick={handleRegenerate}
                            className="px-3 py-1 text-sm bg-yellow-500 text-black rounded hover:bg-yellow-600"
                            disabled={loading}
                        >
                            {loading ? 'Regenerating...' : 'Regenerate Story'}
                        </button>
                    )}
                </div>
            </div>

            <p className="whitespace-pre-line text-sm leading-relaxed">
                {story || (loading ? 'Loading story...' : 'No story yet.')}
            </p>
        </div>
    );
}
