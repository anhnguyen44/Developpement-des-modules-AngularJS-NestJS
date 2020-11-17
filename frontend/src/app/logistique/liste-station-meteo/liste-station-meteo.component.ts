import { Component, OnInit } from '@angular/core';
import {Franchise} from '../../resource/franchise/franchise';
import {ChampDeRecherche} from '../../resource/query-builder/recherche/ChampDeRecherche';
import {Order} from '../../resource/query-builder/order/Order';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {StationMeteo} from '../StationMeteo';
import {MenuService} from '../../menu/menu.service';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {BureauService} from '../../parametrage/bureau/bureau.service';
import {Router} from '@angular/router';
import {StationMeteoService} from '../station-meteo.service';

@Component({
  selector: 'app-liste-station-meteo',
  templateUrl: './liste-station-meteo.component.html',
  styleUrls: ['./liste-station-meteo.component.scss']
})
export class ListeStationMeteoComponent implements OnInit {
    nbObjets: number = 10;
    franchise: Franchise;
    stationMeteos: StationMeteo[];
    champDeRecherches: ChampDeRecherche[] = [];
    headers: Order[] = [
        new Order('Libelle', '', true, 'consommable.libelle'),
        new Order('Référence', '', true, 'consommable.ref'),
        new Order('Agence', '', true, 'bureau.nom'),
        new Order('Action', 'action'),
    ];
    queryBuild: QueryBuild = new QueryBuild();

  constructor(
      private menuService: MenuService,
      private franchiseService: FranchiseService,
      private stationMeteoService: StationMeteoService,
      private bureauService: BureauService,
      private router: Router
  ) { }

  ngOnInit() {
      this.menuService.setMenu([['Logistique', ''], ['Station Météo', '']]);
      this.franchiseService.franchise.subscribe((franchise) => {
          this.franchise = franchise;
          this.bureauService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
              this.champDeRecherches = [
                  new ChampDeRecherche('Libelle', 'text', 'stationMeteo.libelle', true, true),
                  new ChampDeRecherche('Référence', 'text', 'stationMeteo.ref', true, true),
                  new ChampDeRecherche('Agence', 'list', 'stationMeteo.idBureau', false, true, bureaux.map((bureau) => {
                      return {id: bureau.id, nom: bureau.nom};
                  })),
              ];
          });
          this.getAll();
          this.countAll();
      });
  }

    getAll() {
        this.stationMeteoService.getAll(this.franchise.id, this.queryBuild).subscribe((stationMeteos) => {
            this.stationMeteos = stationMeteos;
        });
    }

    countAll() {
        this.stationMeteoService.countAll(this.franchise.id, this.queryBuild).subscribe((nombre) => {
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
        this.router.navigate(['/logistique', 'station-meteo', 'modifier', consommable.id]);
    }

}
