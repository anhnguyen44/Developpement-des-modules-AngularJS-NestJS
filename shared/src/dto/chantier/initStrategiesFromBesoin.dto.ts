import { EnumSousSectionStrategie, BesoinClientLabo } from "../../..";

export class InitStrategieFromBesoinDto {
    sousSection: EnumSousSectionStrategie | null;
    idChantier: number;
    besoin: BesoinClientLabo;
}
