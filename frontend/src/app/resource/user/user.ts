import {Resource, ResourceWithoutId} from '@aleaac/shared';

interface UserFields {
  login: string;
  prenom: string;
  nom: string;
}

export class User implements Resource, UserFields {
  id: number;
  login: string;
  prenom: string;
  nom: string;
}
export interface UserWithoutId extends ResourceWithoutId, UserFields {}
