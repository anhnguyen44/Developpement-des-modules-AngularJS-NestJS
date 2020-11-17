import { PipeTransform, Pipe, Injectable } from "@angular/core";

@Pipe({
    name: 'filter',
    pure: false
})
@Injectable()
export class FilterPipe implements PipeTransform {
    tmp: Array<any> = new Array<any>();
    transform(items: any[], field: string, value: string): any[] {
        if (!items) {
            return [];
        }

        if (value === undefined) {
            return items;
        }

        this.tmp = new Array<any>();
        const arr = items.filter(it => it[field] == value);

        for (let i = 0; i < arr.length; ++i) {
            this.tmp.push(arr[i]);
        }
        return this.tmp;
    }
}
