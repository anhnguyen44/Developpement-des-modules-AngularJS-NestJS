import {Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import { IEnvironnement } from '@aleaac/shared';

@Entity()
export class Environnement implements IEnvironnement {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;
}
