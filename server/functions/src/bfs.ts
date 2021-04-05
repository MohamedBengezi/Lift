import Graph from './graph';
import Queue from './queue';
import Stack from './stack';

class bfs {

    marked : boolean[];
    private edgeTo : number[];
    private s : number;

    constructor(G : Graph, s : number) {
        this.marked = new Array(G.getV());
        this.edgeTo = new Array(G.getV());
        this.s = s;

        for (let i = 0; i < this.marked.length; i++) {
            this.marked[i] = false;
        }


        this.bfs(G, this.s);
    }

    bfs(G : Graph, s : number) {

        let queue = new Queue();
        this.marked[s] = true;
        queue.enqueue(s);

        while(!queue.isEmpty()) {
            let v : number = queue.dequeue();
            G.getAdjacent(v).forEach(w => {
                if (!this.marked[w]) {
                    this.edgeTo[w] = v;
                    this.marked[w] = true;
                    queue.enqueue(w);
                }
            });
        }
    }
    
    hasPathTo(v : number) {
        return this.marked[v];
    }
    
    pathTo(v : number) {

        if (!this.hasPathTo(v)) {
            return null;
        }

        let path = new Stack();
        for (let x = v; x != this.s; x = this.edgeTo[x]) {
            path.push(x);
        }
        path.push(this.s);
        return path;

    }

}

export default bfs;