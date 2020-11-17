import { Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import { IInfosBesoinClientLabo, EnumTypeBesoinLabo } from '@aleaac/shared';
import { Adresse } from '../adresse/adresse.entity';
import { Objectif } from '../objectif/objectif.entity';
import { Fichier } from '../fichier/fichier.entity';
import { BesoinClientLabo } from '../besoin-client-labo/besoin-client-labo.entity';

@Entity()
export class InfosBesoinClientLabo implements IInfosBesoinClientLabo {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    libelle: string;

    @Column()
    @ApiModelProperty()
    contenu: string;

    @Column()
    @ApiModelProperty()
    informateur: string;

    @ManyToOne(() => BesoinClientLabo)
    @JoinColumn({ name: 'idBesoinClientLabo' })
    besoinClientLabo: BesoinClientLabo;

    @Column()
    @ApiModelProperty()
    idBesoinClientLabo: number;
}
