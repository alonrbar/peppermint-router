export class WaitHandle<T = void> {

    private _resolve: (result?: T | PromiseLike<T>) => void;
    private _reject: (err?: Error) => void;
    private readonly promise: Promise<T>;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    public wait(): Promise<T> {
        return this.promise;
    }

    public resolve(result?: T | PromiseLike<T>): void {
        this._resolve(result);
    }

    public reject(err?: Error): void {
        this._reject(err);
    }
}