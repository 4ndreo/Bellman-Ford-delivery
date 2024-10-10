import React, { useEffect, useRef } from 'react';

interface Edge {
  source: number;
  target: number;
  weight: number;
  time?: number;
}

interface GraphVisualizerProps {
  vertices: number;
  edges: Edge[];
  path?: number[];
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ vertices, edges, path }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = Math.min(width, height) / 3;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw edges
    edges.forEach(({ source, target, weight, time }) => {
      const angle1 = (source / vertices) * 2 * Math.PI;
      const angle2 = (target / vertices) * 2 * Math.PI;
      const x1 = centerX + radius * Math.cos(angle1);
      const y1 = centerY + radius * Math.sin(angle1);
      const x2 = centerX + radius * Math.cos(angle2);
      const y2 = centerY + radius * Math.sin(angle2);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = path && path.includes(source) && path.includes(target) ? 'red' : 'black';
      ctx.stroke();

      // Draw weight and time
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      ctx.fillStyle = 'blue';
      ctx.fillText(`${weight}${time !== undefined ? ` (${time})` : ''}`, midX, midY);
    });

    // Draw vertices
    for (let i = 0; i < vertices; i++) {
      const angle = (i / vertices) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = path && path.includes(i) ? 'red' : 'white';
      ctx.fill();
      ctx.strokeStyle = 'black';
      ctx.stroke();

      ctx.fillStyle = 'black';
      ctx.fillText(i.toString(), x - 5, y + 5);
    }
  }, [vertices, edges, path]);

  return <canvas ref={canvasRef} width={500} height={500} />;
};

export default GraphVisualizer;