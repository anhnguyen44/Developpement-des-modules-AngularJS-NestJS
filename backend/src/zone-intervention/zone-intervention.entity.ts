import { Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { ApiModelProperty, ApiPayloadTooLargeResponse } from '@nestjs/swagger';
import {
    IZoneIntervention, EnumTypeZoneIntervention, EnumStatutOccupationZone,
    EnumSequencage, EnumEnvironnement, EnumConfinement, EnumMilieu
} from '@aleaac/shared';
import { Batiment } from '../batiment/batiment.entity';
import { HorairesOccupationLocaux } from '../horaires-occupation/horaires-occupation.entity';
import { LocalUnitaire } from '../local-unitaire/local-unitaire.entity';
import { GES } from '../ges/ges.entity';
import { ProcessusZone } from '../processus-zone/processus-zone.entity';
import { Echantillonnage } from '../echantillonnage/echantillonnage.entity';
import { Strategie } from '../strategie/strategie.entity';
import { MateriauZone } from '../materiau-zone/materiau-zone.entity';
import { Environnement } from '../environnement/environnement.entity';
import { Fichier } from '../fichier/fichier.entity';

@Entity()
export class ZoneIntervention implements IZoneIntervention {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    reference: string;

    @Column({ type: 'int' })
    @ApiModelProperty()
    type: number;

    @Column()
    @ApiModelProperty()
    libelle: string;

    @Column({ type: 'text' })
    @ApiModelProperty()
    descriptif: string;

    @Column({ type: 'int' })
    @ApiModelProperty()
    statut: number;

    @ManyToOne(() => Batiment, { eager: true, nullable: true })
    @JoinColumn({ name: 'idBatiment' })
    @ApiModelProperty()
    batiment: Batiment | null;

    @Column({ nullable: true })
    @ApiModelProperty()
    idBatiment: number | null;

    @OneToMany(() => HorairesOccupationLocaux, h => h.zoneIntervention, { eager: true })
    @JoinTable({ name: 'horaires_zone' })
    horaires: HorairesOccupationLocaux[];

    @Column()
    @ApiModelProperty()
    isZoneDefinieAlea: boolean;

    @Column()
    @ApiModelProperty()
    isSousAccreditation: boolean;

    @Column({ type: 'text' })
    @ApiModelProperty()
    commentaire: string;

    @OneToMany(() => MateriauZone, mz => mz.zoneIntervention)
    materiauxZone: MateriauZone[];

    @OneToMany(() => LocalUnitaire, lu => lu.zoneIntervention, { eager: true })
    locaux: LocalUnitaire[];

    @Column({default: 0})
    @ApiModelProperty()
    nbPiecesUnitaires: number;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    nbPrelevementsCalcul: number;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    nbPrelevementsARealiser: number;

    @Column({ type: 'text', default: null, nullable: true })
    @ApiModelProperty()
    commentaireDifferenceNbPrelevements: string;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    dureeMinPrelevement: number;

    @Column({ type: 'int', default: null, nullable: true })
    @ApiModelProperty()
    sequencage: number;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    repartition: string;

    @Column({ type: 'text', nullable: true, default: null })
    @ApiModelProperty()
    precisionsRepartition: string;

    @OneToMany(() => ProcessusZone, pz => pz.zoneIntervention, { eager: true })
    processusZone: ProcessusZone[];

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    stationMeteo: string;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    dureeTraitementEnSemaines: number;

    @ManyToMany(() => Environnement, { nullable: true, eager: true, cascade: true })
    @JoinTable({ name: 'zone_environnement' })
    @ApiModelProperty()
    environnements: Environnement[];

    @Column({ type: 'int', default: null, nullable: true })
    @ApiModelProperty()
    confinement: number;

    @OneToMany(() => GES, g => g.zoneIntervention, { eager: true })
    listeGES: GES[];

    @OneToMany(() => Echantillonnage, e => e.zoneIntervention, { eager: true })
    echantillonnages: Echantillonnage[];

    @ManyToOne(() => Strategie, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idStrategie' })
    strategie: Strategie;

    @Column()
    @ApiModelProperty()
    idStrategie: number;

    @ManyToOne(() => Fichier, { nullable: true, eager: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'idPIC' })
    PIC: Fichier | null;

    @Column({ nullable: true })
    @ApiModelProperty()
    idPIC: number | null;

    @Column({ default: false, comment: 'Si la zone fait moins de 10m² on a pas de calculs à faire' })
    @ApiModelProperty()
    isZoneInf10: boolean;

    @Column({nullable: true, default: null})
    @ApiModelProperty()
    isExterieur: boolean;


    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    nbGrpExtracteurs: number | null;

    @Column({ type: 'int', nullable: true })
    @ApiModelProperty()
    milieu: number | null;

    @Column()
    @ApiModelProperty()
    conditions: string; // Circulation Air suffisante/Insuffisante

    // NE PAS UTILISER, UN BUG DE TYPEORM NOUS OBLIGE A LE METTRE
    @Column({ nullable: true, comment: 'Ne pas utiliser mais TypeORM bug sans cette colonne' })
    zoneInterventionId: number | null;

    // Infos complémentaires, moved from MateriauZone
    @Column({ type: 'int', nullable: true })
    @ApiModelProperty()
    densiteOccupationTheorique: number | null;

    @Column({ type: 'int', nullable: true })
    @ApiModelProperty()
    typeActivite: number | null;

    @Column({ type: 'text', nullable: true })
    @ApiModelProperty()
    commentaireOccupation: string;

    @Column({ type: 'int', nullable: true })
    @ApiModelProperty()
    expositionAir: number | null;

    @Column({ type: 'int', nullable: true })
    @ApiModelProperty()
    expositionChocs: number | null;

    @Column({ type: 'text', nullable: true })
    @ApiModelProperty()
    commentaireExpositionAirChocs: string;

    @Column({ type: 'text', nullable: true })
    @ApiModelProperty()
    repartitionPrelevements: string;

    @Column({ type: 'text', nullable: true })
    @ApiModelProperty()
    autreActivite: string;  // si typeActivite == Autre, on remplit ça
}
