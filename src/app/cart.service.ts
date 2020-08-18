import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams   } from "@angular/common/http";

import {  throwError, Subject } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class CartService {

  items = [];
  colAll:number = 0;
  colAllChange: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  addToCart(product) {
    this.colAll++;
    var temp = this.items.indexOf(product)
    if(temp === -1) {
      product.col = 1;
      this.items.push(product);
    }
    else {
      this.items[temp].col = this.items[temp].col+1;
    }
    this.colAllChange.next(this.colAll);
    this.openSnackBar(product.name + ' added to cart','Close');
  }

  copyToClipboard() {
    this.openSnackBar('Copied to clipboard','Close');
  }

  delFromCart(index) {
    this.colAll -= this.items[index].col;
    this.colAllChange.next(this.colAll)
    this.items.splice(index, 1);
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.colAll = 0;
    this.colAllChange.next(this.colAll)
    this.items = [];
    return this.items;
  }
  allPrice() {
    return this.getSumPrice(this.getItems());
  }
  getSumPrice(sumItems): number {
    let sum = 0;
    for (let i = 0; i < sumItems.length; i++) {
      if(!sumItems[i].col) sumItems[i].col = 1;
      sum += sumItems[i].price * sumItems[i].col;
    }
    return sum;
  }
  getSumCol(): number {
    return this.colAll;
  }
  getShippingPrices() {
    return this.http.get("./assets/shipping.json");
  }

  readonly _onDestroy = new Subject<void>();
  ngOnDestroy() {
    // console.log("Destroy Cart Service");
    if (this.colAllChange) {
      this.colAllChange.unsubscribe();
      this.colAllChange = null;
    }
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
