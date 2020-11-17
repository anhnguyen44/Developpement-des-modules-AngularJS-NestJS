import { ITypeContactDevisCommande } from '@aleaac/shared';

export class TypeContactDevisCommande implements ITypeContactDevisCommande {
    code: string;
    id: number;
    isInterne: boolean;
    nom: string;
}
