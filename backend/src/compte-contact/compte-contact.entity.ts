import {Entity, ManyToOne, Column, JoinColumn, PrimaryColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import {ICompteContact} from '@aleaac/shared';
import {Compte} from '../compte/compte.entity';
import {Contact} from '../contact/contact.entity';

@Entity()
export class CompteContact implements ICompteContact {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @ApiModelProperty()
    @ManyToOne(type => Compte, compte => compte.compteContacts, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'idCompte'})
    compte: Compte;

    @Column({nullable: true})
    @Column()
    idCompte: number;

    @ApiModelProperty()
    @OneToOne(type => Contact, contact => contact.compteContacts)
    @JoinColumn({name: 'idContact'})
    contact: Contact;

    @Column({nullable: true})
    @Column()
    idContact: number;

    @ApiModelProperty()
    @Column()
    bDemandeur: boolean;

    @ApiModelProperty()
    @Column()
    bDevis: boolean;

    @ApiModelProperty()
    @Column()
    bPrincipale: boolean;

    @ApiModelProperty()
    @Column()
    bFacture: boolean;

    @ApiModelProperty()
    @Column()
    bRapport: boolean;
}
