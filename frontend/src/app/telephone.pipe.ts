import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telephone'
})
export class TelephonePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
        if (value.charAt(0) !== '+') {
            value = value.replace(/ /g, '');
            value = value.match(/(.{1,2})/g);
            value = value.join(' ');
            return value;
        } else {
            return value;
        }
    } else {
        return '';
    }
  }

}
