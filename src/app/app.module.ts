import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductAlertsComponent } from './product-alerts/product-alerts.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartService } from './cart.service';
import { CartComponent } from './cart/cart.component';
import { ShippingComponent } from './shipping/shipping.component';

import { MatNativeDateModule } from '@angular/material/core';
import {MaterialModule} from './material-module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { SidenavComponent } from './top-bar/sidenav/sidenav.component';

import { TelNumberPipe } from './cart/tel-number.pipe';
import { OrderComponent } from './cart/order/order.component';

// import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    NgxMatSelectSearchModule,
    RouterModule.forRoot([
      { path: '', component: ProductListComponent, data:{state: 'home'} },
      { path: 'products/:productId', component: ProductDetailsComponent, data:{state: 'products'},},
        // children:[{path: ':productId', component: ProductDetailsComponent, data:{state: 'products'}}] },
      { path: 'cart', component: CartComponent, data:{state: 'cart'} },
      { path: 'cart/order', component: OrderComponent, data:{state: 'order'} },
      { path: 'shipping', component: ShippingComponent, data:{state: 'shipping'} },
      { path: 'sidenav', component: SidenavComponent, data:{state: 'sidenav'} },
    ]),
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    ProductListComponent,
    ProductAlertsComponent,
    ProductDetailsComponent,
    CartComponent,
    ShippingComponent,
    SidenavComponent,
    TelNumberPipe,
    OrderComponent,
  ],
  bootstrap: [ AppComponent ],
  providers: [CartService]
})
export class AppModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/