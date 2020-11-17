import {Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import { IQualite } from '@aleaac/shared';

@Entity()
export class Qualite implements IQualite {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    isInterne: boolean;
}
