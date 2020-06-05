import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'telNumber'})
export class TelNumberPipe implements PipeTransform {
  transform(value): string {

    var temp = value.toString().trim().replace(/[\+\s\D\(\)\-]/g, '');
    var template = "XXXXXXXXXX"
    var i = 0;
    var str = [];

    temp = temp.toString() + template;

    str[0] = temp.slice(0,2);

    switch (str[0]) {
        case "38":

            i=0;
            break;

        case "80":

            i=-1;
            break;
        
        default:
            i=-2;
    }
    str[1] = temp.slice(2+i,5+i);
    str[2] = temp.slice(5+i,8+i);
    str[3] = temp.slice(8+i,10+i);
    str[4] = temp.slice(10+i,12+i);
    
    
    temp = "+38" + "(" + str[1] + (str[2].length > 0 ? ")" : "") + str[2] + (str[3].length > 0 ? "-" : "") + str[3] + (str[4].length > 0 ? "-" : "") + str[4];
    return temp;
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/