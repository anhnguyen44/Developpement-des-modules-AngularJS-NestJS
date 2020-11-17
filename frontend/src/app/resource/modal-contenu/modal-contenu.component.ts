import { ContenuMenu } from '@aleaac/shared';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '../../notification/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContenuMenuService } from '../menu/contenu-menu.service';

@Component({
    selector: 'app-modal-contenu',
    templateUrl: './modal-contenu.component.html',
    styleUrls: ['./modal-contenu.component.scss']
})
export class ModalContenuComponent implements OnInit {
    @Input() expression: string;
    @Output() emitClose: EventEmitter<void> = new EventEmitter();
    contenu: ContenuMenu;

    constructor(
        private notificationService: NotificationService,
        private contenuService: ContenuMenuService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
        // Rien
        this.contenuService.getContenuByExpressName(this.expression).subscribe(data => {
            this.contenu = data;
        });
    }

    close(event) {
        if (!event || !event.srcElement
            || (event.srcElement!.classList[0] !== 'link'
                && event.srcElement!.classList[0] !== 'button'
                && event.srcElement!.classList[0] !== 'sub')
            ) {
            this.emitClose.emit();
        }
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.close(event);
    }
}
