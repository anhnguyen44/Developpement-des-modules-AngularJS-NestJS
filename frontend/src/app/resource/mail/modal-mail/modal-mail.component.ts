import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../notification/notification.service';
import { ValidationService } from '../../validation/validation.service';
import { Mail } from '../Mail';
import { MailService } from '../mail.service';
import {LoaderService} from '../../../loader/loader.service';


@Component({
    selector: 'app-modal-mail',
    templateUrl: './modal-mail.component.html',
    styleUrls: ['./modal-mail.component.scss']
})
export class ModalMailComponent implements OnInit {
    mailForm = this.formBuilder.group({
        from: ['', [Validators.required, Validators.email]],
        to: ['', [Validators.required, Validators.email]],
        cc: [''],
        cci: [''],
        subject: ['', [Validators.required]]
    });

    champsInformations: Map<string, string> = new Map<string, string>([
        ['to', 'L\'expéditeur'],
        ['from', 'Le destinataire'],
        ['subject', 'Le sujet'],
        ['contenu', 'Le contenu']
    ]);
    submited: boolean = false;
    @Input() mail: Mail;
    @Output() emitClose = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private validationService: ValidationService,
        private mailService: MailService,
        private loaderService: LoaderService
    ) { }

    ngOnInit() {
        this.mailForm.patchValue(this.mail);
        this.mail.contenu = ''; // TODO : Prévoir une table de templates avec la possibilité pour les franchisés de les personnaliser
        // console.log(this.mail);
    }

    onSubmit({ value, valid }: { value: Mail, valid: boolean }) {
        console.log({ value, valid });
        console.log(this.mail);
        if (valid && this.mail.contenu !== undefined && this.mail.contenu !== '') {
            value.contenu = this.mail.contenu;
            value.template = this.mail.template;
            value.idParent = this.mail.idParent;
            value.application = this.mail.application;
            // On filtre les attachments sur ceux selectionné
            if (this.mail.attachments) {
                value.attachments = this.mail.attachments.filter((attachment) => {
                    return attachment.selected;
                });
            } else {
                value.attachments = [];
            }
            // On met toutes les valeurs à remplacer (clef/valeur) dans le template
            const data: Map<string, string> = new Map<string, string>();
            data.set('data', value.contenu);

            // On convertit en objet pour le transfer par POST, sinon ça envoie vide
            const convMap = {};
            data.forEach((val: string, key: string) => {
                convMap[key] = val;
            });
            value.dataList = convMap;
            this.loaderService.show();
            this.mailService.send(value).subscribe(() => {
                this.loaderService.hide();
                this.notificationService.setNotification('success', ['Message envoyé correctement.']);
                this.close();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        } else {
            this.submited = true;
            const erreurs = this.validationService.getFormValidationErrors(this.mailForm, this.champsInformations);
            if (this.mail.contenu === '' || this.mail.contenu === undefined) {
                erreurs.push('Le contenu est obligatoire.');
            }
            this.notificationService.setNotification('danger', erreurs);
        }
    }

    getContent(s: string){
        console.log(s);
        this.mail.contenu = s;
    }

    close() {
        this.emitClose.emit();
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.close();
    }

}
