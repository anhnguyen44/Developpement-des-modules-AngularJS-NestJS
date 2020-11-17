import {Entity, ManyToOne, Column, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import { RessourceHumaine } from '../ressource-humaine/ressource-humaine.entity';
import { CFormation } from '../formation/formation.entity';
import { IFormateurFormation, IRessourceHumaine, IFormation } from '@aleaac/shared';



@Entity()
export class FormateurFormation implements IFormateurFormation {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({nullable: true})
    @ApiModelProperty()
    idFormateur: number;

    @ApiModelProperty()
    @ManyToOne(type => RessourceHumaine, { primary: true, eager: true })
    @JoinColumn({name: 'idFormateur'})
    formateur: IRessourceHumaine;
    
    @Column({nullable: true})
    @ApiModelProperty()
    idFormation: number;

    @ApiModelProperty()
    @ManyToOne(type => CFormation,cFormation=>cFormation.formateur, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn({name: 'idFormation'})
    formation: IFormation;
    
}
