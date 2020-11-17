import {ResourceWithoutId, Resource} from './resource.model';



export interface IDroit extends ResourceWithoutId {
    id?: number;
    nom: string;
    code: string;
    niveau: number;
}

