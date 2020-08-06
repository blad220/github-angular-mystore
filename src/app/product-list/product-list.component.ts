import { Component } from '@angular/core';
import { CartService } from "../cart.service";
import { products } from '../products';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products = products;
  constructor(
    private cartService: CartService
  ) {}
  share(prod) {
    window.alert('The ' + prod.name + ' has been shared!');
  }
  onNotify(prod) {
    window.alert('You will be notified when the ' + prod.name + ' goes on sale');
  }
  addToCart(product) {
    this.cartService.addToCart(product);
    window.alert('Your product has been added to the cart!');
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/