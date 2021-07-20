import { Injectable } from "../decorators";

@Injectable('MyService')
export class MyService {
    constructor() {
        // do nothing
    }

    public getDelayTime(): number {
        return 2;
    }
}