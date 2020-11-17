import { Resource, ResourceWithoutId } from './resource.model';

import { IDroit } from './droit.model';
import { MenuDefini } from './menu-defini.model';
import { CategorieMenu } from './categorie-menu.model';
import { IFichier } from './fichier.model';


export interface ContenuMenuFields {
  /** INFORMATION DE MENU*/
  menu:MenuDefini;
  categorie: CategorieMenu;
  expression: string;
  tag: string;
  titre: string;
  libelleLien: string;
  header1: string;
  header2: string;
  intro: string;
  contenu: string;
  miniature: IFichier | null;
  idMiniature: number | null;
  ordre: number;
  metaDescription: string;
  visible: boolean;
  permission: IDroit | null;
  dateAjout: Date;
  dateMisAJour: Date | null;
}

export interface IContenuMenu extends ContenuMenuFields, ResourceWithoutId { }
export class ContenuMenu implements ContenuMenuFields, Resource {
  id: number;
  menu:MenuDefini;
  categorie: CategorieMenu;
  expression: string;
  tag: string;
  titre: string;
  libelleLien: string;
  header1: string;
  header2: string;
  intro: string;
  contenu: string;
  miniature: IFichier  | null;
  idMiniature: number | null;
  ordre: number;
  metaDescription: string;
  visible: boolean;
  permission: IDroit | null;
  dateAjout: Date;
  dateMisAJour: Date | null;
}
