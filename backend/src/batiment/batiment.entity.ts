import { Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import { IBatiment } from '@aleaac/shared';
import { TypeBatiment } from '../type-batiment/type-batiment.entity';
import { Fichier } from '../fichier/fichier.entity';
import { SitePrelevement } from '../site-prelevement/site-prelevement.entity';

@Entity()
export class Batiment implements IBatiment {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column({ type: 'text' })
    @ApiModelProperty()
    description: string;

    @ApiModelProperty()
    plans: Fichier[]; // !!! On ne peut pas mettre de FK car c'est géré par service Fichier

    @ManyToOne(type => TypeBatiment, { eager: true })
    @JoinColumn({name: 'idTypeBatiment'})
    @ApiModelProperty()
    typeBatiment: TypeBatiment;

    @Column()
    @ApiModelProperty()
    idTypeBatiment: number;

    @ManyToOne(type => SitePrelevement, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({name: 'idSitePrelevement'})
    @ApiModelProperty()
    sitePrelevement: SitePrelevement;

    @Column()
    @ApiModelProperty()
    idSitePrelevement: number;
}
