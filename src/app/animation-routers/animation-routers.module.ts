// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import {animate,state,style,transition,trigger,query,animateChild,group} from "@angular/animations";

// animations: [
//   trigger("routerAnimations", [
//     state(
//       "*",
//       style({
//         height: 0
//       })
//     ),
//     state(
//       "show",
//       style({
//         height: "*"
//       })
//     ),
//     transition("* => *", [animate("400ms cubic-bezier(0.25, 0.8, 0.25, 1)")])
//   ])
// ]

// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
// export class routerAnimations {};
export const routerAnimations =   
trigger("routerAnimations", [
  // state(
  //   "*",
  //   style({
  //     position: "absolute",
  //     left: "0%",
  //     opacity: "1"
  //   })
  // ),
  transition('home => products', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        padding: "0 16px",
      })
    ]),
    query(':enter', [
      style({ left: '-100%'})
    ]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('300ms ease-out', style({ left: '100%'}))
      ]),
      query(':enter', [
        animate('300ms ease-out', style({ left: '0%'}))
      ])
    ]),
    query(':enter', animateChild()),
  ])
  ,
  transition('products => home', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: "0px",
        width: '100%',
        padding: "0 16px",
      })
    ]),
    query(':enter', [
      style({ left: '100%'})
    ]),
    // query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('300ms ease-out', style({ left: '-100%'}))
      ]),
      query(':enter', [
        animate('300ms ease-out', style({ left: '0%'}))
      ])
    ]),
    // query(':enter', animateChild()),
  ])
  ,
  transition('* => cart', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        // left: "0px",
        width: '100%',
        // height: '300%',
        padding: "0 16px",
      })
    ]),
    query(':enter', [
      style({ top: '100%'})
    ]),
    // query(':leave', animateChild()),
    group([
      query(':leave', [
        animate('300ms ease-out', style(
          { 
            top: '-100%',
            opacity: '0',
          }
          ))
      ],{ optional: true }),
      query(':enter', [
        animate('300ms ease-out', style(
          { 
            top: '0%',
            opacity: '1',
          }
          ))
      ])
    ]),
    // query(':enter', animateChild()),
  ])
  ,
  transition('cart => *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        // left: "0px",
        width: '100%',
      

        padding: "0 16px",
      })
    ]),
    query(':enter', [
      style({ top: '-100%'})
    ]),
    // query(':leave', animateChild()),
    group([
      query(':leave',  [
        animate('300ms ease-out', style(
          { 
            top: '100%',
            opacity: '0',
          }
          ))
      ],{ optional: true }),
      query(':enter', [
        animate('300ms ease-out', style(
          { 
            top: '0%',
            opacity: '1',
          }
          ))
      ])
    ]),
    // query(':enter', animateChild()),
  ])
  ,
  transition("order => *", [
    style({ opacity: 0 }),
    animate(500)
    ]),
  // transition('* => home', [
  //   style({ position: 'relative' }),
  //   query(':enter, :leave', [
  //     style({
  //       position: 'absolute',
  //       top: 0,
  //       left: 0,
  //       width: '100%',
  //       padding: "0 16px",
  //     })
  //   ]),
  //   query(':enter', [
  //     style({ top: '100%'})
  //   ]),
  //   // query(':leave', animateChild()),
  //   group([
  //     query(':leave', [
  //       animate('300ms ease-out', style({ top: '-100%'}))
  //     ]),
  //     query(':enter', [
  //       animate('300ms ease-out', style({ top: '0%'}))
  //     ])
  //   ]),
  //   // query(':enter', animateChild()),
  // ])
  // ,
  // transition('home => *', [
  //   style({ position: 'relative' }),
  //   query(':enter, :leave', [
  //     style({
  //       position: 'absolute',
  //       top: 0,
  //       left: 0,
  //       width: '100%',
  //       padding: "0 16px",
  //     })
  //   ]),
  //   query(':enter', [
  //     style({ top: '-100%'})
  //   ]),
  //   query(':leave', animateChild()),
  //   group([
  //     query(':leave', [
  //       animate('300ms ease-out', style({ top: '100%'}))
  //     ]),
  //     query(':enter', [
  //       animate('300ms ease-out', style({ top: '0%'}))
  //     ])
  //   ]),
  //   query(':enter', animateChild()),
  // ])
  // ,

  transition("* => *", [
    style({ opacity: 0 }),
    animate(500)
    ])
  // state(
  //   "products",
  //   style({
  //     position: "absolute",
  //     left: "30%",
  //     opacity: "1"
  //   })
  // ),
  // state(
  //   "home",
  //   style({
  //     position: "absolute",
  //     left: "0%",
  //     opacity: "0"
  //   })
  // ),
  // transition("* => *", [animate("400ms cubic-bezier(0.25, 0.8, 0.25, 1)")])
]);
