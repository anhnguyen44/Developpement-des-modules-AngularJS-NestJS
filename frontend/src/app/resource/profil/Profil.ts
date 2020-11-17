import {Resource, ResourceWithoutId} from '@aleaac/shared';

interface ProfileFields {
  nom: string;
  isVisibleFranchise: boolean;
  isInterne: boolean;
}

export class Profil implements Resource, ProfileFields {
  nom: string;
  isVisibleFranchise: boolean;
  id: number;
  isInterne: boolean;
}
export interface IProfil extends ResourceWithoutId, ProfileFields {}
