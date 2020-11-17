import {AfterViewChecked, Component, EventEmitter, Input, OnChanges, OnInit, Output, HostListener} from '@angular/core';
import {EnumTypeDevis, Produit, TypeGrilles, MotifAbandonCommande} from '@aleaac/shared';
import {TypeGrilleService} from '../../resource/grille-tarif/type-grille.service';
import {GrilleTarif} from '../../resource/grille-tarif/GrilleTarif';
import {GrilleTarifService} from '../../resource/grille-tarif/grille-tarif.service';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {Franchise} from '../../resource/franchise/franchise';
import {TarifDetailService} from '../../resource/tarif-detail/tarif-detail.service';
import {TarifDetail} from '../../resource/tarif-detail/TarifDetail';
import { DevisCommande } from '../DevisCommande';
import { ModalAbandonCommandeDto } from '@aleaac/shared';
import { motifsAbandonCommandes } from '@aleaac/shared/src/models/motif-abandon-commande.model';
import { MotifAbandonCommandeService } from '../../resource/motif-abandon-commande/motif-abandon-commande.service';
import { NotificationService } from '../../notification/notification.service';

@Component({
  selector: 'app-modal-abandon-commande',
  templateUrl: './modal-abandon.component.html',
  styleUrls: ['./modal-abandon.component.scss']
})
export class ModalAbandonCommandeComponent implements OnInit {
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
