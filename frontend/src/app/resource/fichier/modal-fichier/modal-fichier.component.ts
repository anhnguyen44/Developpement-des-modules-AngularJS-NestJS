import { Component, EventEmitter, Input, OnInit, Output, ViewChild, HostListener } from '@angular/core';
import { Fichier } from '../Fichier';
import { UserStore } from '../../user/user.store';
import { FichierService } from '../fichier.service';
import { NotificationService } from '../../../notification/notification.service';
import { LoaderService } from '../../../loader/loader.service';
import { TypeFichierService } from '../../../superadmin/typefichier/type-fichier.service';
import { TypeFichier } from '../../../superadmin/typefichier/type-fichier/TypeFichier';
import { EnumTypeFichierGroupe } from '@aleaac/shared';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';
import { addMinutes } from 'date-fns';

@Component({
    selector: 'app-modal-fichier',
    templateUrl: './modal-fichier.component.html',
    styleUrls: ['./modal-fichier.component.scss']
})
export class ModalFichierComponent implements OnInit {
    @Input() application: string;
    @Input() TypeFichier: TypeFichier;
    @Input() idParent: number;
    @Input() groupeTypeFicher: EnumTypeFichierGroupe;

    @Output() emitFichier = new EventEmitter<Fichier>();
    @Output() emitClose = new EventEmitter();
    @Output() emitIdFichier = new EventEmitter<number>();
    @ViewChild('fileInput') fileInput;
    fichier: Fichier;
    fileName: string;
    typeFichiers: TypeFichier[];

    constructor(
        private utilisateurStore: UserStore,
        private fichierService: FichierService,
        private notificationService: NotificationService,
        private loaderService: LoaderService,
        private typeFichierService: TypeFichierService
    ) { }

    ngOnInit() {
        console.log(this.TypeFichier);
        if (this.groupeTypeFicher) {
            this.typeFichierService.getAffectableByGroupe(this.groupeTypeFicher).subscribe((typeFichiers) => {
                this.typeFichiers = typeFichiers;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.typeFichierService.getAll().subscribe((typeFichiers) => {
                this.typeFichiers = typeFichiers;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
        console.log(this.application, this.idParent);
        this.utilisateurStore.user.subscribe((utilisateur) => {
            this.fichier = new Fichier();
            this.fichier.idUtilisateur = utilisateur.id;
            this.fichier.application = this.application;
            this.fichier.idParent = this.idParent;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    envoyer() {
        // console.log(this.fichier);
        if (this.TypeFichier) {
            this.fichier.typeFichier = this.TypeFichier;
        }
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
            this.notificationService.setNotification('warning', ['Le fichier est en cours d\'envoi.', 'Si vous n\'avez pas la fibre, cela peut prendre quelques minutes.', 
            'Cette fenêtre va se fermer à la fin du téléchargement.', 'En attendant vous pouvez ouvrir un autre onglet si vous le souhaitez.']);
            this.loaderService.show();
            this.fichierService.save(formData).subscribe((fichier) => {
                this.loaderService.hide();
                fichier.typeFichier = this.fichier.typeFichier;
                this.emitFichier.emit(fichier);
                console.log(fichier);
                this.notificationService.setNotification('success', ['Le fichier a bien été envoyé.']);
                this.emitIdFichier.emit(fichier.id);
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
        // this.emitClose.emit();
    }

    onFileChange(event) {
        if (event.target.files.length > 0) {
            this.fichier.file = this.fileInput.nativeElement.files;
            this.fileName = this.fichier.file[0].name;
            this.fichier.extention = this.fichier.file[0].name.split('.').pop();
            if (!this.fichier.nom) {
                this.fichier.nom = this.fichier.file[0].name.split('.')[0];
            }
        }
    }

    openFileChange() {
        const event = new MouseEvent('click', { bubbles: false });
        this.fileInput.nativeElement.dispatchEvent(event);
    }

    close() {
        this.emitClose.emit();
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.close();
    }
}
