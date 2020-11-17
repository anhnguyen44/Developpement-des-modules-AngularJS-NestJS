import {Entity, ManyToOne, Column, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn, OneToMany} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import {IMenuDefini, MenuDefini, CMenuProfil, CMenuDroit} from '@aleaac/shared';
import { TypeMenu } from '../type-menu/type-menu.entity';
import { Droit } from '../droit/droit.entity';


@Entity({name: 'menu-defini'})
export class CMenuDefini implements IMenuDefini {
    
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @ApiModelProperty()
    @ManyToOne(type => TypeMenu)
    @JoinColumn({ name: 'idTypeMenu' })
    type: TypeMenu;

    @Column({ length: 255})
    @ApiModelProperty()
    titre: string;

    @Column({ length: 255})
    @ApiModelProperty()
    name: string;

    @Column({ length: 255})
    @ApiModelProperty()
    url: string;

    @Column({ length: 255})
    @ApiModelProperty()
    icone: string;

    @Column()
    @ApiModelProperty()
    ordreContenuAlpha: boolean;

    @Column()
    @ApiModelProperty()
    ordreMenu: number;

    @Column()
    @ApiModelProperty()
    visible: boolean;

    @Column()
    @ApiModelProperty()
    recherche: boolean;

    @ManyToOne(type => CMenuDefini, { nullable: true })
    @JoinColumn({ name: 'idMenuParent'})
    menuParent: CMenuDefini;

    @Column({ length: 255})
    @ApiModelProperty()
    sousTitre: string;

    @ApiModelProperty()
    @ManyToOne(type => Droit, { nullable: true })
    @JoinColumn({ name: 'idDroit' })
    droitsForMenu: Droit;


}
