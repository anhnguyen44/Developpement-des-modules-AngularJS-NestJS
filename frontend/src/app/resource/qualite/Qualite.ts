import {Resource, ResourceWithoutId} from '@aleaac/shared';

interface QualiteFields {
  nom: string;
  isInterne: boolean;
}

export class Qualite implements Resource, QualiteFields {
    id: number;
    isInterne: boolean;
    nom: string;
}
export interface QualiteWithoutId extends ResourceWithoutId, QualiteFields {}
