import {Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import {Droit} from '../droit/droit.entity';
import { ITypeMenu } from '@aleaac/shared';

@Entity()
export class TypeMenu implements ITypeMenu {
    @ApiModelProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiModelProperty()
    @Column()
    nom: string;
}
