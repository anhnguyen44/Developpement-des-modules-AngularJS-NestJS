import {ResourceWithoutId, Resource} from './resource.model';
import { IDroit } from './droit.model';

export interface MotifAbandonCommandeFields {
    nom: string;
    isSuppression: boolean;
}

export interface IMotifAbandonCommande extends MotifAbandonCommandeFields, ResourceWithoutId {}
export class MotifAbandonCommande implements MotifAbandonCommandeFields, Resource {
    nom: string;
    isSuppression: boolean;
    id: number;
}

export enum motifsAbandonCommandes {
    ANNULATION_CLIENT_MEILLEURE_OFFRE = 1,
    ANNULATION_CLIENT_AUTRE = 2,
    ANNULATION_CABINET = 3,
    ERREUR_SAISIE_COORD_CLIENT = 4,
    ERREUR_PASSAGE_CMD = 5,
    TEST = 6,
    DOUBLON = 7,
    AUTRE = 8
}
