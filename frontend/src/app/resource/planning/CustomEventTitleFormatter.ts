import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import {formatDate} from '@angular/common';
import {isSameDay} from 'date-fns';
import {AleaEvent} from './AleaEvent';

export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {

    // you can override any of the methods defined in the parent class

    month(event: CalendarEvent): string {
        return this.formatDuration(event);
    }

    week(event: CalendarEvent): string {
        return this.formatDuration(event);
    }

    day(event: CalendarEvent): string {
        return this.formatDuration(event);
    }

    formatDuration(event: AleaEvent): string {
        if (event.end) {
            if (isSameDay(event.start, event.end)) {
                if (event.nbPompeEnvi || event.nbPompeMeta) {
                    return `<b>${event.title}</b>
                    De ${formatDate(event.start, 'HH:mm', 'fr-FR')} à ${formatDate(event.end, 'HH:mm', 'fr-FR')}
                    nb pompe meta : ${event.nbPompeMeta}
                    nb pompe envi : ${event.nbPompeEnvi}
                    `;
                } else {
                    return `<b>${event.title}</b>
                    De ${formatDate(event.start, 'HH:mm', 'fr-FR')} à ${formatDate(event.end, 'HH:mm', 'fr-FR')}
                    `;
                }
            } else {
                return `<b>${event.title}</b>
                Du ${formatDate(event.start, 'dd-MM à HH:mm', 'fr-FR')} au ${formatDate(event.end, 'dd-MM à HH:mm', 'fr-FR')}
                `;
            }
        } else {
            return `${event.title}`;
        }
    }
}