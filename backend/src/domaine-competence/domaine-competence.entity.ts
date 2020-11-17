import {Column, Entity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinColumn} from 'typeorm';
import {ApiModelProperty} from '@nestjs/swagger';
import { IDomaineCompetence} from '@aleaac/shared';
import { TypeFichierGroupe } from '../type-fichier-goupe/type-fichier-groupe.entity';
import { Produit } from '../produit/produit.entity';

@Entity('domaine-competence')
export  class CDomaineCompetence implements IDomaineCompetence {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    description: string;
}