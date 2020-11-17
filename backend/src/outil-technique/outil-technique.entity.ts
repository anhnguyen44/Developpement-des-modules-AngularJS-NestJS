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
import {IOutilTechnique, IProcessus, ITypeContactDevisCommande} from '@aleaac/shared';
import {ContactDevisCommande} from '../contact-devis-commande/contact-devis-commande.entity';
import {Compte} from '../compte/compte.entity';

@Entity()
export class OutilTechnique implements IOutilTechnique {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;
}
