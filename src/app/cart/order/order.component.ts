// import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { Component, AfterViewInit, OnDestroy, OnInit, ViewChild } from "@angular/core";


import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from "../../cart.service";
import { OrderService } from "../../order.service";

import { TelNumberPipe } from '../tel-number.pipe';

import { NovaPoshta, NovaPoshtaResponse, Delivery, DeliveryResponse, NovaPoshtaResponsePrice } from './deliverysettings';
import { animate, state, style, transition, trigger } from "@angular/animations";

// import { ReplaySubject, Subject, Observable, SubscriptionLike } from 'rxjs';
import { take, tap, debounceTime, map, delay, mergeMap, shareReplay } from "rxjs/operators";
import {
  Observable, ReplaySubject, Subject, SubscriptionLike, merge, forkJoin
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatSelect } from '@angular/material/select';

import { ErrorStateMatcher } from '@angular/material/core';

import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

// Свой валидатор
const myNameValidator = (control: FormControl) => {
  var condition;
  var data = [];
  data[0] = "м. Вінниця, Вінницька обл.";
  data[1] = "с. Вінницькі Хутори, Вінницький р-н, Вінницька обл.";
  data[2] = "с. Вінинці, Переяслав-Хмельницький р-н, Київська обл.";
  data[3] = "смт. Віньківці, Віньковецький р-н, Хмельницька обл.";
  data[4] = "с. Вінкове, Мукачівський р-н, Закарпатська обл.";
  if (control.value !== 5) {
    return { myNameValidator: 'does not match the condition' }
  }
  return null;
}

// Свой валидатор с параметрами
const myNameValidator3 = (elements: any) => (control: FormControl) => {
  var condition: boolean = false;
  console.log(elements);
  //   if(elements !==undefined) {
  //   elements.forEach(element => {
  //     if(element.Present === control.value) {
  //       condition = true;
  //     }

  //   });
  // }
  // elements.data[0].Addresses
  // const condition = !!control.value && control.value.length > maxLength;
  // if (elements === false) {
  //   return {myNameValidator: 'does not match the condition'};
  // }
  return null;
}

// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }
var argMassiveNovaPoshta: NovaPoshtaResponse[];
var argMassiveFilterNovaPoshta: string[];
var argMassiveВataStream = new BehaviorSubject<(string | undefined)[]>([]);
var filteredServerSideNovaPoshta: ReplaySubject<NovaPoshtaResponse[]> = new ReplaySubject<NovaPoshtaResponse[]>(1);

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [
    TelNumberPipe
  ],
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


export class OrderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  items_shipping;

  items;

  firstNameAutofilled: boolean;
  lastNameAutofilled: boolean;


  firstCtrlName = new FormControl('', [Validators.required]);
  firstCtrlSername = new FormControl('', [Validators.required]);
  firstCtrlEmail = new FormControl('', [Validators.required, Validators.email]);
  firstCtrlTel = new FormControl('', [Validators.required]);
  firstCtrlCity = new FormControl('', [Validators.required]);

  secondCtrlDelivery = new FormControl('', [Validators.required]);

  thirdCtrlAdress = new FormControl('', [Validators.required]);

  nativeSelectFormControl = new FormControl('valid', [
    Validators.required,
    Validators.pattern('valid'),
  ]);

  firstFormGroupLabelName = "Fill out your name:";

  firstFormGroup: FormGroup = new FormGroup({});
  secondFormGroup: FormGroup = new FormGroup({});
  thirdFormGroup: FormGroup = new FormGroup({});

  /** control for filter for server side. */
  public firstCtrlCityFilteringCtrl: FormControl = new FormControl();

  /** indicate search operation is in progress */
  public searching = false;

  unionMassiveCompanyT;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  controlShipp: FormGroup;
  public onFormGroupChangeEvent(_event) {
    this.controlShipp = _event;
    // this.secondFormGroup = this._formBuilder.group({
    //   _event,
    // });
    // this.secondFormGroup = _event;
    // console.log(this.controlShipp);
    this.secondFormGroup.addControl("secondCtrlDelivery", this.controlShipp);
    // this.secondFormGroup.controls["secondCtrlDelivery"] = (this.controlShipp);

    // console.log(_event, this.secondFormGroup['controls'])
  }

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor(private cartService: CartService, private orderService: OrderService, private _formBuilder: FormBuilder, private telNumberPipe: TelNumberPipe, private router: Router) {

  }

  ngOnInit() {

    this.items = this.cartService.getItems();

    this.firstFormGroup = this._formBuilder.group({
      firstCtrlName: ['', Validators.required],
      firstCtrlSername: ['', Validators.required],
      firstCtrlEmail: ['', [Validators.required, Validators.email]],
      firstCtrlTel: ['', [Validators.required]],
      // firstCtrlCity: ['', { validators: [Validators.required, myNameValidator3(this.showCity), this.choosenAdressValidator(this.choosenCity)], updateOn: "change" }],
      // nativeSelectFormControl: ['', [
      //   Validators.required,
      //   Validators.pattern('valid'),
      // ]],
      firstCtrlCity: ['', [Validators.required]],
    });
    // var thirdCtrl2 = new FormControl('', [Validators.required]);
    // this.secondFormGroup = this._formBuilder.group({
    //   thirdCtrl: ['', Validators.required],
    // });
    // this.secondFormGroup = this._formBuilder.group(new FormControl('', [Validators.required]));
    // this.secondFormGroup = new FormGroup({
    //   first: new FormControl()
    // });
    // this.secondFormGroup.setValue("none");
    // console.log(this.secondFormGroup);
    // console.log(this.controlShipp);
    // this.secondFormGroup = this._formBuilder.group(this.controlShipp);



    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrlAdress: ['', Validators.required]
    });
    // this.firstFormGroup.patchValue(
    //   {
    //     firstCtrlName: "Vlad",
    //     firstCtrlSername: "Sliusar",
    //     firstCtrlEmail: "email@example.com",
    //     firstCtrlTel: "+38(066)003-80-56",

    //   }
    // );

    // console.log(searchCityName);

    //   this.orderService.getInstanceList(searchCityName).subscribe((res: NovaPoshta) => {
    //     this.receivedTmpNovaPoshta = res;
    //     this.receivedTmpDisplay = res;
    //     this.showCity = true;

    //   }, error => console.log(error));

    //   this.subscriptionDelivery = this.orderService.getSearchCityByNameDelivery(searchCityName).subscribe((res: Delivery) => {
    //     this.receivedTmpDelivery.status = res.status;
    //     this.receivedTmpDelivery.message = res.message;
    //     this.receivedTmpDelivery.data = new Array();

    //     if(this.receivedTmpNovaPoshta.data[0] !== undefined)
    //     res.data.forEach(element => {
    //       this.receivedTmpNovaPoshta.data[0].Addresses.forEach(elementNovaPoshta => {
    //       if(
    //         ( element.name.toLowerCase() === elementNovaPoshta.MainDescription.toLowerCase() ) &&
    //         ( element.regionName.toLowerCase() === (elementNovaPoshta.Area + " " + elementNovaPoshta.ParentRegionTypes).toLowerCase() )
    //         ) {

    //         elementNovaPoshta.companyDeliveryId = element.id;
    //         this.receivedTmpDelivery.data.push(element);

    //       }
    //       });
    //     });
    //   }, error => console.log(error));

    // NovaPoshta init
    const initialNovaPoshta$ = this.getDataOncenNovaPoshta();
    const updatesNovaPoshta$ = merge(this.updateNovaPoshta$, this.forceReloadNovaPoshta$).pipe(
      mergeMap(() => this.getDataOncenNovaPoshta())
    );

    this.jokesNovaPoshta$ = merge(initialNovaPoshta$, updatesNovaPoshta$);

    // this.jokesNovaPoshta$.pipe(takeUntil(this._onDestroy))
    //   .subscribe(data => {
    //     argMassiveNovaPoshta = data;
    //     // this.ds = new MyDataSource(); 
    //     console.log("Subs work");
    //     for (let i = 0; i < data.length; i++) {
    //       data[i].indexId = i;
    //     }
    //     filteredServerSideNovaPoshta.next(data);
    //     unionMassiveCompanyT = this.unionMassiveCompany(argMassiveNovaPoshta, this.argMassiveDelivery);

    //   });

    // Delivery init
    const initialDelivery$ = this.getDataOnceDelivery();
    const updatesDelivery$ = merge(this.updateNovaPoshta$, this.forceReloadNovaPoshta$).pipe(
      mergeMap(() => this.getDataOnceDelivery())
    );

    this.jokesDelivery$ = merge(initialDelivery$, updatesDelivery$);

    // this.jokesDelivery$.pipe(takeUntil(this._onDestroy))
    //   .subscribe(data => {
    //     this.argMassiveDelivery = data;

    //     this.filteredServerSideDelivery.next(data);
    //     // unionMassiveCompanyT = this.unionMassiveCompany(argMassiveNovaPoshta, this.argMassiveDelivery);

    //   },
    //     error => {
    //       console.log(error);
    //       // handle error...
    //     });

    this.jokesNovaPoshta$.pipe(
      mergeMap((resNovaPoshta) => {
        argMassiveNovaPoshta = resNovaPoshta;
        // filteredServerSideNovaPoshta.next(resNovaPoshta);
        return this.jokesDelivery$
      }),
    )
      .subscribe(resDelivery => {
        console.log("Field 'Town' is ready");
        this.argMassiveDelivery = resDelivery;
        // this.filteredServerSideDelivery.next(resDelivery);
        this.unionMassiveCompanyT = this.unionMassiveCompany(argMassiveNovaPoshta, this.argMassiveDelivery);
      });


      var tmp = {
  
        "CityRecipient": this.firstFormGroup.controls['firstCtrlCity'].value.Ref,
        "Weight": 1,
        "Cost": 100,
  
    }
              // NovaPoshta Price init
              let initialNovaPoshtaPrice$ = this.getDataOncenNovaPoshtaPrice({});
              let updatesNovaPoshtaPrice$ = merge(this.updateNovaPoshtaPrice$, this.forceReloadNovaPoshtaPrice$).pipe(
                mergeMap(() => this.getDataOncenNovaPoshtaPrice({}))
              );
              this.jokesNovaPoshtaPrice$ = merge(initialNovaPoshtaPrice$, updatesNovaPoshtaPrice$);

    this.firstFormGroup.controls['firstCtrlCity'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(data => {
      console.log("data-------------");
      console.log(data);
      // console.log(this.orderService.novaPoshtaPrice(data));
      if(data)
      var tmp = {
  
        "CityRecipient": data.Ref,
        "Weight": 1,
        // "Cost": this.cartService.allPrice(),
  
    }
    console.log(this.cartService.allPrice());
      this.jokesNovaPoshtaPrice$ = this.orderService.novaPoshtaPrice(tmp).pipe(take(1));

      // initialNovaPoshtaPrice$ = this.getDataOncenNovaPoshtaPrice(data.Ref);

      // updatesNovaPoshtaPrice$ = merge(this.updateNovaPoshtaPrice$, this.forceReloadNovaPoshtaPrice$).pipe(
      //   mergeMap(() => this.getDataOncenNovaPoshtaPrice(data.Ref))
      // );
      //         this.jokesNovaPoshtaPrice$ = merge(initialNovaPoshtaPrice$, updatesNovaPoshtaPrice$);
    });



        // // NovaPoshta Price init
        // const initialNovaPoshtaPrice$ = this.getDataOncenNovaPoshtaPrice(tmp);
        // const updatesNovaPoshtaPrice$ = merge(this.updateNovaPoshtaPrice$, this.forceReloadNovaPoshtaPrice$).pipe(
        //   mergeMap(() => this.getDataOncenNovaPoshtaPrice(tmp))
        // );
    
        // this.jokesNovaPoshtaPrice$ = merge(initialNovaPoshtaPrice$, updatesNovaPoshtaPrice$);
    
        this.jokesNovaPoshtaPrice$.pipe(takeUntil(this._onDestroy))
          .subscribe(data => {
            this.priceNovaPoshta = data[0];
            console.log("dataFinal");
            console.log(data);
          });


    this.firstCtrlCityFilteringCtrl.valueChanges
      .pipe(
        // filter(search => !!search),
        tap(() => this.searching = true),
        // takeUntil(this._onDestroy),
        // debounceTime(200),
        map(search => {

          if (!this.unionMassiveCompanyT) {
            console.log(this.unionMassiveCompanyT);

            return [];
          }
          // console.log("bankServerSideFilteringCtrl.valueChanges.pipe");

          // return this.argMassiveNovaPoshta.filter(resp => resp.Present.toLowerCase().indexOf(search) > -1);

          // return argMassiveNovaPoshta.filter(resp => resp.Description.toLowerCase().indexOf(search) > -1);
          return this.unionMassiveCompanyT.filter(resp => resp.nShortName.toLowerCase().indexOf(search) > -1);
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(filteredBanks => {
        this.searching = false;
        if (townSelectOpen) {
          var _cachedData = Array.from<string>({ length: filteredBanks.length });
          this._dataStream = new BehaviorSubject<(string | undefined)[]>(_cachedData);
          for (let i = 0; i < filteredBanks.length; i++) {
            filteredBanks[i].indexId = i;
          }
          this._dataStream.next(filteredBanks);
        }
      },
        error => {
          console.log(error);
          this.searching = false;
        });

        // this.firstCtrlCity.valueChanges
        // .pipe(takeUntil(this._onDestroy))
        // .subscribe(
        //   data => {
        //     console.log("firstCtrlCity.valueChanges");
        //   }
        // );
    // this.bankServerSideCtrl.valueChanges.subscribe(data => {
    // console.log("bankServerSideCtrl.valueChanges: " + data);
    // })



    //   filteredServerSideNovaPoshta
    // .subscribe(data => {

    //   // this._cachedData = Array.from(data, ({ Description }) => Description);

    //   console.log("dfsdf");
    //   // this._dataStream = new BehaviorSubject<(string | undefined)[]>(this._cachedData);

    // // if(townSelectOpen)
    //   this._dataStream.next(data);

    // });



  }
  priceNovaPoshta:NovaPoshtaResponsePrice = {Cost: 0, AssessedCost: 0};

  searchValue: string;
  // ds;

  // argMassiveNovaPoshta: NovaPoshtaResponse[];
  updateNovaPoshta$ = new Subject<void>();

  jokesNovaPoshta$: Observable<Array<NovaPoshtaResponse>>;
  forceReloadNovaPoshta$ = new Subject<void>();

  updateNovaPoshtaPrice$ = new Subject<void>();

  jokesNovaPoshtaPrice$: Observable<Array<NovaPoshtaResponsePrice>>;
  forceReloadNovaPoshtaPrice$ = new Subject<void>();

  public filteredServerSideDelivery: ReplaySubject<DeliveryResponse[]> = new ReplaySubject<DeliveryResponse[]>(1);

  argMassiveDelivery: DeliveryResponse[];
  updateDelivery$ = new Subject<void>();

  jokesDelivery$: Observable<Array<DeliveryResponse>>;
  forceReloadDelivery$ = new Subject<void>();

  ngAfterViewInit() {

    // console.log("ngAfterViewInit");
    // this.setInitialValue();
  }


  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    console.log("setInitialValue");

    filteredServerSideNovaPoshta
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(data => {
        argMassiveFilterNovaPoshta = Array.from(data, ({ Description }) => Description);
        argMassiveВataStream.next(argMassiveFilterNovaPoshta);
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        // this.singleSelect.compareWith = (a: NovaPoshtaResponse, b: NovaPoshtaResponse) => a && b && a.DeliveryCity === b.DeliveryCity;
      });


  }
  townSelectChange() {
    // console.log("Select change");
    // console.log(this.firstFormGroup.controls['firstCtrlCity'].value.Ref);
    var tmp = {
  
        "CityRecipient": this.firstFormGroup.controls['firstCtrlCity'].value.Ref,
        "Weight": 1,
        "Cost": 100,
  
    }
    // this.orderService.forceReloadNovaPoshtaPrice();
    this.forceReload(tmp);
    // Object.assign({}, {name: "one", fg: "1"}, {name: "two", ss: "2"});
    // console.log(tmp);

  
          // initialNovaPoshtaPrice$.next();
  }

  getDataOncenNovaPoshta() {

    // console.log("getDataOncenNovaPoshta");
    return this.orderService.novaPoshta.pipe(take(1));

  }

  getDataOnceDelivery() {

    // console.log("getDataOnceDelivery");
    return this.orderService.delivery.pipe(take(1));

  }

  getDataOncenNovaPoshtaPrice(temp) {

    // console.log("getDataOncenNovaPoshta");
    return this.orderService.novaPoshtaPrice(temp).pipe(take(1));

  }

  choosenAdressValidator = (choosenCity) => (control: FormControl) => {
    // var condition;
    // console.log(control.value.length);
    if (control.value === null || control.value.length === 0) {
      return { myNameValidator: 'Empty field' }
    }
    if (this.choosenCity === undefined) {
      return { myNameValidator: 'Choose City' }
    }
    return null;
  }

  getSumPrice(items): number {
    return this.cartService.getSumPrice(this.items);
  }

  setFirstFormLabel() {
    if (this.firstFormGroup.valid) {
      var firstCtrlNameValue = this.firstFormGroup.controls['firstCtrlName'].value;
      var firstCtrlSernameValue = this.firstFormGroup.controls['firstCtrlSername'].value;
      var firstCtrlEmailValue = this.firstFormGroup.controls['firstCtrlEmail'].value;
      var firstCtrlTelValue = this.firstFormGroup.controls['firstCtrlTel'].value;
      return firstCtrlNameValue + " " + firstCtrlSernameValue + "; "
        + firstCtrlTelValue + "; " + firstCtrlEmailValue + ";";
    }
    else return "Fill out your name";
  }



  // matcher = new MyErrorStateMatcher();
  // matcher2 = new MyErrorStateMatcher();

  setSecondFormLabel() {
    if (this.secondFormGroup.valid) {
      var secondCtrlAdressValue = this.secondFormGroup.controls['secondCtrlDelivery'].value;
      return "Shipping with: " + secondCtrlAdressValue + ";";
    }
    else return "Fill out your shipping";
  }
  setThirdFormLabel() {
    if (this.thirdFormGroup.valid) {
      var thirdCtrlAdressValue = this.thirdFormGroup.controls['thirdCtrlAdress'].value;
      return thirdCtrlAdressValue + ";";
    }
    else return "Fill out your address";
  }
  forceReload(tmp) {
    this.orderService.forceReloadNovaPoshtaPrice(tmp);
    this.forceReloadNovaPoshtaPrice$.next();
  }
  checkTelFocusOut() {
    // this.forceReload();
    
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
  chooseCity(city) {
    // this.firstFormGroup.patchValue(
    //   {
    //     firstCtrlCity: city.Present
    //   });
    this.choosenCity = city;
    this.firstFormGroup.controls['firstCtrlCity'].setValue(city.Present)
    // this.receivedTmp = new NovaPoshta;
    this.showCity = false;
    // this.firstCtrlCity.updateOn = 'blur';

    this.firstCtrlCity.updateValueAndValidity();
    // this.receivedTmp.success = false;
  }

  receivedTmpDisplay: any;
  receivedTmpNovaPoshta: NovaPoshta;
  receivedTmpDelivery: Delivery = new Delivery;
  // receivedTmp2;

  showCity: boolean = false;
  choosenCity;
  // subscriptions: Subscription = new Subscription();
  subscriptionNovaPoshta: SubscriptionLike;
  subscriptionDelivery: SubscriptionLike;
  getCity() {
    var searchCityName = this.firstFormGroup.controls['firstCtrlCity'].value;
    // this.subscriptionNovaPoshta = this.orderService.getSearchCityByNameNovaPoshta
    this.subscriptionNovaPoshta;
    this.orderService.getSearchCityByNameNovaPoshta(searchCityName);
    console.log(this.receivedTmpNovaPoshta);

    // this.jokes$ = this.orderService.jokes;
  }

  DeliveryCitys(): any {
    // console.log(this.receivedTmp);
    if (this.receivedTmpDisplay !== undefined) {
      if (this.receivedTmpDisplay.success) {
        if (this.receivedTmpDisplay.data[0].TotalCount === 0) {
          // this.receivedTmpDisplay.errors = ["Not found"];

          // this.firstFormGroup.controls["firstCtrlCity"].setErrors({ notFound: true });

        }
        else {
          // this.firstFormGroup.controls["firstCtrlCity"].setErrors({ notFound: false });

        }
        // return this.receivedTmpDisplay.data[0].Addresses;
        return this.jokesNovaPoshta$;
      }
      // else return [{error : "Not found" }];
      else {

        return [{ error: this.receivedTmpDisplay.errors }];
      }
    }
    else return "";

  }
  getLog() {
    // console.log( this.firstFormGroup.controls["firstCtrlCity"].errors);
    // console.log(this.firstFormGroup.controls["nativeSelectFormControl"].errors);
    // console.log(this.firstFormGroup.controls["bankServerSideCtrl"].errors);

    // const example =  this.orderService.jokes.pipe(map( ([{ joke }]) => joke + "nonee") );
    // const subscribe = example.subscribe(val => console.log(val));
    // this.orderService.jokes.subscribe(x => console.log(x));
    // console.log(this.firstFormGroup.controls['bankServerSideCtrl'].value);
    // this.secondFormGroup.controls['thirdCtrl'].setValue(this.formCheck.controls['thirdCtrl'].value);
    // this.secondFormGroup.setControl('thirdCtrl', this.formCheck['controls']);
    // console.log(this.formCheck);
    console.log(this.secondFormGroup);
    console.log(this.controlShipp);

    // console.log(this.firstFormGroup.value );

    // console.log(this.selected);
    // console.log(this.argMassiveDelivery);
    // this.doall(argMassiveNovaPoshta, this.argMassiveDelivery);
    // console.log( this.receivedTmpDisplay.error);
    // console.log( this.receivedTmp);
  }
  unionMassiveCompany(tempArgMass1: NovaPoshtaResponse[], tempArgMass2: DeliveryResponse[]) {
    var objMass1 = [];
    var objMass2 = [];

    var objMass = [];

    for (let i = 0; i < tempArgMass1.length; i++) {
      // objMass1[i] = objMass1[i].Description.toString().trim().replace(/\(.*?\)|\s\(.*?\)|\./g, '');
      objMass1.push({
        "nShortName": tempArgMass1[i].Description.toString().trim().replace(/\(.*?\)|\s\(.*?\)|\./g, ''),
        "nNovaPoshta": true,
        "nDelivery": false,
        ...tempArgMass1[i]
      });
    }

    for (let i = 0; i < tempArgMass2.length; i++) {
      // arrayNova[i] = arrayNova[i].toString().trim().replace(/\(.*?\)|\s\(.*?\)|\./g, '');
      objMass2.push({
        "nShortName": tempArgMass2[i].name.toString().trim().replace(/\(.*?\)|\s\(.*?\)|\./g, ''),
        "nDelivery": true,
        "nNovaPoshta": false,
        ...tempArgMass2[i]
      });
    }

    let difference3 = [];
    for (let i = 0; i < objMass1.length; i++) {

      for (let n = 0; n < objMass2.length; n++) {
        if (objMass1[i].nShortName === objMass2[n].nShortName) {
          if (objMass1[i].AreaDescription + " область" === objMass2[n].regionName)
            // if(objMass1[i].SettlementTypeDescription === "місто")
            objMass1[i].nDelivery = true;
          objMass2[n].nNovaPoshta = true;

          difference3.push({ ...objMass1[i], ...objMass2[n] });
        }
      }

    }
    let difference2 = objMass2.filter(
      x => {
        // var ind = Array.from(objMass1, ({ nShortName }) => nShortName).indexOf(x.nShortName);
        if (!Array.from(objMass1, ({ nShortName, AreaDescription }) => nShortName + AreaDescription + " область").includes(x.nShortName + x.regionName)
          // && (
          //   objMass1[ind].AreaDescription +  " область" === x.regionName
          // )
        ) {
          // console.log(ind);
          return true;
        }
        else return false;
      }
    );

    objMass = [...objMass1, ...difference2];
    objMass.sort((a, b) => a.nShortName.localeCompare(b.nShortName));

    // console.log('objMass: ', objMass);
    return objMass;
  }
  doall(tempArgMass1: NovaPoshtaResponse[], tempArgMass2: DeliveryResponse[]) {
    console.log("DANGER | Работа с большими массивами | DANGER");
    console.log(tempArgMass1);
    console.log(tempArgMass2);

    var objMass1 = [];
    var objMass2 = [];

    var objMass = [];

    // this.objectAll.areas[0].areas
    // this.objectNova.areas
    // let objectAll:NovaPoshtaResponse[] = this.argMassiveNovaPoshta;
    // let objectNova:DeliveryResponse[] = this.argMassiveDelivery;
    // .toString().trim().replace(/\s\(.*?\)/g, '')

    let arrayAll = Array.from(tempArgMass1, ({ Description }) => Description);
    // let arrayAll => tempArgMass1.Description

    for (let i = 0; i < tempArgMass1.length; i++) {
      // objMass1[i] = objMass1[i].Description.toString().trim().replace(/\(.*?\)|\s\(.*?\)|\./g, '');
      objMass1.push({
        "nShortName": tempArgMass1[i].Description.toString().trim().replace(/\(.*?\)|\s\(.*?\)|\./g, ''),
        "nNovaPoshta": true,
        "nDelivery": false,
        ...tempArgMass1[i]
      });
    }

    let arrayNova = Array.from(tempArgMass2, ({ name }) => name);
    // let arrayNova => tempArgMass2.name

    // for (let i = 0; i < arrayNova.length; i++) {
    //   arrayNova[i] = arrayNova[i].toString().trim().replace(/\(.*?\)|\s\(.*?\)|\./g, '');
    // }
    for (let i = 0; i < tempArgMass2.length; i++) {
      // arrayNova[i] = arrayNova[i].toString().trim().replace(/\(.*?\)|\s\(.*?\)|\./g, '');
      objMass2.push({
        "nShortName": tempArgMass2[i].name.toString().trim().replace(/\(.*?\)|\s\(.*?\)|\./g, ''),
        "nDelivery": true,
        "nNovaPoshta": false,
        ...tempArgMass2[i]
      });
    }


    // var arrayAll = [];
    // var arrayNova = [];

    console.log(arrayAll);
    console.log(objMass1);
    console.log("------------");
    console.log(arrayNova);
    console.log(objMass2);

    // Пересечение Єти значения есть в обоих массивах
    let intersection = arrayAll.filter(x => arrayNova.includes(x));
    console.log('Пересечение', intersection);

    // Разность В Всех нет єтих значений Новой почті
    // ["Бершадь", "Винница"]
    let difference = arrayAll.filter(x => !arrayNova.includes(x));
    console.log('Разность', difference);

    // Разность В Новой почте нет єтих значений Всех
    // ["Гайсиносі"]
    // let difference2 = arrayNova.filter(x => !arrayAll.includes(x));
    // let difference2 = objMass2.filter(x => !objMass1.includes(x.nShortName));
    let difference3 = [];
    for (let i = 0; i < objMass1.length; i++) {

      for (let n = 0; n < objMass2.length; n++) {
        if (objMass1[i].nShortName === objMass2[n].nShortName) {
          if (objMass1[i].AreaDescription + " область" === objMass2[n].regionName)
            // if(objMass1[i].SettlementTypeDescription === "місто")
            objMass1[i].nDelivery = true;
          objMass2[n].nNovaPoshta = true;

          difference3.push({ ...objMass1[i], ...objMass2[n] });
        }
      }

    }
    let difference2 = objMass2.filter(
      x => {
        // var ind = Array.from(objMass1, ({ nShortName }) => nShortName).indexOf(x.nShortName);
        if (!Array.from(objMass1, ({ nShortName, AreaDescription }) => nShortName + AreaDescription + " область").includes(x.nShortName + x.regionName)
          // && (
          //   objMass1[ind].AreaDescription +  " область" === x.regionName
          // )
        ) {
          // console.log(ind);
          return true;
        }
        else return false;
      }
    );
    // AreaDescription
    // x.regionName
    console.log('Разность2.1', difference3);
    console.log('Разность2', difference2);

    // Симметричная разность 'Сумма' предыдущих разностей
    // ["Бершадь", "Винница", "Гайсиносі"]
    let differenceSimetri = arrayAll.filter(x => !arrayNova.includes(x)).concat(arrayNova.filter(x => !arrayAll.includes(x)));
    console.log('Симметричная разность', differenceSimetri);

    // var objMass = {name: ""};
    // objMass.name = {...arrayAll};
    // var objMass = Object.assign({name}, arrayAll);

    // for (let i = 0; i < arrayAll.length; i++) {
    //   objMass.push({
    //     "nShortName" : arrayAll[i],
    //     ...tempArgMass1[i]
    //   });
    // };
    // for (let i = 0; i < difference2.length; i++) {
    //   objMass.push({
    //     "nShortName" : difference2[i].name,
    //     ...difference2[i]
    //   });
    // };
    objMass = [...objMass1, ...difference2];
    objMass.sort((a, b) => a.nShortName.localeCompare(b.nShortName));

    console.log('objMass: ', objMass);
    return objMass;
    // arrayAll + difference2

  }


  // Area: "71508129-9b87-11de-822f-000c2965ae0e"
  // AreaDescription: "Вінницька"
  // AreaDescriptionRu: "Винницкая "
  // CityID: "558"
  // Conglomerates: null
  // Delivery1: "1"
  // Delivery2: "1"
  // Delivery3: "1"
  // Delivery4: "1"
  // Delivery5: "1"
  // Delivery6: "0"
  // Delivery7: "0"
  // Description: "Ямпіль (Вінницька обл.)"
  // DescriptionRu: "Ямполь (Винницкая обл.)"
  // IsBranch: "0"
  // PreventEntryNewStreetsUser: null
  // Ref: "69da416c-3f5d-11de-b509-001d92f78698"
  // SettlementType: "563ced10-f210-11e3-8c4a-0050568002cf"
  // SettlementTypeDescription: "місто"
  // SettlementTypeDescriptionRu: "город"
  // SpecialCashCheck: 1
  // indexId: 4726



  // ExtracityPickup: false
  // ExtracityShipping: false
  // IsWarehouse: true
  // RAP: false
  // RAS: false
  // RegionId: "c8ad84fe-cf49-e211-9515-00155d012d0d"
  // country: 1
  // districtName: "Ямпільський"
  // id: "3911cd0f-a11d-4a7e-b673-80c078adafa9"
  // name: "Ямпіль"
  // regionId: 3898
  // regionName: "Вінницька область"


  // ds2: DataSource<string | undefined>;
  // private _cachedData;
  _dataStream;
  private _subscription = new Subscription();
  searchCity;
  selected;

  // _cachedData = Array.from<NovaPoshtaResponse>({length: 1});
  // _dataStream = new BehaviorSubject<NovaPoshtaResponse[]>(this._cachedData);

  menuOpened() {
    console.log("Opened");
    townSelectOpen = true;
    // this._dataStream.next(filteredServerSideNovaPoshta);

    // this.ds = new MyDataSource();
    // this.ds.setPageRange(0);
    // this.ds.clearSearch();


    // var _cachedData = Array.from<string>({length: argMassiveNovaPoshta.length});
    // this._dataStream = new BehaviorSubject<(string | undefined)[]>(_cachedData);
    // this._dataStream.next(filteredServerSideNovaPoshta);


    if (this.searchCity)
      this.firstCtrlCityFilteringCtrl.setValue(this.searchCity);
    else
      this.firstCtrlCityFilteringCtrl.setValue("", { emitEvent: true });

    var tempSelected = this.selected;
    this.selected = undefined;
    this.firstFormGroup.controls['firstCtrlCity'].setValue(tempSelected);

    var indexSelect = this.firstFormGroup.controls['firstCtrlCity'].value || undefined;
    if (indexSelect)
      this.viewport.scrollToIndex(indexSelect.indexId);
    else {
      this.viewport.scrollToIndex(20);
      this.viewport.scrollToIndex(0);
    }




    // filteredServerSideNovaPoshta.next(argMassiveNovaPoshta);


    // this.viewport.scrollToIndex(ind, "smooth");

    // if(this.choosenCity !== undefined)
    // this.viewport.scrollToIndex(this.choosenCity);

    // console.log(ind);

  }
  menuClosed() {
    console.log("closed");
    townSelectOpen = false;

    this.selected = this.firstFormGroup.controls['firstCtrlCity'].value;
    // this._subscription.unsubscribe();
    // this.ds.disconnect();
    this.searchCity = this.firstCtrlCityFilteringCtrl.value;
    // console.log(this.choosenCity);
    // this.ds = new MyDataSource();

    // this.ds.setPageRange(0,0);

    // this.ds.destroyed;

  }
  ngOnDestroy() {
    console.log("Destroy");
    if (this.subscriptionNovaPoshta) {
      this.subscriptionNovaPoshta.unsubscribe();
      this.subscriptionNovaPoshta = null;
    }
    if (this.subscriptionDelivery) {
      this.subscriptionDelivery.unsubscribe();
      this.subscriptionDelivery = null;
    }


    this._onDestroy.next();
    this._onDestroy.complete();

  }

}
var townSelectOpen = true;

