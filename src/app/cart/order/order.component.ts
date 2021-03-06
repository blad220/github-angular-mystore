// import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { Component, AfterViewInit, OnDestroy, OnInit, ViewChild, AfterViewChecked, AfterContentInit } from "@angular/core";


import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from "../../cart.service";
import { OrderService } from "../../order.service";

import { TelNumberPipe } from '../tel-number.pipe';

import { NovaPoshta, NovaPoshtaResponse, Delivery, DeliveryResponse, NovaPoshtaResponsePrice,  DeliveryResponsePrice } from './deliverysettings';

import { take, tap, debounceTime, map, delay, mergeMap,  } from "rxjs/operators";
import {
  Observable, ReplaySubject, Subject, SubscriptionLike, merge, forkJoin, observable
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BehaviorSubject, Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [
    TelNumberPipe
  ],
  animations: []
})


export class OrderComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  items = [];

  firstFormGroup: FormGroup = new FormGroup({});
  secondFormGroup: FormGroup = new FormGroup({});
  thirdFormGroup: FormGroup = new FormGroup({});

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

  /** control for filter for server side. */
  public firstCtrlCityFilteringCtrl: FormControl = new FormControl();

  /** indicate search operation is in progress */
  public searching = false;

  unionMassiveCompanyT;
  fieldTownReadyBool = false;

  controlShipp: FormGroup;

  public onFormGroupChangeEvent(_event) {
    this.controlShipp = _event;
    this.secondFormGroup.addControl("secondCtrlDelivery", this.controlShipp);
  }

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  searchNoneBool = false;
  priceShipping = {
    novaPoshta: {
      Cost: 0, AssessedCost: 0,
    },
    delivery: {
      allSumma: 0,
    }
  };

  priceDelivery: DeliveryResponsePrice = { allSumma: 0, status: false };

  updateNovaPoshta$ = new Subject<void>();

  obsNovaPoshta$: Observable<Array<NovaPoshtaResponse>>;
  forceReloadNovaPoshta$ = new Subject<void>();

  updateNovaPoshtaPrice$ = new Subject<void>();

  obsNovaPoshtaPrice$: Observable<Array<NovaPoshtaResponsePrice>>;
  forceReloadNovaPoshtaPrice$ = new Subject<void>();

  updateDeliveryPrice$ = new Subject<void>();

  obsDeliveryPrice$: Observable<Array<DeliveryResponsePrice>>;
  forceReloadDeliveryPrice$ = new Subject<void>();

  argMassiveDelivery: DeliveryResponse[];
  argMassiveNovaPoshta: NovaPoshtaResponse[];

  updateDelivery$ = new Subject<void>();

  obsDelivery$: Observable<Array<DeliveryResponse>>;
  forceReloadDelivery$ = new Subject<void>();

  _dataStream;
  searchCity;
  selected;
  townSelectOpen = true;

  constructor(private cartService: CartService, private orderService: OrderService, private _formBuilder: FormBuilder,
    private telNumberPipe: TelNumberPipe, private router: Router,) {
    console.log('Constructor');
    // this.fieldTownReadyBool = false;

  }

  ngOnInit() {
    console.log('ngOnInit');


    // NovaPoshta init
    const initialNovaPoshta$ = this.getDataOncenNovaPoshta();
    const updatesNovaPoshta$ = merge(this.updateNovaPoshta$, this.forceReloadNovaPoshta$).pipe(
      mergeMap(() => this.getDataOncenNovaPoshta())
    );

    this.obsNovaPoshta$ = merge(initialNovaPoshta$, updatesNovaPoshta$);

    // Delivery init
    const initialDelivery$ = this.getDataOnceDelivery();
    const updatesDelivery$ = merge(this.updateNovaPoshta$, this.forceReloadNovaPoshta$).pipe(
      mergeMap(() => this.getDataOnceDelivery())
    );

    this.obsDelivery$ = merge(initialDelivery$, updatesDelivery$);

    this.obsNovaPoshta$.pipe(
      mergeMap((resNovaPoshta) => {
        this.argMassiveNovaPoshta = resNovaPoshta;
        // filteredServerSideNovaPoshta.next(resNovaPoshta);
        return this.obsDelivery$
      }),
      // delay(500),
      takeUntil(this._onDestroy),
      // debounceTime(100),
    ).subscribe(resDelivery => {
      console.log("Field 'Town' is ready");
      this.argMassiveDelivery = resDelivery;
      // this.filteredServerSideDelivery.next(resDelivery);
      this.fieldTownReadyBool = true;
      this.unionMassiveCompanyT = this.unionMassiveCompany(this.argMassiveNovaPoshta, this.argMassiveDelivery);
    });




  }

  ngAfterViewInit() {

    console.log("ngAfterViewInit");

    // NovaPoshta Price init

    let initialNovaPoshtaPrice$ = this.getDataOncenNovaPoshtaPrice({});
    let updatesNovaPoshtaPrice$ = merge(this.updateNovaPoshtaPrice$, this.forceReloadNovaPoshtaPrice$).pipe(
      mergeMap(() => this.getDataOncenNovaPoshtaPrice({}))
    );
    this.obsNovaPoshtaPrice$ = merge(initialNovaPoshtaPrice$, updatesNovaPoshtaPrice$);


    // Delivery Price init

    let initialDeliveryPrice$ = this.getDataOncenDeliveryPrice({});
    let updatesDeliveryPrice$ = merge(this.updateDeliveryPrice$, this.forceReloadDeliveryPrice$).pipe(
      mergeMap(() => this.getDataOncenDeliveryPrice({}))
    );
    this.obsDeliveryPrice$ = merge(initialDeliveryPrice$, updatesDeliveryPrice$);

    //NovaPoshta Price Get
    this.obsNovaPoshtaPrice$.pipe(
      tap(() => this.priceShipping.novaPoshta.Cost = -1),
      // delay(500),
      takeUntil(this._onDestroy)
    ).subscribe(data => {
      if (data[0]) {
        this.priceShipping['novaPoshta'] = data[0];
      }
    });

    // Delivery Price Get
    this.obsDeliveryPrice$.pipe(
      tap(() => this.priceShipping.delivery.allSumma = -1),
      takeUntil(this._onDestroy)
    ).subscribe(data => {
      if (data[0]) {
        this.priceShipping['delivery'] = data[0];
      }
    });

    this.firstCtrlCityFilteringCtrl.valueChanges
      .pipe(
        // filter(search => !!search),
        tap(() => this.searching = true),
        map(search => {

          if (!this.unionMassiveCompanyT) {
            // console.log(this.unionMassiveCompanyT);
            return [];
          }

          return this.unionMassiveCompanyT.filter(resp => resp.nShortName.toLowerCase().indexOf(search.toLowerCase()) > -1);

        }),
        delay(500),
        takeUntil(this._onDestroy)
      ).subscribe(filtered => {
        this.searching = false;
        if (this.townSelectOpen) {
          var _cachedData = Array.from<string>({ length: filtered.length });
          this._dataStream = new BehaviorSubject<(string | undefined)[]>(_cachedData);
          for (let i = 0; i < filtered.length; i++) {
            filtered[i].indexId = i;
          }
          if (!filtered.length) this.searchNoneBool = true;
          else this.searchNoneBool = false;
          this._dataStream.next(filtered);
        }
      }, error => {
        console.log(error);
        this.searching = false;
      });
  }

  ngAfterContentInit() {

    console.log("ngAfterContentInit");

    this.items = this.cartService.getItems();

    this.firstFormGroup = this._formBuilder.group({
      firstCtrlName: ['', Validators.required],
      firstCtrlSername: ['', Validators.required],
      firstCtrlEmail: ['', [Validators.required, Validators.email]],
      firstCtrlTel: ['', [Validators.required]],
      firstCtrlCity: ['', [Validators.required]],
    });

    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrlAdress: ['', Validators.required]
    });
    // this.fieldTownReadyBool = false;
    // this.setInitialValue();

    // this.firstFormGroup.controls['firstCtrlName'].setValue('Vlad');
    // this.firstFormGroup.controls['firstCtrlSername'].setValue('Sliusar');
    // this.firstFormGroup.controls['firstCtrlEmail'].setValue('blad220@mail.ru');
    // this.firstFormGroup.controls['firstCtrlTel'].setValue('0667938824');

  }

  townSelectChange() {
    console.log('Town Select Change');

    this.secondFormGroup.controls['secondCtrlDelivery'].reset();

    var dataTown = this.firstFormGroup.controls['firstCtrlCity'].value;

    if (dataTown) {

      if (dataTown.nNovaPoshta) {

        var tmpNov = {
          "CityRecipient": dataTown.Ref,
          "Weight": 1,
          "Cost": 100,
        }

        this.orderService.forceReloadNovaPoshtaPrice(tmpNov);
        this.forceReloadNovaPoshtaPrice$.next();

      }
      else this.priceShipping['novaPoshta'] = { Cost: 0, AssessedCost: 0, };
      if (dataTown.nDelivery) {

        var tmpDel = {
          'areasResiveId': dataTown.id,
          InsuranceValue: this.cartService.allPrice(),
          CashOnDeliveryValue: this.cartService.allPrice(),
        }

        this.orderService.forceReloadDeliveryPrice(tmpDel);
        this.forceReloadDeliveryPrice$.next();

        var requestDeliveryWarehouses = this.orderService.requestDeliveryWarehouses(dataTown.id);

        requestDeliveryWarehouses.pipe(
          mergeMap((resNovaPoshta) => {
            this.priceShipping.delivery.allSumma = -1;
            var tmpDeliveryPriceWarehouses = {
              'warehouseResiveId': resNovaPoshta['data'][0].id,
              'InsuranceValue': this.cartService.allPrice(),
              'CashOnDeliveryValue': this.cartService.allPrice(),
            }
            return this.orderService.requestDeliveryPriceWarehouses(tmpDeliveryPriceWarehouses);
          }),
          // delay(1500),
          takeUntil(this._onDestroy),
        ).subscribe(resDelivery => {
          this.priceShipping.delivery.allSumma = resDelivery['allSumma'];
        });

      }
      else this.priceShipping['delivery'] = { allSumma: 0, };
    }

  }


  getDataOncenNovaPoshta() {
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
  getDataOncenDeliveryPrice(temp) {

    // console.log("getDataOncenNovaPoshta");
    return this.orderService.deliveryPrice(temp).pipe(take(1));

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

  checkTelFocusOut() {

    var firstCtrlTelValue = this.firstFormGroup.controls['firstCtrlTel'].value;
    this.firstFormGroup.patchValue(
      {
        firstCtrlTel: this.telNumberPipe.transform(firstCtrlTelValue)
      }
    );

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
          if (objMass1[i].AreaDescription + " область" === objMass2[n].regionName) {
            // if(objMass1[i].SettlementTypeDescription === "місто")
            objMass1[i].nDelivery = true;
            objMass2[n].nNovaPoshta = true;
            // objMass1[i].id = objMass2[n].id;
            objMass1[i] = { ...objMass1[i], ...objMass2[n] };
            difference3.push({ ...objMass1[i], ...objMass2[n] });
          }
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

    return objMass;
  }

  menuOpened() {
    // console.log("Opened");
    this.townSelectOpen = true;

    if (this.searchCity)
      this.firstCtrlCityFilteringCtrl.setValue(this.searchCity);
    else
      this.firstCtrlCityFilteringCtrl.setValue("", { emitEvent: true });

    var tempSelected = this.selected;
    // this.selected = undefined;
    this.firstFormGroup.controls['firstCtrlCity'].setValue(tempSelected);

    var indexSelect = this.firstFormGroup.controls['firstCtrlCity'].value || undefined;
    if (indexSelect)
      this.viewport.scrollToIndex(indexSelect.indexId);
    else {
      this.viewport.scrollToIndex(20);
      this.viewport.scrollToIndex(0);
    }

  }
  menuClosed() {
    // console.log("closed");
    this.townSelectOpen = false;

    this.selected = this.firstFormGroup.controls['firstCtrlCity'].value;
    this.searchCity = this.firstCtrlCityFilteringCtrl.value;

  }
  ngOnDestroy() {

    console.log("Destroy");
    this._onDestroy.next();
    this._onDestroy.complete();

  }






  /**
 * -------------------Test functions----------------
 */
  getLog() {
    // console.log( this.firstFormGroup.controls["firstCtrlCity"].errors);
    // console.log(this.firstFormGroup.controls["nativeSelectFormControl"].errors);
    // console.log(this.firstFormGroup.controls["bankServerSideCtrl"].errors);

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
  doall(tempArgMass1: NovaPoshtaResponse[], tempArgMass2: DeliveryResponse[]) {
    console.log("DANGER | Работа с большими массивами | DANGER");
    console.log(tempArgMass1);
    console.log(tempArgMass2);

    var objMass1 = [];
    var objMass2 = [];

    var objMass = [];


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

    // Пересечение: Єти значения есть в обоих массивах
    let intersection = arrayAll.filter(x => arrayNova.includes(x));
    console.log('Пересечение', intersection);

    // Разность: В Всех нет єтих значений Новой почті
    // ["Бершадь", "Винница"]
    let difference = arrayAll.filter(x => !arrayNova.includes(x));
    console.log('Разность', difference);

    // Разность: В Новой почте нет єтих значений Всех
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

    // Симметричная разность: 'Сумма' предыдущих разностей
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

}


