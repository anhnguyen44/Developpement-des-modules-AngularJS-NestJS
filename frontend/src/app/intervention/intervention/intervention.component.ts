import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {InterventionService} from '../intervention.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Intervention} from '../Intervention';
import {format} from 'date-fns';
import {Prelevement} from '../../processus/Prelevement';
import {ValidationService} from '../../resource/validation/validation.service';
import {NotificationService} from '../../notification/notification.service';
import {fadeIn, fadeOut} from '../../resource/animation';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {Franchise} from '../../resource/franchise/franchise';
import {
    EnumOrigineValidation,
    EnumStatutIntervention, EnumStatutPrelevement,
    EnumTypeFiltre,
    EnumTypePrelevement,
    LatLngDto,
    LegendeDto,
    MailFile, SitePrelevement
} from '@aleaac/shared';
import * as FileSaver from 'file-saver';
import {FichierService} from '../../resource/fichier/fichier.service';
import {Fichier} from '../../resource/fichier/Fichier';
import {PompeService} from '../../logistique/pompe.service';
import {TypeFichier} from '../../superadmin/typefichier/type-fichier/TypeFichier';
import {TypeFichierService} from '../../superadmin/typefichier/type-fichier.service';
import {BureauService} from '../../parametrage/bureau/bureau.service';
import {Bureau} from '../../parametrage/bureau/Bureau';
import {Mail} from '../../resource/mail/Mail';
import {SitePrelevementService} from '../../chantier/site-prelevement.service';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {PrelevementService} from '../../prelevement/prelevement.service';
import {UserStore} from '../../resource/user/user.store';

@Component({
    selector: 'app-intervention',
    templateUrl: './intervention.component.html',
    styleUrls: ['./intervention.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class InterventionComponent implements OnInit {
    franchise: Franchise;
    bureaux: Bureau[];
    modalPrelevement = false;
    modalMail: boolean = false;
    modalFichier: boolean = false;
    modalOrigineValidation: boolean = false;
    @Input() intervention: Intervention;
    @Input() isNew: boolean = false;
    @Input() redirectPath: (string | number)[];
    @Input() idChantier: number;
    enumTypeFiltre = EnumTypeFiltre;
    enumTypePrelevement = EnumTypePrelevement;
    enumStatutIntervention = EnumStatutIntervention;
    enumOrigineValidation = EnumOrigineValidation;
    enumStatutPrelevement = EnumStatutPrelevement;
    typeModalPrelevement = 'liste';
    typeFichier: TypeFichier;
    mail: Mail | null;
    isNewPrelevement: boolean = false;
    listePoints: LatLngDto[] = [];
    caption: LegendeDto[] = new Array<LegendeDto>();
    siteInterventions: SitePrelevement[];
    canCreateInter: boolean;
    isEditable: boolean = true;

    interventionForm = this.formBuilder.group({
        id: [null],
        idBureau: ['', [Validators.required]],
        libelle: [''],
        rang: [''],
        commentaire: [''],
        idStatut: [1],
        idDevisCommande: [null],
        dateValidation: [''],
        idFranchise: [''],
        idChantier: [null],
        idStrategie: [null],
        idOrdreIntervention: [null],
        idOrigineValidation: [null],
        ordreIntervention: this.formBuilder.group({
            id: [null],
            nom: [''],
            extention: [''],
            keyDL: [''],
            date: [null],
            idTypeFichier: [null],
            commentaire: [null]
        }),
        idOrdreInterventionValide: [null],
        ordreInterventionValide: this.formBuilder.group({
            id: [null],
            nom: [''],
            extention: [''],
            keyDL: ['']
        }),
        idSiteIntervention: [null, [Validators.required]],
        siteIntervention: this.formBuilder.group({
            id: [null],
            nom: [''],
            adresse: this.formBuilder.group({
                id: [null],
                adresse: [''],
                complement: [''],
                cp: [''],
                ville: [''],
                latitude: [''],
                longitude: ['']
            })
        }),
        rendezVous: this.formBuilder.group({
            id: [null],
            dateHeureDebut: [''],
            // rendezVousRessourceHumaines: this.formBuilder.array([]),
            // rendezVousPompes: this.formBuilder.array([]),
            dateDebut: ['', [Validators.required]],
            heureDebut: ['', [Validators.required]],
            dateFin: ['', [Validators.required]],
            heureFin: ['', [Validators.required]],
            dateHeureFin: [''],
            isDefinitif: ['']
        }),
        prelevements: this.formBuilder.array([])
    });

    submited: boolean = false;
    champsInformations: Map<string, string> = new Map<string, string>([
        ['heureDebut', 'L\'heure de début'],
        ['heureFin', 'L\'heure de fin'],
        ['dateDebut', 'La date de début'],
        ['dateFin', 'La date de fin'],
        ['idBureau', 'Le bureau'],
        ['idSiteIntervention', 'Le site d\'intervention']
    ]);

    constructor(
        private formBuilder: FormBuilder,
        private interventionService: InterventionService,
        private route: ActivatedRoute,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private franchiseService: FranchiseService,
        private router: Router,
        private fichierService: FichierService,
        private pompeService: PompeService,
        private typeFichierService: TypeFichierService,
        private bureauService: BureauService,
        private sitePrelevementService: SitePrelevementService,
        private prelevementService: PrelevementService,
        private userStore: UserStore
    ) {
    }

    async ngOnInit() {
        this.canCreateInter = await this.userStore.hasRight('INTER_CREATE');
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.bureauService.getAll(franchise.id).subscribe((bureaux) => {
                this.bureaux = bureaux;
            });
        });
        this.typeFichierService.get(25).subscribe((typeFichier) => {
            this.typeFichier = typeFichier;
        });
        if (this.isNew) {
            this.interventionForm.patchValue({idFranchise: this.franchise.id});
            if (this.idChantier) {
                this.interventionForm.patchValue({idChantier: this.idChantier});
                this.getSiteIntervention(this.idChantier);
            }
        } else {
            if (this.intervention.idStatut === this.enumStatutIntervention.TERMINE) {
                this.isEditable = false;
            }
            this.intervention.rendezVous.dateDebut = format(this.intervention.rendezVous.dateHeureDebut, 'YYYY-MM-DD');
            this.intervention.rendezVous.dateFin = format(this.intervention.rendezVous.dateHeureFin, 'YYYY-MM-DD');
            this.intervention.rendezVous.heureDebut = format(this.intervention.rendezVous.dateHeureDebut, 'HH:mm');
            this.intervention.rendezVous.heureFin = format(this.intervention.rendezVous.dateHeureFin, 'HH:mm');

            if (this.intervention && this.intervention.siteIntervention && this.intervention.siteIntervention.adresse) {
                this.parselatLngDto(this.intervention.siteIntervention.adresse);
            }

            this.getSiteIntervention(this.intervention.idChantier);

            // si pas d'ordre d'intervention
            if (!this.intervention.ordreIntervention) {
                delete this.intervention.ordreIntervention;
            }
            if (!this.intervention.ordreInterventionValide) {
                delete  this.intervention.ordreInterventionValide;
            }
            this.interventionForm.patchValue(this.intervention);
            for (const prelevement of  this.intervention.prelevements) {
                this.addPrelevement(prelevement);
            }
        }

        this.interventionForm.get('siteIntervention')!.get('adresse')!.valueChanges.subscribe((adresse) => {
            this.parselatLngDto(adresse);
        });
    }

    parselatLngDto(adresse) {
        if (adresse.latitude && adresse.longitude) {
            const latLngDto = new LatLngDto();
            latLngDto.latitude = adresse.latitude;
            latLngDto.longitude = adresse.longitude;
            this.listePoints = [latLngDto];
        }
    }

    getSiteIntervention(idChantier) {
        this.sitePrelevementService.getAll(idChantier, new QueryBuild()).subscribe((siteInterventions) => {
            this.siteInterventions = siteInterventions;
        });
    }

    changeSiteIntervention() {
        const siteIntervention = this.siteInterventions.find((findSiteIntervention) => {
            return findSiteIntervention.id === Number(this.interventionForm.get('idSiteIntervention')!.value);
        });
        this.interventionForm.patchValue({
            idSiteIntervention: Number(this.interventionForm.get('idSiteIntervention')!.value)
        });
        this.interventionForm.get('siteIntervention')!.patchValue(siteIntervention);
        if (siteIntervention && siteIntervention.adresse) {
            this.parselatLngDto(siteIntervention.adresse);
        } else {
            this.listePoints = [];
        }
    }

    // PRELEVEMENT

    setPrelevements(prelevements: Prelevement[]): void {
        console.log(prelevements);
        for (const prelevement of prelevements) {
            prelevement.idStatutPrelevement = this.enumStatutPrelevement.PLANIFIE;
            this.addPrelevement(prelevement);
        }
        this.closeModalPrelevement();
    }

    createPrelevement(prelevement: Prelevement): FormGroup {
        const formGroup = this.formBuilder.group({
            id: [''],
            idFranchise: [''],
            idChantier: [''],
            reference: [''],
            idFiltre: [''],
            idPompe: [''],
            idTypePrelevement: [''],
            // isNonEffectue: [''],
            nbMesures: [''],
            idStatutPrelevement: [2],
            objectif: this.formBuilder.group({
                id: [''],
                lettre: ['']
            })
        });
        formGroup.patchValue(prelevement);
        return formGroup;
    }

    addPrelevement(prelevement: Prelevement): void {
        const prelevements = this.interventionForm.controls.prelevements as FormArray;
        prelevements.push(this.createPrelevement(prelevement));
    }

    removePrelevement(prelevement: FormGroup): void {
        console.log(prelevement);
        const prelevements = this.interventionForm.controls.prelevements as FormArray;
        prelevement.value.idStatutPrelevement = this.enumStatutPrelevement.EN_ATTENTE;
        this.prelevementService.update(prelevement.value).subscribe(() => {
            prelevements.removeAt(prelevements.value.findIndex(findPrelevement => findPrelevement.id === prelevement.get('id')!.value));
        });
    }

    openModalPrelevement(type: string) {
        this.typeModalPrelevement = type;
        this.modalPrelevement = true;
    }

    closeModalPrelevement() {
        this.modalPrelevement = false;
    }

    // SUBMIT

    async onSubmit({value, valid}: { value: Intervention, valid: boolean }) {
        if (this.checkValide(valid)) {
            await this.save(value);
            if (value.id) {
                this.notificationService.setNotification('success', ['Intervention mise à jour correctement.']);
                if (this.redirectPath) {
                    this.redirectPath.push('liste');
                    this.router.navigate(this.redirectPath);
                } else {
                    this.router.navigate(['/intervention']);
                }
            } else {
                this.notificationService.setNotification('success', ['Intervention créée correctement.']);
                if (this.redirectPath) {
                    this.redirectPath.push('liste');
                    this.router.navigate(this.redirectPath);
                } else {
                    this.router.navigate(['/intervention']);
                }
            }
        }
    }

    async generateOI({value, valid}: { value: Intervention, valid: boolean }) {
        if (this.checkValide(valid)) {
            if (value.prelevements.length > 0) {
                const intervention = await this.save(value);
                this.interventionService.generateOI(intervention.id).subscribe((newIntervention) => {
                    console.log(newIntervention);
                    this.interventionForm.controls.ordreIntervention.patchValue(newIntervention.ordreIntervention);
                });
            } else {
                this.notificationService.setNotification('danger',
                    ['Il faut au moins un prélèvement sur l\'intervention pour générer l\'ordre d\'intervention.']);
            }
        }
    }

    openModalOrigineValidation() {
        if (this.checkValide(this.interventionForm.valid)) {
            if (this.interventionForm.value.prelevements.length > 0) {
                this.modalOrigineValidation = true;
            } else {
                this.notificationService.setNotification(
                    'danger', ['Il faut au moins un prélèvement sur l\'intervention pour valider celle-ci.']
                );
            }
        }
    }

    setOrigineValidation(idOrigineValidation) {
        this.interventionForm.patchValue({
            idOrigineValidation: idOrigineValidation
        });
        console.log(this.interventionForm);
        this.closeModalValidation();
        this.validationClient(this.interventionForm);
    }

    closeModalValidation() {
        this.modalOrigineValidation = false;
    }

    async validationClient({value, valid}: { value: Intervention, valid: boolean }) {

        this.interventionForm.patchValue({
            idStatut: this.enumStatutIntervention.VALIDE,
            dateValidation: new Date()
        });
        this.interventionForm.controls.rendezVous.patchValue({
            isDefinitif: true
        });
        const intervention = await this.save(this.interventionForm.value);
        this.notificationService.setNotification('success', ['Ordre d\'intervention validé.']);
        if (this.redirectPath) {
            this.redirectPath.push(await intervention.id);
            this.redirectPath.push('preparation');
            this.router.navigate(this.redirectPath);
        } else {
            this.router.navigate(['/intervention', intervention.id, 'preparation']);
        }
    }

    openModalFichier() {
        this.modalFichier = true;
    }

    async setOrdreInterventionValide(fichier) {
        this.interventionForm.get('ordreInterventionValide')!.patchValue(fichier);
        this.interventionForm.patchValue({
            idStatut: this.enumStatutIntervention.VALIDE,
            idOrigineValidation: this.enumOrigineValidation.SIGNATURE,
            dateValidation: new Date()
        });
        this.interventionForm.controls.rendezVous.patchValue({
            isDefinitif: true
        });
        await this.save(this.interventionForm.value);
        this.notificationService.setNotification('success', ['Ordre d\'intervention validé.']);

        this.closeModalFichier();
    }

    closeModalFichier() {
        this.modalFichier = false;
    }

    async envoyerMail({value, valid}: { value: Intervention, valid: boolean }) {
        if (this.checkValide(valid)) {
            if (value.prelevements.length > 0) {
                await this.save(value);
                this.interventionService.generateOI(value.id).subscribe((intervention) => {
                    this.interventionForm.controls.ordreIntervention.patchValue(intervention.ordreIntervention);
                    const mail = new Mail();
                    mail.subject = 'Envoi de l\'ordre d\'intervention ' + intervention.id;
                    mail.to = [''];
                    mail.from = '';
                    mail.attachments = [];
                    mail.idParent = intervention.id;
                    mail.application = 'ordre-intervention';
                    const fileToSend = new MailFile();
                    fileToSend.filename = intervention.ordreIntervention.nom + '.' + intervention.ordreIntervention.extention;
                    fileToSend.path = './uploads/' + intervention.ordreIntervention.keyDL;
                    mail.attachments.push(fileToSend);
                    mail.template = 'blank';
                    this.mail = mail;
                });
            } else {
                this.notificationService.setNotification(
                    'danger', ['Il faut au moins un prélèvement sur l\'intervention pour envoyer l\'ordre d\'intervention.']
                );
            }
        }
    }

    setCloseMail() {
        this.mail = null;
    }

    save(intervention: Intervention): Promise<Intervention> {
        return new Promise((resolve, reject) => {
            intervention.rendezVous.nom = intervention.libelle;
            if (!intervention.ordreIntervention || !intervention.ordreIntervention.id) {
                delete intervention.ordreIntervention;
            }
            if (!intervention.ordreInterventionValide || !intervention.ordreInterventionValide.id) {
                delete intervention.ordreInterventionValide;
            }

            if (intervention.id) {
                this.interventionService.update(intervention).subscribe((inter) => {
                    this.interventionForm.patchValue(inter);
                    resolve(inter);
                });
            } else {
                this.interventionService.create(intervention).subscribe((inter) => {
                    this.interventionForm.patchValue(inter);
                    resolve(inter);
                });
            }
        });
    }

    checkValide(valid: boolean) {
        if (valid) {
            return true;
        } else {
            this.submited = true;
            const erreur = this.validationService.getFormValidationErrors(this.interventionForm.get('rendezVous') as FormGroup, this.champsInformations)
                .concat(this.validationService.getFormValidationErrors(this.interventionForm as FormGroup, this.champsInformations));
            this.notificationService.setNotification('danger', erreur);
            return false;
        }
    }

    parseDateDebut() {
        if (this.interventionForm.controls['rendezVous'].get('dateDebut')!.value
            && this.interventionForm.controls['rendezVous'].get('heureDebut')!.value) {
            const newDateHeureDebut = new Date(this.interventionForm.controls['rendezVous'].get('dateDebut')!.value
                + ' ' + this.interventionForm.controls['rendezVous'].get('heureDebut')!.value);
            this.interventionForm.controls.rendezVous.patchValue({dateHeureDebut: newDateHeureDebut});
        }
    }

    parseDateFin() {
        if (this.interventionForm.controls['rendezVous'].get('dateFin')!.value
            && this.interventionForm.controls['rendezVous'].get('heureFin')!.value) {
            const newDateHeureDebut = new Date(this.interventionForm.controls['rendezVous'].get('dateFin')!.value
                + ' ' + this.interventionForm.controls['rendezVous'].get('heureFin')!.value);
            this.interventionForm.controls.rendezVous.patchValue({dateHeureFin: newDateHeureDebut});
        }
    }

    telecharge(fichier: Fichier) {
        this.fichierService.get(fichier.keyDL).subscribe((file) => {
            const filename = fichier.nom + '.' + fichier.extention;
            FileSaver.saveAs(file, filename);
        });
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1 === val2;
        }
    }
}
