import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";

import { throwError, Observable, Subject } from 'rxjs';
import { retry, catchError, tap, publishReplay, refCount } from 'rxjs/operators';
import { shareReplay, map } from 'rxjs/operators';

import { NovaPoshtaSettings, NovaPoshtaResponse, NovaPoshta, DeliverySettings, DeliveryResponse, Delivery, NovaPoshtaResponsePrice, NovaPoshtaResponsePriceAll } from './cart/order/deliverysettings';
import { CartService } from "../app/cart.service";



@Injectable({
  providedIn: 'root'
})
export class OrderService {

  items = [];

  constructor(private http: HttpClient, private cartService: CartService) {

  }

  ApiCall() {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.novaposhta.ua/v2.0/json/",
      "method": "POST",
      "headers": {
        "content-type": "application/json",

      },
      "processData": false,
      "data": "{\r\n\"apiKey\": \"\",\r\n \"modelName\": \"Address\",\r\n \"calledMethod\": \"searchSettlements\",\r\n \"methodProperties\": {\r\n \"CityName\": \"васильевка\",\r\n \"Limit\": 5\r\n }\r\n}"
    };
    return this.http.get(settings.url, settings);
    // console.log(this.http.post(settings.url, settings));
    // console.log(this.http.get("./assets/shipping.json"));
  }

  public first: string = "";
  public prev: string = "";
  public next: string = "";
  public last: string = "";

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  settingsNovaPoshta: NovaPoshtaSettings = new NovaPoshtaSettings;
  deliverySettings: DeliverySettings = new DeliverySettings;

  public sendGetRequest(searchCityName) {

    // this.settingsNovaPoshta.options.methodProperties.CityName = searchCityName;
    return this.http.post(this.settingsNovaPoshta.REST_API_SERVER, this.settingsNovaPoshta.options).pipe(retry(3), catchError(this.handleError));

    // return this.http.get(this.REST_API_SERVER, options).pipe(retry(3), catchError(this.handleError));
    // return this.http.post(this.REST_API_SERVER, options2).pipe(catchError(this.handleError));

    // const myHeaders = new HttpHeaders().set('Authorization', 'my-auth-token');
    // return this.http.post('http://localhost:3000/postuser', user, {headers:myHeaders}); 
  }
  public getSearchCityByNameNovaPoshta(searchCityName) {
    // this.settingsNovaPoshta.options.methodProperties.CityName = searchCityName;
    // return this.http.post<NovaPoshta>(this.settingsNovaPoshta.REST_API_SERVER, this.settingsNovaPoshta.options).pipe(retry(3), catchError(this.handleError));
    return this.getInstanceList(this.settingsNovaPoshta.options);
  }
  public getPriceNovaPoshta(searchCityName) {
    // this.settingsNovaPoshta.options.methodProperties.CityName = searchCityName;
    // return this.http.post<NovaPoshta>(this.settingsNovaPoshta.REST_API_SERVER, this.settingsNovaPoshta.options).pipe(retry(3), catchError(this.handleError));
    return this.getInstanceListPrice(this.settingsNovaPoshta.price);
  }
  public getSearchCityByNameDelivery(searchCityName) {
    // this.deliverySettings.options.methodProperties.CityName = searchCityName;
    // const url = `${this.deliverySettings.REST_API_SERVER}/${searchCityName}`;
    // var temp:Delivery = new Delivery;
    // temp.forEach(element => {

    // });
    // temp = this.http.get<Delivery>(this.deliverySettings.REST_API_SERVER).pipe(retry(3), catchError(this.handleError));

    return this.http.get<Delivery>(this.deliverySettings.REST_API_SERVER).pipe(retry(3), catchError(this.handleError));
  }

  private _instanceCache = new Map<string, Observable<any>>();

  getInstanceList(params = {}): Observable<NovaPoshta> {
    const key = JSON.stringify(params);
    if (!this._instanceCache.has(key)) {
      // this.settingsNovaPoshta.options.methodProperties.CityName = searchCityName;
      // params = this.settingsNovaPoshta;
      const response = this.http.post(this.settingsNovaPoshta.REST_API_SERVER, params).pipe(
        publishReplay(1),
        refCount()
      );
      this._instanceCache.set(key, response);
    }
    return this._instanceCache.get(key);
  }
  getInstanceListPrice(params = {}): Observable<NovaPoshta> {
    const key = JSON.stringify(params);
    if (!this._instanceCache.has(key)) {
      const response = this.http.post(this.settingsNovaPoshta.REST_API_SERVER, params).pipe(
        publishReplay(1),
        refCount()
      );
      this._instanceCache.set(key, response);
    }
    return this._instanceCache.get(key);
  }

  //  API_ENDPOINT = 'https://api.icndb.com/jokes/random/5?limitTo=[nerdy]';
  CACHE_SIZE = 1;
  //  private cache$: Observable<NovaPoshta>;
  // get jokes() {
  // if (!this.cache$) {
  //   this.cache$ = this.requestJokes().pipe(
  //     shareReplay(this.CACHE_SIZE)
  //   );
  // }

  // return this.cache$;
  // }
  private cacheNovaPoshta$: Observable<Array<NovaPoshtaResponse>>;
  private reloadNovaPoshta$ = new Subject<void>();

  get novaPoshta() {
    if (!this.cacheNovaPoshta$) {
      this.cacheNovaPoshta$ = this.requestNovaPoshta().pipe(
        shareReplay(this.CACHE_SIZE)
      );
    }

    return this.cacheNovaPoshta$;
  }
  // Public facing API to force the cache to reload the data
  forceReloadNovaPoshta() {
    this.reloadNovaPoshta$.next();
    this.cacheNovaPoshta$ = null;
  }
  clearReloadNovaPoshta() {
    this.reloadNovaPoshta$.next();
    // this.cache$ = null;
  }
  // Helper method to actually fetch the jokes
  requestNovaPoshta() {
    return this.http.post<NovaPoshta>(this.settingsNovaPoshta.REST_API_SERVER, this.settingsNovaPoshta.options).pipe(
      map(response => response.data)
    );
  }


  private cacheDelivery$: Observable<Array<DeliveryResponse>>;
  private reloadDelivery$ = new Subject<void>();

  get delivery() {
    if (!this.cacheDelivery$) {
      this.cacheDelivery$ = this.requestDelivery().pipe(
        shareReplay(this.CACHE_SIZE)
      );
    }

    return this.cacheDelivery$;
  }
  // Public facing API to force the cache to reload the data
  forceReloadDelivery() {
    this.reloadDelivery$.next();
    this.cacheDelivery$ = null;
  }
  clearReloadDelivery() {
    this.reloadDelivery$.next();
    // this.cache$ = null;
  }
  // Helper method to actually fetch the jokes
  requestDelivery() {
    return this.http.get<Delivery>(this.deliverySettings.REST_API_SERVER).pipe(
      map(response => response.data)
    );
  }



  private cacheNovaPoshtaPrice$: Observable<Array<NovaPoshtaResponsePrice>>;
  private reloadNovaPoshtaPrice$ = new Subject<void>();

   novaPoshtaPrice(temp) {
    if (!this.cacheNovaPoshtaPrice$) {
      this.cacheNovaPoshtaPrice$ = this.requestNovaPoshtaPrice(temp).pipe(
        shareReplay(this.CACHE_SIZE)
      );
    }

    return this.cacheNovaPoshtaPrice$;
  }
  // Public facing API to force the cache to reload the data
  forceReloadNovaPoshtaPrice(temp) {
    var tmp2 = Object.assign({}, this.settingsNovaPoshta.price.methodProperties, temp);
    this.tmpAll = Object.assign({}, this.settingsNovaPoshta.price, tmp2);

    console.log(temp);
    this.reloadNovaPoshtaPrice$.next();
    this.cacheNovaPoshtaPrice$ = null;
    this.novaPoshtaPrice(temp);

  }
  clearReloadNovaPoshtaPrice() {
    this.reloadNovaPoshtaPrice$.next();
    // this.cache$ = null;
  }
  tmpAll;
  tmp = {
  
    // "CityRecipient": this.firstFormGroup.controls['firstCtrlCity'].value.Ref,
    "Weight": 1,
    "Cost": 100,

}
  // Helper method to actually fetch the jokes
  requestNovaPoshtaPrice(temp) {
    
    var tmp4 = {};
    // console.log(tmp);
    
    var tmp2 = Object.assign({}, this.settingsNovaPoshta.price.methodProperties, temp);
    var tmpAll = Object.assign({}, this.settingsNovaPoshta.price, tmp2);

    this.settingsNovaPoshta.price.methodProperties = tmp2;
    this.settingsNovaPoshta.price.methodProperties.Cost = this.cartService.allPrice();

    // tmp3.methodProperties.CityRecipient  = temp.CityRecipient;
    console.log("TMP------->");
    console.log(temp);
    console.log(this.settingsNovaPoshta.price);
    // console.log(tmpAll);
    // console.log(tmp2);
    // console.log(this.settingsNovaPoshta.price);
    // console.log(tmp2);
    return this.http.post<NovaPoshtaResponsePriceAll>(this.settingsNovaPoshta.REST_API_SERVER, this.settingsNovaPoshta.price).pipe(
      map(response => response.data)
    );
  }


  
}



// NovaPoshta
AddressDeliveryAllowed: true
Area: "Запорізька"
DeliveryCity: "cfbeaca8-4063-11de-b509-001d92f78698"
MainDescription: "Якимівка"
ParentRegionCode: "обл."
ParentRegionTypes: "область"
Present: "смт. Якимівка, Якимівський р-н, Запорізька обл."
Ref: "e7207ef5-4b33-11e4-ab6d-005056801329"
Region: "Якимівський"
RegionTypes: "район"
RegionTypesCode: "р-н"
SettlementTypeCode: "смт."
StreetsAvailability: false
Warehouses: 2

// Delivery
// www.delivery-auto.com/api/v4/Public/
// GetAreasList?
// culture=uk-UA&
// fl_all={fl_all}&
// regionId={regionId}&
// country=1

// return ->
// {
//   "status": true,
//   "message": "",
//   "data": [
//     ...
//   ]}

id: "7e128f11-872a-e311-8b0d-00155d037960"
name: "Якимівка"
RegionId: "d4ad84fe-cf49-e211-9515-00155d012d0d"
IsWarehouse: true
ExtracityPickup: false
ExtracityShipping: false
RAP: false
RAS: false
regionName: "Запорізька область"
regionId: 3904
country: 1
districtName: "Якимівський"

// (NovaPoshta.MainDescription === Delivery.name) &&
// ((NovaPoshta.Area + " " + NovaPoshta.ParentRegionTypes) === Delivery.regionName)
