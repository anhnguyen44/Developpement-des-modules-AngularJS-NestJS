import { IFichier } from '@aleaac/shared';
import { TypeFichier } from '../../superadmin/typefichier/type-fichier/TypeFichier';

export class Fichier implements IFichier {
    application: string;
    date: Date;
    extention: string;
    id: number;
    idParent: number;
    idUtilisateur: number;
    nom: string;
    keyDL: string;
    file: any;
    idTypeFichier: number;
    typeFichier: TypeFichier;
    commentaire?: string;
}
