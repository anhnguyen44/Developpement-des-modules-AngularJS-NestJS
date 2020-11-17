import { Resource, ResourceWithoutId } from './resource.model';
import { Profil } from './profil.model';
import { CMenuProfil } from './menu-profil.model';
import { CMenuDroit } from './menu-droit.model';
import { TypeMenu } from './type-menu.model';
import { IDroit } from './droit.model';

export interface MenuDefiniFields {
  /** INFORMATION DE MENU*/
  type: TypeMenu;
  titre: string;
  name?: string;
  url: string;
  icone: string;
  ordreContenuAlpha?: boolean;
  ordreMenu?: number;
  visible?: boolean;
  recherche?: boolean;
  menuParent?: MenuDefini;
  sousTitre?: string;
  
  /** DROITS--PERMISSION */
  droitsForMenu: IDroit | null;

}

export interface IMenuDefini extends MenuDefiniFields, ResourceWithoutId { }
export class MenuDefini implements MenuDefiniFields, Resource {
  id: number;
  type: TypeMenu;
  name?: string;
  titre:string;
  url:string;
  icone: string;
  ordreContenuAlpha?:boolean;
  ordreMenu?: number;
  visible?: boolean;
  recherche?: boolean
  sousTitre?: string;
  menuParent?: MenuDefini | undefined; // undefined est à dire que l'on peut laisser le champ de menuParent vide
  droitsForMenu: IDroit | null;

}
