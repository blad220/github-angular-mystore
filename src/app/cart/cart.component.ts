import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { Component, OnInit } from "@angular/core";
import { take } from "rxjs/operators";

import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

import { CartService } from "../cart.service";
import { TelNumberPipe } from './tel-number.pipe';

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
  providers: [
    TelNumberPipe
  ],
})
export class CartComponent implements OnInit {
  items;


  constructor(private cartService: CartService) {
    
  }

  ngOnInit() {

    this.items = this.cartService.getItems();

  }

  delFromCart(index) {
    this.cartService.delFromCart(index);
  }

}
