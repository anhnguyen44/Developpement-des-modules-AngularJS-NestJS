import {Entity, ManyToOne, Column, JoinColumn, PrimaryColumn} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { Profil } from '../profil/profil.entity';
import { Franchise } from '../franchise/franchise.entity';

@Entity()
export class UtilisateurProfil implements UtilisateurProfil {
    @ApiModelProperty()
    @ManyToOne(type => CUtilisateur, utilisateur => utilisateur.profils, { primary: true, onDelete: 'CASCADE' })
    @JoinColumn({name: 'idUtilisateur'})
    utilisateur: CUtilisateur;
    @Column({nullable: true})
    @PrimaryColumn()
    idUtilisateur: number;



    @ApiModelProperty()
    @ManyToOne(type => Profil, { primary: true, eager: true })
    @JoinColumn({name: 'idProfil'})
    profil: Profil;
    @Column({nullable: true})
    @PrimaryColumn()
    idProfil: number;



    @ApiModelProperty()
    @ManyToOne(type => Franchise, { primary: true })
    @JoinColumn({name: 'idFranchise'})
    franchise: Franchise;
    @Column({nullable: true})
    @PrimaryColumn()
    idFranchise: number;
}
