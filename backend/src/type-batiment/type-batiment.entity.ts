import {Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import { ITypeBatiment, IFichier } from '@aleaac/shared';

@Entity()
export class TypeBatiment implements ITypeBatiment {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;
}
