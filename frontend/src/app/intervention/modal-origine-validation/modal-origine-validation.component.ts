import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EnumOrigineValidation} from '@aleaac/shared';
import {NotificationService} from '../../notification/notification.service';

@Component({
    selector: 'app-modal-origine-validation',
    templateUrl: './modal-origine-validation.component.html',
    styleUrls: ['./modal-origine-validation.component.scss']
})
export class ModalOrigineValidationComponent implements OnInit {
    idOrigineValidation: number;
    keys: any[];
    enumOrigineValidation = EnumOrigineValidation;
    @Output() emitIdOrigineValidation = new EventEmitter<number>();
    @Output() emitClose = new EventEmitter();

    constructor(private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.keys = Object.keys(this.enumOrigineValidation).filter(Number);
    }

    confirm() {
        if (this.idOrigineValidation) {
            this.emitIdOrigineValidation.emit(this.idOrigineValidation);
        } else {
            this.notificationService.setNotification('danger', ['Il faut saisir une origine de validation.']);
        }

    }

    close() {
        this.emitClose.emit();
    }

}
