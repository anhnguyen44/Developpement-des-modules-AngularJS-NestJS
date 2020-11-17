import {AfterViewChecked, Component, EventEmitter, Input, OnChanges, OnInit, Output, HostListener} from '@angular/core';
import {EnumTypeDevis, Produit, TypeGrilles} from '@aleaac/shared';
import {TypeGrilleService} from '../../resource/grille-tarif/type-grille.service';
import {GrilleTarif} from '../../resource/grille-tarif/GrilleTarif';
import {GrilleTarifService} from '../../resource/grille-tarif/grille-tarif.service';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {Franchise} from '../../resource/franchise/franchise';
import {Recherche} from '../../resource/query-builder/recherche/Recherche';
import {TarifDetailService} from '../../resource/tarif-detail/tarif-detail.service';
import {TarifDetail} from '../../resource/tarif-detail/TarifDetail';
import {Paginable} from '../../resource/query-builder/pagination/Paginable';
import {QueryBuild, QueryBuildable} from '../../resource/query-builder/QueryBuild';
import {NotificationService} from '../../notification/notification.service';

@Component({
    selector: 'app-modal-produit',
    templateUrl: './modal-produit.component.html',
    styleUrls: ['./modal-produit.component.scss']
})
export class ModalProduitComponent implements OnInit, Paginable, QueryBuildable {
    @Input() modalProduit: number;
    @Input() grilleTarifSpecifiques: GrilleTarif[];
    @Input() typeDevis;
    @Output() emitTarifDetail = new EventEmitter<TarifDetail>();
    @Output() emitClose = new EventEmitter();

    idGrilles: any[];
    keys: any;
    enumTypeDevis = EnumTypeDevis;
    grilleTarifs: GrilleTarif[] = [];
    tarifDetails: TarifDetail[];
    franchise: Franchise;
    nbObjets: number = 49;
    rechercheString: string;
    queryBuild: QueryBuild = new QueryBuild(10, 1);

    constructor(
        private typeGrilleService: TypeGrilleService,
        private grilleTarifService: GrilleTarifService,
        private franchiseService: FranchiseService,
        private tarifDetailService: TarifDetailService,
        private notificationService: NotificationService
    ) {
    }

    ngOnInit() {
        this.keys = Object.keys(this.enumTypeDevis).filter(Number);
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
        this.grilleTarifService.getPublicDevisByFranchise(this.franchise.id).subscribe((grilleTarifPublics) => {
            console.log(grilleTarifPublics);
            console.log(this.grilleTarifSpecifiques);
            for (const grilleTarifPublic of grilleTarifPublics) {
                const findGrilleTarif = this.grilleTarifSpecifiques.find((grille) => {
                    return grille.idTypeGrille === grilleTarifPublic.idTypeGrille;
                });
                if (findGrilleTarif) {
                    this.grilleTarifs.push(findGrilleTarif);
                } else {
                    this.grilleTarifs.push(grilleTarifPublic);
                }
            }
            console.log(this.grilleTarifs);
            this.changeTypeDevis();
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    getTarifDetail() {
        this.tarifDetailService.getByIdGrilles(this.queryBuild).subscribe((tarifDetails) => {
            this.tarifDetails = tarifDetails;
            console.log(tarifDetails);
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    countTarifDetail() {
        this.tarifDetailService.countByIdGrilles(this.queryBuild).subscribe((nbObjets) => {
            this.nbObjets = nbObjets;
            console.log(nbObjets);
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    changeTypeDevis() {
        this.queryBuild.nomCleWhereIn = 'tarif_detail.idGrilleTarif';
        this.queryBuild.idsWhereIn = [];
        console.log(this.grilleTarifs);
        if (this.typeDevis == this.enumTypeDevis.LIBRE) {
            for (const grille of this.grilleTarifs) {
                this.queryBuild.idsWhereIn.push(grille);
            }
        } else {
            const findGrille = this.grilleTarifs.find((grille) => {
                return grille.idTypeGrille == Number(this.typeDevis);
            });
            if (findGrille) {
                this.queryBuild.idsWhereIn.push(findGrille);
            }
        }
        this.queryBuild.pageEnCours = 1;
        this.setQueryBuild(this.queryBuild);
    }

    setQueryBuild(queryBuild: QueryBuild) {
        this.queryBuild = queryBuild;
        this.countTarifDetail();
        this.getTarifDetail();
    }


    rechercher() {
        this.queryBuild.stringRecherche = 'simple=$$produit.nom$$produit.code';
        this.queryBuild.stringRecherche += '€€' + this.rechercheString;
        this.getTarifDetail();
        this.countTarifDetail();
    }

    close() {
        this.emitClose.emit();
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.close();
    }
}
