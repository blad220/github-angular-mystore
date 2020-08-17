import {animate,state,style,transition,trigger,query,animateChild,group} from "@angular/animations";

export const routerAnimations =
 trigger("routerAnimations", [

  transition('home => products', [
    style({ 
      // position: 'relative' 
    }),
    query(':enter, :leave', [
      style({
        width: '100%',
        padding: "0 16px",
        display: 'block', 
        'grid-area': 'main',
        // height: 'max-content',
        // transform: "translate(0%, 0%)",
      })
    ]),
    query('.footer', [
      style({
        opacity:'0',
        transform: "translate(0%, 50%)",
      })
    ]),
    query(':enter', [
      style({ 
        transform: 'translate(-100%, 0%)',
        // position: 'fixed',
        // 'max-height':'100%',
      })
    ]),
    query(':leave', [
      style({
        'max-height': '899px',
        overflow: 'hidden',
      })
    ], { optional: true },),
    query(':self', [
      style({
        // 'max-height':'100%',
        overflow: 'hidden',
        // position: 'fixed'
      })
    ]),
    // query(':leave', animateChild()),
    group([
      query(':self', [
        animate('1ms 302ms ease-out', style({  overflow: 'auto',}))
      ]),
      query(':leave', [
        animate('300ms ease-out', style({  transform: 'translate(100%, 0%)',  opacity:0,'max-height':'{{numberOfDropdownItems}}px',})),
      ], { optional: true },),
      query(':enter', [
        animate('300ms ease-out', style({  transform: 'translate(0%, 0%)'})),
      ]),
      query('.footer', [
        animate('300ms 0ms ease-out', style({  opacity:'1', transform: "translate(0%, 0%)",}))
      ]),

    ]),
    // query(':enter', animateChild()),
  ])
  ,

  transition('products => home', [
    style({ 
      // position: 'relative' 
    }),

    query(':enter, :leave', [
      style({
        width: '100%',
        padding: "0 16px",
        display: 'block', 
        'grid-area': 'main',
        // height: 'max-content',
        // transform: "translate(0%, 0%)",
      })
    ]),
    query('.footer', [
      style({
        opacity:'0',
        transform: "translate(0%, 50%)",
      })
    ]),
    query(':enter', [
      style({ 
        transform: 'translate(100%, 0%)',
        // 'max-height':'100%',
      })
    ]),
    query(':leave',  [
      style({
        'max-height': '899px',
        // overflow: 'hidden',
      })
    ], { optional: true },),
    query(':self', [
      style({
        overflow: 'hidden',
      })
    ]),
    // query(':self', [
    //   style({ position: 'absolute', top: 0,})
    // ]),
    // query(':leave', animateChild()),
    group([
      query(':self', [
        
        animate('1ms 302ms ease-out', style({  overflow: 'auto',}))
      ]),
      query(':leave', [
        animate('300ms ease-out', style({  transform: 'translate(-100%, 0%)',  opacity:1,'max-height':'0px',})),
        // animate('1300ms ease-out', style({  'max-height':'0px',})),

      ], { optional: true },),
      query(':enter', [
        
        animate('300ms ease-out', style({  transform: 'translate(0%, 0%)'}))
      ]),
      query('.footer', [
        
        animate('300ms 0ms ease-out', style({  opacity:'1', transform: "translate(0%, 0%)",}))
      ]),

    ]),
    // query(':enter', animateChild()),
  ])
  ,
  transition('* => cart', [
    style({ 
      // position: 'relative' 
    }),

    query(':enter, :leave', [
      style({
        width: '100%',
        padding: "0 16px",
        display: 'block', 
        'grid-area': 'main',        
        // height: 'max-content',
        // transform: "translate(0%, 0%)",
      })
    ]),
    query('.footer', [
      style({
        opacity:'0',
        transform: "translate(0%, 100%)",
      })
    ]),
    query(':enter', [
      style({ 
        transform: 'translate(0%, -100%)',
        // 'max-height':'100%',
      })
    ]),
    query(':leave', [
      style({
        // 'max-height': '899px',
        overflow: 'hidden',
      })
    ], { optional: true },),
    query(':self', [
      style({
        overflow: 'hidden',
      })
    ]),
    // query(':self', [
    //   style({ position: 'absolute', top: 0,})
    // ]),
    // query(':leave', animateChild()),
    group([
      query(':self', [
        
        animate('1ms 302ms ease-out', style({  overflow: 'auto',}))
      ]),
      query(':leave', [
        animate('300ms ease-out', style({  transform: 'translate(0%, 100%)',  opacity:1,'max-height': '0px',})),
        // animate('1300ms ease-out', style({  'max-height':'0px',})),

      ], { optional: true },),
      query(':enter', [
        
        animate('300ms ease-out', style({  transform: 'translate(0%, 0%)'}))
      ]),
      query('.footer', [
        
        animate('300ms 0ms ease-out', style({  opacity:'1', transform: "translate(0%, 0%)",}))
      ]),

    ]),
    // query(':enter', animateChild()),
  ])
  ,
  transition('cart => *', [
    style({ 
      // position: 'relative' 
    }),

    query(':enter, :leave', [
      style({
        width: '100%',
        padding: "0 16px",
        display: 'block', 
        'grid-area': 'main',
      })
    ]),
    query('.footer', [
      style({
        opacity:'0',
        transform: "translate(0%, 100%)",
      })
    ]),
    query(':enter', [
      style({ 
        transform: 'translate(0%, {{numberOfDropdownItems2}}px)',
      })
    ]),
    query(':leave', [
      style({
        // 'max-height': '899px',
        // overflow: 'hidden',
      })
    ], { optional: true },),
    query(':self', [
      style({
        overflow: 'hidden',
      })
    ]),
    // query(':self', [
    //   style({ position: 'absolute', top: 0,})
    // ]),
    // query(':leave', animateChild()),
    group([
      query(':self', [
        
        animate('1ms 302ms ease-out', style({  overflow: 'auto',}))
      ]),
      query(':leave', [
        animate('300ms ease-out', style({  transform: 'translate(0%, -100%)',  opacity:1})),
        // animate('1300ms ease-out', style({  'max-height':'0px',})),

      ], { optional: true },),
      query(':enter', [
        
        animate('300ms ease-out', style({  transform: 'translate(0%, 0%)'}))
      ]),
      query('.footer', [
        
        animate('300ms 0ms ease-out', style({  opacity:'1', transform: "translate(0%, 0%)",}))
      ]),

    ]),
    // query(':enter', animateChild()),
  ])
  ,
  transition("order => *", [
    style({ opacity: 0 }),
    animate(500)
    ]),
  transition("* => *", [
    style({ opacity: 0 }),
    animate(500)
    ])
]);
