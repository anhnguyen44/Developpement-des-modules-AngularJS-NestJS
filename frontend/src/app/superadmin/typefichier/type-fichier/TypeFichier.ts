import {ITypeFichier, TypeFichierGroupe} from '@aleaac/shared';

export class TypeFichier implements ITypeFichier {
    groupe: TypeFichierGroupe | null;
    idGroupe: number | null;
    id: number;
    nom: string;
    affectable: boolean;
}
