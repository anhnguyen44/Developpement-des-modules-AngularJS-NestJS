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
import { IStrategie, EnumSousSectionStrategie, EnumStatutStrategie, EnumTypeStrategie } from '@aleaac/shared';
import { Chantier } from '../chantier/chantier.entity';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';
import { MomentObjectif } from '../moment-objectif/moment-objectif.entity';


@Entity()
export class Strategie implements IStrategie {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    reference: string;

    @Column({ type: 'int', nullable: true })
    @ApiModelProperty()
    sousSection: number | null; // Null en CSP

    @Column()
    @ApiModelProperty()
    version: number;

    @Column()
    @ApiModelProperty()
    isCOFRAC: boolean;

    @Column({ type: 'int' })
    @ApiModelProperty()
    statut: number;

    @OneToMany(() => ZoneIntervention, zi => zi.strategie, { eager: true })
    zonesIntervention: ZoneIntervention[];

    @Column({ type: 'int', nullable: true })
    @ApiModelProperty()
    typeStrategie: number;

    @ManyToOne(() => Chantier, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idChantier' })
    @ApiModelProperty()
    chantier: Chantier;

    @Column()
    @ApiModelProperty()
    idChantier: number;

    @ManyToMany(() => MomentObjectif, { eager: true })
    @JoinTable({ name: 'moments_strategie' })
    moments: MomentObjectif[];

    @Column({ default: false })
    @ApiModelProperty()
    generated: boolean;

    @Column({ type: 'text' })
    @ApiModelProperty()
    description: string;
}
