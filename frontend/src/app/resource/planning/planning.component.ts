import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output
} from '@angular/core';
import {
    CalendarView,
    CalendarEvent,
    CalendarEventTitleFormatter
} from 'angular-calendar';
import {
    addDays,
    endOfDay,
    endOfMonth,
    startOfDay, startOfMonth,
    startOfISOWeek, endOfISOWeek, addMonths, addWeeks, eachDay, getDay, isSameMonth, isSameDay, format
} from 'date-fns';
import { Subject } from 'rxjs';
import { CustomEventTitleFormatter } from './CustomEventTitleFormatter';
import { Router } from '@angular/router';
import { PompeService } from '../../logistique/pompe.service';
import { EnumTypePompe } from '@aleaac/shared';
import { Intervention } from '../../intervention/Intervention';
import { AleaEvent } from './AleaEvent';
import { BureauService } from '../../parametrage/bureau/bureau.service';
import { Bureau } from '../../parametrage/bureau/Bureau';
import { QueryBuild } from '../query-builder/QueryBuild';
import {reject} from 'q';

@Component({
    selector: 'app-planning',
    templateUrl: './planning.component.html',
    styleUrls: ['./planning.component.scss'],
    providers: [
        {
            provide: CalendarEventTitleFormatter,
            useClass: CustomEventTitleFormatter
        }
    ]
})
export class PlanningComponent implements OnChanges, OnInit {
    @Input() entites: any[];
    @Input() type: string;
    @Input() idBureau: number;
    @Input() bureaux: Bureau[];
    @Output() emitInterval = new EventEmitter<{ dd: Date, df: Date }>();
    @Output() emitIdBureau = new EventEmitter<number>();

    enumTypePompe = EnumTypePompe;

    nbPompesMeta: {
        lundi: number;
        mardi: number;
        mercredi: number;
        jeudi: number;
        vendredi: number;
        samedi: number;
        dimanche: number;
    } = {
            lundi: 0,
            mardi: 0,
            mercredi: 0,
            jeudi: 0,
            vendredi: 0,
            samedi: 0,
            dimanche: 0,
        };

    nbPompesEnvi: {
        lundi: number;
        mardi: number;
        mercredi: number;
        jeudi: number;
        vendredi: number;
        samedi: number;
        dimanche: number;
    } = {
            lundi: 0,
            mardi: 0,
            mercredi: 0,
            jeudi: 0,
            vendredi: 0,
            samedi: 0,
            dimanche: 0,
        };

    view: CalendarView = CalendarView.Week;
    CalendarView = CalendarView;
    viewDate: Date = new Date();
    refresh: Subject<any> = new Subject();
    events: AleaEvent[];

    activeDayIsOpen: boolean = false;

    constructor(
        private router: Router,
        private pompeService: PompeService,
        private bureauService: BureauService
    ) { }

    ngOnInit() {
        this.parseInterval();
    }

    async ngOnChanges() {
        const events: AleaEvent[] = [];
        // si Intervention
        if (this.type && this.type === 'intervention') {
            console.log(this.entites);
            /*if (this.view === CalendarView.Week) {
                await this.getStocks();
            }*/
            for (const entite of this.entites) {
                const event: AleaEvent = {
                    start: new Date(entite.rendezVous.dateHeureDebut),
                    end: new Date(entite.rendezVous.dateHeureFin),
                    title: entite.libelle,
                    color: this.getInterventionColor(entite),
                    idParent: entite.id,
                    application: 'intervention',
                    redirect: ['chantier', entite.idChantier, 'intervention', entite.id, 'information'],
                    nbPompeEnvi: entite.nbPompeEnvi,
                    nbPompeMeta: entite.nbPompeMeta
                };
                events.push(event);
            }
        } else { // sinon logistique
            for (const entite of this.entites) {
                // si c'est une pompe
                if (entite.rendezVousPompes) {
                    for (const rdv of entite.rendezVousPompes) {
                        const event: AleaEvent = {
                            start: new Date(rdv.rendezVous.dateHeureDebut),
                            end: new Date(rdv.rendezVous.dateHeureFin),
                            title: rdv.rendezVous.nom,
                            color:
                            {
                                primary: (rdv.rendezVous.isAbsence ? 'red' : entite.couleur),
                                secondary: entite.couleur
                            },
                            idParent: rdv.rendezVous.idParent,
                            application: rdv.rendezVous.application
                        };
                        events.push(event);
                    }
                } else if (entite.rendezVousRessourceHumaines) { // Si c'est une ressource Humaine
                    for (const rdv of entite.rendezVousRessourceHumaines) {
                        console.log(rdv);
                        const event: AleaEvent = {
                            start: new Date(rdv.rendezVous.dateHeureDebut),
                            end: new Date(rdv.rendezVous.dateHeureFin),
                            title: rdv.rendezVous.nom,
                            color:
                            {
                                primary: (rdv.rendezVous.isAbsence ? 'red' : entite.couleur),
                                secondary: entite.couleur
                            },
                            idParent: rdv.rendezVous.idParent,
                            application: rdv.rendezVous.application
                        };
                        events.push(event);
                    }
                } else { // sinon c'est une salle
                    for (const rdv of entite.rendezVousSalles) {
                        const event: AleaEvent = {
                            start: new Date(rdv.rendezVous.dateHeureDebut),
                            end: new Date(rdv.rendezVous.dateHeureFin),
                            title: rdv.rendezVous.nom,
                            color:
                            {
                                primary: (rdv.rendezVous.isAbsence ? 'red' : entite.couleur),
                                secondary: entite.couleur
                            },
                            idParent: rdv.rendezVous.idParent,
                            application: rdv.rendezVous.application
                        };
                        events.push(event);
                    }
                }
            }
        }
        this.events = events;
    }

    changeBureau(idBureau: number) {
        this.emitIdBureau.emit(idBureau);
    }

    eventClicked({ event }: { event: AleaEvent }): void {
        if (event.redirect) {
            this.router.navigate(event.redirect);
        } else {
            if (event.idParent && event.application) {
                let application = event.application;
                if (application === 'activite') {
                    application = 'contact/activite';
                }
                this.router.navigate(['/' + application + '/' + event.idParent + '/modifier']);
            }
        }

    }

    setView(view: CalendarView) {
        this.view = view;
        this.parseInterval();
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
        this.parseInterval();
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            this.viewDate = date;
            if (events.length === 0) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
        }
    }

    parseInterval(): void {
        const interval: { dd: Date, df: Date } = { dd: new Date(), df: new Date() };
        if (this.view === CalendarView.Month) {
            interval.dd = startOfMonth(this.viewDate);
            interval.df = endOfMonth(this.viewDate);
        }
        if (this.view === CalendarView.Week) {
            interval.dd = startOfISOWeek(this.viewDate);
            interval.df = endOfISOWeek(this.viewDate);
            this.countStock();
        }
        if (this.view === CalendarView.Day) {
            interval.dd = startOfDay(this.viewDate);
            interval.df = endOfDay(this.viewDate);
        }
        this.emitInterval.emit(interval);
    }

    next(): void {
        this.activeDayIsOpen = false;
        if (this.view === CalendarView.Month) {
            this.viewDate = addMonths(this.viewDate, 1);
        }
        if (this.view === CalendarView.Week) {
            this.viewDate = addWeeks(this.viewDate, 1);
        }
        if (this.view === CalendarView.Day) {
            this.viewDate = addDays(this.viewDate, 1);
        }
        this.parseInterval();
    }

    previous(): void {
        this.activeDayIsOpen = false;
        if (this.view === CalendarView.Month) {
            this.viewDate = addMonths(this.viewDate, -1);
        }
        if (this.view === CalendarView.Week) {
            this.viewDate = addWeeks(this.viewDate, -1);
        }
        if (this.view === CalendarView.Day) {
            this.viewDate = addDays(this.viewDate, -1);
        }
        this.parseInterval();
    }

    getInterventionColor(intervention: Intervention) {
        switch (intervention.idStatut) {
            case 1:
                return {
                    primary: '#f39f1f',
                    secondary: '#f39f1f'
                };
            case 2:
                return {
                    primary: '#00BC0E',
                    secondary: '#00BC0E'
                };
            case 3:
                return {
                    primary: '#1d2ef3',
                    secondary: '#1d2ef3'
                };
            case 4:
                return {
                    primary: '#8457a9',
                    secondary: '#8457a9'
                };
            case 5:
                return {
                    primary: '#f31904',
                    secondary: '#f31904'
                };
        }
    }


    // on get les stock et on l'affecte à l'objet de la semaine
    async getStocks() {
        for (const day of eachDay(startOfISOWeek(this.viewDate), endOfISOWeek(this.viewDate))) {
            const stocks = await this.getStock(day);

            let envi = stocks.find((stock) => stock.idTypePompe === this.enumTypePompe.ENVIRONNEMENTALE);
            if (!envi) {
                envi = 0;
            } else {
                envi = envi.stock;
            }
            let meta = stocks.find((stock) => stock.idTypePompe === this.enumTypePompe.INDIVIDUELLE);
            if (!meta) {
                meta = 0;
            } else {
                meta = meta.stock;
            }

            switch (getDay(day)) {
                case 1:
                    this.nbPompesEnvi.lundi = Number(envi);
                    this.nbPompesMeta.lundi = Number(meta);
                    break;
                case 2:
                    this.nbPompesEnvi.mardi = Number(envi);
                    this.nbPompesMeta.mardi = Number(meta);
                    break;
                case 3:
                    this.nbPompesEnvi.mercredi = Number(envi);
                    this.nbPompesMeta.mercredi = Number(meta);
                    break;
                case 4:
                    this.nbPompesEnvi.jeudi = Number(envi);
                    this.nbPompesMeta.jeudi = Number(meta);
                    break;
                case 5:
                    this.nbPompesEnvi.vendredi = Number(envi);
                    this.nbPompesMeta.vendredi = Number(meta);
                    break;
                case 6:
                    this.nbPompesEnvi.samedi = Number(envi);
                    this.nbPompesMeta.samedi = Number(meta);
                    break;
                case 0:
                    this.nbPompesEnvi.dimanche = Number(envi);
                    this.nbPompesMeta.dimanche = Number(meta);
                    break;
                default:
            }
        }
    }

    // on get les stocks pour chaque jour de la semaine
    getStock(day): any {
        return new Promise((resolve, reject1) => {
            const queryBuild = new QueryBuild();
            queryBuild.dd = format(startOfDay(day), 'YYYY-MM-DD HH:mm:ss');
            queryBuild.df = format(endOfDay(day), 'YYYY-MM-DD HH:mm:ss');
            this.pompeService.getStock(this.idBureau, queryBuild).subscribe((stock) => {
                resolve(stock);
            });
        });
    }

    // on enléve les inters des stock
    async countStock() {
        await this.getStocks();
        for (const intervention of this.entites) {
            for (const day of eachDay(intervention.rendezVous.dateHeureDebut, intervention.rendezVous.dateHeureFin)) {
                console.log(day);
                switch (getDay(day)) {
                    case 1:
                        this.nbPompesEnvi.lundi -= intervention.nbPompeEnvi;
                        this.nbPompesMeta.lundi -= intervention.nbPompeMeta;
                        break;
                    case 2:
                        this.nbPompesEnvi.mardi -= intervention.nbPompeEnvi;
                        this.nbPompesMeta.mardi -= intervention.nbPompeMeta;
                        break;
                    case 3:
                        this.nbPompesEnvi.mercredi -= intervention.nbPompeEnvi;
                        this.nbPompesMeta.mercredi -= intervention.nbPompeMeta;
                        break;
                    case 4:
                        this.nbPompesEnvi.jeudi -= intervention.nbPompeEnvi;
                        this.nbPompesMeta.jeudi -= intervention.nbPompeMeta;
                        break;
                    case 5:
                        this.nbPompesEnvi.vendredi -= intervention.nbPompeEnvi;
                        this.nbPompesMeta.vendredi -= intervention.nbPompeMeta;
                        break;
                    case 6:
                        this.nbPompesEnvi.samedi -= intervention.nbPompeEnvi;
                        this.nbPompesMeta.samedi -= intervention.nbPompeMeta;
                        break;
                    case 0:
                        this.nbPompesEnvi.dimanche -= intervention.nbPompeEnvi;
                        this.nbPompesMeta.dimanche -= intervention.nbPompeMeta;
                        break;
                    default:
                }
            }
        }
        return new Promise((resolve, reject2) => {
            resolve();
        });
    }

}
