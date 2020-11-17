import { ModalAbandonCommandeDto, MotifAbandonCommande } from '@aleaac/shared';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '../../notification/notification.service';
import { Franchise } from '../../resource/franchise/franchise';
import { MotifAbandonCommandeService } from '../../resource/motif-abandon-commande/motif-abandon-commande.service';
import { HorairesOccupationLocaux } from '@aleaac/shared';

@Component({
  selector: 'app-modal-horaires-zone',
  templateUrl: './modal-horaires.component.html',
  styleUrls: ['./modal-horaires.component.scss']
})
export class ModalHorairesZoneComponent implements OnInit {
  @Input() horairesZone: HorairesOccupationLocaux[];
  @Input() idZone: number;
  @Input() canEdit: boolean = true;
  @Output() emitHoraires = new EventEmitter<HorairesOccupationLocaux[]>();
  @Output() emitClose = new EventEmitter();

  rechercheString: string;
  franchise: Franchise;
  loading: boolean;
  constructor(
    private notificationService: NotificationService,
    private motifAbandonCommandeService: MotifAbandonCommandeService
  ) { }

  ngOnInit() {
    if (!this.horairesZone || this.horairesZone.length === 0) {
      if (this.idZone) {
        this.horairesZone = [
          new HorairesOccupationLocaux(this.idZone, 0),
          new HorairesOccupationLocaux(this.idZone, 1),
          new HorairesOccupationLocaux(this.idZone, 2),
          new HorairesOccupationLocaux(this.idZone, 3),
          new HorairesOccupationLocaux(this.idZone, 4),
          new HorairesOccupationLocaux(this.idZone, 5),
        ];
      } else {
        console.error('Il manque un idZone pour la modal horaires.');
      }
    }
  }

  close() {
    this.emitClose.emit();
  }

  onSubmit() {
    this.emitHoraires.emit(this.horairesZone);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.close();
  }
}
