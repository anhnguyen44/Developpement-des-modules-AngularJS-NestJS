import { Resource, ResourceWithoutId } from './resource.model';
import { MenuDefini } from './menu-defini.model';


export interface CategorieMenuFields {
    titre: string;
    url: string;
    menu: MenuDefini;
    ordre?: number;
}

export interface ICategorieMenu extends CategorieMenuFields, ResourceWithoutId { }
export class CategorieMenu implements CategorieMenuFields, Resource {
  id: number;
  titre: string;
  url: string;
  menu: MenuDefini;
  ordre?: number;
}