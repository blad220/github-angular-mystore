import { Component, OnInit } from "@angular/core";
import { CartService } from "../cart.service";
import {animate,state,style,transition,trigger} from "@angular/animations";

// import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ProgressSpinnerMode } from "@angular/material/progress-spinner";
@Component({
  selector: "app-shipping",
  templateUrl: "./shipping.component.html",
  styleUrls: ["./shipping.component.scss"],
  animations: [
    trigger("slideVertical", [
      state(
        "*",
        style({
          height: 0
        })
      ),
      state(
        "show",
        style({
          height: "*"
        })
      ),
      transition("* => *", [animate("400ms cubic-bezier(0.25, 0.8, 0.25, 1)")])
    ])
  ]
})
export class ShippingComponent implements OnInit {
  items_shipping;
  items_shipping_stages;
  shippingCosts;

  loading: boolean = false;

  objectKeys = Object.keys;

  constructor(private cartService: CartService) {}
  yourShipping: string;
  // seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
  ngOnInit() {
    this.loading = true;
    this.cartService.getShippingPrices().subscribe(res => {
      // let stage;
      this.items_shipping = this.cartService.getShippingPrices();
      // this.items_shipping_stages = this.items_shipping.stages;
      // console.log(this.items_shipping);
      this.loading = false;
    });
    // this.items_shipping = this.cartService.getShippingPrices();
  }
  getSumPrice(items): number {
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += items[i].price;
    }
    return sum;
  }
  log(a) {
    console.log(a);
  }
}
