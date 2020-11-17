import { ResourceWithoutId, Resource } from "./resource.model";

export interface FonctionFields {
    nom: string
}


export interface IFonction extends FonctionFields, ResourceWithoutId {}
export class Fonction implements FonctionFields, Resource {
    nom: string;    
    id: number;
}