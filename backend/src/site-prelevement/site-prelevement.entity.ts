import { Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import { ISitePrelevement, IFichier } from '@aleaac/shared';
import { Adresse } from '../adresse/adresse.entity';
import { Batiment } from '../batiment/batiment.entity';
import { Fichier } from '../fichier/fichier.entity';
import { Chantier } from '../chantier/chantier.entity';

@Entity()
export class SitePrelevement implements ISitePrelevement {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    code: string;

    @ManyToOne(() => Adresse, { eager: true })
    @JoinColumn({ name: 'idAdresse' })
    adresse: Adresse;

    @Column()
    @ApiModelProperty()
    idAdresse: number;

    @OneToMany(() => Batiment, b => b.sitePrelevement, { eager: true })
    @ApiModelProperty()
    batiments: Batiment[];

    @Column('decimal', { precision: 10, scale: 8, nullable: true })
    @ApiModelProperty()
    latitude: number;

    @Column('decimal', { precision: 11, scale: 8, nullable: true })
    @ApiModelProperty()
    longitude: number;

    @Column()
    @ApiModelProperty()
    accesHauteurNecessaire: boolean;

    @Column()
    @ApiModelProperty()
    electriciteSurPlace: boolean;

    @Column()
    @ApiModelProperty()
    combles: boolean;

    @Column()
    @ApiModelProperty()
    digicode: string;

    @Column({ type: 'text' })
    @ApiModelProperty()
    commentaire: string;

    // @ManyToMany(() => Fichier)
    @ApiModelProperty()
    // @JoinTable({ name: 'fichiers_siteprelevement' })
    photos: Fichier[];

    @ManyToOne(() => Chantier, chantier => chantier.sitesPrelevement, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'idChantier' })
    chantier: Chantier;

    @Column()
    @ApiModelProperty()
    idChantier: number;

    generatedMaps?: any;
    raw?: any;
}
