import {ResourceWithoutId, Resource} from './resource.model';

export interface CodePostalFields {
    numCP: string;
    nomCommune: string;
    nomDepartement: string;
    numDepartement: string;
    latitude: string;
    longitude: string;
    nomGeofla: string;
    cpGeofla: string;
}

export interface ICodePostal extends CodePostalFields, ResourceWithoutId {}
export class CodePostal implements CodePostalFields, Resource {
    numCP: string;
    nomCommune: string;
    nomDepartement: string;
    numDepartement: string;
    latitude: string;
    longitude: string;
    nomGeofla: string;
    cpGeofla: string;
    cpVille: string
    id: number;
    constructor() {
        this.cpVille = this.numCP + ' ' + this.nomCommune;
    }
}
