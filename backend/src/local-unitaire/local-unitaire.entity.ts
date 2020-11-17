import { Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import {
    ILocalUnitaire, EnumTypeLocal
} from '@aleaac/shared';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';

@Entity()
export class LocalUnitaire implements ILocalUnitaire {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({ type: 'int' })
    @ApiModelProperty()
    type: number;

    @Column({ default: null, nullable: true })
    @ApiModelProperty({ description: 'Utilisé pour S<10m² ou S<=100m² && L<=15m' })
    nombre: number | null; // Utilisé pour S<10m² ou S<=100m² && L<=15m

    @Column({ default: null, nullable: true })
    @ApiModelProperty({ description: 'Utilisé pour S<=100m² && L>15m' })
    longueur: number | null; // Utilisé pour S<=100m² && L>15m

    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    largeur: number | null; // Utilisé pour cage d'escalier

    @Column({ default: null, nullable: true })
    @ApiModelProperty({ description: 'Utilisé pour S>100m², les groupements et les cages d\'escalier' })
    surface: number | null; // Utilisé pour S>100m², les groupements et les cages d'escalier

    @Column({ default: null, nullable: true })
    @ApiModelProperty({ description: 'Utilisé pour les groupements' })
    idParent: number | null; // Utilisé pour les groupements

    @Column({ default: null, nullable: true })
    @ApiModelProperty({ description: 'Utilisé pour les groupements, un groupement est un maximum de 4 locaux pour un maximum de 100m²' })
    nom: string; // Utilisé pour les groupements, un groupement est un maximum de 4 locaux pour un maximum de 100m²

    @Column({ default: null, nullable: true })
    @ApiModelProperty({ description: 'Utilisé pour les cages d\'escalier' })
    nbNiveaux: number | null; // Utilisé pour les cages d'escalier

    @ManyToOne(() => ZoneIntervention, l => l.locaux, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'idZILocal' })
    @ApiModelProperty()
    zoneIntervention: ZoneIntervention;

    @Column()
    @ApiModelProperty()
    idZILocal: number;

    @Column({ default: null, nullable: true })
    @ApiModelProperty({ description: 'Utilisé pour le rapport de stratégie' })
    nbPU: number | null; // Ca permet de séparer par ligne le nombre de PU
}
