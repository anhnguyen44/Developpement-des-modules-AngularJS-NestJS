import {CalendarEvent} from 'angular-calendar';

export interface AleaEvent extends CalendarEvent {
    idParent?: number;
    application?: string;
    redirect?: (string | number)[];
    nbPompeEnvi?: number;
    nbPompeMeta?: number;
}