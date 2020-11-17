import { ResourceWithoutId, Resource } from './resource.model';
import { EnumTypeStrategie } from './type-strategie.model';

export interface MomentObjectifFields {
    nom: string;
    code: string;
    typeStrategie: EnumTypeStrategie | null;
}

export interface IMomentObjectif extends MomentObjectifFields, ResourceWithoutId { }
export class MomentObjectif implements MomentObjectifFields, Resource {
    nom: string;
    code: string;
    id: number;
    typeStrategie: EnumTypeStrategie | null;
    selected?: boolean;
}

export enum EnumMomentObjectifs {
    UTILISATION_NORMALE_LOCAUX = 1,
    SUITE_A_INCIDENT = 2,
    AVANT_TRAVAUX_LIES_AMIANTE = 3,
    PENDANT_TRAVAUX_PRELIM_PREPA = 4,
    PENDANT_TRAVAUX_INTERV_LIES_AMIANTE = 5,
    FIN_TRAVAUX_RETRAIT_ENCAPSULAGE = 6,
    FIN_INTERVENTION_EMISSION_FIBRES = 7,
    ISSUE_TRAVAUX_RETRAIT_ENCAPSULAGE = 8
}
