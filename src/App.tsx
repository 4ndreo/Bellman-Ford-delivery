import React, { useEffect, useState } from 'react';
import { Graph, findShortestPath, findShortestPathsToMultipleTargets } from './utils/graph';
import GraphVisualizer from './components/GraphVisualizer';
import { Package } from 'lucide-react';

const App: React.FC = () => {
  const [graph, setGraph] = useState<Graph>(new Graph(5));
  const [source, setSource] = useState<number>(0);
  const [target, setTarget] = useState<number>(4);
  const [result, setResult] = useState<{ path: number[]; distance: number } | null>(null);
  const [multipleTargets, setMultipleTargets] = useState<number[]>([]);
  const [multipleResults, setMultipleResults] = useState<{ [target: number]: { path: number[]; distance: number } } | null>(null);

  useEffect(() => {
    console.log('graph', graph);
  }, [graph]);

  const handleAddEdge = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const source = parseInt(formData.get('source') as string);
    const target = parseInt(formData.get('target') as string);
    const weight = parseInt(formData.get('weight') as string);
    console.log(source, target, weight);
    const newGraph = new Graph(graph.getVerticesCount());
    newGraph.edges = [...graph.edges];
    newGraph.addEdge(source, target, weight);
    setGraph(newGraph);
  };

  const handleFindShortestPath = () => {
    try {
      const result = findShortestPath(graph, source, target);
      setResult(result);
      setMultipleResults(null);
    } catch (error) {
      alert(error);
    }
  };

  const handleFindMultipleShortestPaths = () => {
    try {
      const results = findShortestPathsToMultipleTargets(graph, source, multipleTargets);
      setMultipleResults(results);
      setResult(null);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <Package className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">Package Delivery Route Optimizer</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Add Edge</h2>
              <form onSubmit={handleAddEdge} className="space-y-4">
                <input type="number" name="source" placeholder="Source" className="w-full p-2 border rounded" required />
                <input type="number" name="target" placeholder="Target" className="w-full p-2 border rounded" required />
                <input type="number" name="weight" placeholder="Weight" className="w-full p-2 border rounded" required />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Edge</button>
              </form>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Find Shortest Path</h2>
              <div className="space-y-4">
                <input type="number" value={source} onChange={(e) => setSource(parseInt(e.target.value))} placeholder="Source" className="w-full p-2 border rounded" />
                <input type="number" value={target} onChange={(e) => setTarget(parseInt(e.target.value))} placeholder="Target" className="w-full p-2 border rounded" />
                <button onClick={handleFindShortestPath} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Find Shortest Path</button>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Find Multiple Shortest Paths</h2>
            <div className="space-y-4">
              <input type="text" value={multipleTargets.join(',')} onChange={(e) => setMultipleTargets(e.target.value.split(',').map(Number))} placeholder="Targets (comma-separated)" className="w-full p-2 border rounded" />
              <button onClick={handleFindMultipleShortestPaths} className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600">Find Multiple Shortest Paths</button>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            {result && (
              <div>
                <p>Shortest path: {result.path.join(' -> ')}</p>
                <p>Distance: {result.distance}</p>
              </div>
            )}
            {multipleResults && (
              <div>
                {Object.entries(multipleResults).map(([target, { path, distance }]) => (
                  <div key={target}>
                    <p>Shortest path to {target}: {path.join(' -> ')}</p>
                    <p>Distance: {distance}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Graph Visualization</h2>
            <GraphVisualizer
              vertices={graph.getVerticesCount()}
              edges={graph.edges}
              path={result?.path || Object.values(multipleResults || {}).flatMap(r => r.path)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;