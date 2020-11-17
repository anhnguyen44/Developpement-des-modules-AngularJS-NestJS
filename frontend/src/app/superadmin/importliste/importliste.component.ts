import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../../notification/notification.service';
import { fadeIn, fadeOut } from '../../resource/animation';
import { MenuService } from '../../menu/menu.service';
import { Fichier } from '../../resource/fichier/Fichier';
import { EnumTypeFichier, Liste } from '@aleaac/shared';
import { LoaderService } from '../../loader/loader.service';
import { FichierService } from '../../resource/fichier/fichier.service';
import { ImportService } from '../../resource/import/import.service';
import { MateriauConstructionAmiante } from '@aleaac/shared';
import { MateriauConstructionAmianteService } from '../../resource/materiau-construction-amiante/materiau-construction-amiante.service';
import { EnumTypeFichierGroupe } from '@aleaac/shared/src/models/typeFichierGroupe.model';
import { ListeService } from '../../resource/liste/liste.service';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'sa-import-liste',
    templateUrl: './importliste.component.html',
    styleUrls: ['./importliste.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class ImportlisteComponent implements OnInit {
    @ViewChild('fileInputAmiante') fileInputAmiante;
    @ViewChild('fileInputListe') fileInputListe;
    fichier: Fichier; // Fichier ListeA/B/C
    fileName: string; // Fichier ListeA/B/C
    fichierListesEnrichissables: Fichier;
    fileNameistesEnrichissables: string;
    isImportListesAmiante: boolean = false;

    constructor(
        private notificationService: NotificationService,
        private menuService: MenuService,
        private loaderService: LoaderService,
        private fichierService: FichierService,
        private importService: ImportService,
        private materiauConstructionAmianteService: MateriauConstructionAmianteService,
        private listeService: ListeService,
    ) { }

    ngOnInit() {
        this.menuService.setMenu([
            ['Super admin', '/superadmin'],
            ['Import/Export des listes', '']
        ]);
    }

    envoyerAmiante() {
        console.log(this.fichier);
        this.isImportListesAmiante = true;
        if (this.fichier.file && this.fichier.file[0] && this.fichier.nom && this.fichier.typeFichier) {
            const formData = new FormData();
            formData.append('file', this.fichier.file[0]);
            formData.append('nom', this.fichier.nom);
            formData.append('idUtilisateur', this.fichier.idUtilisateur.toString());
            formData.append('extention', this.fichier.extention);
            formData.append('application', this.fichier.application);
            formData.append('idParent', this.fichier.idParent.toString());
            formData.append('idTypeFichier', this.fichier.typeFichier.id.toString());
            formData.append('commentaire', this.fichier.commentaire ? this.fichier.commentaire : '');
            this.loaderService.show();
            this.fichierService.save(formData).subscribe((fichier) => {
                this.loaderService.hide();
                fichier.typeFichier = this.fichier.typeFichier;

                this.importListeAmiante(fichier);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                this.isImportListesAmiante = false;
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

    openFileChangeAmiante() {
        const event = new MouseEvent('click', { bubbles: false });
        this.fileInputAmiante.nativeElement.dispatchEvent(event);
    }

    onFileChangeAmiante(event) {
        if (!this.fichier) {
            this.fichier = new Fichier();
            this.fichier.typeFichier = {
                id: EnumTypeFichier.IMPORT_LISTE_AMIANTE, nom: 'IMPORT_LISTE_AMIANTE', affectable: false,
                idGroupe: EnumTypeFichierGroupe.IMPORT, groupe: { id: EnumTypeFichierGroupe.IMPORT, nom: 'IMPORT' }
            };
            this.fichier.idUtilisateur = 2; // TODO : Mettre le user conencté
            this.fichier.application = 'sa-import';
            this.fichier.idParent = 1;
        }
        if (event.target.files.length > 0) {
            this.fichier.file = this.fileInputAmiante.nativeElement.files;
            this.fileName = this.fichier.file[0].name;
            this.fichier.extention = this.fichier.file[0].name.split('.').pop();
            if (!this.fichier.nom) {
                this.fichier.nom = this.fichier.file[0].name.split('.')[0];
            }
        }
    }

    envoyerEnrichissable() {
        console.log(this.fichierListesEnrichissables);
        if (this.fichierListesEnrichissables.file && this.fichierListesEnrichissables.file[0]
            && this.fichierListesEnrichissables.nom && this.fichierListesEnrichissables.typeFichier) {
            const formData = new FormData();
            formData.append('file', this.fichierListesEnrichissables.file[0]);
            formData.append('nom', this.fichierListesEnrichissables.nom);
            formData.append('idUtilisateur', this.fichierListesEnrichissables.idUtilisateur.toString());
            formData.append('extention', this.fichierListesEnrichissables.extention);
            formData.append('application', this.fichierListesEnrichissables.application);
            formData.append('idParent', this.fichierListesEnrichissables.idParent.toString());
            formData.append('idTypeFichier', this.fichierListesEnrichissables.typeFichier.id.toString());
            formData.append('commentaire', this.fichierListesEnrichissables.commentaire
                ? this.fichierListesEnrichissables.commentaire
                : '');
            this.loaderService.show();
            this.fichierService.save(formData).subscribe((fichier) => {
                this.loaderService.hide();
                fichier.typeFichier = this.fichierListesEnrichissables.typeFichier;

                this.importListeEnrichissable(fichier);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            const erreur = new Array();
            if (!this.fichierListesEnrichissables.file) {
                erreur.push('Il faut ajouter un fichier.');
            }
            if (!this.fichierListesEnrichissables.nom) {
                erreur.push('Il faut saisir un nom pour votre fichier.');
            }
            if (!this.fichierListesEnrichissables.typeFichier) {
                erreur.push('Il faut saisir un type fichier.');
            }
            this.notificationService.setNotification('danger', erreur);
        }
    }

    openFileChangeEnrichissable() {
        const event = new MouseEvent('click', { bubbles: false });
        this.fileInputListe.nativeElement.dispatchEvent(event);
    }

    onFileChangeEnrichissable(event) {
        if (!this.fichierListesEnrichissables) {
            this.fichierListesEnrichissables = new Fichier();
            this.fichierListesEnrichissables.typeFichier = {
                id: EnumTypeFichier.IMPORT_LISTE_ENRICHISSABLE, nom: 'IMPORT_LISTE_ENRICHISSABLE', affectable: false,
                idGroupe: EnumTypeFichierGroupe.IMPORT, groupe: { id: EnumTypeFichierGroupe.IMPORT, nom: 'IMPORT' }
            };
            this.fichierListesEnrichissables.idUtilisateur = 2; // TODO : Mettre le user conencté
            this.fichierListesEnrichissables.application = 'sa-import';
            this.fichierListesEnrichissables.idParent = 1;
        }
        if (event.target.files.length > 0) {
            this.fichierListesEnrichissables.file = this.fileInputListe.nativeElement.files;
            this.fileNameistesEnrichissables = this.fichierListesEnrichissables.file[0].name;
            this.fichierListesEnrichissables.extention = this.fichierListesEnrichissables.file[0].name.split('.').pop();
            if (!this.fichierListesEnrichissables.nom) {
                this.fichierListesEnrichissables.nom = this.fichierListesEnrichissables.file[0].name.split('.')[0];
            }
        }
    }

    importListeAmiante(fichier: Fichier) {
        this.loaderService.show();
        this.importService.getDataFromFile(fichier.id, false,
            ['liste', 'partieStructure', 'composantConstruction', 'partieComposant']).subscribe(result => {
                const resultTyped: Array<MateriauConstructionAmiante> = result; // On cast dans un objet typé
                // On vide la table avant de recréer car y'a pas d'éléments utilisateur dans cette table
                this.materiauConstructionAmianteService.truncate().subscribe(() => {
                    let i = 1;
                    for (const materiau of resultTyped) {
                        this.materiauConstructionAmianteService.createMateriauConstructionAmiante(materiau).subscribe(() => {
                            i++;
                            // On affiche que c'est fini seulement après la fin du traitement
                            if (i >= resultTyped.length) {
                                this.notificationService.setNotification('success', ['Listes mises à jour.']);
                                this.loaderService.hide();
                                this.isImportListesAmiante = false;
                            }
                        });
                    }
                }, err => {
                    console.error(err);
                    this.isImportListesAmiante = false;
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                });
            });
    }

    importListeEnrichissable(fichier: Fichier) {
        this.loaderService.show();
        this.importService.getDataFromFile(fichier.id, true, ['typePartage', 'nomListe', 'resume', 'valeur',
            'ordre', 'isLivreParDefaut', 'sousListe']).subscribe(result => {
            for (const item of result) {
                if (item.isLivreParDefaut === 'true') {
                    item.isLivreParDefaut = true;
                }
                if (item.sousListe === '') {
                    item.sousListe = null;
                }
            }
            const resultTyped: Array<Liste> = result; // On cast dans un objet typé
            // Ici on vide que ceux qui sont livrés par défaut et on les recrée
            console.log(resultTyped);
            this.listeService.truncate().subscribe(() => {
                let i = 1;
                for (const listItem of resultTyped) {
                    i++;
                    console.log(listItem);
                    if (listItem.isLivreParDefaut === true) {
                        this.listeService.create(listItem).subscribe(() => {
                            // On affiche que c'est fini seulement après la fin du traitement
                            if (i >= resultTyped.length) {
                                this.notificationService.setNotification('success', ['Listes mises à jour.']);
                                this.loaderService.hide();
                            }
                        });
                    }
                }
            }, err => {
                console.error(err);
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            });
        }, err => {
            console.error(err);
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        });
    }

    exportListesEnrichissables() {

        this.listeService.generateXlsx().subscribe((xlsx) => {
            FileSaver.saveAs(xlsx, 'export.xlsx');
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }
}
