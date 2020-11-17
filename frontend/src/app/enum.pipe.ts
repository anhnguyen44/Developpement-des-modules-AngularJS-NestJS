import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enum'
})
export class EnumPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    switch (value) {
        case 'SAISIE':
            return 'Saisie';
        case 'VALIDE':
            return 'Valide';
        case 'DEPART_TERRAIN':
            return 'Départ terrain';
        case 'RETOUR_TERRAIN':
            return 'Retour terrain';
        case 'TERMINE':
            return 'Terminé';
        case 'EN_ATTENTE':
            return 'En attente';
        case 'PLANIFIE':
            return 'Planifié';
        case 'ABANDONNE':
            return 'Abandonné';
        case 'NON_EFFECTUE':
            return 'Non effectué';
        case 'POSE':
            return 'Posé';
        case 'PRELEVE':
            return 'prélevé';
        case 'ATTENTE_ENVOI_ANALYSE':
            return 'Attente envoi analyse';
        case 'ANALYSE_ENVOYEE':
            return 'Analyse envoyée';
        case 'RETOUR_ANALYSE':
            return 'Retour analyse';
        case 'PV_ENVOYE':
            return 'PV envoyé';
        case 'ENVIRONNEMENTALE':
          return 'Enviro';
        case 'META_OP':
          return 'Meta OP';
        case 'INDIVIDUELLE':
          return 'Meta OP';
        case 'LABO':
          return 'Labo';
        case 'LIBRE':
          return 'Libre';
        case 'FORMATION':
          return 'Formation';
        case 'CONSEIL':
          return 'Conseil';
        case 'BIM':
          return 'BIM';
        case 'CONTROLES':
          return 'Contrôles';
        case 'DEBOUT':
            return 'Debout';
        case 'ASSIS':
            return 'Assis';
        case 'ALLONGE':
            return 'Allongé';
        case 'AUTRE':
            return 'Autre';
        default:
          return value;
    }
  }

}
