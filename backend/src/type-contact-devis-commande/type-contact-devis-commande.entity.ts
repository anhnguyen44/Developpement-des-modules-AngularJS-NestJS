import {
    Entity,
    ManyToOne,
    Column,
    JoinColumn,
    PrimaryColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import {ITypeContactDevisCommande} from '@aleaac/shared';
import {ContactDevisCommande} from '../contact-devis-commande/contact-devis-commande.entity';

@Entity()
export class TypeContactDevisCommande implements ITypeContactDevisCommande {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    code: string;

    @ApiModelProperty()
    @OneToMany(type => ContactDevisCommande, contactDevisCommande => contactDevisCommande.typeContactDevisCommande)
    @JoinColumn({name: 'idContact'})
    contactDevisCommandes: ContactDevisCommande[];

    @Column()
    @ApiModelProperty()
    isInterne: boolean;
}
