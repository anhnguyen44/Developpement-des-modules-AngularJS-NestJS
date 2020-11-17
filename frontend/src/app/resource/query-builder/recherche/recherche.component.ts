import { Component, EventEmitter, Input, Output, OnChanges, OnInit } from '@angular/core';
import { Recherche } from './Recherche';
import { ChampDeRecherche } from './ChampDeRecherche';
import { QueryBuild } from '../QueryBuild';
import { fadeIn, fadeOut } from '../../animation';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NotificationService } from '../../../notification/notification.service';

@Component({
    selector: 'app-recherche',
    templateUrl: './recherche.component.html',
    styleUrls: ['./recherche.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class RechercheComponent implements OnChanges, OnInit {
    rechercheSimple: string;
    rechercheSimpleField: FormControl = new FormControl();
    @Input() type: string = '';
    @Input() typeRecherche = 'simple';
    @Input() champDeRecherches: ChampDeRecherche[];
    @Input() queryBuild: QueryBuild;
    @Input() canCreate: boolean = false;
    @Output() emitNouveau = new EventEmitter();
    @Output() emitQueryBuild = new EventEmitter<QueryBuild>();
    isRechercheComplexe: boolean = false;

    constructor(private notificationService: NotificationService) { }

    ngOnInit() {
        this.rechercheSimpleField
            .valueChanges.pipe(
                debounceTime(300),
                distinctUntilChanged()
            ).subscribe(() => {
                this.rechercher();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
    }

    ngOnChanges() {
        this.isRechercheComplexe = false;
        for (const recherche of this.champDeRecherches) {
            if (recherche.isPourComplexe) {
                this.isRechercheComplexe = true;
            }
            if (recherche.type === 'enum') {
                recherche.list = Object.keys(recherche.list)
                    .filter(key => typeof recherche.list[key] === 'number')
                    .map(key => ({ id: recherche.list[key], nom: key }));
            }
        }
    }

    changeTypeRecherche(typeRecherche) {
        this.typeRecherche = typeRecherche;
    }

    createNouveau() {
        this.emitNouveau.emit();
    }

    rechercher() {
        this.queryBuild.stringRecherche = '';
        console.log(this.typeRecherche);
        if (this.typeRecherche === 'simple') {
            this.queryBuild.type = 'simple';
            this.queryBuild.stringRecherche += 'simple=';
            for (const champDeRecherche of this.champDeRecherches) {
                if (champDeRecherche.isPourSimple) {
                    this.queryBuild.stringRecherche += '$$' + champDeRecherche.nom;
                }
            }
            this.queryBuild.stringRecherche += '€€' + this.rechercheSimple;
        } else {
            this.queryBuild.type = 'complexe';
            this.queryBuild.stringRecherche = 'complexe=';
            for (const champDeRecherche of this.champDeRecherches) {
                this.queryBuild.stringRecherche += '$$' + champDeRecherche.nom + '€€' + champDeRecherche.value;
            }
        }
        this.queryBuild.needCount = true;
        this.queryBuild.pageEnCours = 1;
        this.emitQueryBuild.emit(this.queryBuild);
    }

    changeCheckbox(event, champDeRecherche) {
        if (event.target.checked) {
            champDeRecherche.value = 1;
        } else {
            champDeRecherche.value = 0;
        }
    }

    emptySimple() {
        this.rechercheSimple = '';
        this.rechercher();
    }

    emptyComplexe() {
        for (let champDeRecherche of this.champDeRecherches) {
            if (champDeRecherche.type === 'enum') {
                champDeRecherche.value = undefined;
            }
            if (champDeRecherche.type === 'list') {
                champDeRecherche.value = undefined;
            }
            if (champDeRecherche.type === 'checkbox') {
                champDeRecherche.value = 0;
            }
            if (champDeRecherche.type === 'text') {
                champDeRecherche.value = '';
            }
        }
        this.rechercher();
    }

}
