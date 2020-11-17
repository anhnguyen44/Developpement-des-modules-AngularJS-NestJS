import {Entity, ManyToOne, Column, JoinColumn, PrimaryColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import {Compte} from '../compte/compte.entity';
import {Contact} from '../contact/contact.entity';
import {IContactDevisCommande, ITypeContactDevisCommande} from '@aleaac/shared';
import {DevisCommande} from '../devis-commande/devis-commande.entity';
import {TypeContactDevisCommande} from '../type-contact-devis-commande/type-contact-devis-commande.entity';

@Entity()
export class ContactDevisCommande implements IContactDevisCommande {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    idContact: number;

    @ApiModelProperty()
    @ManyToOne(type => Contact, contact => contact.contactDevisCommandes)
    @JoinColumn({name: 'idContact'})
    contact: Contact;

    @Column()
    @ApiModelProperty()
    idDevisCommande: number;

    @ApiModelProperty()
    @ManyToOne(type => DevisCommande, devisCommande => devisCommande.contactDevisCommandes, { onDelete: 'CASCADE'})
    @JoinColumn({name: 'idDevisCommande'})
    devisCommande: DevisCommande;

    @Column()
    @ApiModelProperty()
    idTypeContactDevisCommande: number;

    @ApiModelProperty()
    @ManyToOne(type => TypeContactDevisCommande, typeContactDevis => typeContactDevis.contactDevisCommandes)
    @JoinColumn({name: 'idTypeContactDevisCommande'})
    typeContactDevisCommande: TypeContactDevisCommande;
}
