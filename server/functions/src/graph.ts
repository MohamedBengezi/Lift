import './NodeList';
import NodeList from './NodeList';

class Graph {

    private adj : number[][];

    constructor(V : number) {
        this.adj = [];

        for (let i = 0; i < V; i++) {
            this.adj[i] = []; 
        }
    }

    addEdge(v : number, w : number) {
        this.adj[v].push(w);
        this.adj[w].push(v);
    }
    

}

export default Graph;