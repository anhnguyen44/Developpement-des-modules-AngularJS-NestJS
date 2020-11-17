import {Component, OnInit} from '@angular/core';
import {MenuService} from '../../menu/menu.service';
import {FormBuilder, Validators} from '@angular/forms';
import {ValidationService} from '../../resource/validation/validation.service';
import {BureauService} from '../../parametrage/bureau/bureau.service';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {Bureau} from '../../parametrage/bureau/Bureau';
import {Franchise} from '../../resource/franchise/franchise';
import {ActivatedRoute, Router} from '@angular/router';
import {RessourceHumaineService} from '../ressource-humaine.service';
import {RessourceHumaine} from '../RessourceHumaine';
import {NotificationService} from '../../notification/notification.service';
import { FonctionService } from '../../resource/fonction/fonction.service';
import { Fonction, IFonction } from '@aleaac/shared/src/models/fonction.model';
import { FormationService } from '../../formation/formation.service';
import { TypeFormationService } from '../../superadmin/typeformation/type-formation.service';
import { TypeFormation } from '../../superadmin/typeformation/type-formation/TypeFormation';
import { IFonctionRH, IFormationValideRH } from '@aleaac/shared';
import { FormationValideRH } from '../FormationValideRessourceHumaine';
import { RessourceHumaineFonctionService } from '../rh-fonction.service';
import { FonctionRH } from '../FonctionRessourceHumaine';
import { RessourceHumaineFormationService } from '../rh-formation.service';

@Component({
    selector: 'app-ressource-humaine',
    templateUrl: './ressource-humaine.component.html',
    styleUrls: ['./ressource-humaine.component.scss']
})
export class RessourceHumaineComponent implements OnInit {
    listFonctions: Fonction[];
    listTypeFormations: TypeFormation[];
    ressourceHumaine: RessourceHumaine;
    franchise: Franchise;
    bureaux: Bureau [];
    submited: boolean = false;
    submitedFonction: boolean = false;
    submitedFormationSuivi: boolean = false;
    submitedFormationHabilite: boolean = false;
    errorsFonctions: string[] = new Array<string>();
    errorsFormationSuivi: string[] = new Array<string>();
    errorsFormationHabilite: string[] = new Array<string>();
    userModal: boolean = false;
    isFormateur: boolean = false;
    fonctionRh:FonctionRH;
    fonctionsAffiche: FonctionRH[] = [];
    formationValide: FormationValideRH;
    formationHabilite: FormationValideRH;
    formationValideAffiche: FormationValideRH[] = [];
    formationHabiliteAffiche: FormationValideRH[] = [];
    // fonctionRh: FonctionRH;
    rhForm = this.formBuilder.group({
        id: [null],
        idUtilisateur: [null, [Validators.required]],
        utilisateur: this.formBuilder.group({
            id: [null],
            nom: [null],
            prenom: [null]
        }),
        idBureau: [null, [Validators.required]],
       /* bureau: this.formBuilder.group({
            id: [null],
            nom: [null]
        }),*/
        couleur: [null]
    });
    
    intituleUtilisateur: string;
    champsInformations: Map<string, string> = new Map<string, string>([
        ['idBureau', 'Le bureau'],
        ['idUtilisateur', 'L\'utilisateur']
    ]);

    champsFonction: Map<string, string> = new Map<string, string>([
        ['fonction', 'La fonction']
    ]);

    champsValideForm: Map<string, string> = new Map<string, string>([
        ['formation', 'La formation suivi'],
        ['date', 'Le date d\'obtention']
    ]);

    champsHabiliteForm: Map<string, string> = new Map<string, string>([
        ['formation', 'La formation habilité'],
    ]);

    fonctionForm = this.formBuilder.group({
        fonction: ['', [Validators.required]]
    });

    formationValideForm = this.formBuilder.group({
        formation: ['', [Validators.required]],
        date: ['', [Validators.required]]
    });

    formationHabiliteForm = this.formBuilder.group({
        formationHabilite:  ['', [Validators.required]]
    });

    constructor(
        private menuService: MenuService,
        private formBuilder: FormBuilder,
        private bureauService: BureauService,
        private franchiseService: FranchiseService,
        private route: ActivatedRoute,
        private ressourceHumaineService: RessourceHumaineService,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private router: Router,
        private fonctionService: FonctionService,
        private typeFormationService: TypeFormationService,
        private ressourceHumaineFonctionService: RessourceHumaineFonctionService,
        private ressourceHumaineFormationService :RessourceHumaineFormationService
    ) {
    }

    ngOnInit() {
        this.menuService.setMenu([['Logistique', ''], ['Ressource humaine', '']]);
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.bureauService.getAll(franchise.id).subscribe((bureaux) => {
                this.bureaux = bureaux;
                this.route.params.subscribe((params) => {
                    if (params.id) {
                        this.ressourceHumaineService.get(params.id).subscribe((ressourceHumaine) => {
                            this.ressourceHumaine = ressourceHumaine;
                            console.log(ressourceHumaine);
                            this.fonctionsAffiche! = ressourceHumaine.fonctions;
                            ressourceHumaine.formationValide!.forEach(f=>{
                                if(!f.habilite){
                                    this.formationValideAffiche!.push(f);
                                    console.log(this.formationValideAffiche);
                                }else if(f.habilite){
                                    this.formationHabiliteAffiche!.push(f); 
                                    console.log(this.formationHabiliteAffiche);                                   
                                }
                            });

                            let temp=false;
                            if(this.fonctionsAffiche.find((typeFile) => {
                                return typeFile.fonction!.nom === "Formateur";
                                })){
                                    temp = true;
                                    this.isFormateur=true;
                                }
                            if(!temp){
                                this.formationHabiliteAffiche=[];
                                this.isFormateur=false;
                            }

                            console.log(this.fonctionsAffiche);
                            console.log(this.formationHabiliteAffiche);
                            console.log(this.formationValideAffiche);
                            // if(this.formationHabiliteAffiche.length){
                            //     this.isFormateur=true;
                            // }

                            this.rhForm.patchValue(ressourceHumaine);
                            this.parseIntituleUser(ressourceHumaine.utilisateur);
                        });
                        
                    } else {
                        this.rhForm.patchValue({
                            idBureau: this.bureaux[0].id
                        });
                    }
                });
            });
        });

        this.fonctionService.getAll().subscribe(listFonction=>{
            this.listFonctions = listFonction;
            // console.log(this.listFonctions);
        },err=>{
            this.notificationService.setNotification('danger',['Une erreur est survenue']);
            console.log(err);
        });

        this.typeFormationService.getAll().subscribe(listFor=>{
            // console.log(listFor);
            this.listTypeFormations = listFor;
        },err=>{
            this.notificationService.setNotification('danger',['Une erreur est survenue']);
            console.log(err);
        });
    }

    validateFonction(){
        this.submitedFonction = true;
        this.errorsFonctions = [];

        if(this.fonctionsAffiche.find((typeFile) => {
            return typeFile.fonction!.nom === this.fonctionForm.controls.fonction.value.nom;
        })){
            this.fonctionForm.controls['fonction'].setErrors({ 'alreadyExists': true });
        }

        if(this.fonctionForm.invalid){
            this.errorsFonctions = this.validationService.getFormValidationErrors(this.fonctionForm,this.champsFonction);
            this.notificationService.setNotification('danger',this.errorsFonctions);
            return false;
        }else{
            return true;
        }
    }

    validateFormationSuivi(){
        this.submitedFormationSuivi = true;
        this.errorsFormationSuivi = [];

        if(this.formationValideAffiche.find((typeFor) => {
            return typeFor.formation!.id === this.formationValideForm.value['formation'].id;
        })){
            this.formationValideForm.controls['formation'].setErrors({ 'alreadyExists': true });
        }

        if(this.formationValideForm.invalid){
            this.errorsFormationSuivi = this.validationService.getFormValidationErrors(this.formationValideForm,this.champsValideForm);
            this.notificationService.setNotification('danger',this.errorsFormationSuivi);
            return false;
        }else{
            return true;
        }
    }

    validateFormationHabilite(){
        this.submitedFormationHabilite = true;
        this.errorsFormationHabilite = [];

        if(this.formationHabiliteAffiche.find((e)=>{
            return e.formation!.id===this.formationHabiliteForm.value['formationHabilite'].id;
        })){
            this.formationHabiliteForm.controls['formationHabilite'].setErrors({ 'alreadyExists':true });
        }

        if(this.formationHabiliteForm.invalid){
            this.errorsFormationHabilite = this.validationService.getFormValidationErrors(this.formationHabiliteForm,this.champsHabiliteForm);
            this.notificationService.setNotification('danger',['Une erreur est survenue']);
            return false;
        }else{
            return true;
        }

    }

    onSubmitFormationHabilite(e){
        if(!this.validateFormationHabilite()){
            return;
        }

        this.formationHabilite = new FormationValideRH();
        console.log(e.value['formationHabilite']);
        this.formationHabilite.formation = e.value['formationHabilite'];
        this.formationHabilite.habilite = true;
        this.formationHabiliteAffiche.push(this.formationHabilite);
        console.log(this.formationHabiliteAffiche);
    }

    onSubmitFonction(e){
        if(!this.validateFonction()){
            return;
        }
        // if(this.fonctionsAffiche.find((typeFile) => {
        //     return typeFile.nom === e.value['fonction'].nom;
        //   })){
        //     // this.notificationService.setNotification('danger',['Impossible d\'ajouter cette fonction qui existe déjà']);
        //     this.fonctionForm.controls['fonction'].setErrors({ 'alreadyExists': true });
        //   }else{
        //     this.fonctionsAffiche.push(e.value['fonction']);
        //   }
        console.log(e.value['fonction']);
        console.log(e.controls.fonction.value);
        this.fonctionRh = new FonctionRH();
        this.fonctionRh.fonction = e.controls.fonction.value; 
        this.fonctionsAffiche.push(this.fonctionRh);
        console.log(this.fonctionsAffiche);
    }

    onSubmitFormationSuivi(e){
        if(!this.validateFormationSuivi()){
            return;
        }

        // console.log(e.value);

        this.formationValide = new FormationValideRH();
        this.formationValide.formation = e.value['formation'];
        this.formationValide.dateObtenu = e.value['date'];

        // console.log(e.value['date']);
        this.formationValideAffiche.push(this.formationValide);
        // console.log(this.formationValideAffiche);
    }

    parseIntituleUser(utilisateur) {
        this.intituleUtilisateur = utilisateur.nom + ' ' + utilisateur.prenom;
    }

    openModalUser() {
        this.userModal = true;
    }

    setEvent(){
        // console.log(e);
        if(this.fonctionsAffiche.find((typeFile) => {
            return typeFile.fonction!.nom === "Formateur";
          })){
              this.isFormateur = true;
          }else{
            // console.log(this.fonctionForm.value['fonction'].nom);
            console.log(this.fonctionForm.value['fonction']);
            if(this.fonctionForm.controls.fonction.value.nom=="Formateur"){
                this.isFormateur = true;
            }else{
                this.isFormateur = false;
                this.fonctionForm.value['fonction']=null;
            }
          }
    }

    setUser(utilisateur) {
        this.rhForm.patchValue({
            idUtilisateur: utilisateur.id,
            utilisateur: utilisateur
        });
        this.parseIntituleUser(utilisateur);

        this.userModal = false;
    }

    onSubmit({value, valid}: { value: RessourceHumaine, valid: boolean }) {
        console.log("list fonction");
        console.log(this.fonctionsAffiche);
        console.log("list formation habilite");
        console.log(this.formationHabiliteAffiche);
        console.log("list formation valide");
        console.log(this.formationValideAffiche);

        console.log(value);
        if (valid) {
            value.idFranchise = this.franchise.id;
            if (value.id) {
                this.ressourceHumaineFormationService.deleteByIdRh(value.id).subscribe(()=>{
                },err=>{
                    this.notificationService.setNotification('danger',['Une erreur est survenue']);
                    console.log(err);
                });
        
                this.ressourceHumaineFonctionService.deleteByIdRh(value.id).subscribe(()=>{
                },err=>{
                    this.notificationService.setNotification('danger',['Une erreur est survenue']);
                    console.log(err);
                });
                
                this.ressourceHumaineService.update(value).subscribe((ressourceHumaine) => {
                    // =============================
                    console.log(ressourceHumaine);

                    this.addFonctionFormation(ressourceHumaine.id);
                    
                    // ======================
                    this.notificationService.setNotification('success', ['Ressource humaine mise à jour']);
                    this.router.navigate(['/logistique', 'ressource-humaine']);
                });

                console.log(this.fonctionsAffiche);
                            console.log(this.formationHabiliteAffiche);
                            console.log(this.formationValideAffiche);
            } else {
                this.ressourceHumaineService.create(value).subscribe((ressourceHumaine) => {
                    console.log(ressourceHumaine);
                    console.log(this.fonctionsAffiche);

                    this.addFonctionFormation(ressourceHumaine.id);
                    
                    this.notificationService.setNotification('success', ['Ressource humaine créée']);
                    this.router.navigate(['/logistique', 'ressource-humaine']);
                });

                console.log(this.fonctionsAffiche);
                            console.log(this.formationHabiliteAffiche);
                            console.log(this.formationValideAffiche);
            }
        } else {
            this.submited = true;
            this.notificationService.setNotification('danger',
                this.validationService.getFormValidationErrors(this.rhForm, this.champsInformations)
            );
        }
    }

    addFonctionFormation(id: number){
        let temp=false;
        if(this.fonctionsAffiche.find((typeFile) => {
            return typeFile.fonction!.nom === "Formateur";
            })){
                temp = true;
            }
        if(!temp){
            this.formationHabiliteAffiche=[];
            this.isFormateur=false;
        }

        console.log('2.1');

        console.log(this.fonctionsAffiche);

        // this.ressourceHumaineFormationService.deleteByIdRh(id).subscribe(()=>{
        // },err=>{
        //     this.notificationService.setNotification('danger',['Une erreur est survenue']);
        //     console.log(err);
        // });

        // this.ressourceHumaineFonctionService.deleteByIdRh(id).subscribe(()=>{
        // },err=>{
        //     this.notificationService.setNotification('danger',['Une erreur est survenue']);
        //     console.log(err);
        // });


        console.log('list fonction pour ajouter');
        console.log(this.fonctionsAffiche);

        this.fonctionsAffiche.forEach(e=>{

            e.idRh = id;
            this.ressourceHumaineFonctionService.create(e).subscribe(fonRH=>{  
            },err=>{
                this.notificationService.setNotification('danger',['Une erreur est survenue']);
                console.log(err);
            });
        });

        console.log('list foramtion valide pour ajouter');
        console.log(this.formationValideAffiche);
        this.formationValideAffiche.forEach(e1=>{
            e1.idRh = id;
            this.ressourceHumaineFormationService.create(e1).subscribe((data)=>{
            },err=>{
                this.notificationService.setNotification('danger',['Une erreur est survenue']);
                console.log(err);
            });
        });

        console.log('list foramtion habilite pour ajouter');
        console.log(this.fonctionsAffiche);
        console.log(this.formationHabiliteAffiche);
        this.formationHabiliteAffiche.forEach(e2=>{
            e2.idRh = id;
            this.ressourceHumaineFormationService.create(e2).subscribe((data)=>{
            },err=>{
                this.notificationService.setNotification('danger',['Une erreur est survenue']);
                console.log(err);
            });
        });

        console.log(this.fonctionsAffiche);
                            console.log(this.formationHabiliteAffiche);
                            console.log(this.formationValideAffiche);
    }

    removeFoncAffi(fonc){
        console.log(fonc);
        console.log(this.fonctionsAffiche);
        this.fonctionsAffiche = this.fonctionsAffiche.filter(e => e.fonction!.id!==fonc.fonction.id);
        // console.log(e);
        if(!this.fonctionsAffiche.find((typeFile) => {
            return typeFile.fonction!.nom === "Formateur";
          })){
              this.isFormateur = false;
          }
    }

    removeFormationValide(formationValid: FormationValideRH){
        this.formationValideAffiche = this.formationValideAffiche.filter(e=>e.formation!.id!==formationValid.formation!.id);
    }

    removeFormationHabilite(formation: FormationValideRH){
        this.formationHabiliteAffiche = this.formationHabiliteAffiche.filter(e=>e.formation!.id!==formation.formation!.id);
    }


    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

}
