import { Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, JoinColumn } from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import { IObjectif } from '@aleaac/shared';
import { TypeObjectif } from '../type-objectif/type-objectif.entity';
import { MomentObjectif } from '../moment-objectif/moment-objectif.entity';

@Entity()
export class Objectif implements IObjectif {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    code: string;

    @Column({ type: 'text' })
    @ApiModelProperty()
    description: string;

    @Column()
    @ApiModelProperty()
    lettre: string;

    @ManyToOne(() => TypeObjectif, { eager: true })
    @JoinColumn({ name: 'idType' })
    @ApiModelProperty()
    type: TypeObjectif;

    @Column({ nullable: true })
    @ApiModelProperty()
    idType: number;

    @ManyToOne(() => MomentObjectif, { eager: true })
    @JoinColumn({ name: 'idMomentObjectif' })
    @ApiModelProperty()
    momentObjectif: MomentObjectif;

    @Column()
    @ApiModelProperty()
    idMomentObjectif: number;

    @Column()
    @ApiModelProperty()
    isMesureOperateur: boolean;

    @Column()
    @ApiModelProperty()
    isObligatoireCOFRAC: boolean;

    @Column()
    @ApiModelProperty()
    isPeriodique: boolean;

    @Column({type: 'text'})
    @ApiModelProperty()
    conditionsApplication: string;

    @Column({type: 'text'})
    @ApiModelProperty()
    duree: string;

    @Column({type: 'text'})
    @ApiModelProperty()
    frequence: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    @ApiModelProperty()
    SAFibreParLitre: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    @ApiModelProperty()
    limiteSup: number;

    @Column({ default: true })
    @ApiModelProperty()
    hasTempsCalcule: boolean;

    @Column()
    @ApiModelProperty()
    simulationObligatoire: number; // EnumSimulationObligatoire;
}
