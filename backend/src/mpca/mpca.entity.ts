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
import {IMpca} from '@aleaac/shared';


@Entity()
export class Mpca implements IMpca {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nom: string;
}
