import { Component, EventEmitter, Input, OnInit, Output, ViewChild, HostListener } from '@angular/core';
import { UserStore } from '../../user/user.store';
import { BatimentService } from '../batiment.service';
import { NotificationService } from '../../../notification/notification.service';
import { LoaderService } from '../../../loader/loader.service';
import { TypeBatiment, Batiment, EnumTypeFichier } from '@aleaac/shared';
import { TypeFichier } from '../../../superadmin/typefichier/type-fichier/TypeFichier';
import { TypeFichierService } from '../../../superadmin/typefichier/type-fichier.service';
import { TypeBatimentService } from '../../type-batiment/type-batiment.service';

@Component({
    selector: 'app-modal-batiment',
    templateUrl: './modal-batiment.component.html',
    styleUrls: ['./modal-batiment.component.scss']
})
export class ModalBatimentComponent implements OnInit {
    @Input() application: string;
    @Input() idParent: number;
    @Input() TypeFichier: TypeFichier;
    typeFichierPerimetre: TypeFichier;
    @Input() batiment: Batiment;

    @Output() emitBatiment = new EventEmitter<Batiment>();
    @Output() emitClose = new EventEmitter();

    fileName: string;
    typeBatiments: TypeBatiment[];

    constructor(
        private utilisateurStore: UserStore,
        private batimentService: BatimentService,
        private notificationService: NotificationService,
        private loaderService: LoaderService,
        private typeFichierService: TypeFichierService,
        private typeBatimentService: TypeBatimentService,
    ) { }

    compareFn(a, b) {
        // Handle compare logic (eg check if unique ids are the same)
        return a && b ? a.id === b.id : false;
    }

    ngOnInit() {

        if (!this.TypeFichier) {
            this.typeFichierService.getAll().subscribe(data => {
                this.TypeFichier = data.find(c => c.id == EnumTypeFichier.CHANTIER_PLAN_BATIMENT)!;
                this.typeFichierPerimetre = data.find(c => c.id == EnumTypeFichier.CHANTIER_PLAN_PERIMETRE_BATIMENT)!;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.typeFichierService.getAll().subscribe(data => {
                this.typeFichierPerimetre = data.find(c => c.id == EnumTypeFichier.CHANTIER_PLAN_PERIMETRE_BATIMENT)!;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }

        this.typeBatimentService.getAllTypeBatiment().subscribe(types => {
            this.typeBatiments = types;
        });

        if (!this.batiment) {
            this.batiment = new Batiment();
            this.batiment.idSitePrelevement = this.idParent;
        }

        console.log(this.application, this.idParent);
    }

    envoyer(closeAfterSave: boolean = false) {
        console.log(this.batiment);
        if (this.batiment.typeBatiment && this.batiment.typeBatiment.id && this.batiment.nom) {
            // this.loaderService.show();
            if (!this.batiment.id) {
                this.batimentService.createBatiment(this.batiment).subscribe((batiment) => {
                    // this.loaderService.hide();
                    this.batiment.id = batiment.id;
                    this.emitBatiment.emit(batiment);
                    if (closeAfterSave) {
                        this.emitClose.emit();
                    }
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            } else {
                this.batimentService.updateBatiment(this.batiment).subscribe((batiment) => {
                    // this.loaderService.hide();
                    this.emitBatiment.emit(this.batiment);
                    if (closeAfterSave) {
                        this.emitClose.emit();
                    }
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }
        } else {
            const erreur = new Array();
            if (!this.batiment.typeBatiment || !this.batiment.typeBatiment.id) {
                erreur.push('Il faut choisir un type de bâtiment.');
            }
            if (!this.batiment.nom) {
                erreur.push('Il faut saisir un nom pour votre bâtiment.');
            }
            this.notificationService.setNotification('danger', erreur);
        }
    }

    close() {
        this.emitClose.emit();
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.close();
    }
}
