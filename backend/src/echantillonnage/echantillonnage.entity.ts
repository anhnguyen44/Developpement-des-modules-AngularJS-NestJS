import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { IEchantillonnage, EnumTypeMesure } from '@aleaac/shared';
import { Prelevement } from '../prelevement/prelevement.entity';
import { Objectif } from '../objectif/objectif.entity';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';
import { ProcessusZone } from '../processus-zone/processus-zone.entity';


@Entity()
export class Echantillonnage implements IEchantillonnage {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({ type: 'int' })
    @ApiModelProperty()
    typeMesure: number;

    @Column()
    @ApiModelProperty()
    code: string;

    @ManyToOne(() => Objectif, { eager: true })
    @JoinColumn({ name: 'idObjectif' })
    @ApiModelProperty()
    objectif: Objectif;

    @Column()
    @ApiModelProperty()
    idObjectif: number;

    @Column()
    @ApiModelProperty()
    frequenceParSemaine: number;

    @Column()
    @ApiModelProperty()
    nbMesures: number;

    @Column()
    @ApiModelProperty()
    nbMesuresARealiser: number;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    commentaireDifferenceMesure: string;

    @Column({ type: 'text', nullable: true })
    @ApiModelProperty()
    localisation: string | null;

    @Column({ nullable: true })
    @ApiModelProperty()
    duree: number | null;

    @Column({ nullable: true })
    @ApiModelProperty()
    dureeARealiser: number | null;


    @Column({ nullable: true })
    @ApiModelProperty()
    commentaireDifferenceDuree: string;

    @OneToMany(() => Prelevement, p => p.echantillonnage, { eager: true, cascade: true })
    prelevements: Prelevement[];

    @Column()
    @ApiModelProperty()
    isRealise: boolean;

    @Column({ type: 'text', nullable: true, default: null })
    @ApiModelProperty()
    commentaireNonRealise: string;

    @ManyToOne(() => ZoneIntervention, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idZIEch' })
    @ApiModelProperty()
    zoneIntervention: ZoneIntervention;

    @Column()
    @ApiModelProperty()
    idZIEch: number;

    @ManyToOne(() => ProcessusZone, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idProcessusZone' })
    processusZone: ProcessusZone | null;

    @Column({ nullable: true })
    @ApiModelProperty()
    idProcessusZone: number | null;
}
