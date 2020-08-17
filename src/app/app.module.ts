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

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { AuthGuard } from './cart/order/auth.guard';

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
      { path: 'products/:productId',  component: ProductDetailsComponent, data:{state: 'products'},},
      // { path: '', redirectTo: '/#top', pathMatch: 'prefix',},
        // children:[{path: ':productId', component: ProductDetailsComponent, data:{state: 'products'}}] },
      { path: 'cart', component: CartComponent, data:{state: 'cart'} },
      { path: 'cart/order', component: OrderComponent, canActivate: [AuthGuard], data:{state: 'order'} },
      { path: 'shipping', component: ShippingComponent, data:{state: 'shipping'} },
      { path: 'sidenav', component: SidenavComponent, data:{state: 'sidenav'} },
    ], ),
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

