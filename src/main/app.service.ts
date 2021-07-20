import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    public getDelayTime(): number {
        return 2;
    }
}
