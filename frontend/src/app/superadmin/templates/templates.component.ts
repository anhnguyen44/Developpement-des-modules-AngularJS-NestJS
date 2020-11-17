import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { NotificationService } from '../../notification/notification.service';
import { fadeIn, fadeOut } from '../../resource/animation';
import { MenuService } from '../../menu/menu.service';
import { Fichier } from '../../resource/fichier/Fichier';
import { EnumTypeFichier, Liste, EnumTypeTemplate, TemplateVersion } from '@aleaac/shared';
import { LoaderService } from '../../loader/loader.service';
import { FichierService } from '../../resource/fichier/fichier.service';
import { TypeFichier } from '../typefichier/type-fichier/TypeFichier';
import { TypeFichierService } from '../typefichier/type-fichier.service';
import { TemplateVersionService } from '../../resource/template-version/template-version.service';
import * as FileSaver from 'file-saver';
import { DevisCommandeService } from '../../devis-commande/devis-commande.service';
import { ChantierService } from '../../chantier/chantier.service';

@Component({
    selector: 'sa-templates',
    templateUrl: './templates.component.html',
    styleUrls: ['./templates.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class TemplatesComponent implements OnInit {
    @ViewChildren('fileInput') fileInputs;
    fichiers: Map<EnumTypeTemplate, Fichier> = new Map<EnumTypeTemplate, Fichier>();
    fichier: Fichier;
    fileName: string;
    typeFichier: TypeFichier;
    listeTemplates: TemplateVersion[] = new Array<TemplateVersion>();
    templateAssocie: Map<EnumTypeTemplate, TemplateVersion> = new Map<EnumTypeTemplate, TemplateVersion>();

    isModeTest: boolean = false;
    // Y'a 10 valeurs parce 10 valeurs dans l'enum EnumTypeTemplate
    idsForTest: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    constructor(
        private notificationService: NotificationService,
        private menuService: MenuService,
        private loaderService: LoaderService,
        private fichierService: FichierService,
        private typeFichierService: TypeFichierService,
        private templateVersionService: TemplateVersionService,
        private devisCommandeService: DevisCommandeService,
        private chantierService: ChantierService,
    ) {
        this.typeFichierService.get(24).subscribe(tf => {
            this.typeFichier = tf;
        });
    }

    ngOnInit() {
        this.menuService.setMenu([
            ['Super admin', '/superadmin'],
            ['Templates', '']
        ]);

        this.templateVersionService.getAllTemplateVersion().subscribe(tv => {
            this.initTemplates(tv);
        });
    }

    private initTemplates(tv: TemplateVersion[]) {
        console.log(tv);
        this.listeTemplates = tv;
        for (const temp of this.listeTemplates) {
            this.templateAssocie.set(temp.typeTemplate, temp);
        }
    }

    download(idFichier: number) {
        this.fichierService.getFichierById(idFichier).subscribe(file => {
            const filename = file.nom + '.' + file.extention;

            this.fichierService.get(file.keyDL).subscribe(data => {
                FileSaver.saveAs(data, filename);
            });
        });
    }

    printTest(idTypeTemplate: number) {
        switch (idTypeTemplate) {
            case EnumTypeTemplate.TEST_LABO_PROP_COMMERCIALE:
                    this.devisCommandeService.imprimerTest(this.idsForTest[idTypeTemplate - 1]).subscribe((fichier) => {
                        this.fichierService.get(fichier.keyDL).subscribe((file) => {
                            const filename = fichier.nom + '.' + fichier.extention;
                            FileSaver.saveAs(file, filename);
                        }, err => {
                            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                            console.error(err);
                        });
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                break;
            case EnumTypeTemplate.TEST_LABO_STRATEGIE:
                    this.chantierService.generateStrategieTest(this.idsForTest[idTypeTemplate - 1]).subscribe((fichier) => {
                        this.fichierService.get(fichier.keyDL).subscribe((file) => {
                            const filename = fichier.nom + '.' + fichier.extention;
                            FileSaver.saveAs(file, filename);
                        }, err => {
                            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                            console.error(err);
                        });
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                        console.error(err);
                    });
                break;
            default:
                break;
        }
    }

    envoyer(type: EnumTypeTemplate) {
        console.log(this.fichier);
        if (this.fichier.file && this.fichier.file[0] && this.fichier.nom && this.fichier.typeFichier) {
            const formData = new FormData();
            formData.append('file', this.fichier.file[0]);
            formData.append('nom', this.fichier.nom);
            formData.append('idUtilisateur', this.fichier.idUtilisateur.toString());
            formData.append('extention', this.fichier.extention);
            formData.append('application', 'sa-template');
            formData.append('idParent', type.toString());
            formData.append('idTypeFichier', '24');
            formData.append('commentaire', '');
            this.loaderService.show();
            this.fichierService.saveForceCreate(formData).subscribe((fichier) => {
                this.loaderService.hide();
                fichier.typeFichier = this.typeFichier;

                this.makeVersion(fichier, type);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            const erreur = new Array();
            if (!this.fichier.file) {
                erreur.push('Il faut ajouter un fichier.');
            }
            if (!this.fichier.nom) {
                erreur.push('Il faut saisir un nom pour votre fichier.');
            }
            if (!this.fichier.typeFichier) {
                erreur.push('Il faut saisir un type de fichier.');
            }
            this.notificationService.setNotification('danger', erreur);
        }
    }

    openFileChange(type: EnumTypeTemplate) {
        const event = new MouseEvent('click', { bubbles: false });
        this.fileInputs.find(x => x.nativeElement.id.indexOf(type) > -1).nativeElement.dispatchEvent(event);
    }

    onFileChange(event, type: EnumTypeTemplate) {
        if (!this.fichiers[type]) {
            this.fichier = new Fichier();
            this.fichier.typeFichier = {
                id: EnumTypeFichier.TEMPLATE, nom: 'TEMPLATE', affectable: false,
                idGroupe: null, groupe: null
            };
            this.fichier.idUtilisateur = 2; // TODO : Mettre le user conencté
            this.fichier.application = 'sa-template';
            this.fichier.idParent = type;
        }
        if (event.target.files.length > 0) {
            this.fichier.file = this.fileInputs.find(x => x.nativeElement.id.indexOf(type) > -1).nativeElement.files;
            this.fileName = this.fichier.file[0].name;
            this.fichier.extention = this.fichier.file[0].name.split('.').pop();
            if (!this.fichier.nom) {
                this.fichier.nom = this.fichier.file[0].name.split('.')[0];
            }
        }
        this.fichiers.set(type, this.fichier);
    }

    makeVersion(fichier: Fichier, type: EnumTypeTemplate) {
        this.loaderService.show();
        const tmp: TemplateVersion = new TemplateVersion();
        tmp.idFichier = fichier.id;
        tmp.dateDebut = new Date();
        tmp.typeTemplate = type;
        tmp.version = 1;

        if (this.listeTemplates.findIndex(t => t.typeTemplate === type) > -1) {
            tmp.version = this.listeTemplates.find(t => t.typeTemplate === type)!.version + 1;
        }

        this.templateVersionService.createTemplateVersion(tmp).subscribe(res => {
            this.loaderService.hide();
            this.fichiers.delete(type);
            this.fichier = new Fichier();

            this.templateVersionService.getAllTemplateVersion().subscribe(tv => {
                this.initTemplates(tv);
            });
        });
    }
}
