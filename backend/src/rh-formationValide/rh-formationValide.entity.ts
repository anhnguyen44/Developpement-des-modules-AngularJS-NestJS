import {Entity, ManyToOne, Column, JoinColumn, PrimaryColumn} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { Profil } from '../profil/profil.entity';
import { Franchise } from '../franchise/franchise.entity';

import { CFormation } from '../formation/formation.entity';
import { RessourceHumaine } from '../ressource-humaine/ressource-humaine.entity';
import { IFormationValideRH, IRessourceHumaine, ITypeFormation } from '@aleaac/shared';
import { TypeFormation } from '../type-formation/type-formation.entity';


@Entity()
export class RhFormationValide implements IFormationValideRH {
    @ApiModelProperty()
    @ManyToOne(type => RessourceHumaine, rh => rh.formationValide, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn({name: 'idRh'})
    rh: IRessourceHumaine;
    @Column({nullable: true})
    @PrimaryColumn()
    idRh: number;



    @ApiModelProperty()
    @ManyToOne(type => TypeFormation, { primary: true, eager: true })
    @JoinColumn({name: 'idTypeFormation'})
    formation: ITypeFormation;
    @Column({nullable: true})
    @PrimaryColumn()
    idTypeFormation: number;



    @Column({nullable: true})
    @ApiModelProperty()
    dateObtenu: Date;

    @Column({nullable: true})
    @ApiModelProperty()
    @PrimaryColumn()
    habilite: boolean;
}
