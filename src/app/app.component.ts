import { Component } from '@angular/core';
import { routerAnimations } from './animation-routers/animation-routers.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerAnimations]
})

export class AppComponent {

  constructor() {

  }

  getState(outlet) {
    var temp = 0;
    if (document.querySelector('.content ')) {
      temp = document.querySelector('.content ').getBoundingClientRect().height;
    }
    var tempProductList = 0;
    if (document.querySelector('.containerOuter')) {
      tempProductList = document.querySelector('.containerOuter').getBoundingClientRect().height;
    }
    return { value: outlet.activatedRouteData.state, params: { numberOfDropdownItems: temp, numberOfDropdownItems2: tempProductList } };
  }
  
  onActivate(elem) {
    let scrollToTop = window.setInterval(() => {
      let pos = elem.scrollTop;
      if (pos > 0) {
        elem.scrollTo(0, pos - 20);
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }

}