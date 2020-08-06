import { Component } from '@angular/core';
import { routerAnimations } from './animation-routers/animation-routers.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  animations: [routerAnimations]
})
export class AppComponent  {
  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/