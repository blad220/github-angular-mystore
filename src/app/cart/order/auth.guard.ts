import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { CartService } from '../../cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private cartService: CartService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.cartService.items.length) {
    //   return this.router.createUrlTree(
    //     ['/notauth', { message: 'you do not have the permission to enter' }]
    //     // { skipLocationChange: true }
    //   );
      this.router.navigateByUrl('/cart');
      return false;
    } else {
      return true;
    }
  }
}
