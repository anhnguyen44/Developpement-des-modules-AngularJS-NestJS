import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../menu/menu.service';
import { FormationContactService } from '../formation-contact.service';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { NotificationService } from '../../notification/notification.service';
import { FormationContact, Formation, MailFile } from '@aleaac/shared';
import { Consommable } from '../../logistique/Consommable';
import { FormationService } from '../formation.service';
import { ChampDeRecherche } from '../../resource/query-builder/recherche/ChampDeRecherche';
import { NoteCompetenceStagiaire } from '@aleaac/shared';
import { NoteCompetenceStagiaireService } from '../note-competence-stagiaire.service';
import { Mail } from '../../resource/mail/Mail';
import { MailService } from '../../resource/mail/mail.service';
import { LoaderService } from '../../loader/loader.service';
import { format } from "date-fns";

@Component({
  selector: 'app-liste-stagiaire-formation',
  templateUrl: './liste-stagiaire-formation.component.html',
  styleUrls: ['./liste-stagiaire-formation.component.scss']
})
export class ListeStagiaireFormationComponent implements OnInit {
  checkAll: boolean = false;
  modalGeneration: boolean = false;
  id: number;
  activeMenu: string;
  listeFormationContact: FormationContact[];
  openStagiarie: boolean = false;
  numberStagiaire: number;
  capaciteSalle: number;
  listIdStagiaireChecked: number[] = [];
  listStagiaireChecked: FormationContact[] = [];
  session: Formation;
  stagiaireTempo: FormationContact;
  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private formationContactService: FormationContactService,
    private notificationService: NotificationService,
    private formationService: FormationService,
    private router: Router,
    private noteCompetenceStagiaireService: NoteCompetenceStagiaireService,
    private mailService: MailService,
    private loaderService: LoaderService
  ) {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      console.log('Affichage id dans menu formation');
      console.log(this.id);
    });

    if (this.id) {
      this.menuService.setMenu([
        ['Sessions', '/formation'],
        ['Session #' + this.id, '/formation/' + this.id + '/modifier'],
        ['Stagiaires', ''],
      ]);

      this.formationService.getById(this.id).subscribe(ses => {
        this.session = ses;
        this.capaciteSalle = ses.salle.place;
        this.getAllStagiaire();
        this.countStagiaire();
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue']);
        console.log(err);
      });

    }

  }

  champDeRecherches: ChampDeRecherche[] = [
    new ChampDeRecherche('Prénom', 'text', 'contact.prenom', true, true),
    new ChampDeRecherche('Nom', 'text', 'contact.nom', true, true),
    new ChampDeRecherche('Raison sociale', 'text', 'compte.raisonSociale', true, true),
    new ChampDeRecherche('Absence Total', 'checkbox', 'formation-contact.absenceTotal', false, true),
  ];


  queryBuild: QueryBuild = new QueryBuild();

  ngOnInit() {
    this.formationContactService.getAllByIdFormation(this.queryBuild, this.id).subscribe(data2 => {
      console.log(data2);
      this.listeFormationContact = data2;
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      console.log(err);
    });
    this.getAllStagiaire();
    this.countStagiaire();
  }

  getAllStagiaire() {
    this.formationContactService.getAllByIdFormation(this.queryBuild, this.id).subscribe(data2 => {
      console.log(data2);
      this.listeFormationContact = data2;
      this.listeFormationContact.forEach(s => {
        s.delivrerLe = new Date(this.session.dateFin);
        s.delivrerLe.setDate(s.delivrerLe.getDate());
      });
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      console.log(err);
    });
  }

  // getStagiaire() {
  //   this.formationContactService.getAllByIdFormation(this.queryBuild, this.id).subscribe(data => {
  //     // console.log(data);
  //     data.forEach(s => {
  //       if (s.noteCompetence!.length) {
  //         let idTypeOld = s.noteCompetence![0].competence!.idTypeFormation;
  //         if (idTypeOld !== this.session.typeFormation.id) {
  //           idTypeOld = this.session.typeFormation.id;
  //           // console.log(this.session);
  //           this.noteCompetenceStagiaireService.deleteAllNoteByIdSta(s.id).subscribe(() => {
  //           }, err => {
  //             this.notificationService.setNotification('danger', ['Une erreur est survenue']);
  //             console.log(err);
  //           });
  //           this.session.typeFormation.dCompetence!.forEach(compe3 => {
  //             this.noteCompetenceStagiaireService.create({ "idStagiaire": s.id, "idCompetence": compe3.id, 'note': 0 }).subscribe(() => {
  //             }, err => {
  //               this.notificationService.setNotification('danger', ['Une erreur est survenue']);
  //               console.log(err);
  //             });
  //           });
  //         }
  //       }
  //     });
  //     this.listeFormationContact = data;
  //     // console.log(data);

  //   }, err => {
  //     this.notificationService.setNotification('danger', ['Une erreur est survenue']);
  //     console.log(err);
  //   });
  // }

  countStagiaire() {
    this.formationContactService.countAll(this.queryBuild, this.id).subscribe((data2) => {
      this.numberStagiaire = data2;
      // console.log("Number stagiaire");
      // console.log(this.numberStagiaire);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      console.log(err);
    });
  }

  supprimer(id: number, text = 'one') {
    if (text == 'many') {
      this.formationContactService.delete(id).subscribe(() => {
        this.notificationService.setNotification('success', ['Stagiaire supprimé']);
        this.listeFormationContact = this.listeFormationContact.filter(item => item.id !== id);
        this.countStagiaire();
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue']);
        console.log(err);
      });
    } else {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce stagiare ?')) {
        this.formationContactService.delete(id).subscribe(() => {
          this.notificationService.setNotification('success', ['Stagiaire supprimé']);
          this.listeFormationContact = this.listeFormationContact.filter(item => item.id !== id);
          this.countStagiaire();
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue']);
          console.log(err);
        });
      }
    }
  }

  limitCreate() {
    this.notificationService.setNotification('danger', ['Ne pouvez pas ajouter un stagiaire. La capacité de salle est limité']);
  }

  setQueryBuild(queryBuild) {
    this.queryBuild = queryBuild;
    this.getAllStagiaire();
    this.countStagiaire();
  }

  changeCocher(e) {
    console.log(e);
  }

  boxChecked(checkEven, sta: FormationContact) {
    sta.pratiqueFavorable = false;
    sta.theoriqueFavorable = false;
    sta.favorable = false;
    // console.log(checkEven);
    // console.log("de stagiaire id: ");
    // console.log(sta.id);
    if (checkEven) {
      console.log(this.listIdStagiaireChecked.length);
      if (this.listIdStagiaireChecked.length) {
        if (!this.listIdStagiaireChecked.includes(sta.id)) {
          this.listIdStagiaireChecked.push(sta.id);
        }
        if (!this.listStagiaireChecked.includes(sta)) {
          this.listStagiaireChecked.push(sta);
        }
      } else {
        this.listIdStagiaireChecked.push(sta.id);
        this.listStagiaireChecked.push(sta);
      }
    } else {
      if (this.listIdStagiaireChecked.length) {
        if (this.listIdStagiaireChecked.includes(sta.id)) {
          this.listIdStagiaireChecked.splice(this.listIdStagiaireChecked.indexOf(sta.id), 1);
        }
        if (this.listStagiaireChecked.includes(sta)) {
          this.listStagiaireChecked.splice(this.listStagiaireChecked.indexOf(sta), 1);
        }
      }
    }
    console.log(this.listIdStagiaireChecked);
    console.log(this.listStagiaireChecked);
  }


  deleteMany() {
    if (this.listIdStagiaireChecked.length > 0) {
      if (confirm('Êtes-vous sûr de vouloir supprimer des stagiaires ?')) {
        this.listIdStagiaireChecked.forEach(id => {
          this.supprimer(id, 'many');
          this.listeFormationContact = this.listeFormationContact.filter(item => item.id !== id);
        });
      }
    }
  }

  allCoche(model) {
    if (model) {
      this.listIdStagiaireChecked = [];
      this.listStagiaireChecked = [];
      this.listeFormationContact.forEach(e => {
        e.pratiqueFavorable = false;
        e.theoriqueFavorable = false;
        e.favorable = false;
        this.listIdStagiaireChecked.push(e.id);
        this.listStagiaireChecked.push(e);
      });
    } else {
      this.listIdStagiaireChecked = [];
      this.listStagiaireChecked = [];
    }
    console.log(this.listIdStagiaireChecked);
    console.log(this.listStagiaireChecked);
  }

  setOffCheckAll(e) {
    // console.log(this.modalGeneration);
    // if (!this.modalGeneration) {
    //   this.getStagiaire();
    // }
    // if (e) {
    //   this.getStagiaire();
    // }
    this.listIdStagiaireChecked = [];
    this.listStagiaireChecked = [];
    this.checkAll = false;
    for (let e of this.listeFormationContact) {
      e.checked = 0;
    }
  }

  openModalGeneration() {
    if (this.listIdStagiaireChecked.length > 0) {
      this.modalGeneration = true;
    }
  }

  envoyerDossier() {
    console.log('alolao');

    let listStagiairePasDossier = this.listStagiaireChecked.filter(e => e.dossierComplet == null || e.dossierComplet == undefined);
    let listStagiaireAvoirDossier = this.listStagiaireChecked.filter(e => e.dossierComplet !== null);
    let listStagiaireEnvoyerDossier = this.listStagiaireChecked.filter(e => e.dateEnvoiDossier !== null && e.dossierComplet !== null);
    console.log(listStagiaireEnvoyerDossier);

    if (listStagiairePasDossier.length) {
      if (confirm("Attention certain stagiaire n'ont pas de dossier attaché. Voulez continuer?")) {
        if (listStagiaireEnvoyerDossier.length) {
          if (confirm('Vous avez déjà envoyé le dossier à certain stagiaire sélectionées. Voulez vous continué')) {
            this.envoyerDossierAListStagiaire(listStagiaireAvoirDossier);
          }
        }else{
          this.envoyerDossierAListStagiaire(listStagiaireAvoirDossier);
        }
      }
    } else {
      if (listStagiaireEnvoyerDossier.length) {
        if (confirm('Vous avez déjà envoyé le dossier à certain stagiaire sélectionées. Voulez vous continué')) {
          this.envoyerDossierAListStagiaire(listStagiaireAvoirDossier);
        }
      }


    }
  }

  envoyerDossierAListStagiaire(listSta) {
    listSta.forEach(mSta => {

      let mail = new Mail();
      let fileToSend = new MailFile();
      let fichier = mSta.dossierComplet;
      let convMap = {};
      let data: Map<string, string> = new Map<string, string>();
      // console.log(mSta);

      console.log(mSta);
      // console.log(mSta.dossierComplet);
      let dateDebut = format(mSta.formation!.dateDebut, 'DD-MM-YYYY');
      let dateFin = format(mSta.formation!.dateFin, 'DD-MM-YYYY');


      mail.subject = 'Envoi du dossier complet de stagiaire';

      if (mSta && mSta.contact && mSta.contact.adresse! && mSta.contact.adresse!.email) {
        mail.to = [mSta.contact.adresse!.email];
      } else {
        mail.to = [''];
      }
      // mail. = mSta.id;
      console.log(mail.to);
      mail.from = mSta.formation!.bureau.adresse.email;
      mail.attachments = [];
      mail.template = 'blank';
      mail.idParent = mSta.id;
      mail.application = 'formation';
      mail.contenu = "<p><strong>Bonjour Madame/Monsieur " + mSta.contact.prenom + " " + mSta.contact.nom + "</strong></p><p>&nbsp;</p><p>Nous vous enverrions votre dossier complet de stagiaire suivant la formation " + mSta.formation!.typeFormation.phrFormation + " suivant:</p><p>" + mSta.formation!.typeFormation.nomFormation + " " + mSta.formation!.typeFormation.cateFormation + "</p><p>&nbsp;</p><p><strong>Cordialement</strong></p><p><strong>Diagamter Toulouse</strong></p>";
      mail.contenu = "<p>Bonjour Madame/Monsieur <strong>" + mSta.contact.prenom + " " + mSta.contact.nom + "</strong></p><p>&nbsp;</p><p>Veuillez trouver ci-joint votre dossier complet de formation. Celui ci correspond de formation " + mSta.formation!.typeFormation.nomFormation + "</p><p>que vous avez suivi du " + dateDebut + " au " + dateFin + " &agrave; " + mSta.formation!.bureau.adresse.adresse + ' - ' + mSta.formation!.bureau.adresse.cp + ' ' + mSta.formation!.bureau.adresse.ville + ". Merci</p><p>&nbsp;</p><p>Cordialement</p><p>" + mSta.formation!.bureau.franchise!.raisonSociale + "</p>"
      fileToSend.filename = fichier.nom + '.' + fichier.extention;
      fileToSend.path = './uploads/' + fichier.keyDL;
      mail.attachments.push(fileToSend);


      data.set('data', mail.contenu);
      data.forEach((val: string, key: string) => {
        convMap[key] = val;
      });
      mail.dataList = convMap;

      this.loaderService.show();
      this.mailService.send(mail).subscribe(() => {
        this.loaderService.hide();
        this.notificationService.setNotification('success', ['Message envoyé correctement.']);
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
      });

      let s = new FormationContact();
      s.id = mSta.id;
      s.dateEnvoiDossier = new Date();
      this.formationContactService.update(s).subscribe(()=>{
        this.getAllStagiaire();
      },err=>{
        this.notificationService.setNotification('danger',['Une erreur est survenue']);
        console.log(err);
      });


    });
  }

  public openModalStagiaire(id = this.id, idCon = null, text = 'ajouter') {
    if (idCon == null) {
      this.router.navigate(['formation', id, 'stagiaire', text]).then((e) => {
        if (e) {
          // console.log('Navigation is successful!');
        } else {
          // console.log('Navigation has failed!');
        }
      });
    } else {
      this.router.navigate(['formation', id, 'stagiaire', idCon, text]).then((e) => {
        if (e) {
          // console.log('Navigation is successful!');
        } else {
          // console.log('Navigation has failed!');
        }
      });
    }

  }


}