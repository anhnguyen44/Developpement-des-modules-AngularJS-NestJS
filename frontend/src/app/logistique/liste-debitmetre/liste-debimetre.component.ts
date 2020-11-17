import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../menu/menu.service';
import {Franchise} from '../../resource/franchise/franchise';
import {ChampDeRecherche} from '../../resource/query-builder/recherche/ChampDeRecherche';
import {Order} from '../../resource/query-builder/order/Order';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {BureauService} from '../../parametrage/bureau/bureau.service';
import {Router} from '@angular/router';
import {DebitmetreService} from '../debitmetre.service';
import {Debitmetre} from '../Debitmetre';

@Component({
  selector: 'app-liste-debimetre',
  templateUrl: './liste-debimetre.component.html',
  styleUrls: ['./liste-debimetre.component.scss']
})
export class ListeDebimetreComponent implements OnInit {

    nbObjets: number = 10;
    franchise: Franchise;
    debitmetres: Debitmetre[];
    champDeRecherches: ChampDeRecherche[] = [];
    headers: Order[] = [
        new Order('Libelle', '', true, 'debitmetre.libelle'),
        new Order('Référence', '', true, 'debitmetre.ref'),
        new Order('Agence', '', true, 'bureau.nom'),
        new Order('Action', 'action'),
    ];
    queryBuild: QueryBuild = new QueryBuild();

    constructor(
        private menuService: MenuService,
        private franchiseService: FranchiseService,
        private debitmetreService: DebitmetreService,
        private bureauService: BureauService,
        private router: Router
    ) { }

    ngOnInit() {
        this.menuService.setMenu([['Logistique', '/logistique/debitmetre'], ['Débitmètres', '']]);
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.bureauService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
                this.champDeRecherches = [
                    new ChampDeRecherche('Libelle', 'text', 'debitmetre.libelle', true, true),
                    new ChampDeRecherche('Référence', 'text', 'debitmetre.ref', true, true),
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
        this.debitmetreService.getAll(this.franchise.id, this.queryBuild).subscribe((debitmetres) => {
            this.debitmetres = debitmetres;
        });
    }

    countAll() {
        this.debitmetreService.countAll(this.franchise.id, this.queryBuild).subscribe((nombre) => {
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
        this.router.navigate(['/logistique', 'debitmetre', 'modifier', salle.id]);
    }

}
