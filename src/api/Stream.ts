export default class Stream<T> {
    private data: T[];
    private pos: number = 0;

    constructor(data: T[]) {
        this.data = data;
    }

    public get length(): number {
        return this.data.length;
    }

    public hasNext(): boolean {
        return this.pos < this.data.length;
    }

    public next(): T | null {
        if (this.hasNext()) {
            return this.data[this.pos++];
        }
        return null;
    }

    public peek(): T | null {
        if (this.hasNext()) {
            return this.data[this.pos];
        }
        return null;
    }
    
    public skip(n: number): void {
        this.pos += n;
    }

}