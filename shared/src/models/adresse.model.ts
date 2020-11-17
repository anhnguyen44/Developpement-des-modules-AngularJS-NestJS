export interface IAdresse {

    id: number,
    adresse: string,
    complement?: string | null,
    cp: string,
    ville: string,
    email: string,
    telephone: string,
    fax: string,
    latitude: number,
    longitude: number
}


export class Adresse implements IAdresse {
    latitude: number;
    longitude: number;

    id: number;
    adresse: string;
    complement?: string | null;
    cp: string;
    ville: string;
    email: string;
    telephone: string;
    fax: string;
}
