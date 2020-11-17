import {animate, style, transition, trigger, group, query, stagger, animateChild, state} from '@angular/animations';

/*export const slide =
    trigger(
        'slide',
        [
            transition(
                'void => *', [
                    style({'position': 'relative', 'left': '-100%'  , 'opacity': 0, height: '0' }),
                    animate('300ms', style({'left': '0px', 'opacity': 1, height: '*'}))
                ]
            ),
            transition(
                '* => void', [
                    style({'position': 'relative', 'left': '0px', 'opacity': 1, height: '*'}),
                    animate('300ms', style({'left': '100%', 'opacity': 0, height: '0'}))
                ]
            )]
    );

export const fadeInList =
    trigger('fadeInList', [
        transition('* => *', [ // each time the binding value changes
            query('#realisations div', [
                style({ opacity: 0 }),
                stagger(200, [
                    animate(500, style({ opacity: 1 }))
                ])
            ], { optional: true })
        ])
    ]);*/

export const fadeIn =
    trigger('fadeIn', [
        transition(':enter', [
            style({ opacity: 0}),
            animate(300)
        ])
    ]);

export const fadeOut =
    trigger('fadeOut', [
        transition(':leave', [
            style({ opacity: 1}),
            animate(200, style({ opacity: 0}))
        ])
    ]);

/*export const menuAnimation =
    trigger('menuAnimation', [
        transition(':enter', [
            style({
                overflow: 'hidden',
                height: '*'
            }),
            animate(300)
        ]),
        transition(':leave', [
            style({
                opacity: '0',
                overflow: 'hidden',
                height: '0px'
            }),
            animate(200, style({ opacity: 0}))
        ])
    ]);*/

export const menuAnimation =
    trigger('menuAnimation', [
        state('close', style({ height: '0', 'opacity': 0, 'display': 'none'})),
        state('open', style({ height: '*', 'opacity': 1, 'display': 'bloc' })),
        transition('close => open', animate(300)),
        transition('open => close', animate(200))
    ]);


/*export const thumbAnim =
    trigger('thumbAnim', [
        transition(':enter', [
            style({opacity: 0}),
            animate(1000, style({opacity: 1}))
        ])
    ]);*/


