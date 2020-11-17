import { ResourceWithoutId, Resource } from './resource.model';
import { ZoneIntervention } from './zone-intervention.model';

export interface HorairesOccupationLocauxFields {
    zoneIntervention: ZoneIntervention;
    idZIHoraires: number;
    heureDebut: Date; // 'time' en bdd
    heureFin: Date; // 'time' en bdd
    jour: number; // 0 à 6
    isOccupe: boolean;
}

export interface IHorairesOccupationLocaux extends HorairesOccupationLocauxFields, ResourceWithoutId { }
export class HorairesOccupationLocaux implements HorairesOccupationLocauxFields, Resource {
    
    constructor (idZone: number, jour: number) {
        this.idZIHoraires = idZone;
        this.jour = jour;
    }
    
    zoneIntervention: ZoneIntervention;
    idZIHoraires: number;
    heureDebut: Date;
    heureFin: Date;
    jour: number;
    isOccupe: boolean;
    id: number;
}
