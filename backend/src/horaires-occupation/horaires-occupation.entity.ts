import { Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import {
    IHorairesOccupationLocaux
} from '@aleaac/shared';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';


@Entity()
export class HorairesOccupationLocaux implements IHorairesOccupationLocaux {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @ManyToOne(() => ZoneIntervention, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idZIHoraires' })
    @ApiModelProperty()
    zoneIntervention: ZoneIntervention;

    @Column()
    @ApiModelProperty()
    idZIHoraires: number;

    @Column({ type: 'time' })
    @ApiModelProperty()
    heureDebut: Date;

    @Column({ type: 'time' })
    @ApiModelProperty()
    heureFin: Date;

    @Column()
    @ApiModelProperty({ description: '0 à 6'})
    jour: number;

    @Column()
    @ApiModelProperty()
    isOccupe: boolean;
}
