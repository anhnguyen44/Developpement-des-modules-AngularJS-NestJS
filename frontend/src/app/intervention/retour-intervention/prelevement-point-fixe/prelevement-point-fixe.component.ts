import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {EnumExpositionAir, EnumExpositionChocs, EnumPluie, EnumStatutPrelevement} from '@aleaac/shared';
import {Prelevement} from '../../../processus/Prelevement';
import {Filtre} from '../../../logistique/Filtre';
import {Pompe} from '../../../logistique/Pompe';
import {AffectationPrelevement} from '../../../prelevement/AffectationPrelevement';

@Component({
  selector: 'app-prelevement-point-fixe',
  templateUrl: './prelevement-point-fixe.component.html',
  styleUrls: ['./prelevement-point-fixe.component.scss']
})
export class PrelevementPointFixeComponent implements OnInit, OnChanges {
  @Input() prelevement: Prelevement;
  @Input() filtres: Filtre[];
  @Input() pompes: Pompe[];
  @Input() isEditable: boolean;
  @Output() emitPrelevement = new EventEmitter<Prelevement>();
  enumStatutPrelevement = EnumStatutPrelevement;
  enumExpositionAir = EnumExpositionAir;
  enumExpositionChocs = EnumExpositionChocs;
  localisation: string;
  enumPluie = EnumPluie;

  constructor() { }

  ngOnInit() {
    if (!this.prelevement.affectationsPrelevement || this.prelevement.affectationsPrelevement.length === 0) {
      this.prelevement.affectationsPrelevement = [];
      this.prelevement.affectationsPrelevement.push(new AffectationPrelevement());
    }
  }

  ngOnChanges() {
      if ((!this.prelevement.affectationsPrelevement || this.prelevement.affectationsPrelevement.length === 0)
          && this.prelevement.idStatutPrelevement !== this.enumStatutPrelevement.NON_EFFECTUE) {
          this.prelevement.affectationsPrelevement = [];
          this.prelevement.affectationsPrelevement.push(new AffectationPrelevement());
      }
      if (!this.prelevement.localisation) {
          this.prelevement.localisation = '';
          this.prelevement.localisation += 'zone : ' + this.prelevement.zoneIntervention.libelle;
          if (this.prelevement.zoneIntervention.batiment) {
              this.prelevement.localisation += 'batiment : ' + this.prelevement.zoneIntervention.batiment.nom;
              if (this.prelevement.zoneIntervention.batiment.description) {
                  this.prelevement.localisation += '\n : ' + this.prelevement.zoneIntervention.batiment.description;
              }
          }
      }
  }

    parseDateHeureDebut(affectationPrelevement: AffectationPrelevement) {
        if (affectationPrelevement.heureDebut && affectationPrelevement.dateDebut) {
            affectationPrelevement.dateHeureDebut = new Date(affectationPrelevement.dateDebut + ' ' + affectationPrelevement.heureDebut);
        } else {
            affectationPrelevement.dateHeureDebut = null;
        }
        this.checkPrelevement();
    }

    parseDateHeureFin(affectationPrelevement: AffectationPrelevement) {
        if (affectationPrelevement.heureFin && affectationPrelevement.dateFin) {
            affectationPrelevement.dateHeureFin = new Date(affectationPrelevement.dateFin + ' ' + affectationPrelevement.heureFin);
        } else {
            affectationPrelevement.dateHeureFin = null;
        }
        this.checkPrelevement();
    }

    changeFiltre(affectationPrelevement: AffectationPrelevement, filtre: Filtre) {
        affectationPrelevement.idFiltre = filtre.id;
        this.checkPrelevement();
    }

    changePompe(affectationPrelevement: AffectationPrelevement, pompe: Pompe) {
        affectationPrelevement.idPompe = pompe.id;
        this.checkPrelevement();
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

    checkPrelevement() {
        this.emitPrelevement.emit(this.prelevement);
    }

}
