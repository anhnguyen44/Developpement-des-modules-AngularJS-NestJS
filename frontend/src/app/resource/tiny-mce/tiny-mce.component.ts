import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';

import tinymce from 'tinymce/tinymce';
import {ContenuMenuService} from '../menu/contenu-menu.service';
import {NotificationService} from '../../notification/notification.service';
import {ModalMailComponent} from '../mail/modal-mail/modal-mail.component';
import {environment} from '../../../environments/environment';

declare var moxman;

@Component({
    selector: 'app-tiny-mce',
    templateUrl: './tiny-mce.component.html',
    styleUrls: ['./tiny-mce.component.scss']
})
export class TinyMceComponent implements OnInit {
    content: string;
    contentTest: string;
    moxmanUrl = environment.moxman;
    siteUrl = environment.siteUrl;

    init = {
        height: 400,
        toolbar_items_size: 'small',
        theme: 'modern',
        // font_formats: 'Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Open Sans=Open Sans,helvetica,sans-serif;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats',
        plugins: [
            'advlist autolink lists link image charmap print preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code fullscreen',
            'insertdatetime media nonbreaking save table contextmenu directionality',
            'emoticons template paste textcolor colorpicker textpattern'
        ],
        external_plugins: {
            'moxiemanager': this.moxmanUrl + '/plugin.js'
        },
        toolbar1: 'styleselect fontsizeselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent blockquote | bullist numlist ',
        toolbar2: 'cut copy paste | searchreplace | inserttime preview | forecolor backcolor | insertfile | link image | print media | emoticons | code',
        toolbar3: 'table | hr removeformat | subscript superscript | charmap | print fullscreen | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft | undo redo',
        paste_data_images: true,
        font_formats: 'Ubuntu',
        image_advtab: true,
        content_css: this.siteUrl + '/assets/css/style.css',
        init_instance_callback: () => {
            moxman.Env.baseUrl = this.moxmanUrl;
        },
        formats: {
        },
        style_formats: [
            {
                title: 'Header 2', block: 'h2', styles: {
                    'color': '#ec7123',
                    'background-color': '#ffffff',
                    'border-bottom': '1px solid #ec7123',
                    'display': 'block',
                    'width': '100%',
                    'margin': '0 -20px',
                    'box-shadow': 'none',
                    'padding': '10px 20px',
                    'font-size': '1.2em',
                    'font-family': 'Ubuntu, sans-serif'
                }
            },
            {
                title: 'Header 3', block: 'h3', styles: {
                    'border': 'none',
                    'margin-bottom': '0',
                    'width': '100%',
                    'color': '#ec7123',
                    'font-size': '1em',
                    'font-weight': 'bold',
                    'font-family': 'Ubuntu, sans-serif',
                }
            },
            {
                title: 'Header 4', block: 'h4', styles: {
                    'color': '#505151',
                    'font-family': 'Ubuntu, sans-serif',
                    'font-weight': 'bold'
                }
            },
        ]
    }

    @Input() idContenu;
    @Input() modalMail;
    @Output() emitContent = new EventEmitter<string>();

    constructor(
        private contenuMenuService: ContenuMenuService,
        private notificationService: NotificationService
    ) {
    }

    ngOnInit() {
        if (this.idContenu) {
            this.contenuMenuService.getContenuById(this.idContenu).subscribe((e) => {
                this.content = e.contenu;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.log(err);
            });
        }

        if (this.modalMail == '1') {
            this.init['toolbar2'] = '';
            this.init['toolbar3'] = '';
        }
    }

    changeContent() {
        // console.log(this.content);
        this.emitContent.emit(this.content);
    }


}
