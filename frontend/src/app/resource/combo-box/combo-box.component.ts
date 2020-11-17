import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { CodePostal } from '@aleaac/shared';
import { NotificationService } from '../../notification/notification.service';

export enum KEY_CODE {
    UP_ARROW = 38,
    DOWN_ARROW = 40,
    TAB_KEY = 9,
    ENTER_KEY = 13,
}
@Component({
    selector: 'combo-box',
    templateUrl: './combo-box.component.html',
    styleUrls: ['./combo-box.component.scss'],
    providers: []
})
export class ComboBoxComponent implements OnInit {
    // Données
    @Input() dataList: Observable<any[]> = of(new Array<any>());
    @Input() columnName: string;
    @Input() displayColumnName: string;

    // Format
    @Input() isOnlyMajuscules: boolean = false;
    @Input() isOnlyNumbers: boolean = false;

    // Reactive Forms
    @Input() parentForm: FormGroup;
    @Input() internalFormControlName: string;

    @Input() tabindex: number;

    @Output() emitResult: EventEmitter<any> = new EventEmitter<any>();
    @Output() emitSearch: EventEmitter<string> = new EventEmitter<string>();

    // Utilisé pour l'affichage, contient les éléments "filtrés"
    dummyDataList: any[];
    showDropDown: boolean;
    counter: number;
    // Contenu de la textbox
    textToSort: string;
    // Pour debounce si on tape "vite"
    lastkeydown1: number = 0;
    // Si observable, on peut pas accéder aux valeurs facilement
    dataListPasObservable: any[];

    // Pour pas afficher le dropdown sur la ville quand on saitit le cp et vice-versa
    compteurDeTouches: number = 0;

    onFocusEventAction(): void {
        this.counter = 0;
    }

    onBlurEventAction(): void {

    }

    // Applique une transformation au texte à chaque touche pressée
    applyTransform(truc: any) {
        if (this.isOnlyMajuscules) {
            truc.target.value = truc.target.value.toUpperCase();
        }
        if (this.isOnlyNumbers) {
            truc.target.value = truc.target.value.replace(/[^0-9]/g, '');
        }
    }

    // Gestion TAB/Enter/Flèches
    onKeyDownAction(event: KeyboardEvent): void {
        this.compteurDeTouches++;
        this.showDropDown = true;

        if (event.keyCode === KEY_CODE.UP_ARROW) {
            this.counter = (this.counter === 0) ? this.counter : --this.counter;
            this.checkHighlight(this.counter);
        }

        if (event.keyCode === KEY_CODE.DOWN_ARROW) {
            this.counter = (this.counter === this.dataListPasObservable.length - 1) ? this.counter : ++this.counter;
            this.checkHighlight(this.counter);
        }

        if (event.keyCode === KEY_CODE.TAB_KEY || event.keyCode === KEY_CODE.ENTER_KEY) {
            if (event.keyCode === KEY_CODE.ENTER_KEY) {
                event.preventDefault();
                event.stopPropagation();
            }

            this.textToSort = this.dataListPasObservable[this.counter][this.columnName];
            this.emitResult.emit(this.dataListPasObservable[this.counter]);
            this.compteurDeTouches = 0;
            this.showDropDown = false;
        }
    }

    checkHighlight(currentItem): boolean {
        if (this.counter === currentItem) {
            return true;
        } else {
            return false;
        }
    }

    constructor(private notificationService: NotificationService) {
        if (this.dataList === undefined) {
            this.dataList = of(new Array<any>());
        }
    }

    ngOnInit() {
        if (this.dataList === undefined) {
            this.dataList = of(new Array<any>());
        }
        if (this.displayColumnName === undefined) {
            this.displayColumnName = this.columnName;
        }

        this.dataList.subscribe(data => {
            this.dataListPasObservable = data;
            this.dummyDataList = data;
            this.showDropDown = this.compteurDeTouches > 0;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
        this.reset();
    }

    toogleDropDown(): void {
        this.showDropDown = !this.showDropDown;
    }

    reset(): void {
        this.showDropDown = false;
        this.dummyDataList = [];
    }

    textChange(value) {
        if (value && value.length > 2) {
            this.emitSearch.emit(value);
            if (this.dataListPasObservable && this.dataListPasObservable.length > 0) {
                this.dummyDataList.filter(o => o[this.columnName].toString().indexOf(value) > -1).map(u => ({...u}));
            }
            // console.log('this.dummyDataList',this.dummyDataList);
            if (this.dataListPasObservable && this.dataListPasObservable.length > 0 && this.compteurDeTouches > 0) {
                this.showDropDown = true;
            }
        }
    }

    // Clic sur une valeur/choix d'un valeur
    updateTextBox(valueSelected) {
        this.textToSort = this.dataListPasObservable.find(c => c.id == valueSelected)[this.columnName];
        this.emitResult.emit(this.dataListPasObservable.find(c => c.id == valueSelected));
        this.compteurDeTouches = 0;
        this.showDropDown = false;
    }
}
