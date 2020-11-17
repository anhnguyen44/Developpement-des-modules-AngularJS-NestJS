import {Resource, ResourceWithoutId} from '../../../../../shared/index';

interface UserFields {
  nom: string;
  abbrev: string;
}

export interface Civilite extends Resource, UserFields {}
export interface UserWithoutId extends ResourceWithoutId, UserFields {}
