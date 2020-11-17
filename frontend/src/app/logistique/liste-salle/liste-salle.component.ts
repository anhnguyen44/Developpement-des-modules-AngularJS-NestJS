import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../menu/menu.service';
import {Franchise} from '../../resource/franchise/franchise';
import {Salle} from '../Salle';
import {ChampDeRecherche} from '../../resource/query-builder/recherche/ChampDeRecherche';
import {Order} from '../../resource/query-builder/order/Order';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {SalleService} from '../salle.service';
import {BureauService} from '../../parametrage/bureau/bureau.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-liste-salle',
  templateUrl: './liste-salle.component.html',
  styleUrls: ['./liste-salle.component.scss']
})
export class ListeSalleComponent implements OnInit {

    nbObjets: number = 10;
    franchise: Franchise;
    salles: Salle[];
    champDeRecherches: ChampDeRecherche[] = [];
    headers: Order[] = [
        new Order('Libelle', '', true, 'salle.libelle'),
        new Order('Référence', '', true, 'salle.ref'),
        new Order('Nombre', '', true, 'salle.place'),
        new Order('Agence', '', true, 'bureau.nom'),
        new Order('Action', 'action'),
    ];
    queryBuild: QueryBuild = new QueryBuild();

    constructor(
        private menuService: MenuService,
        private franchiseService: FranchiseService,
        private salleService: SalleService,
        private bureauService: BureauService,
        private router: Router
    ) { }

    ngOnInit() {
        this.menuService.setMenu([['Logistique', '/logistique/lot-filtre'], ['Salles', '']]);
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.bureauService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
                this.champDeRecherches = [
                    new ChampDeRecherche('Libelle', 'text', 'salle.libelle', true, true),
                    new ChampDeRecherche('Référence', 'text', 'salle.ref', true, true),
                    new ChampDeRecherche('Place', 'text', 'salle.place', true, true),
                    new ChampDeRecherche('Agence', 'list', 'salle.idBureau', false, true, bureaux.map((bureau) => {
                        return {id: bureau.id, nom: bureau.nom};
                    })),
                ];
            });
            this.getAll();
            this.countAll();
        });
    }

    getAll() {
        this.salleService.getAll(this.franchise.id, this.queryBuild).subscribe((salles) => {
            console.log(salles);
            this.salles = salles;

        });
    }

    countAll() {
        this.salleService.countAll(this.franchise.id, this.queryBuild).subscribe((nombre) => {
            this.nbObjets = nombre;
        });
    }

    setQueryBuild(queryBuild: QueryBuild) {
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countAll();
        }
        this.getAll();
    }

    goToDetail(salle) {
        this.router.navigate(['/logistique', 'salle', 'modifier', salle.id]);
    }

}
