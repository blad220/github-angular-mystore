import { Component, OnInit } from '@angular/core';
import {CartService} from '../cart.service'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  constructor(private cartService: CartService) { }

  items = [];
  itemsColAll;
  ngOnInit() {
    this.items = this.cartService.getItems();
    this.cartService.colAllChange
    .pipe(takeUntil(this.cartService._onDestroy))
    .subscribe((value) => {
      this.itemsColAll = value
    });
  }



}
