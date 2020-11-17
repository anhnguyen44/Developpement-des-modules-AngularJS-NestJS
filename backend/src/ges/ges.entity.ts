import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { IGES } from '@aleaac/shared';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';
import { TacheProcessus } from '../tache-processus/tache-processus.entity';
import { EnumPhaseOperationnelle } from '@aleaac/shared/src/models/ges.model';


@Entity()
export class GES implements IGES {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    description: string;

    @ManyToOne(() => ZoneIntervention, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idZoneIntervention' })
    @ApiModelProperty()
    zoneIntervention: ZoneIntervention;

    @Column()
    @ApiModelProperty()
    idZoneIntervention: number;

    @Column()
    @ApiModelProperty()
    nbPompes: number;

    @Column()
    @ApiModelProperty()
    nbFiltres: number;

    @Column()
    @ApiModelProperty()
    nbOperateursTerrain: number;

    @ManyToMany(() => TacheProcessus, { eager: true, cascade: true, onUpdate: 'CASCADE' })
    @JoinTable({ name: 'tache_processus_zone' })
    taches: TacheProcessus[];

    @Column({ type: 'int' })
    @ApiModelProperty()
    phaseOperationnelle: number;
}
