import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Prelevement} from '../../../processus/Prelevement';
import {Debitmetre} from '../../../logistique/Debitmetre';
import {AffectationPrelevement} from '../../../prelevement/AffectationPrelevement';
import {differenceInMinutes, format, parse} from 'date-fns';
import {EnumEPI, EnumPluie, EnumRisqueNuisance, EnumTypePrelevement} from '@aleaac/shared';
import {PrelevementService} from '../../../prelevement/prelevement.service';
import {FicheExposition} from '../../../prelevement/FicheExposition';
import {FicheExpositionService} from '../../../prelevement/fiche-exposition.service';
import {RessourceHumaine} from '../../../logistique/RessourceHumaine';

@Component({
    selector: 'app-meta-operateur-apres',
    templateUrl: './meta-operateur-apres.component.html',
    styleUrls: ['./meta-operateur-apres.component.scss'],
})
export class MetaOperateurApresComponent implements OnChanges {
    @Input() prelevement: Prelevement;
    @Input() debitmetres: Debitmetre[];
    @Input() isEditable: boolean;
    @Input() techniciens: RessourceHumaine[];
    @Output() emitPrelevement = new EventEmitter<Prelevement>();
    enumTypePrelevement = EnumTypePrelevement;
    enumPluie = EnumPluie;
    prelevementMat: Prelevement;
    enumEPI = EnumEPI;
    keysEPI: any;
    enumRisqueNuisance = EnumRisqueNuisance;
    keysRisqueNuisance: any;

    constructor(
        private prelevementService: PrelevementService,
        private ficheExpositionService: FicheExpositionService
    ) {
    }

    ngOnChanges() {
        this.keysEPI = Object.keys(this.enumEPI).filter(Number);
        this.keysRisqueNuisance = Object.keys(this.enumRisqueNuisance).filter(Number);
        if (this.prelevement.idPrelevementMateriaux) {
            this.prelevementService.get(this.prelevement.idPrelevementMateriaux).subscribe((prelevementMat) => {
                this.prelevementMat = prelevementMat;
            });
        }

    }

    calcDebitFinal(affectationPrelevement) {
        if (affectationPrelevement.debitFinal1 && affectationPrelevement.debitFinal2 && affectationPrelevement.debitFinal3) {
            affectationPrelevement.debitMoyenFinal = ((
                Number(affectationPrelevement.debitFinal1) + Number(affectationPrelevement.debitFinal2) + Number(affectationPrelevement.debitFinal3)
            ) / 3).toFixed(3);
        } else {
            affectationPrelevement.debitMoyenFinal = null;
        }
        this.checkPrelevement();
    }

    parseDateHeure(affectationPrelevement: AffectationPrelevement) {
        if (affectationPrelevement.heureFin && affectationPrelevement.dateFin) {
            affectationPrelevement.dateHeureFin = new Date(affectationPrelevement.dateFin + ' ' + affectationPrelevement.heureFin);
        } else {
            affectationPrelevement.dateHeureFin = null;
        }
        this.checkPrelevement();
    }

    calcDuree(affectationPrelevement: AffectationPrelevement) {
        if (affectationPrelevement.dateHeureFin && affectationPrelevement.dateHeureDebut) {
            return differenceInMinutes(affectationPrelevement.dateHeureFin, affectationPrelevement.dateHeureDebut);
        } else {
            return null;
        }
    }

    calcVolume(affectationPrelevement: AffectationPrelevement) {
        const duree = this.calcDuree(affectationPrelevement);
        if ( duree && affectationPrelevement.debitMoyenInitial && affectationPrelevement.debitMoyenFinal) {
            return ((Number(affectationPrelevement.debitMoyenFinal) + Number(affectationPrelevement.debitMoyenInitial) / 2) * duree).toFixed(3);
        } else {
            return null;
        }
    }

    checkPrelevement() {
        this.emitPrelevement.emit(this.prelevement);
    }

    prelevementMateriaux(event) {
        if (event.target.checked) {
            const prelevementMateriaux = new Prelevement();
            prelevementMateriaux.idTypePrelevement = this.enumTypePrelevement.MATERIAUX;
            prelevementMateriaux.idFranchise = this.prelevement.idFranchise;
            prelevementMateriaux.idChantier = this.prelevement.idChantier;
            prelevementMateriaux.idProcessus = this.prelevement.idProcessus;
            prelevementMateriaux.reference = this.prelevement.reference + 'MAT';
            prelevementMateriaux.idProcessusZone = this.prelevement.idProcessusZone;
            prelevementMateriaux.idGes = this.prelevement.idGes;
            prelevementMateriaux.idStrategie = this.prelevement.idStrategie;
            prelevementMateriaux.idObjectif = this.prelevement.idObjectif;
            prelevementMateriaux.idSitePrelevement = this.prelevement.idSitePrelevement;
            this.prelevementService.create(prelevementMateriaux).subscribe((prelevement) => {
                this.prelevement.idPrelevementMateriaux = prelevement.id;
            });
        } else {
            if (window.confirm('Le prélèvement Materiaux sera supprimé après enregistrement, voulez vous continuer')) {
                if (this.prelevement.idPrelevementMateriaux) {
                    this.prelevementService.delete(this.prelevement.idPrelevementMateriaux).subscribe(() => {
                        this.prelevement.idPrelevementMateriaux = null;
                    });
                }
            } else {
                event.preventDefault();
            }
        }
    }

    addExposition() {
        const exposition = new FicheExposition();
        exposition.idPrelevement = this.prelevement.id;
        this.ficheExpositionService.create(exposition).subscribe((ficheExpo) => {
            this.prelevement.fichesExposition.push(ficheExpo);
            this.checkPrelevement();
        });
    }

    deleteExposition(exposition: FicheExposition) {
        this.ficheExpositionService.delete(exposition.id).subscribe(() => {
            this.prelevement.fichesExposition = this.prelevement.fichesExposition.filter((expo) => {
                return expo.id !== exposition.id;
            });
            this.checkPrelevement();
        });
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

}
