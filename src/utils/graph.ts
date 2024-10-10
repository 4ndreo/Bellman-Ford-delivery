import { PriorityQueue } from './priorityQueue';

interface Edge {
  source: number;
  target: number;
  weight: number;
  time?: number;
}

export class Graph {
  private vertices: number;
  public edges: Edge[];

  constructor(vertices: number) {
    this.vertices = vertices;
    this.edges = [];
  }

  addEdge(source: number, target: number, weight: number, time?: number) {
    this.edges.push({ source, target, weight, time });
  }

  getVerticesCount(): number {
    return this.vertices;
  }
  
  // Método para encontrar la ruta menos costosa
  bellmanFord(source: number): { distances: number[]; predecessors: number[] } {
    const distances: number[] = new Array(this.vertices).fill(Infinity);
    const predecessors: number[] = new Array(this.vertices).fill(-1);
    distances[source] = 0;

    // Optimización: Usar una cola de prioridad para procesar los nodos
    const queue = new PriorityQueue<number>((a, b) => distances[a] - distances[b]);
    queue.enqueue(source);

    const inQueue: boolean[] = new Array(this.vertices).fill(false);
    inQueue[source] = true;

    let iterations = 0;
    const maxIterations = this.vertices * this.edges.length;

    while (!queue.isEmpty() && iterations < maxIterations) {
      const u = queue.dequeue()!;
      inQueue[u] = false;

      for (const { source, target, weight } of this.edges) {
        if (source === u) {
          if (distances[u] !== Infinity && distances[u] + weight < distances[target]) {
            distances[target] = distances[u] + weight;
            predecessors[target] = u;
            if (!inQueue[target]) {
              queue.enqueue(target);
              inQueue[target] = true;
            }
          }
        }
      }

      iterations++;
    }

    // Detección de ciclos negativos
    if (iterations === maxIterations) {
      throw new Error("Graph contains a negative weight cycle");
    }

    return { distances, predecessors };
  }

  getPath(predecessors: number[], target: number): number[] {
    const path: number[] = [];
    let current = target;
    while (current !== -1) {
      path.unshift(current);
      current = predecessors[current];
    }
    return path;
  }

  // Método para encontrar la ruta más rápida
  dijkstra(source: number): { times: number[]; predecessors: number[] } {
    const times: number[] = new Array(this.vertices).fill(Infinity);
    const predecessors: number[] = new Array(this.vertices).fill(-1);
    times[source] = 0;

    const queue = new PriorityQueue<number>((a, b) => times[a] - times[b]);
    queue.enqueue(source);

    while (!queue.isEmpty()) {
      const u = queue.dequeue()!;

      for (const { source, target, time } of this.edges) {
        if (source === u && time !== undefined) {
          if (times[u] + time < times[target]) {
            times[target] = times[u] + time;
            predecessors[target] = u;
            queue.enqueue(target);
          }
        }
      }
    }

    return { times, predecessors };
  }
}

export function findShortestPath(graph: Graph, source: number, target: number): { path: number[]; distance: number } {
  const { distances, predecessors } = graph.bellmanFord(source);
  const path = graph.getPath(predecessors, target);
  return { path, distance: distances[target] };
}

export function findShortestPathsToMultipleTargets(graph: Graph, source: number, targets: number[]): { [target: number]: { path: number[]; distance: number } } {
  const { distances, predecessors } = graph.bellmanFord(source);
  const result: { [target: number]: { path: number[]; distance: number } } = {};

  for (const target of targets) {
    const path = graph.getPath(predecessors, target);
    result[target] = { path, distance: distances[target] };
  }

  return result;
}

export function findFastestPath(graph: Graph, source: number, target: number): { path: number[]; time: number } {
  const { times, predecessors } = graph.dijkstra(source);
  const path = graph.getPath(predecessors, target);
  return { path, time: times[target] };
}

export function findFastestPathsToMultipleTargets(graph: Graph, source: number, targets: number[]): { [target: number]: { path: number[]; time: number } } {
  const { times, predecessors } = graph.dijkstra(source);
  const result: { [target: number]: { path: number[]; time: number } } = {};

  for (const target of targets) {
    const path = graph.getPath(predecessors, target);
    result[target] = { path, time: times[target] };
  }

  return result;
}