import { ModalAbandonCommandeDto, MotifAbandonCommande } from '@aleaac/shared';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '../../notification/notification.service';
import { Franchise } from '../../resource/franchise/franchise';
import { MotifAbandonCommandeService } from '../../resource/motif-abandon-commande/motif-abandon-commande.service';

@Component({
  selector: 'app-modal-abandon-chantier',
  templateUrl: './modal-abandon.component.html',
  styleUrls: ['./modal-abandon.component.scss']
})
export class ModalAbandonChantierComponent implements OnInit {
  @Input() infos: ModalAbandonCommandeDto;
  @Output() emitRaison = new EventEmitter<ModalAbandonCommandeDto>();
  @Output() emitClose = new EventEmitter();
  listeMotifs: MotifAbandonCommande[];

  rechercheString: string;
  franchise: Franchise;
  loading: boolean;
  constructor(
    private notificationService: NotificationService,
    private motifAbandonCommandeService: MotifAbandonCommandeService
  ) { }

  ngOnInit() {
    this.motifAbandonCommandeService.getAllMotifAbandonCommande().subscribe(data => {
      this.listeMotifs = data;
      this.infos.motif = data[0];
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.error(err);
    });
  }

  close() {
    this.emitClose.emit();
  }

  onSubmit() {
    this.emitRaison.emit(this.infos);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.close();
  }
}
