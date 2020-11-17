import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Prelevement} from '../../../processus/Prelevement';
import {EnumAppareilsProtectionRespiratoire, EnumPluie, EnumPosition} from '@aleaac/shared';
import {CaptageAspirationSourceService} from '../../../processus/captage-aspiration-source.service';
import {TravailHumideService} from '../../../processus/travail-humide.service';
import {OutilTechniqueService} from '../../../processus/outil-technique.service';
import {MpcaService} from '../../../processus/mpca.service';
import {MateriauConstructionAmiante} from '../../../resource/materiau-construction-amiante/MateriauConstructionAmiante';

@Component({
    selector: 'app-meta-operateur-pendant',
    templateUrl: './meta-operateur-pendant.component.html',
    styleUrls: ['./meta-operateur-pendant.component.scss']
})
export class MetaOperateurPendantComponent implements OnInit, OnChanges {
    @Input() prelevement: Prelevement;
    @Output() emitPrelevement = new EventEmitter<Prelevement>();
    @Input() isEditable: boolean;
    keys: any[];
    enumPosition = EnumPosition;
    enumProtectionRespiratoire = EnumAppareilsProtectionRespiratoire;
    captageAspirationSource: string;
    travailHumide: string;
    outilTechnique: string;
    materiaux: string[];
    mpca: string;
    taches: string[];
    enumPluie = EnumPluie;

    constructor(
        private captageAspirationSourceService: CaptageAspirationSourceService,
        private travailHumideService: TravailHumideService,
        private outilTechniqueService: OutilTechniqueService,
        private mpcaService: MpcaService
    ) {
    }

    ngOnInit() {
        this.keys = Object.keys(this.enumPosition).filter(Number);
    }

    ngOnChanges() {
        if (this.prelevement.processus.idCaptageAspirationSource) {
            this.captageAspirationSourceService.get(this.prelevement.processus.idCaptageAspirationSource)
                .subscribe((captageAspirationSource) => {
                    this.captageAspirationSource = captageAspirationSource.nom;
                });
        }
        if (this.prelevement.processus.idTravailHumide) {
            this.travailHumideService.get(this.prelevement.processus.idTravailHumide).subscribe((travailHumide) => {
                this.travailHumide = travailHumide.nom;
            });
        }
        if (this.prelevement.processus.idOutilTechnique) {
            this.outilTechniqueService.get(this.prelevement.processus.idOutilTechnique).subscribe((outilTechnique) => {
                this.outilTechnique = outilTechnique.nom;
            });
        }
        if (this.prelevement.processus.idMpca) {
            this.mpcaService.get(this.prelevement.processus.idMpca).subscribe((mpca) => {
                this.mpca = mpca.nom;
            });
        }
        if (this.prelevement.zoneIntervention.materiauxZone && this.prelevement.zoneIntervention.materiauxZone.length > 0) {
            this.materiaux = [];
            for (const materiauxZone of this.prelevement.zoneIntervention.materiauxZone) {
                if (materiauxZone.materiau!.partieComposant !== '-') {
                    this.materiaux.push(materiauxZone.materiau!.partieComposant);
                } else if (materiauxZone.materiau!.composantConstruction !== '-') {
                    this.materiaux.push(materiauxZone.materiau!.composantConstruction);
                } else {
                    this.materiaux.push(materiauxZone.materiau!.partieStructure);
                }
            }
        }

        if (this.prelevement.ges.taches) {
            this.taches = [];
            for (const tache of this.prelevement.ges.taches) {
                this.taches.push(tache.nom);
            }
        }
    }

    checkPrelevement() {
        this.emitPrelevement.emit(this.prelevement);
    }

}
