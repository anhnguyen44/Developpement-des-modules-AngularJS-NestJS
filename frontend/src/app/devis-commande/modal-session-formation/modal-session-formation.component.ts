import { Component, ElementRef, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { Formation } from '@aleaac/shared';
import { Router } from '@angular/router';
import { MenuService } from '../../menu/menu.service';
import { FormationService } from '../../formation/formation.service';
import { NotificationService } from '../../notification/notification.service';
import { FichierService } from '../../resource/fichier/fichier.service';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { BureauService } from '../../parametrage/bureau/bureau.service';
import { ChampDeRecherche } from '../../resource/query-builder/recherche/ChampDeRecherche';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { Order } from '../../resource/query-builder/order/Order';


@Component({
  selector: 'app-modal-session-formation',
  templateUrl: './modal-session-formation.component.html',
  styleUrls: ['./modal-session-formation.component.scss']
})
export class ModalSessionFormationComponent {
  @Input() isModal: boolean = false;
  @Output() emitSessionFormation: EventEmitter<Formation> = new EventEmitter<Formation>();
  @Output() emitClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private router: Router,
    private menuService: MenuService,
    private formationService: FormationService,
    private notificationService: NotificationService,
    private fichierService: FichierService,
    private franchiseService: FranchiseService,
    private bureauService: BureauService
  ) {

    this.menuService.setMenu([
      ['Session de formation', '/formation'],
    ]);
  }

  franchise;
  listSessionFormation: Formation[];
  nbObjets: number = 20;
  champDeRecherches: ChampDeRecherche[] = [];



  queryBuild: QueryBuild = new QueryBuild();
  headers: Order[] = [
    new Order('Référence de session', 'grow2', true, 'formation.id'),
    new Order('Type de formation', 'grow3', true, 'type_formation.nomFormation'),
    new Order('Date début', 'grow2', true, 'formation.dateDebut'),
    new Order('Nombre de jour', 'grow2', true, 'formation.nbrJour'),
    new Order('Participants', 'grow2', false),
    new Order('Action', 'action'),
    // new Order('Formateur', 'grow2', true, 'utilisateur.prenom'),
  ];

  ngOnInit() {
    this.getFormations();
  }

  getFormations() {
    console.log('coucou');
    this.franchiseService.franchise.subscribe(franchise => {
      this.franchise = franchise;
      this.formationService.getAllByIdFranchise(this.franchise.id, this.queryBuild).subscribe((dataList) => {
        dataList.forEach(e => {
          if (e.typeFormation) {
            if (e.nbrJour !== e.typeFormation.dureeEnJour) {
              e.nbrJour = e.typeFormation.dureeEnJour;
            }
          }
        });
        this.listSessionFormation = dataList;
        console.log(this.listSessionFormation);
        this.bureauService.getAll(this.franchise.id).subscribe(bureau => {
          this.champDeRecherches = [
            new ChampDeRecherche('Type de formation', 'text', 'type_formation.nomFormation', true, true),
            new ChampDeRecherche('Nombre de jour', 'text', 'formation.nbrJour', true, true),
            new ChampDeRecherche('Bureau', 'list', 'formation.bureau', true, true, bureau.map((bu) => {
              return { id: bu.id, nom: bu.nom };
            })),

          ];

        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue']);
          console.log(err);
        });
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue']);
        console.log(err);
      });
    }, err => {
      this.notificationService.setNotification("danger", ['Une erreur est survenue']);
      console.log(err);
    });
  }

  supprimer(sesFor: Formation) {
    this.formationService.delete(sesFor).subscribe(() => {
      this.notificationService.setNotification('success', ['Formation supprimé']);
      this.listSessionFormation = this.listSessionFormation.filter(item => item.id !== sesFor.id);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      console.log(err);
    });
  }


  setQueryBuild(queryBuild) {
    this.queryBuild = queryBuild;
    this.getFormations();
  }

  public goToDetail(sesFor: Formation) {

    this.router.navigate(['formation', sesFor.id, 'modifier']);

  }

  emitFormation(sesFor: Formation) {
    this.emitSessionFormation.emit(sesFor);
  }

  close(e) {
    this.emitClose.emit(false);
  }

}
