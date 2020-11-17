import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PrelevementService} from '../prelevement.service';
import {Prelevement} from '../../processus/Prelevement';
import {ChampDeRecherche} from '../../resource/query-builder/recherche/ChampDeRecherche';
import {Order} from '../../resource/query-builder/order/Order';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {Router} from '@angular/router';
import {Intervention} from '../../intervention/Intervention';
import {EnumStatutPrelevement, EnumTypePompe, EnumTypePrelevement} from '@aleaac/shared';

@Component({
    selector: 'app-liste-prelevement',
    templateUrl: './liste-prelevement.component.html',
    styleUrls: ['./liste-prelevement.component.scss']
})
export class ListePrelevementComponent implements OnInit {
    @Input() application: string;
    @Input() idParent: number;
    @Input() canCreate: boolean = false;
    @Input() modal: boolean = false;
    @Input() nonPreleve: boolean = false;
    @Input() intervention: Intervention;
    @Input() redirectPath: (string | number)[];
    @Output() emitPrelevements: EventEmitter<Prelevement[]> = new EventEmitter<Prelevement[]>();
    @Output() emitDelete: EventEmitter<void> = new EventEmitter();
    keys: any[];
    statutCible: number;
    idApplication: string;
    prelevements: Prelevement[];
    nbObjets: number;
    enumTypePrelevement = EnumTypePrelevement;
    enumStatutPrelevement = EnumStatutPrelevement;
    enumTypePompe = EnumTypePompe;
    headers: Order[] = [
        new Order('Ref', '', true, 'prelevement.reference'),
        new Order('Chantier', '', true, 'chantier.nomChantier'),
        new Order('Objectif', '', true, 'objectif.lettre'),
        new Order('Fréq.', '', true, 'echantillonnage.frequenceParSemaine'),
        new Order('Type', '', true, 'prelevement.idTypePrelevement'),
        new Order('Statut', '', true, 'prelevement.idStatutPrelevement'),
        new Order('Action', 'action')
    ];
    champDeRecherches: ChampDeRecherche[] = [
        new ChampDeRecherche('Référence', 'text', 'prelevement.reference', true, true),
        new ChampDeRecherche('Chantier', 'text', 'chantier.nomChantier', true, true),
        new ChampDeRecherche('Objectif', 'text', 'objectif.lettre', true, true),
        new ChampDeRecherche('Fréquence', 'text', 'echantillonnage.frequenceParSemaine', true, true),
        new ChampDeRecherche('Type', 'enum', 'prelevement.idTypePrelevement', true, true, this.enumTypePrelevement),
        new ChampDeRecherche('Statut', 'enum', 'prelevement.idStatutPrelevement', false, true, this.enumStatutPrelevement),
    ];
    queryBuild: QueryBuild = new QueryBuild();

    constructor(
        private prelevementService: PrelevementService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.keys = Object.keys(this.enumStatutPrelevement).filter(Number);
        if (this.application) {
            this.idApplication = 'id' + this.application.charAt(0).toUpperCase() + this.application.slice(1);
        }
        if (this.modal) {
            this.headers.splice(4, 2);
        }
        if (this.nonPreleve) {
            this.queryBuild.nonPreleve = true;
            // this.queryBuild.nomCleStatut = 'idStatutPrelevement';
            // this.queryBuild.nomCleIsNull = 'prelevement.idIntervention';
        }
        if (this.intervention) {
            this.queryBuild.idsExclude = this.intervention.prelevements;
            this.queryBuild.nomCleExclude = 'prelevement.id';
        }
    }

    getAll() {
        this.prelevementService.getAllByType(this.idApplication, this.idParent, this.queryBuild).subscribe((prelevements) => {
            this.prelevements = prelevements;
            if (this.nonPreleve) {
                this.prelevements = this.prelevements.filter((prelevement) => {
                    return prelevement.countInter < 2;
                });
            }
        });
    }

    countAll() {
        this.prelevementService.countAllByType(this.idApplication, this.idParent, this.queryBuild).subscribe((nbPrelevements) => {
            this.nbObjets = nbPrelevements;
        });
    }

    setQueryBuild(queryBuild: QueryBuild) {
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countAll();
        }
        this.getAll();
    }

    goToDetail(prelevement: Prelevement) {
        if (this.modal) {
            const prelevements: Prelevement[] = [prelevement];
            this.emitPrelevements.emit(prelevements);
        } else {
            if (this.redirectPath) {
                this.redirectPath.push(prelevement.id);
                this.redirectPath.push('information');
                this.router.navigate(this.redirectPath);
            } else {
                this.router.navigate(['/prelevement', prelevement.id, 'information']);
            }
        }
    }

    goToNew() {
        if (this.redirectPath) {
            this.redirectPath.push('ajouter');
            this.router.navigate(this.redirectPath);
        } else {
            this.router.navigate(['/prelevement', 'ajouter']);
        }
    }

    checkAll(event) {
        this.prelevements.map((prelevement) => {
            prelevement.checked = event;
        });
    }

    isAllChecked() {
        if (this.prelevements) {
            return this.prelevements.every(prelevement => prelevement.checked);
        } else {
            return false;
        }
    }

    sendPrelevements() {
        this.emitPrelevements.emit(
            this.prelevements.filter((prelevement) => {
            return prelevement.checked;
            })
        );
    }

    changeStatut() {
        for (const prelevement of this.prelevements) {
            if (prelevement.checked) {
                prelevement.idStatutPrelevement = this.statutCible;
                this.prelevementService.update(prelevement).subscribe(() => {

                });
            }
        }
    }

    deletePrelevement(prelevement: Prelevement) {
        this.prelevementService.delete(prelevement.id).subscribe(() => {
            this.prelevements = this.prelevements.filter((prl) => {
                return prl.id !== prelevement.id;
            });

            this.emitDelete.emit();
        });
    }
}
