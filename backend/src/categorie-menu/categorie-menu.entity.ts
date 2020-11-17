import {Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, JoinColumn} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import { ICategorieMenu } from '@aleaac/shared';
import { CMenuDefini } from '../menu-defini/menu-defini.entity';
import { Categorie } from '../categorie/categorie.entity';

@Entity({name: 'categorie-menu'})
export class CCategorieMenu implements ICategorieMenu {
    @ApiModelProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiModelProperty()
    @Column()
    titre: string;

    @ApiModelProperty()
    @Column()
    url: string;

    @ApiModelProperty()
    @Column()
    ordre: number;

    @ApiModelProperty()
    @ManyToOne(type => CMenuDefini)
    @JoinColumn({ name: 'idMenu' })
    menu: CMenuDefini;
}
