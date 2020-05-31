import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { Component, OnInit } from "@angular/core";
import { take } from "rxjs/operators";

import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

import { CartService } from "../cart.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"]
})
export class CartComponent implements OnInit {
  items;

  firstNameAutofilled: boolean;
  lastNameAutofilled: boolean;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private cartService: CartService, private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.items = this.cartService.getItems();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
  cartItemDel() {

  }
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  // @ViewChild("autosize") autosize: CdkTextareaAutosize;

  // triggerResize() {
  //   // Wait for changes to be applied, then trigger textarea resize.
  //   this._ngZone.onStable
  //     .pipe(take(1))
  //     .subscribe(() => this.autosize.resizeToFitContent(true));
  // }
}
