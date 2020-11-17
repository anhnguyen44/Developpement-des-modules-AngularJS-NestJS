import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IStatutCommande } from '@aleaac/shared';
import { Bureau } from '../bureau/bureau.entity';
import { Contact } from '../contact/contact.entity';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class StatutCommande implements IStatutCommande {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    description: string;

    @Column()
    @ApiModelProperty()
    ordre: number;

    @ManyToOne(type => StatutCommande)
    @JoinColumn({ name: 'idStatutParent' })
    parent: StatutCommande;

    @Column()
    @ApiModelProperty()
    isJustificationNecessaire: boolean;
}