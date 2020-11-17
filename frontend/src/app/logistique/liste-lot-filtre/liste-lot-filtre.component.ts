import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../menu/menu.service';
import {ChampDeRecherche} from '../../resource/query-builder/recherche/ChampDeRecherche';
import {Order} from '../../resource/query-builder/order/Order';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {BureauService} from '../../parametrage/bureau/bureau.service';
import {Router} from '@angular/router';
import {Filtre} from '../Filtre';
import {Franchise} from '../../resource/franchise/franchise';
import {LotFiltreService} from '../lot-filtre.service';
import {LotFiltre} from '../LotFiltre';
import {EnumTypeFiltre} from '@aleaac/shared';
import {Bureau} from '../../parametrage/bureau/Bureau';
import {FiltreService} from '../filtre.service';

@Component({
  selector: 'app-liste-lot-filtre',
  templateUrl: './liste-lot-filtre.component.html',
  styleUrls: ['./liste-lot-filtre.component.scss']
})
export class ListeLotFiltreComponent implements OnInit {
  nbObjets: number;
  franchise: Franchise;
  lotFiltres: LotFiltre[];
  countFiltre: {idTypeFiltre: number, idBureau: number, count: number}[];
  enumTypeFiltre = EnumTypeFiltre;
  champDeRecherches: ChampDeRecherche[] = [];
  bureaux: Bureau[];
  headers: Order[] = [
      new Order('Référence', '', true, 'lotFiltre.ref'),
      new Order('Agence', '', true, 'bureau.nom'),
      new Order('Conforme', '', true, 'lotFiltre.isConforme'),
      new Order('Type filtre', '', true, 'lotFiltre.idTypeFiltre'),
      new Order('Stock'),
      new Order('Action', 'action'),
  ];
  queryBuild: QueryBuild = new QueryBuild();

  constructor(
      private menuService: MenuService,
              private franchiseService: FranchiseService,
              private lotFiltreService: LotFiltreService,
              private filtreService: FiltreService,
              private bureauService: BureauService,
              private router: Router) { }

  ngOnInit() {
      this.menuService.setMenu([['Logistique', '/logistique/lot-filtre'], ['Lots de filtres', '']]);
      this.franchiseService.franchise.subscribe((franchise) => {
          this.filtreService.getStock(franchise.id).subscribe((data) => {
              this.countFiltre = data;
          });
          this.franchise = franchise;
          this.bureauService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
              this.bureaux = bureaux;
              this.champDeRecherches = [
                  new ChampDeRecherche('Référence', 'text', 'filtre.ref', true, true),
                  new ChampDeRecherche('Conforme', 'checkbox', 'isConforme', false, true),
                  new ChampDeRecherche('Agence', 'list', 'lotFiltre.idBureau', false, true, bureaux.map((bureau) => {
                      return {id: bureau.id, nom: bureau.nom};
                  })),
                  new ChampDeRecherche('Type filtre', 'enum', 'lotFiltre.idTypeFiltre', false, true, this.enumTypeFiltre)
              ];
          });
      });
  }

    getAll() {
        this.lotFiltreService.getAll(this.franchise.id, this.queryBuild).subscribe((lotFiltres) => {
            this.lotFiltres = lotFiltres;
            for (const lotFiltre of lotFiltres) {
                lotFiltre.stock = this.countStock(lotFiltre);
                lotFiltre.stockTotal = this.countStockTotal(lotFiltre);
            }
            console.log(this.lotFiltres);
        });
    }

    countStock(lotFiltre: LotFiltre): number {
        return lotFiltre.filtres.filter((filtre) => {
            return !filtre.isBlanc;
        }).length;
    }

    countStockTotal(lotFiltre: LotFiltre) {
        return lotFiltre.filtres.length;
    }

    countAll() {
        this.lotFiltreService.countAll(this.franchise.id, this.queryBuild).subscribe((nombre) => {
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

    getCountFiltre(idBureau: number, idTypeFiltre: number) {
      const count = this.countFiltre ? this.countFiltre.find((findCount) => {
          return findCount.idBureau === idBureau && findCount.idTypeFiltre === idTypeFiltre;
      }) : null;

      if (count) {
          return Number(count.count);
      } else {
          return 0;
      }
    }

    goToDetail(lotFiltres) {
        this.router.navigate(['/logistique', 'lot-filtre', 'modifier', lotFiltres.id]);
    }

}
