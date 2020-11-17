import {
    Entity,
    ManyToOne,
    Column,
    OneToMany,
    PrimaryGeneratedColumn, JoinColumn, ManyToMany, JoinTable
} from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import { IProcessusZone, EnumTypeDeChantier } from '@aleaac/shared';
import { Processus } from '../processus/processus.entity';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';
import { GES } from '../ges/ges.entity';
import { Prelevement } from '../prelevement/prelevement.entity';


@Entity()
export class ProcessusZone implements IProcessusZone {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @ManyToOne(() => Processus, { eager: true })
    @JoinColumn({ name: 'idProcessus' })
    @ApiModelProperty()
    processus: Processus;

    @Column()
    @ApiModelProperty()
    idProcessus: number;

    @ManyToOne(() => ZoneIntervention, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idZoneIntervention' })
    @ApiModelProperty()
    zoneIntervention: ZoneIntervention;

    @OneToMany(type => Prelevement, prelevement => prelevement.processusZone)
    @ApiModelProperty()
    prelevements: Prelevement[];

    @Column()
    @ApiModelProperty()
    idZoneIntervention: number;

    @Column({ type: 'int' })
    @ApiModelProperty()
    typeChantier: number | null; // Null si c'est une ZH (et pas une ZT)

    @Column()
    @ApiModelProperty()
    nombreVacationsJour: number; // Ca devient le nombre de *séquences*

    @Column()
    @ApiModelProperty()
    idEmpoussierementGeneralAttendu: number;

    @Column()
    @ApiModelProperty()
    idAppareilsProtectionRespiratoire: number;

    @Column()
    @ApiModelProperty()
    nombreOperateurs: number;

    @ManyToMany(() => GES, { eager: true, cascade: true, onUpdate: 'CASCADE' })
    @JoinTable({ name: 'ges_processus_zone' })
    listeGES: GES[]; // Maintenant on n'en a plus qu'une, pffff

    @Column()
    @ApiModelProperty()
    tsatP: number;

    @Column()
    @ApiModelProperty()
    tr: number;

    @Column()
    @ApiModelProperty()
    nombreJours: number;

    @Column()
    @ApiModelProperty()
    dureeSequence: number;

    @Column()
    @ApiModelProperty()
    typeAnalyse: number; // EnumTypeAnalysePrelevement
}
