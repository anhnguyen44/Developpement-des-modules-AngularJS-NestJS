import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Prelevement} from '../../../processus/Prelevement';
import {Filtre} from '../../../logistique/Filtre';
import {EnumPluie, EnumStatutPrelevement} from '@aleaac/shared';
import {AffectationPrelevement} from '../../../prelevement/AffectationPrelevement';
import {Debitmetre} from '../../../logistique/Debitmetre';
import {Pompe} from '../../../logistique/Pompe';
import {Contact} from '../../../contact/Contact';
import {AffectationPrelevementService} from '../../../prelevement/affectation-prelevement.service';

@Component({
    selector: 'app-meta-operateur-avant',
    templateUrl: './meta-operateur-avant.component.html',
    styleUrls: ['./meta-operateur-avant.component.scss']
})
export class MetaOperateurAvantComponent implements OnInit, OnChanges {
    @Input() prelevement: Prelevement;
    @Input() filtres: Filtre[];
    @Input() debitmetres: Debitmetre[];
    @Input() pompes: Pompe[];
    @Input() isEditable: boolean;
    @Input() isGenerateAffectation: boolean;
    @Output() emitPrelevement = new EventEmitter<Prelevement>();
    enumStatutPrelevement = EnumStatutPrelevement;
    affectationPrelevementActive: AffectationPrelevement;
    modalContact: boolean = false;
    enumPluie = EnumPluie;

    constructor(private affectationPrelevementService: AffectationPrelevementService) {
    }

    ngOnInit() {
        console.log('init');
    }

    ngOnChanges() {

    }

    calcDebitInitial(affectationPrelevement) {
        if (affectationPrelevement.debitInitial1 && affectationPrelevement.debitInitial2 && affectationPrelevement.debitInitial3) {
            affectationPrelevement.debitMoyenInitial = ((
                Number(affectationPrelevement.debitInitial1) + Number(affectationPrelevement.debitInitial2) + Number(affectationPrelevement.debitInitial3)
            ) / 3).toFixed(3);
        } else {
            affectationPrelevement.debitMoyenInitial = null;
        }
        this.checkPrelevement();
    }

    openModalContact(affectationPrelevement) {
        this.affectationPrelevementActive = affectationPrelevement;
        this.modalContact = true;
    }

    closeModalContact() {
        this.modalContact = false;
    }

    setContact(contact: Contact) {
        this.affectationPrelevementActive.idOperateurChantier = contact.id;
        this.affectationPrelevementActive.operateurChantier = contact;
        this.closeModalContact();
        this.checkPrelevement();
    }

    changeFiltre(affectationPrelevement: AffectationPrelevement, filtre: Filtre) {
        console.log(filtre);
        affectationPrelevement.idFiltre = filtre.id;
        this.checkPrelevement();
    }

    changePompe(affectationPrelevement: AffectationPrelevement, pompe: Pompe) {
        affectationPrelevement.idPompe = pompe.id;
        this.checkPrelevement();
    }

    parseDateHeure(affectationPrelevement: AffectationPrelevement) {
        if (affectationPrelevement.heureDebut && affectationPrelevement.dateDebut) {
            affectationPrelevement.dateHeureDebut = new Date(affectationPrelevement.dateDebut + ' ' + affectationPrelevement.heureDebut);
        } else {
            affectationPrelevement.dateHeureDebut = null;
        }
        this.checkPrelevement();
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

    checkPrelevement() {
        this.emitPrelevement.emit(this.prelevement);
    }

    addAffectation() {
        const affectationPrelevement = new AffectationPrelevement();
        affectationPrelevement.idPrelevement = this.prelevement.id;
        this.affectationPrelevementService.create(affectationPrelevement).subscribe((affectation) => {
            this.prelevement.affectationsPrelevement.push(affectation);
        });
    }

    deleteAffectation(affectation) {
        this.affectationPrelevementService.delete(affectation.id).subscribe(() => {
            this.prelevement.affectationsPrelevement = this.prelevement.affectationsPrelevement.filter((affectationPrelevement) =>{
                return affectation.id !== affectationPrelevement.id;
            });
        });
    }

}
