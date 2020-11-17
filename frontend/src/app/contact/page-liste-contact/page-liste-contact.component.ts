import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { MenuService } from '../../menu/menu.service';
import { Contact } from '../Contact';
import { Compte } from '../Compte';

@Component({
    selector: 'app-page-liste-interlocuteur',
    templateUrl: './page-liste-contact.component.html',
    styleUrls: ['./page-liste-contact.component.scss']
})
export class PageListeContactComponent implements OnInit {
    @Input() type: string;
    @Input() modalClient: boolean;
    @Input() isContactSeul: boolean = false;
    @Output() emitContact = new EventEmitter<Contact>();
    @Output() emitNouveauContact = new EventEmitter();
    @Output() emitCompte = new EventEmitter<Compte>();
    typeAffichage: string = 'compte';
    modalContact: boolean = false;

    constructor(private menuService: MenuService) { }

    ngOnInit() {
        if (!this.modalClient) {
            this.menuService.setMenu([
                ['Comptes / Contacts', '']
            ]);
        }
        const typeContact = localStorage.getItem('typeContact');
        this.typeAffichage = typeContact !== null ? typeContact : 'compte';
        if (this.isContactSeul) {
            this.typeAffichage = 'contact';
        }
    }

    changeType(type) {
        this.typeAffichage = type;
        this.modalContact = false;
        localStorage.setItem('typeContact', type);
    }

    setContact(contact) {
        this.emitContact.emit(contact);
    }

    setNouveauContact(pouet: any) {
        this.emitNouveauContact.emit();
    }

    setCompte(compte) {
        this.emitContact.emit(compte);
    }
}
