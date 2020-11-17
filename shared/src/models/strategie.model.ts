import { ResourceWithoutId, Resource } from './resource.model';
import { EnumSousSectionStrategie, EnumStatutStrategie, ZoneIntervention, EnumTypeStrategie, Chantier } from '../..';
import { MomentObjectif } from './moment-objectif.model';

export interface StrategieFields {
    reference: string;
    sousSection: EnumSousSectionStrategie | null; // Null en CSP
    version: number;
    isCOFRAC: boolean;

    statut: EnumStatutStrategie;

    zonesIntervention: ZoneIntervention[];
    typeStrategie: EnumTypeStrategie;

    chantier: Chantier;
    idChantier: number;

    moments: MomentObjectif[];
    generated: boolean;
    description: string;
}

export interface IStrategie extends StrategieFields, ResourceWithoutId { }
export class Strategie implements StrategieFields, Resource {
    moments: MomentObjectif[];
    chantier: Chantier;
    idChantier: number;
    reference: string;
    sousSection: EnumSousSectionStrategie | null;
    version: number;
    isCOFRAC: boolean;
    statut: EnumStatutStrategie;
    zonesIntervention: ZoneIntervention[];
    id: number;
    typeStrategie: EnumTypeStrategie;
    generated: boolean;
    description: string;
}
