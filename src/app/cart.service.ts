import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams   } from "@angular/common/http";

import {  throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';

@Injectable()
export class CartService {
  items = [];

  constructor(private http: HttpClient) {
    
  }

  addToCart(product) {
    
    var temp = this.items.indexOf(product)
    if(temp === -1) {
      product.col = 1;
      this.items.push(product);
    }
    else {
      this.items[temp].col = this.items[temp].col+1;
      console.log(this.items[temp]);
    }
      
  }

  delFromCart(index) {
    this.items.splice(index, 1);
  }

  getItems() {
    return this.items;
  }

  clearCart() {
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
  getShippingPrices() {
    return this.http.get("./assets/shipping.json");
  }


}
