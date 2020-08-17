import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { CartService } from "../cart.service";
import {animate,state,style,transition,trigger} from "@angular/animations";

// import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ProgressSpinnerMode } from "@angular/material/progress-spinner";
// import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { retry } from 'rxjs/operators';

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
  // items_shipping_stages;
  // shippingCosts;

  loading: boolean = false;
  
  constructor(private cartService: CartService, private _formBuilder: FormBuilder) {}

  yourShipping: string;

  @Input() shippingInfo = 'info';
  @Input() shippingCost= {    
    novaPoshta : {
      Cost: 0, AssessedCost: 0 ,
    },
    delivery : {
      allSumma: 0,
    }
  };
  @Input() shippingHave:{"nNovaPoshta":boolean, "nDelivery":boolean};

  @Output() private onFormGroupChange = new EventEmitter<any>();

  shippingForm = new FormControl('', [Validators.required]);
  
  ngOnInit() {

    this.onFormGroupChange.emit(this.shippingForm);

    this.loading = true;

    this.cartService.getShippingPrices().subscribe(res => {
      this.items_shipping = this.cartService.getShippingPrices();
      this.loading = false;
    });
  }
  getPriceOfShip(item) {
    if(item.type === "Novaposhta" ){
      return this.shippingCost.novaPoshta.Cost;
    }
    if(item.type === "Delivery" ){
      return this.shippingCost.delivery.allSumma;
    }
    return 0;
  }
  getPriceOfShipAll(item) {
    // var temp: {
    //   'name': string,
    //   'cost': number
    // } = {
    //   'name': item.type,
    //   'cost': this.getPriceOfShip(item)
    // };
    var temp = item.type + " (₴" + this.getPriceOfShip(item) + ")";
    return temp;
  }
  ifDisabled(item) {
    if (this.shippingHave !== undefined) {
    if(item.type === "Delivery") {
      return !this.shippingHave.nDelivery;
    }
    if(item.type === "Novaposhta" ){
      return !this.shippingHave.nNovaPoshta;
    }
    if(item.type === "Another" ){
      return false;
    }
  }
    return true;
  }
  getSumPrice(items): number {
    return this.cartService.getSumPrice(items);
  }
  log(a) {
    console.log(a);
  }
}
