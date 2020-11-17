import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../menu/menu.service';
import {RessourceHumaineService} from '../ressource-humaine.service';
import {PompeService} from '../pompe.service';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {Franchise} from '../../resource/franchise/franchise';
import {RessourceHumaine} from '../RessourceHumaine';
import {Pompe} from '../Pompe';
import {BureauService} from '../../parametrage/bureau/bureau.service';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {Bureau} from '../../parametrage/bureau/Bureau';
import {endOfWeek, format, startOfWeek} from 'date-fns';
import {Salle} from '../Salle';
import {SalleService} from '../salle.service';
import {InterventionService} from '../../intervention/intervention.service';
import {Intervention} from '../../intervention/Intervention';
import {EnumStatutIntervention} from '@aleaac/shared';
import {Order} from '../../resource/query-builder/order/Order';
import {Router} from '@angular/router';

@Component({
  selector: 'app-page-planning',
  templateUrl: './page-planning.component.html',
  styleUrls: ['./page-planning.component.scss']
})
export class PagePlanningComponent implements OnInit {
    headers: Order[] = [
        new Order('Ref', '', true, 'intervention.id'),
        new Order('Libellé', '', true, 'intervention.libelle'),
        new Order('Statut', '', true, 'intervention.idStatut'),
        new Order('Debut', '', true, 'rendezVous.dateHeureDebut'),
        new Order('Fin', '', true, 'rendezVous.dateHeureFin'),
        new Order('Date Validation', '', true, 'intervention.dateValidation'),
        new Order('Action', 'action')
    ];
  typeAffichage: string = 'intervention';
  franchise: Franchise;
  franchises: Franchise[];
  idBureau: number;
  bureaux: Bureau[];
  listePompes: Pompe[];
  listeRessourceHumaines: RessourceHumaine[];
  listeSalles: Salle[];
  pompes: Pompe[];
  ressourceHumaines: RessourceHumaine[];
  salles: Salle[];
  interventions: Intervention[];
  interventionsBureaux: Intervention[];
  enumStatutIntervention = EnumStatutIntervention;
  entites: (Pompe | RessourceHumaine | Salle | Intervention)[];
    queryBuild: QueryBuild = new QueryBuild(
        null,
        null,
        format(startOfWeek(new Date), 'YYYY-MM-DD HH:mm:ss'),
        format(endOfWeek(new Date), 'YYYY-MM-DD HH:mm:ss'),
        'rendezVous.dateHeureDebut',
        'rendezVous.dateHeureFin'
    );
  constructor(
      private menuService: MenuService,
      private franchiseService: FranchiseService,
      private bureauService: BureauService,
      private pompeService: PompeService,
      private ressourceHumaineService: RessourceHumaineService,
      private salleService: SalleService,
      private interventionService: InterventionService,
      private router: Router
  ) { }

  ngOnInit() {
    this.franchiseService.franchises.subscribe((franchises) => {
      this.franchises = franchises;
    });
    this.franchiseService.franchise.subscribe((franchise) => {
      this.franchise = franchise;
        this.bureauService.getAll(franchise.id, new QueryBuild(100, 1)).subscribe((bureaux) => {
          this.bureaux = bureaux;
          this.idBureau = bureaux[0].id;
        });
        this.pompeService.getAll(this.franchise.id, new QueryBuild()).subscribe((pompes) => {
            this.listePompes = pompes;
            this.listePompes.forEach(pompe => pompe.checked = true);
            this.ressourceHumaineService.getAll(this.franchise.id, new QueryBuild()).subscribe((ressourceHumaines) => {
                this.listeRessourceHumaines = ressourceHumaines;
                this.listeRessourceHumaines.forEach(ressourceHumaine => ressourceHumaine.checked = true);
                this.salleService.getAll(this.franchise.id, new QueryBuild()).subscribe((salles) => {
                  this.listeSalles = salles;
                  this.listeSalles.forEach(salle => salle.checked = true);
                  this.getRendezVous();
                });
            });
        });
    });
    this.menuService.setMenu([['Planning', '']]);
  }

  getRendezVous() {
    this.entites = [];
    if (this.typeAffichage === 'intervention') {
        this.queryBuild.colonne = 'intervention';
        /*this.interventionService.getInIntervalAllStatut(1, this.queryBuild.dd, this.queryBuild.df).subscribe((interventions) => {
            this.interventions = interventions;
            this.parseEntite();
        });*/

        this.queryBuild.colonne = 'intervention';
        this.interventionService.getAll(this.franchise.id, this.queryBuild).subscribe((interventions) => {
            console.log(interventions);
            this.interventions = interventions;
            this.parseEntite();
        });
    } else {
        this.queryBuild.colonne = 'pompe';
        this.pompeService.getAll(this.franchise.id, this.queryBuild).subscribe((pompes) => {
            this.pompes = pompes;
            this.queryBuild.colonne = 'ressourceHumaine';
            this.ressourceHumaineService.getAll(this.franchise.id, this.queryBuild).subscribe((ressourceHumaines) => {
                this.ressourceHumaines = ressourceHumaines;
                this.queryBuild.colonne = 'salle';
                this.salleService.getAll(this.franchise.id, this.queryBuild).subscribe((salles) => {
                    this.salles = salles;
                    this.parseEntite();
                });
            });
        });
    }
  }

  parseEntite() {
      let entites: (Pompe | RessourceHumaine | Salle | Intervention)[] = [];
      if (this.typeAffichage === 'intervention') {
          entites = this.interventions;
      } else {
          for (const pompe of this.pompes) {
              if (this.listePompes.find((findedPompe) => {
                  return findedPompe.id === pompe.id && findedPompe.checked;
              })) {
                  entites.push(pompe);
              }
          }
          for (const ressourceHumaine of this.ressourceHumaines) {
              if (this.listeRessourceHumaines.find((findedRessourceHumaine) => {
                  return findedRessourceHumaine.id === ressourceHumaine.id && findedRessourceHumaine.checked;
              })) {
                  entites.push(ressourceHumaine);
              }
          }
          for (const salle of this.salles) {
              if (this.listeSalles.find((findedSalle) => {
                  return findedSalle.id === salle.id && findedSalle.checked;
              })) {
                  entites.push(salle);
              }
          }
      }


      entites = entites.filter((entite) => {
          return entite.idBureau == this.idBureau;
      });

      this.interventionsBureaux = this.interventions.filter((intervention) => intervention.idBureau === this.idBureau);

      this.entites = entites;
      console.log(this.entites);
  }

  setIdBureau(idBureau) {
      this.idBureau = idBureau;
      this.parseEntite();
  }

  change(event) {
    this.idBureau = event.target.value;
    console.log(this.idBureau);
    this.parseEntite();
  }

  setInterval(interval) {
    this.queryBuild.dd = format(interval.dd, 'YYYY-MM-DD HH:mm:ss');
    this.queryBuild.df = format(interval.df, 'YYYY-MM-DD HH:mm:ss');
    this.getRendezVous();
  }

  checkPompe(value) {
      this.listePompes.forEach(pompe => pompe.checked = value);
      this.parseEntite();
  }

  checkRessourceHumaine(value) {
      this.listeRessourceHumaines.forEach(ressourceHumaine => ressourceHumaine.checked = value);
      this.parseEntite();
  }

  checkSalle(value) {
    this.listeSalles.forEach(salle => salle.checked = value);
    this.parseEntite();
  }

  changeType(value) {
      this.typeAffichage = value;
      this.getRendezVous();
  }

  setQueryBuild(queryBuild: QueryBuild) {
      this.queryBuild = queryBuild;
      this.getRendezVous();
  }

    goTo(intervention) {
      this.router.navigate(['chantier', intervention.idChantier, 'intervention', intervention.id, 'information']);
    }

}
