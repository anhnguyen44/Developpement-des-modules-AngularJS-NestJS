import { Component, EventEmitter, Input, OnInit, Output, ViewChild, HostListener } from '@angular/core';
import { NotificationService } from '../../../notification/notification.service';
import { LoaderService } from '../../../loader/loader.service';
import { UserStore } from '../../../resource/user/user.store';
import { InfosBesoinClientLabo } from '@aleaac/shared';
import { InformationsBesoinService } from '../informations-besoin.service';


@Component({
    selector: 'app-modal-informations-besoin',
    templateUrl: './modal-informations-besoin.component.html',
    styleUrls: ['./modal-informations-besoin.component.scss']
})
export class ModalInformationsBesoinComponent implements OnInit {
    @Input() application: string;
    @Input() idParent: number;
    @Input() infosBesoinClient: InfosBesoinClientLabo;

    @Output() emitinfoInfosBesoinClientLabo = new EventEmitter<InfosBesoinClientLabo>();
    @Output() emitClose = new EventEmitter();

    informationsBesoin: InfosBesoinClientLabo;
    fileName: string;

    constructor(
        private utilisateurStore: UserStore,
        private informationsBesoinService: InformationsBesoinService,
        private notificationService: NotificationService,
        private loaderService: LoaderService,
    ) { }

    ngOnInit() {
        console.log(this.infosBesoinClient, this.idParent);
        if (!this.infosBesoinClient) {
            this.informationsBesoin = new InfosBesoinClientLabo();
            this.informationsBesoin.idBesoinClientLabo = this.idParent;
        } else {
            this.informationsBesoin = this.infosBesoinClient;
        }
    }

    envoyer() {
        console.log(this.informationsBesoin);
        if (this.informationsBesoin.informateur
            && this.informationsBesoin.contenu
            && this.informationsBesoin.libelle
            && this.informationsBesoin.informateur.length > 0
            && this.informationsBesoin.contenu.length > 0
            && this.informationsBesoin.libelle.length > 0
            ) {
            this.loaderService.show();
            this.informationsBesoinService.save(this.informationsBesoin).subscribe((informationsBesoin) => {
                this.loaderService.hide();
                this.emitinfoInfosBesoinClientLabo.emit(informationsBesoin);
            });
        } else {
            const erreur = new Array();
            if (!this.informationsBesoin.informateur || !this.informationsBesoin.informateur.length) {
                erreur.push('Il faut remplir l\'informateur.');
            }
            if (!this.informationsBesoin.libelle || !this.informationsBesoin.libelle.length) {
                erreur.push('Il faut remplir le libellé.');
            }
            if (!this.informationsBesoin.contenu || !this.informationsBesoin.contenu.length) {
                erreur.push('Il faut remplir le contenu.');
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
