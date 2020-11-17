import {Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import {Droit} from '../droit/droit.entity';
import { ITypeGrille } from '@aleaac/shared';
import { TypeProduit } from '../type-produit/type-produit.entity';

@Entity()
export class TypeGrille implements ITypeGrille {
    @ApiModelProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiModelProperty()
    @Column()
    nom: string;

    @ApiModelProperty()
    @Column()
    refDefaut: string;

    @ManyToMany(type => TypeProduit, {eager: true, cascade: true})
    @JoinTable({
        name: 'grille_typeproduit',
        joinColumns: [
            { name: 'idTypeGrille' }
        ],
        inverseJoinColumns: [
            { name: 'idTypeProduit' }
        ]
    })
    categories: TypeProduit[];
}
