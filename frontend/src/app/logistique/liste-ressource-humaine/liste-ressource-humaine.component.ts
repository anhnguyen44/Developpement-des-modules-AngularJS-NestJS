import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuService} from '../../menu/menu.service';
import {Franchise} from '../../resource/franchise/franchise';
import {ChampDeRecherche} from '../../resource/query-builder/recherche/ChampDeRecherche';
import {Order} from '../../resource/query-builder/order/Order';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {BureauService} from '../../parametrage/bureau/bureau.service';
import {Router} from '@angular/router';
import {RessourceHumaine} from '../RessourceHumaine';
import {RessourceHumaineService} from '../ressource-humaine.service';
import {RendezVous} from '../RendezVous';
import {format} from 'date-fns';
import {RendezVousRessourceHumaine} from '../RendezVousRessourceHumaine';

@Component({
  selector: 'app-liste-ressource-humaine',
  templateUrl: './liste-ressource-humaine.component.html',
  styleUrls: ['./liste-ressource-humaine.component.scss']
})
export class ListeRessourceHumaineComponent implements OnInit {
    @Input() modal = false;
    @Input() ressourceHumainesAjoutees: RendezVousRessourceHumaine[];
    @Input() idBureau: number | null;
    @Input() rendezVous: RendezVous | null;
    @Output() emitRessourceHumaine = new EventEmitter<RessourceHumaine>();
    nbObjets: number;
    franchise: Franchise;
    ressourceHumaines: RessourceHumaine[];
    champDeRecherches: ChampDeRecherche[] = [];
    headers: Order[] = [
        new Order('Technicien', '', true, 'utilisateur.nom'),
        new Order('Agence', '', true, 'bureau.nom'),
        new Order('Fonctions'),
        new Order('Action', 'action')
    ];
    queryBuild: QueryBuild = new QueryBuild();

    constructor(
        private menuService: MenuService,
        private franchiseService: FranchiseService,
        private ressourceHumaineService: RessourceHumaineService,
        private bureauService: BureauService,
        private router: Router) { }

    ngOnInit() {
        if (this.ressourceHumainesAjoutees) {
            const ressourceHumaines: RessourceHumaine[] = [];
            for (const ressourceHumainesAjoutee of this.ressourceHumainesAjoutees) {
                ressourceHumaines.push(ressourceHumainesAjoutee.ressourceHumaine);
            }
            this.queryBuild.idsExclude = ressourceHumaines;
            this.queryBuild.nomCleExclude = 'ressourceHumaine.id';
        }
        if (!this.modal) {
            this.menuService.setMenu([['Logistique', ''], ['Ressource humaine', '']]);
        }
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.bureauService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
                this.champDeRecherches = [
                    new ChampDeRecherche('Nom technicien', 'text', 'utilisateur.nom', true, true),
                    new ChampDeRecherche('Prenom technicien', 'text', 'utilisateur.prenom', true, true),
                    new ChampDeRecherche('Agence', 'list', 'ressourceHumaine.idBureau', false, true, bureaux.map((bureau) => {
                        return {id: bureau.id, nom: bureau.nom};
                    })),
                ];
            });
        });
    }

    getAll() {
        if (this.idBureau) {
            if (this.rendezVous) {
                this.queryBuild.dd = format(this.rendezVous.dateHeureDebut, 'YYYY-MM-DD HH:mm:ss');
                this.queryBuild.df = format(this.rendezVous.dateHeureFin, 'YYYY-MM-DD HH:mm:ss');
            }
            this.ressourceHumaineService.getByBureau(this.idBureau, this.queryBuild).subscribe((ressourceHumaines) => {
                this.ressourceHumaines = ressourceHumaines;
                
            });
        } else {
            this.ressourceHumaineService.getAll(this.franchise.id, this.queryBuild).subscribe((ressourceHumaines) => {
                this.ressourceHumaines = ressourceHumaines;
                console.log(this.ressourceHumaines);
            });
        }

    }

    countAll() {
        if (this.idBureau) {
            this.ressourceHumaineService.countByBureau(this.idBureau, this.queryBuild).subscribe((nombre) => {
                this.nbObjets = nombre;
            });
        } else {
            this.ressourceHumaineService.countAll(this.franchise.id, this.queryBuild).subscribe((nombre) => {
                this.nbObjets = nombre;
            });
        }

    }

    setQueryBuild(queryBuild: QueryBuild) {
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countAll();
        }
        this.getAll();
    }

    goToDetail(ressourceHumaine) {
        if (this.modal) {
            this.emitRessourceHumaine.emit(ressourceHumaine);
        } else {
            this.router.navigate(['/logistique', 'ressource-humaine', 'modifier', ressourceHumaine.id]);
        }
    }
}
