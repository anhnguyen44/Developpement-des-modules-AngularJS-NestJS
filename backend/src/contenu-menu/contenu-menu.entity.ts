import {Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, JoinColumn} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import { IContenuMenu, IFichier,  } from '@aleaac/shared';
import { CMenuDefini } from '../menu-defini/menu-defini.entity';
import { CCategorieMenu } from '../categorie-menu/categorie-menu.entity';
import { Droit } from '../droit/droit.entity';
import { Fichier } from '../fichier/fichier.entity';



@Entity({name: 'contenu-menu'})
export class CContenuMenu implements IContenuMenu {
    @ApiModelProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiModelProperty()
    @ManyToOne(type => CMenuDefini)
    @JoinColumn({ name: 'idMenu' })
    menu: CMenuDefini;

    @ApiModelProperty()
    @ManyToOne(type => CCategorieMenu)
    @JoinColumn({ name: 'idCategorie' })
    categorie: CCategorieMenu;

    @ApiModelProperty()
    @Column()
    expression: string;

    @ApiModelProperty()
    @Column()
    tag: string;

    @ApiModelProperty()
    @Column()
    titre: string;

    @ApiModelProperty()
    @Column()
    libelleLien: string;

    @ApiModelProperty()
    @Column()
    header1: string;

    @ApiModelProperty()
    @Column()
    header2: string;

    @ApiModelProperty()
    @ManyToOne(type => Fichier, { nullable: true })
    @JoinColumn({ name: 'idMiniature' })
    miniature: Fichier;

    @Column({ nullable: true })
    @ApiModelProperty()
    idMiniature: number;

    @ApiModelProperty()
    @Column()
    intro: string;

    @ApiModelProperty()
    @Column({type: 'longtext'})
    contenu: string;
    
    @ApiModelProperty()
    @Column()
    ordre: number;

    @ApiModelProperty()
    @Column()
    metaDescription: string;

    @ApiModelProperty()
    @Column()
    visible: boolean;

    @ApiModelProperty()
    @ManyToOne(type => Droit, { nullable: true })
    @JoinColumn({ name: 'idDroit' })
    permission: Droit;

    @ApiModelProperty()
    @Column()
    dateAjout: Date;

    @ApiModelProperty()
    @Column( { nullable: true } )
    dateMisAJour: Date;
}
