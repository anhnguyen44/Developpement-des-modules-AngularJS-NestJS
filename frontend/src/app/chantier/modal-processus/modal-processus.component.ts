import { Component, EventEmitter, Input, OnInit, Output, HostListener, ElementRef } from '@angular/core';
import { Compte } from '../../contact/Compte';
import { Contact } from '../../contact/Contact';
import { ContactService } from '../../contact/contact.service';
import { CompteService } from '../../contact/compte.service';
import { fadeIn, fadeOut } from '../../resource/animation';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { NotificationService } from '../../notification/notification.service';
import { Processus } from '@aleaac/shared';

@Component({
    selector: 'app-modal-processus',
    templateUrl: './modal-processus.component.html',
    styleUrls: ['./modal-processus.component.scss']
})
export class ModalProcessusComponent implements OnInit {
    @Input() idProcessus: number;
    @Input() isNew: boolean;
    @Input() idCompte: number;

    @Output() emitProcessus: EventEmitter<Processus> = new EventEmitter<Processus>();
    @Output() emitClose = new EventEmitter();

    constructor(
        private contactService: ContactService,
        private compteService: CompteService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {

    }

    setProcessus(processus) {
        console.log(processus);
        this.emitProcessus.emit(processus);
    }

    close(event) {
        if (!event || !event.srcElement ||
            (event.srcElement!.classList[0] !== 'link'
                && event.srcElement!.classList[0] !== 'button'
                && event.srcElement!.classList[0] !== 'selection-tache'
                && event.srcElement!.classList[0] !== 'liste-tache'
                && event.srcElement!.classList[0] !== 'tache'
                && event.srcElement!.classList[0] !== 'ng-pristine'
                && event.srcElement!.classList[0] !== 'ng-valid'
                && event.srcElement!.classList[0] !== 'ng-invalid'
                && event.srcElement!.classList[0] !== 'ng-touched'
                && event.srcElement!.classList[0] !== 'ng-untouched'
                && event.srcElement!.classList[0] !== 'formgroup'
                && event.srcElement!.classList[0] !== 'bloc'
            )
        ) {
            this.emitClose.emit(event);
        }
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.emitClose.emit();
    }
}
