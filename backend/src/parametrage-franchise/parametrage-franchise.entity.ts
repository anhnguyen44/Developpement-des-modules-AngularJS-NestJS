import {Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, JoinColumn} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import { Franchise } from '../franchise/franchise.entity';
import { IParametrageFranchise } from '@aleaac/shared';

@Entity()
export class ParametrageFranchise implements IParametrageFranchise {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @ManyToOne(type => Franchise, franchise => franchise.parametres)
    @JoinColumn({name: 'idFranchise'})
    franchise: Franchise;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    valeur: string;
}
