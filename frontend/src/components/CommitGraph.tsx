'use client';

import React, { useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useEdgesState,
    useNodesState,
    Node,
    Edge,
    type ColorMode,
    MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

type Commit = {
    sha: string;
    message: string;
    author: string;
    date: string;
    parents: string[];
};

interface Props {
    commits: Commit[];
}

type CustomNode = Node<{ label: string }>;
type CustomEdge = Edge;

export default function CommitGraph({ commits }: Props) {
    const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);

    useEffect(() => {
        // Generate nodes from commits
        const newNodes: CustomNode[] = commits.map((commit, i) => ({
            id: commit.sha,
            position: {
                x: (i % 4) * 300,
                y: Math.floor(i / 2) * 160,
            },
            data: {
                label: `${commit.message.slice(0, 40)}...`,
            },
            draggable: true,
            style: {
                width: 240,
                padding: 10,
                fontSize: 12,
                borderRadius: 6,
                border: '1px solid #ccc',
            },
        }));

        // Generate edges from parent relationships
        const newEdges: CustomEdge[] = commits.flatMap((commit) =>
            commit.parents.map((parentSha) => ({
                type: 'smoothstep',
                id: `${parentSha} -> ${commit.sha}`,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 20,
                    color: '#FF0072',
                },
                label: commit.date,
                source: parentSha,
                target: commit.sha,
                animated: true,
                style: { stroke: '#999', color: 'red' },
            }))
        );

        setNodes(newNodes);
        setEdges(newEdges);
    }, [commits, setNodes, setEdges]);

    return (
        <div className="h-[600px] w-full border rounded-md mt-8 shadow-sm">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                colorMode="dark"
                fitView
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
}
