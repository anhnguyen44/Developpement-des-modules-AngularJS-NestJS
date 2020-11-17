import {Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import {Droit} from '../droit/droit.entity';
import { ITypeProduit } from '@aleaac/shared';

@Entity()
export class TypeProduit implements ITypeProduit {
    @ApiModelProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiModelProperty()
    @Column()
    nom: string;

    @ApiModelProperty()
    @Column()
    rang: number;
}
