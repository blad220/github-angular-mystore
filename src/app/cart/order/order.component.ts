import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { Component, OnInit } from "@angular/core";
import { take } from "rxjs/operators";

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from "src/app/cart.service";
import { TelNumberPipe } from '../tel-number.pipe';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [
    TelNumberPipe
  ],
})
export class OrderComponent implements OnInit {

  items;

  firstNameAutofilled: boolean;
  lastNameAutofilled: boolean;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  firstCtrlName = new FormControl('', [Validators.required]);
  firstCtrlSername = new FormControl('', [Validators.required]);
  firstCtrlEmail = new FormControl('', [Validators.required, Validators.email]);
  firstCtrlTel = new FormControl('', [Validators.required]);

  firstFormGroupLabelName = "";

  constructor(private cartService: CartService, private _formBuilder: FormBuilder, private telNumberPipe: TelNumberPipe,private router: Router) {
    
  }

  ngOnInit() {
    // , Validators.pattern(/^[\+38]{3}\(+[0-9]{3}\)+[0-9]{3}\-[0-9]{2}\-[0-9]{2}$/)
    this.items = this.cartService.getItems();

    this.firstFormGroup = this._formBuilder.group({
      firstCtrlName: ['', Validators.required],
      firstCtrlSername: ['', Validators.required],
      firstCtrlEmail: ['', [Validators.required, Validators.email]],
      firstCtrlTel: ['', [Validators.required]]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    // if(!this.items.length) this.router.navigate(["/cart"]);
  }

  setFirstFormLabel() {
    if (this.firstFormGroup.valid) {
      var firstCtrlNameValue = this.firstFormGroup.controls['firstCtrlName'].value;
      var firstCtrlSernameValue = this.firstFormGroup.controls['firstCtrlSername'].value;
      var firstCtrlEmailValue = this.firstFormGroup.controls['firstCtrlEmail'].value;
      var firstCtrlTelValue = this.firstFormGroup.controls['firstCtrlTel'].value;
      this.firstFormGroupLabelName = firstCtrlNameValue + " " + firstCtrlSernameValue + "; "
        + firstCtrlTelValue + "; " + firstCtrlEmailValue + ";";
    }
  }

  checkTel() {

    var firstCtrlTelValue = this.firstFormGroup.controls['firstCtrlTel'].value;
    this.firstFormGroup.patchValue(
      {
        firstCtrlTel: this.telNumberPipe.transform(firstCtrlTelValue)
      }
    );
    // this.firstFormGroupLabelName = "Replace";
    // console.log( this.firstFormGroup.controls['firstCtrlTel'].value);
    // console.log(this.firstFormGroup.value);
  }

}
