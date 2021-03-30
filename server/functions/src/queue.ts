class Queue {

    private q : number[];

    constructor() {
        this.q = [];
    }

    enqueue(i : number) {
        this.q.push(i);
    }

    dequeue() {
        let i : number = this.q[this.q.length-1];
        this.q.shift();
        return i;
    }

    isEmpty() {
        if (this.q.length == 0) {
            return true;
        }
        else {
            return false;
        }
    }
}

export default Queue;