import { Module, Global } from "@nestjs/common";
import { app } from "electron";
import { WinModule } from "./win.module";

@Global()
@Module({
    providers: [{
        provide: 'IS_DEV',
        useValue: !app.isPackaged
    }],
    imports: [WinModule],
    exports: [WinModule, 'IS_DEV']
})
export class GlobalModule { }