import { Module, Global } from "@nestjs/common";
import { WinModule } from "./win.module";

@Global()
@Module({
    imports: [WinModule],
    exports: [WinModule]
})
export class GlobalModule { }