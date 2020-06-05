import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CartService {
  items = [];

  constructor(private http: HttpClient) {}

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

  getShippingPrices() {
    return this.http.get("./assets/shipping.json");
  }
}
