class Stack {

    private s : number[];

    constructor() {
        this.s = [];
    }

    push(i : number) {
        this.s.push(i);
    }

    pop() {
        let i : number = this.s[0];
        this.s.pop();
        return i;
    }

    isEmpty() {
        if (this.s.length == 0) {
            return true;
        }
        else {
            return false;
        }
    }

    indexOf(e : number) {
        return this.s.indexOf(e);
    }

    size() {
        return this.s.length;
    }
}

export default Stack;