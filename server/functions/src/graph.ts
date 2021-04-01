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

    getAdjacent(v : number) {
        return this.adj[v];
    }

    getV() {
        return this.adj.length;
    }
    

}

export default Graph;