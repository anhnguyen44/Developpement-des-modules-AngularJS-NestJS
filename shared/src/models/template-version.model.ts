import {ResourceWithoutId, Resource} from './resource.model';
import { EnumTypeFichier, IFichier } from '../..';

export interface TemplateVersionFields {
    fichier: IFichier;
    idFichier: number;
    typeTemplate: number;
    dateDebut: Date;
    version: number;
    isTest: boolean;
}

export interface ITemplateVersion extends TemplateVersionFields, ResourceWithoutId {}
export class TemplateVersion implements TemplateVersionFields, Resource {
    isTest: boolean;
    fichier: IFichier;
    idFichier: number;
    typeTemplate: number;
    dateDebut: Date;
    version: number;
    id: number;
}

export enum EnumTypeTemplate {
    LABO_STRATEGIE = 1,
    LABO_PROP_COMMERCIALE = 2,
    LABO_RF_METAOP = 3,
    LABO_RF_METAIR = 4,
    LABO_RF_GLOBAL = 5,
    TEST_LABO_STRATEGIE = 6,
    TEST_LABO_PROP_COMMERCIALE = 7,
    TEST_LABO_RF_METAOP = 8,
    TEST_LABO_RF_METAIR = 9,
    TEST_LABO_RF_GLOBAL = 10,
}
