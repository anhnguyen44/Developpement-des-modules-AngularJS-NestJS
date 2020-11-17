import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuService } from '../../menu/menu.service';
import { Contact } from '../../contact/Contact';
import { Compte } from '../../contact/Compte';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';

@Component({
    selector: 'app-page-liste-interlocuteur-chantier',
    templateUrl: './page-liste-contact.component.html',
    styleUrls: ['./page-liste-contact.component.scss']
})
export class PageListeContactChantierComponent implements OnInit {
    @Input() type: string;
    @Input() modalClient: boolean;
    @Output() emitContact = new EventEmitter<Contact>();
    @Output() emitCompte = new EventEmitter<Compte>();
    @Output() emitNouveauContact = new EventEmitter<any>();
    @Input() isOnlyContact: boolean = false;
    typeAffichage: string = 'compte';
    @Input() queryBuildContact: QueryBuild = new QueryBuild();
    constructor(private menuService: MenuService) { }

    ngOnInit() {
        if (!this.modalClient) {
            this.menuService.setMenu([
                ['Compte / Contact', '']
            ]);
        }
    }

    changeType(type) {
        this.typeAffichage = type;
    }

    setContact(contact) {
        this.emitContact.emit(contact);
    }

    setNouveauContact(event) {
        this.emitNouveauContact.emit(event);
    }

    setCompte(compte) {
        this.emitContact.emit(compte);
    }
}
