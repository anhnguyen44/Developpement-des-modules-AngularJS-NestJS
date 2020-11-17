import { DomSanitizer } from "@angular/platform-browser";
import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: 'safeStyle' })
export class SafeStyle implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(value: any, args?: any): any {
        return this.sanitizer.bypassSecurityTrustStyle(value);
    }
}
