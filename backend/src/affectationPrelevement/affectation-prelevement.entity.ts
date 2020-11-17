import {Entity, ManyToOne, Column, JoinColumn, PrimaryColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import {Contact} from '../contact/contact.entity';
import {IAffectationPrelevement} from '@aleaac/shared';
import {DevisCommande} from '../devis-commande/devis-commande.entity';
import {TypeContactDevisCommande} from '../type-contact-devis-commande/type-contact-devis-commande.entity';
import {Filtre} from '../filtre/filtre.entity';
import {Pompe} from '../pompe/pompe.entity';
import {Prelevement} from '../prelevement/prelevement.entity';
import {Debitmetre} from '../debitmetre/debitmetre.entity';

@Entity()
export class AffectationPrelevement implements IAffectationPrelevement {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({nullable: true})
    @ApiModelProperty()
    idFiltre: number;

    @ApiModelProperty()
    @ManyToOne(type => Filtre, {nullable: true})
    @JoinColumn({name: 'idFiltre'})
    filtre: Filtre;

    @Column({nullable: true})
    @ApiModelProperty()
    idDebitmetre: number;

    @ApiModelProperty()
    @ManyToOne(type => Filtre, {nullable: true})
    @JoinColumn({name: 'idDebitmetre'})
    debitmetre: Debitmetre;

    @Column({nullable: true})
    @ApiModelProperty()
    idPompe: number;

    @ApiModelProperty()
    @ManyToOne(type => Pompe, {nullable: true})
    @JoinColumn({name: 'idPompe'})
    pompe: Pompe;

    @Column({nullable: true, default: null})
    @ApiModelProperty()
    idOperateurChantier: number;

    @ApiModelProperty()
    @ManyToOne(type => Contact, {nullable: true})
    @JoinColumn({name: 'idOperateurChantier'})
    operateurChantier: Contact;

    @Column({nullable: true, default: null})
    @ApiModelProperty()
    idPrelevement: number;

    @ApiModelProperty()
    @ManyToOne(type => Prelevement, prelevement => prelevement.affectationsPrelevement, {nullable: true, onDelete: 'CASCADE'})
    @JoinColumn({name: 'idPrelevement'})
    prelevement: Prelevement;

    @Column({nullable: true})
    @ApiModelProperty()
    dateHeureDebut: Date;

    @Column({nullable: true})
    @ApiModelProperty()
    dateHeureFin: Date;

    @Column({nullable: true})
    @ApiModelProperty()
    idPosition: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, default: 0})
    @ApiModelProperty()
    debitFinal1: number;

    @Column({type: 'decimal', precision: 10, scale: 3, nullable: true, default: null})
    @ApiModelProperty()
    debitFinal2: number;

    @Column({type: 'decimal', precision: 10, scale: 3, nullable: true, default: null})
    @ApiModelProperty()
    debitFinal3: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, default: 0})
    @ApiModelProperty()
    debitInitial1: number;

    @Column({type: 'decimal', precision: 10, scale: 3, nullable: true, default: null})
    @ApiModelProperty()
    debitInitial2: number;

    @Column({type: 'decimal', precision: 10, scale: 3, nullable: true, default: null})
    @ApiModelProperty()
    debitInitial3: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, default: 0})
    @ApiModelProperty()
    debitMoyenFinal: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, default: 0})
    @ApiModelProperty()
    debitMoyenInitial: number;

    @Column({nullable: true, default: null})
    @ApiModelProperty()
    commentaire: string;
}
