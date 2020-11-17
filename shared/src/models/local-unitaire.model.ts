import { ResourceWithoutId, Resource } from './resource.model';
import { EnumTypeLocal } from './type-local.model';
import { ZoneIntervention } from './zone-intervention.model';

export interface LocalUnitaireFields {
    type: EnumTypeLocal;
    nombre: number | null; // Utilisé pour S<10m² ou S<=100m² && L<=15m
    longueur: number | null; // Utilisé pour S<=100m² && L>15m
    largeur: number | null; // Utilisé pour cage d'escalier
    surface: number | null;  // Utilisé pour S>100m², les groupements et les cages d'escalier
    idParent: number | null; // Utilisé pour les groupements
    nom: string; // Utilisé pour les groupements, un groupement est un maximum de 4 locaux pour un maximum de 100m²
    nbNiveaux: number | null; // Utilisé pour les cages d'escalier

    zoneIntervention: ZoneIntervention;
    idZILocal: number;
}

export interface ILocalUnitaire extends LocalUnitaireFields, ResourceWithoutId { }
export class LocalUnitaire implements LocalUnitaireFields, Resource {
    zoneIntervention: ZoneIntervention;
    idZILocal: number;
    type: EnumTypeLocal;
    nombre: number | null;
    longueur: number | null;
    surface: number | null;
    idParent: number | null;
    nom: string;
    nbNiveaux: number | null;
    id: number;

    largeur: number | null; // Utilisé pour cage d'escalier
}
