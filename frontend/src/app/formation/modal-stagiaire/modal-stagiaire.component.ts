import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../menu/menu.service';
import { FormationContactService } from '../formation-contact.service';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { NotificationService } from '../../notification/notification.service';
import { isThisWeek } from 'date-fns';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../resource/validation/validation.service';
import { FormationContact, EnumTypeFichierGroupe, EnumTypeFichier, TypeFormationDCompetence, Formation } from '@aleaac/shared';
import { TypeFichier } from '../../superadmin/typefichier/type-fichier/TypeFichier';
import { TypeFichierService } from '../../superadmin/typefichier/type-fichier.service';
import { Fichier } from '../../resource/fichier/Fichier';
import { Contact } from '@aleaac/shared/src/models/contact.model';
import { Compte } from '../../contact/Compte';
import { format } from 'date-fns';
import { FormationService } from '../formation.service';
import { ITypeFormation } from '@aleaac/shared';
import { TFormationDCompetenceService } from '../../superadmin/typeformation/tFormation-dCompetence.service';
import { NoteCompetenceStagiaireService } from '../note-competence-stagiaire.service';
import { NoteCompetenceStagiaire } from '@aleaac/shared';
import { CompteService } from '../../contact/compte.service';


@Component({
  selector: 'app-modal-stagiaire',
  templateUrl: './modal-stagiaire.component.html',
  styleUrls: ['./modal-stagiaire.component.scss']
})
export class ModalStagiaireComponent implements OnInit {
  capaciteSalle: number;
  nbrStagiaire: number;
  idSessionFormation: number;
  TypeFichier: TypeFichier;
  groupeTypeFicher: EnumTypeFichierGroupe = EnumTypeFichierGroupe.STAGIAIRE;
  submited: boolean = false;
  id: number;
  isAbTotal: boolean = false;
  formaValide: boolean = false;
  modalContact: boolean = false;
  modalCompte: boolean = false;
  modalFichier: boolean = false;
  casChangementTypeForma: boolean = false;
  oldIdTypeForma: number;
  typeFormaNouvelle: any;
  noteCompetence: NoteCompetenceStagiaire;
  listNoteCompetenceTempo: any[] = [];
  listNoteCompetenceUpdate: any[] = [];
  listCompetenceFormation: any[] | undefined;
  listCompetenceFormation2: any[];
  listTest: any[] = [];
  listCompetence: TypeFormationDCompetence[];
  listStagiaire: FormationContact[];
  stagiaireFormationForm = this.formBuilder.group({
    id: [null, null],
    contact: ['', [Validators.required]],
    sousTraitance: [null, null],
    rattrapage: ['', null],
    absenceTotal: ['', null],
    absencePartielle: ['', null],
    formationValide: ['', null],
    numCertificat: ['', null],
    numForprev: ['', null],
    phraseForprev: ['', null],
    noteObtenu: ['', null],
    delivrerLe: ['', null],
    dossierComplet: [null, null],
    idFormation: [null, null]
  });

  errors: string[] = new Array<string>();
  stagiaireCreate: FormationContact;
  sessionFormation: Formation

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private formationContactService: FormationContactService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private typeFichierService: TypeFichierService,
    private formationService: FormationService,
    private router: Router,
    private tFormationDCompetenceService: TFormationDCompetenceService,
    private noteCompetenceStagiaireService: NoteCompetenceStagiaireService,
    private compteService: CompteService
  ) {
    this.route.params.subscribe((params) => {
      this.id = params['idStagiaire'];
      this.idSessionFormation = params['id'];
    });
  }

  champsStagiaireFormation: Map<string, string> = new Map<string, string>([
    ['contact', 'Le contact de stagiaire'],
  ]);

  queryBuild: QueryBuild = new QueryBuild();

  ngOnInit() {
    if (!this.id) {
      this.stagiaireCreate = new FormationContact();
      // this.stagiaireFormationForm.patchValue({ 'formationValide': true });
      this.formaValide = false;
      this.menuService.setMenu([
        ['Sessions', '/formation'],
        ['Session #' + this.idSessionFormation, '/formation/' + this.idSessionFormation + '/modifier'],
        ['Stagiaires', '/formation/' + this.idSessionFormation + '/stagiaire'],
        ['Nouveau stagiaire', ''],
      ]);

      this.formationContactService.getAllByIdFormation(new QueryBuild(),this.idSessionFormation).subscribe(listStagiaire=>{
        this.listStagiaire = listStagiaire;
        console.log(this.listStagiaire);  
      },err=>{
        this.notificationService.setNotification('danger',['Une erreur est survenue']);
        console.log(err);
      });

      this.formationService.getById(this.idSessionFormation).subscribe(session => {
        this.sessionFormation = session;
        this.stagiaireFormationForm.patchValue({delivrerLe:format(session.dateFin, 'YYYY-MM-DD')});
        console.log(this.sessionFormation);
        if (session.typeFormation) {
          this.listCompetenceFormation = session.typeFormation.dCompetence;
          this.listCompetenceFormation!.forEach(e1 => {
            console.log(e1);
            this.listNoteCompetenceTempo.push({ 'idCompetence': e1.id, 'note': 0 });
          });
        } else {
          this.listCompetenceFormation = [];
        }
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue']);
        console.log(err);
      });

    } else {
      this.menuService.setMenu([
        ['Sessions', '/formation'],
        ['Session #' + this.idSessionFormation, '/formation/' + this.idSessionFormation + '/modifier'],
        ['Stagiaires', '/formation/' + this.idSessionFormation + '/stagiaire'],
        ['Stagiaire #' + this.id, ''],
      ]);

      this.formationContactService.getById(this.idSessionFormation, this.id).subscribe(data3 => {
        this.stagiaireCreate = data3;
        console.log(data3);

        this.noteCompetenceStagiaireService.getAllByIdStagiaire(data3.id).subscribe(competencesList => {
          this.listCompetenceFormation = competencesList;
          this.listCompetenceFormation.forEach(e6 => {
            this.listNoteCompetenceUpdate.push({ 'idNote': e6.id, 'idStagiaire': e6.idStagiaire, 'idCompetenceTypeForma': e6.competence.id, 'note': e6.note });
          });
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue']);
          console.log(err);
        });

        this.stagiaireFormationForm.patchValue(data3);
        this.stagiaireFormationForm.patchValue({ contact: data3.contact.prenom + ' ' + data3.contact.nom });
        this.stagiaireFormationForm.patchValue({ sousTraitance: data3.sousTraitance ? data3.sousTraitance.raisonSociale : 'Particulier' });
        
        if (data3.dossierComplet) {
          this.stagiaireFormationForm.patchValue({ dossierComplet: data3.dossierComplet!.nom + '.' + data3.dossierComplet.extention });
        }
        this.stagiaireFormationForm.patchValue({ delivrerLe: format(data3.formation!.dateFin, 'YYYY-MM-DD') });
        if (data3.formationValide) {
          this.formaValide = true;
        }
        // console.log(data3.absenceTotal);
        if (data3.absenceTotal) {
          this.isAbTotal = true;
        }
        
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue']);
        console.log(err);
      });
    }

    this.typeFichierService.getAll().subscribe(data => {
      // console.log(data);
      this.TypeFichier = data.find(c => c.id == EnumTypeFichier.DOCUMENT_ATTACHE)!;
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.error(err);
    });

    this.formationService.getById(this.idSessionFormation).subscribe(ses => {
      // this.listCompetenceFormation = ses.typeFormation!.dCompetence;
      // if (this.id) {
      //   this.listCompetenceFormation = [{ competence: ses.typeFormation!.dCompetence }];
      // }
      this.capaciteSalle = ses.salle.place;
      // this.tFormationDCompetenceService.getByIdTypeFormation(ses.typeFormation.id).subscribe(listCompetenceTypeForma => {
      //   this.listCompetence = listCompetenceTypeForma;
      //   this.listCompetence.forEach(e3 => {
      //     this.listNoteCompetenceTempo.push({ 'idCompetence': e3.id, 'note': 0 });
      //   }, err => {
      //     this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      //     console.log(err);
      //   });
      // }, err => {
      //   this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      //   console.log(err);
      // })
    }, err => {
      this.notificationService.setNotification("danger", ['Une erreur est survenue']);
      console.log(err);
    });

    this.formationContactService.countAll(this.queryBuild, this.idSessionFormation).subscribe(nbr => {
      this.nbrStagiaire = nbr;
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      console.log(err);
    });
  }

  validateStagiaireFormation() {
    this.submited = true;
    if (this.stagiaireFormationForm.invalid) {
      this.errors = [];
      this.errors = this.validationService.getFormValidationErrors(this.stagiaireFormationForm, this.champsStagiaireFormation);
      this.notificationService.setNotification('danger', this.errors);
      return false;
    } else {
      return true;
    }
  }

  onSubmit() {
    if (!this.validateStagiaireFormation()) {
      return;
    }

    if (this.stagiaireFormationForm.value.absenceTotal) {
      this.stagiaireFormationForm.patchValue({ absencePartielle: null });
    }

    if (!this.stagiaireFormationForm.value.formationValide) {
      this.stagiaireFormationForm.patchValue({ numCertificat: null });
      this.stagiaireFormationForm.patchValue({ numForprev: null });
      this.stagiaireFormationForm.patchValue({ delivrerLe: null });
      this.stagiaireFormationForm.patchValue({ phraseForprev: null });
      this.stagiaireFormationForm.patchValue({ noteObtenu: null });
    }

    this.stagiaireFormationForm.value.idFormation = this.idSessionFormation;
    this.stagiaireFormationForm.value.contact = this.stagiaireCreate.contact;
    this.stagiaireFormationForm.value.dossierComplet = this.stagiaireCreate.dossierComplet;
    this.stagiaireFormationForm.value.sousTraitance = this.stagiaireCreate.sousTraitance;

    if(this.listStagiaire){
      this.listStagiaire = this.listStagiaire.filter(e=>e.contact.id == this.stagiaireFormationForm.value.contact.id);
    }
    
    if (!this.id) {
      // console.log(this.nbrStagiaire);
      // console.log(this.capaciteSalle);
      if(this.listStagiaire.length>=1 && this.listStagiaire){
        this.notificationService.setNotification('danger',['Le contact est exist']);
      }else{
        if (this.nbrStagiaire <= this.capaciteSalle) {
          this.formationContactService.create(this.stagiaireFormationForm.value).subscribe(data1 => {
            this.notificationService.setNotification('success', ['Stagiaire created']);
            let temp=0;
            this.listNoteCompetenceTempo.forEach(e4 => {
              this.noteCompetenceStagiaireService.create({ 'idStagiaire': data1.id, 'idCompetence': e4.idCompetence, 'note': e4.note }).subscribe(dataCreate => {
                temp++;
                if(temp>=this.listNoteCompetenceTempo.length){
                  this.router.navigate(['formation/', this.idSessionFormation, 'stagiaire']);
                }
              }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                console.log(err);
              });
            });
            
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue']);
            console.log(err);
          });
        } else {
          this.notificationService.setNotification('danger', ['Ne pouvez pas ajouter un stagiaire. La capacité de salle est limité']);
        }
        // this.router.navigate(['formation/', this.idSessionFormation, 'stagiaire']);
      }
      
    } else {
      this.formationContactService.update(this.stagiaireFormationForm.value).subscribe(data5 => {
        this.listNoteCompetenceUpdate.forEach(e5 => {
          //idCompetence -> id de compétence d'un type formation
          this.noteCompetenceStagiaireService.update({ 'id': e5.idNote, 'idStagiaire': e5.idStagiaire, 'idCompetence': e5.idCompetenceTypeForma, 'note': e5.note }).subscribe(dataCreate => {
            if (this.casChangementTypeForma) {
              this.casChangementTypeForma = false;
            }
            this.router.navigate(['formation/', this.idSessionFormation, 'stagiaire']);
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue']);
            console.log(err);
          });
        });
        this.notificationService.setNotification('success', ['Stagiaire updated'])
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue']);
        console.log(err);
      });
      // this.router.navigate(['formation/', this.idSessionFormation, 'stagiaire']);
    }
  }


  afficherNote(e, competenceFormation) {
    if (e == '') {
      e = 0;
    }

    if(this.listNoteCompetenceTempo.length){
      this.listNoteCompetenceTempo.find(element => {
        return element.idCompetence === competenceFormation.id;
      }).note = e;
    }
    

    // if (this.casChangementTypeForma && this.listNoteCompetenceUpdate.length == 0) {
    //   if (this.stagiaireCreate) {
    //     this.noteCompetenceStagiaireService.getAllByIdStagiaire(this.stagiaireCreate.id).subscribe(competencesList2 => {
    //       // this.listCompetenceFormation = competencesList2;
    //       competencesList2.forEach(e7 => {
    //         this.listNoteCompetenceUpdate.push({ 'idNote': e7.id, 'idStagiaire': e7.idStagiaire, 'idCompetenceTypeForma': e7.idCompetence, 'note': e7.note });
    //       });
    //       // console.log(this.listNoteCompetenceUpdate);
    //     }, err => {
    //       this.notificationService.setNotification('danger', ['Une erreur est survenue']);
    //       console.log(err);
    //     });
    //   }
    // }
    if (this.listNoteCompetenceUpdate) {
      this.listNoteCompetenceUpdate.find(element2 => { return element2.idCompetenceTypeForma === competenceFormation.id; }).note = e;
    }
    console.log(this.listNoteCompetenceTempo);
    console.log(this.listNoteCompetenceUpdate);
  }

  setFichier(fichier: Fichier) {
    this.modalFichier = false;
    if (fichier.extention !== 'pdf') {
      this.notificationService.setNotification('danger', ['Choissir un fichier en type pdf']);
    } else {
      this.stagiaireCreate = { ...this.stagiaireCreate, ...{ dossierComplet: fichier } };
      this.stagiaireFormationForm.patchValue({ dossierComplet: this.stagiaireCreate.dossierComplet!.nom + '.' + this.stagiaireCreate.dossierComplet!.extention });

      if(this.id){
        // console.log(this.id);
        // let sta = new FormationContact();
        // sta.id = this.id;
        // console.log(fichier);
        // sta.dossierComplet = fichier;
        this.stagiaireFormationForm.value.contact = this.stagiaireCreate.contact;
        this.stagiaireFormationForm.value.dossierComplet = this.stagiaireCreate.dossierComplet;
        this.stagiaireFormationForm.value.sousTraitance = this.stagiaireCreate.sousTraitance;

        this.formationContactService.update(this.stagiaireFormationForm.value).subscribe(()=>{
        },err=>{
          this.notificationService.setNotification('danger',['Une erreur est survenue']);
          console.log(err);
        });
      }
    }
  }

  isAbsenceTotal() {
    if (this.isAbTotal == false) {
      this.isAbTotal = true;
    } else {
      this.isAbTotal = false;
    }
  }

  setFormationValid() {
    if (this.formaValide == false) {
      this.formaValide = true;
      this.stagiaireFormationForm.patchValue({delivrerLe:format(this.sessionFormation.dateFin, 'YYYY-MM-DD')});
    } else {
      this.formaValide = false;
      this.stagiaireFormationForm.patchValue({delivrerLe:null});
    }
  }

  openModalContact() {
    this.modalContact = true;
  }

  openModalCompte() {
    this.modalCompte = true;
  }

  openModalfichier() {
    this.modalFichier = true;
  }

  setContact(contact: Contact) {
    // if (!this.id) {
    //   this.stagiaireCreate = { ...this.stagiaireCreate, ...{ contact: contact } }
    // }
    console.log(contact);
    this.stagiaireCreate = { ...this.stagiaireCreate, ...{ contact: contact } }

    if(contact.compteContacts){
      this.compteService.getById(contact.compteContacts.idCompte).subscribe(compte=>{
        this.stagiaireCreate = { ...this.stagiaireCreate, ...{ sousTraitance: compte } }
        this.stagiaireFormationForm.patchValue({ sousTraitance: this.stagiaireCreate.sousTraitance.raisonSociale });
      },err=>{
        this.notificationService.setNotification('danger',['Une erreur est survenue']);
        console.log(err);
      });
    }else{
      this.stagiaireCreate = { ...this.stagiaireCreate, ...{ sousTraitance: new Compte() } }
      this.stagiaireFormationForm.patchValue({ sousTraitance: 'Particulier' });
    }    

    // this.stagiaireCreate = { ...this.stagiaireCreate, ...{ compte: contact. } }

    this.stagiaireFormationForm.patchValue({ contact: this.stagiaireCreate.contact.prenom + ' ' + this.stagiaireCreate.contact.nom });
    this.modalContact = false;


  }

  setCompte(compte: Compte) {
    this.stagiaireCreate = { ...this.stagiaireCreate, ...{ sousTraitance: compte } };
    this.stagiaireFormationForm.patchValue({ sousTraitance: this.stagiaireCreate.sousTraitance.raisonSociale });
    this.modalCompte = false;
  }

  get f() {
    return this.stagiaireFormationForm.controls;
  }
}