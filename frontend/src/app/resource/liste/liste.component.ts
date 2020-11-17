import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Liste } from '@aleaac/shared';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../../notification/notification.service';
import { ListeService } from './liste.service';
import { isThisQuarter } from 'date-fns';
import { style } from '@angular/animations';
import { EnumTypePartageListe } from '@aleaac/shared';


@Component({
    selector: 'app-liste',
    templateUrl: './liste.component.html',
    styleUrls: ['./liste.component.scss']
})
export class ListeComponent implements OnInit {
    @Input() nomListe: string;
    @Input() listeComplete: Liste[]; // Si on a déjà la liste, on évite d'appeler en base
    @Input() label: string;
    @Input() idItem: number | null = null;

    @Input() isFull: boolean = true;
    @Input() isEnrichissable: boolean = true;
    @Input() parentForm: FormGroup;
    @Input() internalFormControlName: string;
    @Input() tabIndex: number;

    @Input() autoSelectFirst: boolean = true;
    @Input() readonly: boolean = false;
    @Input() disabled: boolean = false;
    @Input() class: string;
    @Input() style: string;

    // Pour récupérer la liste dans le contrôle parent sans appel bdd (pour comparer les valeurs au save)
    @Output() emitListe: EventEmitter<Liste[]> = new EventEmitter<Liste[]>();

    currentListe: Liste = new Liste();
    listeAffichage: BehaviorSubject<Liste[]> = new BehaviorSubject(new Array<Liste>());

    constructor(
        private notificationService: NotificationService,
        private listeService: ListeService,
    ) {
    }

    ngOnInit(): void {
        if (this.listeComplete && this.listeComplete.length) {
            this.setListes(this.listeComplete);
            if (this.listeComplete.length) {
                this.isEnrichissable = this.isEnrichissable
                    && (this.listeComplete as Liste[])[0].typePartage.valueOf() !== EnumTypePartageListe.Aucun.valueOf();
            }

            this.listeAffichage.subscribe(liste => {
                const tmp = liste.find(l => l.valeur === this.parentForm.get(this.internalFormControlName)!.value);

                if (tmp) {
                    this.idItem = tmp.id;
                    this.currentListe = liste.find(i => i.id === this.idItem)!;
                }
                if ((!this.parentForm.get(this.internalFormControlName)!.value) && this.autoSelectFirst) {
                    this.currentListe = liste[0] ? liste[0] : new Liste();
                    this.parentForm.get(this.internalFormControlName)!.setValue(liste[0] ? liste[0].valeur : '');
                }
            }, err => {
                console.error(err);
            });
        } else if (this.nomListe) {
            this.listeService.getByListName(this.nomListe).subscribe(data => {
                this.setListes(data);
                this.emitListe.emit(data);
                if (data && data.length) {
                    this.isEnrichissable = this.isEnrichissable
                    && (data as Liste[])[0].typePartage.valueOf() !== EnumTypePartageListe.Aucun.valueOf();
                }

                this.listeAffichage.subscribe(liste => {
                    const tmp = liste.find(l => l.valeur === this.parentForm.get(this.internalFormControlName)!.value);

                    if (tmp) {
                        this.idItem = tmp.id;
                        this.currentListe = liste.find(i => i.id === this.idItem)!;
                    }
                    if ((!this.parentForm.get(this.internalFormControlName)!.value) && this.autoSelectFirst) {
                        this.currentListe = liste[0] ? liste[0] : new Liste();
                        this.parentForm.get(this.internalFormControlName)!.setValue(liste[0] ? liste[0].valeur : '');
                    }
                }, err => {
                    console.error(err);
                });
            });
        }
    }

    setListe(item: Liste) {
        this.currentListe = item;
        this.parentForm.get(this.internalFormControlName)!.setValue(item.valeur);
    }

    txtUpdate(valeur: string) {
        const tmpList = new Liste();
        tmpList.valeur = valeur;
        this.currentListe = this.listeAffichage.value.find(l => l.valeur === valeur)
            ? this.listeAffichage.value.find(l => l.valeur === valeur)!
            : tmpList;
    }

    get listes(): Observable<Liste[]> {
        return this.listeAffichage.asObservable();
    }

    setListes(listes: Liste[]): void {
        this.listeAffichage.next(listes);
    }

    compareList(a, b) {
        return a && b ? (a.id === b.id || (a.nomListe === b.nomListe && a.valeur === b.valeur)) : false;
    }
}
