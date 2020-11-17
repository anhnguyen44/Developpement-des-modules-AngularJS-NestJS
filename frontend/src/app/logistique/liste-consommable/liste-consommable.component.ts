import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../menu/menu.service';
import {ChampDeRecherche} from '../../resource/query-builder/recherche/ChampDeRecherche';
import {Order} from '../../resource/query-builder/order/Order';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {Franchise} from '../../resource/franchise/franchise';
import {ConsommableService} from '../consommable.service';
import {Consommable} from '../Consommable';
import {Router} from '@angular/router';
import {BureauService} from '../../parametrage/bureau/bureau.service';

@Component({
  selector: 'app-liste-consommable',
  templateUrl: './liste-consommable.component.html',
  styleUrls: ['./liste-consommable.component.scss']
})
export class ListeConsommableComponent implements OnInit {
  nbObjets: number = 10;
  franchise: Franchise;
  consommables: Consommable[];
  champDeRecherches: ChampDeRecherche[] = [];
  headers: Order[] = [
        new Order('Libelle', '', true, 'consommable.libelle'),
        new Order('Référence', '', true, 'consommable.ref'),
        new Order('Stock', '', true, 'consommable.stock'),
        new Order('Agence', '', true, 'bureau.nom'),
        new Order('Action', 'action'),
  ];
  queryBuild: QueryBuild = new QueryBuild();

  constructor(
      private menuService: MenuService,
      private  franchiseService: FranchiseService,
      private consommableService: ConsommableService,
      private bureauService: BureauService,
      private router: Router
  ) { }

  ngOnInit() {
    this.menuService.setMenu([['Logistique', ''], ['Consommables', '']]);
    this.franchiseService.franchise.subscribe((franchise) => {
        this.franchise = franchise;
        this.bureauService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
            this.champDeRecherches = [
                new ChampDeRecherche('Libelle', 'text', 'consommable.libelle', true, true),
                new ChampDeRecherche('Référence', 'text', 'consommable.ref', true, true),
                new ChampDeRecherche('Agence', 'list', 'consommable.idBureau', false, true, bureaux.map((bureau) => {
                    return {id: bureau.id, nom: bureau.nom};
                })),
            ];
        });
        this.getAll();
        this.countAll();
    });
  }

  getAll() {
      this.consommableService.getAll(this.franchise.id, this.queryBuild).subscribe((consommables) => {
          this.consommables = consommables;
          console.log(this.consommables);
      });
  }

  countAll() {
      this.consommableService.countAll(this.franchise.id, this.queryBuild).subscribe((nombre) => {
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

  goToDetail(consommable) {
      this.router.navigate(['/logistique', 'consommable', 'modifier', consommable.id]);
  }

}
