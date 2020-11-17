import {Resource, ResourceWithoutId} from '@aleaac/shared';

interface DroitFields {
    nom: string;
    code: string;
    niveau: number;
}

export class Droit implements Resource, DroitFields {
    code: string;
    niveau: number;
    id: number;
    isInterne: boolean;
    nom: string;
}
export interface DroitWithoutId extends ResourceWithoutId, DroitFields {}
