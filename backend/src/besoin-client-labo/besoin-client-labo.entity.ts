import { Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { ApiModelProperty, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { IBesoinClientLabo, IFichier, EnumTypeBesoinLabo } from '@aleaac/shared';
import { Adresse } from '../adresse/adresse.entity';
import { Objectif } from '../objectif/objectif.entity';
import { Fichier } from '../fichier/fichier.entity';
import { InfosBesoinClientLabo } from '../infos-besoin-client-labo/infos-besoin-client-labo.entity';
import { Chantier } from '../chantier/chantier.entity';
import { TypeObjectif } from '../type-objectif/type-objectif.entity';

@Entity()
export class BesoinClientLabo implements IBesoinClientLabo {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({ nullable: true })
    BesoinClientLaboId: number; // ne pas utiliser, ne sert à rien, c'est l'orm qui merde si on le met pas


    @Column({ type: 'date' })
    @ApiModelProperty()
    dateDemande: Date;

    @Column({ type: 'date' })
    @ApiModelProperty()
    dateDemandeSS4: Date;

    // @ManyToOne(type => Adresse, { eager: true })
    // @JoinColumn({ name: 'idAdresseMission' })
    // adresseMission: Adresse;

    // @Column()
    // @ApiModelProperty()
    // idAdresseMission: number;
    @ManyToOne(() => TypeObjectif, { nullable: true, eager: true })
    @JoinColumn({ name: 'idTypeBesoinLabo' })
    @ApiModelProperty()
    typeBesoinLabo: TypeObjectif;

    @Column({ nullable: true })
    @ApiModelProperty()
    idTypeBesoinLabo: number;

    @Column()
    @ApiModelProperty()
    ss3: boolean;

    @Column()
    @ApiModelProperty()
    ss4: boolean;

    @ApiModelProperty()
    documents: Fichier[];

    @ManyToMany(type => Objectif, { eager: true, cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinTable({ name: 'objectifs_besoin' })
    @ApiModelProperty()
    objectifs: Objectif[];

    @Column({ type: 'text' })
    @ApiModelProperty()
    descriptifChantier: string;

    @Column({ type: 'text' })
    @ApiModelProperty()
    effectifPrevu: string;

    @Column({ type: 'text' })
    @ApiModelProperty()
    commentaires: string;

    @Column({ type: 'text' })
    @ApiModelProperty()
    perimetreGlobal: string;

    @OneToMany(() => InfosBesoinClientLabo, i => i.besoinClientLabo, { eager: true })
    informations: InfosBesoinClientLabo[];

    @ApiModelProperty()
    @OneToOne(() => Chantier, c => c.besoinClient)
    chantier: Chantier;

    besoinClientLabo?: any;
}
