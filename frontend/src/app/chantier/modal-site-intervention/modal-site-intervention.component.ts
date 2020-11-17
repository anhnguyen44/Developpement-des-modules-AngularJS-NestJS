import { Component, EventEmitter, Input, OnInit, Output, HostListener, ElementRef } from '@angular/core';
import { Compte } from '../../contact/Compte';
import { Contact } from '../../contact/Contact';
import { ContactService } from '../../contact/contact.service';
import { CompteService } from '../../contact/compte.service';
import {fadeIn, fadeOut} from '../../resource/animation';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { NotificationService } from '../../notification/notification.service';
import { SitePrelevement } from '@aleaac/shared';

@Component({
  selector: 'app-modal-site-intervention',
  templateUrl: './modal-site-intervention.component.html',
  styleUrls: ['./modal-site-intervention.component.scss'],
  animations: [fadeIn, fadeOut]
})
export class ModalSiteInterventionComponent implements OnInit {
  @Input() modalSiteIntervention: boolean = false;
  @Input() isOnlyCreate: boolean = false;
  @Input() siteInterv: SitePrelevement;
  @Input() for: string = '';
  @Input() queryBuildContact: QueryBuild = new QueryBuild();
  @Output() emitSiteIntervention = new EventEmitter<SitePrelevement>();
  @Output() emitClose = new EventEmitter();

  constructor(
    private contactService: ContactService,
    private compteService: CompteService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    console.log('isOnlyCreate', this.isOnlyCreate);
  }

  setSiteIntervention(siteIntervention) {
    this.siteInterv = siteIntervention;
    this.emitSiteIntervention.emit(siteIntervention);
  }

  close(event) {
    if (!event || !event.srcElement || (event.srcElement!.classList[0] !== 'link' && event.srcElement!.classList[0] !== 'sub'))  {
      this.emitClose.emit(event);
    }
  }

  setCreateMode(event) {
    const test = this.isOnlyCreate;
    event.preventDefault();
    event.stopPropagation();
    this.for = 'create';
    this.isOnlyCreate = test;
  }

  setSelectMode(event) {
    const test = this.isOnlyCreate;
    event.preventDefault();
    event.stopPropagation();
    this.for = 'select';
    this.isOnlyCreate = test;
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.emitClose.emit();
  }
}
