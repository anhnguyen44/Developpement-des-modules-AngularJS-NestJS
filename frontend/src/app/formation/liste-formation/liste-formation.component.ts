import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { exists } from 'fs';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { Recherchable } from '../../resource/query-builder/recherche/Recherchable';
import { Paginable } from '../../resource/query-builder/pagination/Paginable';
import { ChampDeRecherche } from '../../resource/query-builder/recherche/ChampDeRecherche';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { Order } from '../../resource/query-builder/order/Order';
import { MenuService } from '../../menu/menu.service';
import { FormationService } from '../formation.service';
import { NotificationService } from '../../notification/notification.service';
import { FichierService } from '../../resource/fichier/fichier.service';
import * as FileSaver from 'file-saver';
import { Formation, EnumStatutSessionFormation } from '@aleaac/shared';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { Bureau } from '../../parametrage/bureau/Bureau';
import { BureauService } from '../../parametrage/bureau/bureau.service';


@Component({
  selector: 'app-liste-formation',
  templateUrl: './liste-formation.component.html',
  styleUrls: ['./liste-formation.component.scss']
})
export class ListeFormationComponent implements OnInit, Recherchable, Paginable {
  @Input() idParent: number;
  @Input() isModal: boolean = false;
  @Output() emitSessionFormation: EventEmitter<Formation> = new EventEmitter<Formation>();
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
  enumStatutSessionFormation = EnumStatutSessionFormation
  

  
  queryBuild: QueryBuild = new QueryBuild();
  headers: Order[] = [
    new Order('Référence de session', 'grow2', true, 'formation.id'),
    new Order('Type de formation', 'grow3', true, 'type_formation.nomFormation'),
    new Order('Statut', 'grow2', true, 'formation.idStatutFormation'),
    new Order('Date début', 'grow2', true, 'formation.dateDebut'),
    new Order('Nombre de jour', 'grow2', true, 'formation.nbrJour'),
    new Order('Participants', 'grow2', false),
    new Order('Action', 'action'),
    // new Order('Formateur', 'grow2', true, 'utilisateur.prenom'),
  ];

  ngOnInit() {
    console.log(EnumStatutSessionFormation);
    this.getFormations();
  }

  getFormations() {
    this.franchiseService.franchise.subscribe(franchise => {
      this.franchise = franchise;
      this.formationService.getAllByIdFranchise(this.franchise.id,this.queryBuild).subscribe((dataList) => {
        dataList.forEach(e => {
          if (e.typeFormation) {
            if (e.nbrJour !== e.typeFormation.dureeEnJour) {
              e.nbrJour = e.typeFormation.dureeEnJour;
            }
          }
        });
        this.listSessionFormation = dataList;
        console.log(this.listSessionFormation);
        this.bureauService.getAll(this.franchise.id).subscribe(bureau=>{
          this.champDeRecherches = [
            new ChampDeRecherche('Type de formation', 'text', 'type_formation.nomFormation', true, true),
            new ChampDeRecherche('Nombre de jour', 'text', 'formation.nbrJour', true, true),
            new ChampDeRecherche('Bureau', 'list', 'formation.bureau', true, true, bureau.map((bu) => {
              return { id: bu.id, nom: bu.nom };
          })),
        
          ];
        
        },err=>{
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

    // this.formationService.getAll(this.queryBuild).subscribe((dataList)=>{
    //   dataList.forEach(e=>{
    //     if(e.typeFormation){
    //       if(e.nbrJour!==e.typeFormation.dureeEnJour){
    //         e.nbrJour = e.typeFormation.dureeEnJour;
    //       }
    //     }
    //   });
    //   this.listSessionFormation = dataList;
    //   console.log(this.listSessionFormation);
    // },err=>{
    //   this.notificationService.setNotification('danger',['Une erreur est survenue']);
    //   console.log(err);
    // });
  }


  // generateFormationDocx(text='demo'){

  //   this.formationService.generateDocument(text).subscribe(fichier=>{
  //     console.log(fichier);
  //     this.fichierService.get(fichier.keyDL).subscribe((file) => {
  //       const filename = fichier.nom + '.' + fichier.extention;
  //       FileSaver.saveAs(file, filename);
  //   }, err => {
  //       this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
  //       console.error(err);
  //   });
  //   },err=>{
  //     this.notificationService.setNotification('danger',['Une erreur est survenue']);
  //     console.log(err);
  //   });
  // }

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
    if (this.isModal) {
      this.emitFormation(sesFor);
    } else {
      if (this.idParent) {
        this.router.navigate(['formation', sesFor.id, 'detail']);
      } else {
        this.router.navigate(['formation', sesFor.id, 'modifier']);
      }
    }
  }

  emitFormation(sesFor: Formation) {
    this.emitSessionFormation.emit(sesFor);
  }

}
