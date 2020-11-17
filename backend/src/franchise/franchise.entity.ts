import {Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, JoinColumn} from 'typeorm';

import {ApiModelProperty} from '@nestjs/swagger';
import { IFranchise, Civilite, IUtilisateur} from '@aleaac/shared';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';
import { ParametrageFranchise } from '../parametrage-franchise/parametrage-franchise.entity';

@Entity()
export class Franchise implements IFranchise {
    /** INFOS FRANCHISE */
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({type: 'int'})
    @ApiModelProperty()
    numeroContrat: number;

    @Column()
    @ApiModelProperty()
    raisonSociale: string;

    @Column()
    @ApiModelProperty()
    statutJuridique: string;

    @Column()
    @ApiModelProperty()
    rcs: string;

    @Column()
    @ApiModelProperty()
    siret: string;

    @Column()
    @ApiModelProperty()
    naf: string;

    @Column()
    @ApiModelProperty()
    numeroTVA: string;

    @Column({type: 'decimal', default: 20.0, precision: 10, scale: 1})
    @ApiModelProperty()
    pourcentTVADefaut: number;

    @Column()
    @ApiModelProperty()
    capitalSocial: number;

    /** Admin */
    @Column()
    @ApiModelProperty()
    isSortieReseau: boolean;

    @Column()
    @ApiModelProperty()
    trigramme: string;

    @Column({type: 'date'})
    @ApiModelProperty()
    datePremiereSignature: Date | undefined;

    @Column({type: 'date'})
    @ApiModelProperty()
    dateSignatureContratEnCours: Date | undefined;

    @Column({type: 'date'})
    @ApiModelProperty()
    dateFinContratEnCours: Date | undefined;

    @Column({type: 'date'})
    @ApiModelProperty()
    dateDemarrage: Date | undefined;

    @Column({type: 'date'})
    @ApiModelProperty()
    dateSortieReseau: Date | undefined;

    /** Responsables */
    @Column()
    @ApiModelProperty()
    nomPrenomSignature?: string; // Utilisé pour le SA pour savoir à qui est la franchise

    /** ASSURANCE */
    @Column()
    @ApiModelProperty()
    compagnieAssurance?: string | undefined;

    @Column()
    @ApiModelProperty()
    adresseCompagnieAssurance?: string | undefined;

    @Column()
    @ApiModelProperty()
    numeroContratRCP?: string | undefined;

    @Column()
    @ApiModelProperty()
    montantAnnuelGaranti?: string | undefined;

    @Column({type: 'date'})
    @ApiModelProperty()
    dateValiditeAssurance?: Date | undefined;

    @Column()
    @ApiModelProperty()
    numeroAgrementASN?: string | undefined;

    /** RELATIONS */
    @OneToMany(type => UtilisateurProfil, utilisateurProfil => utilisateurProfil.franchise)
    utilisateurs: UtilisateurProfil[];

    users: CUtilisateur[]; // Seulement pour affichage franchise

    @OneToMany(type => ParametrageFranchise, parametrageFranchise => parametrageFranchise.franchise)
    parametres: ParametrageFranchise[];
}
