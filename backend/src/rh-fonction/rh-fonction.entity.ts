import {Entity, ManyToOne, Column, JoinColumn, PrimaryColumn} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import { RessourceHumaine } from '../ressource-humaine/ressource-humaine.entity';
import { Fonction } from '../fonction/fonction.entity';
import { IFonctionRH, IRessourceHumaine, IFonction } from '@aleaac/shared';


@Entity()
export class RhFonction implements IFonctionRH {
    @ApiModelProperty()
    @ManyToOne(type => RessourceHumaine, rh => rh.fonctions, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn({name: 'idRh'})
    rh: IRessourceHumaine;
    @Column({nullable: true})
    @PrimaryColumn()
    idRh: number;



    @ApiModelProperty()
    @ManyToOne(type => Fonction, { primary: true, eager: true })
    @JoinColumn({name: 'idFonction'})
    fonction: IFonction;
    @Column({nullable: true})
    @PrimaryColumn()
    idFonction: number;
}
