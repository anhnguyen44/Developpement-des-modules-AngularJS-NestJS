import {IAdresse} from '@aleaac/shared';

export class Adresse implements IAdresse {
    fax: string;
    latitude: number;
    longitude: number;
    adresse: string;
    complement: any;
    cp: string;
    id: number;
    ville: string;
    email: any;
    telephone: any;
}
