import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CodePostal } from '../../../../../shared';
import { UserService } from '../user/user.service';
import { CodePostalService } from './cp-ville.service';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../../notification/notification.service';


@Component({
    selector: 'app-cp-ville',
    templateUrl: './input-cp-ville.component.html',
    styleUrls: ['./input-cp-ville.component.scss']
})
export class InputCpVilleComponent implements OnInit {

    currentCP: CodePostal = new CodePostal();
    @Input() isRechercheVille: boolean;
    @Input() parentForm: FormGroup;
    @Input() internalFormControlName: string;
    @Input() tabindex: number;
    placeHolder: string;
    listeAffichage: BehaviorSubject<CodePostal[]> = new BehaviorSubject(new Array<CodePostal>());
    lalala: any;
    lastkeydown1: number = 0;
    @Output() emitCP: EventEmitter<CodePostal> = new EventEmitter<CodePostal>();

    constructor(private cpVilleService: CodePostalService, private notificationService: NotificationService) {
    }

    ngOnInit(): void {
        if (this.isRechercheVille === undefined) {
            throw new Error('Il faut préciser le type de recherche (isRechercheVille: boolean)');
        }

        if (this.parentForm === undefined) {
            throw new Error('Il faut préciser le formulaire parent (parentForm: FormGroup)');
        }

        if (this.internalFormControlName === undefined || this.internalFormControlName.length === 0) {
            throw new Error('Il faut préciser le nom du champ dans le formulaire parent (internalFormControlName: string)');
        }

        this.placeHolder = this.isRechercheVille ? 'Ville' : 'Code Postal';
    }

    getCPVille($event) {
        const searchText = $event;

        const timestamp = window.performance && window.performance.now && window.performance.timing
            && window.performance.timing.navigationStart
            ? window.performance.now() + window.performance.timing.navigationStart
            : Date.now();
        if (searchText && searchText.length > 2) {
            if (timestamp - this.lastkeydown1 > 300) {
                this.lastkeydown1 = timestamp;
                if (this.isRechercheVille) {
                    this.cpVilleService.getByPartialVille(searchText).subscribe(data => {
                        data.forEach(a => a.cpVille = a.numCP + ' ' + a.nomCommune);
                        this.setCodesPostaux(data);
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                } else {
                    if (searchText.length < 5) {
                        this.cpVilleService.getByPartialCp(searchText).subscribe(data => {
                            data.forEach(a => a.cpVille = a.numCP + ' ' + a.nomCommune);
                            this.setCodesPostaux(data);
                        }, err => {
                            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                            console.error(err);
                        });
                    }
                }
            }
        }
    }

    setCP(truc: CodePostal) {
        this.currentCP = truc;
        this.emitCP.emit(this.currentCP);
    }

    get codesPostaux(): Observable<CodePostal[]> {
        return this.listeAffichage.asObservable();
    }

    setCodesPostaux(franchises: CodePostal[]): void {
        this.listeAffichage.next(franchises);
    }
}
