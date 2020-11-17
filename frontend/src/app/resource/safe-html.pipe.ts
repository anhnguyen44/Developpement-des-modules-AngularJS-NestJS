import { DomSanitizer } from "@angular/platform-browser";
import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: 'safeHtml' })
export class Safe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(value: any, args?: any): any {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}
