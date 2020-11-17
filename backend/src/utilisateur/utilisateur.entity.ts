import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { type } from 'os';
import { IUtilisateur } from '@aleaac/shared';
import { Civilite } from '../civilite/civilite.entity';
import { Qualite } from '../qualite/qualite.entity';
import { Franchise } from '../franchise/franchise.entity';
import { Historique } from '../historique/historique.entity';
import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';
import { Adresse } from '../adresse/adresse.entity';
import { Profil } from '../profil/profil.entity';
import { Fonction } from '../fonction/fonction.entity';
import { Fichier } from '../fichier/fichier.entity';
import {ProfilsDroits} from '@aleaac/shared';

@Entity({ name: 'utilisateur' })
export class CUtilisateur implements IUtilisateur {
  @PrimaryGeneratedColumn()
  @ApiModelProperty()
  id: number;

  /** IDENTITE */
  @ManyToOne(type => Civilite)
  @JoinColumn({ name: 'idCivilite' })
  @ApiModelProperty()
  civilite: Civilite;

  @ManyToOne(type => Qualite)
  @JoinColumn({ name: 'idQualite' })
  @ApiModelProperty()
  qualite: Qualite;

  @ManyToOne(type => Fonction)
  @JoinColumn({ name: 'idFonction' })
  @ApiModelProperty()
  fonction: Fonction;

  @Column({ length: 35 })
  @ApiModelProperty()
  nom: string;

  @Column({ length: 35 })
  @ApiModelProperty()
  prenom: string;

  @Column({ length: 255 })
  @ApiModelProperty()
  raisonSociale?: string; // Peut-être le virer ?

  @Column({ length: 35 })
  @ApiModelProperty()
  mobile?: string;

  /** ADRESSE */
  @ManyToOne(type => Adresse)
  @JoinColumn({ name: 'idAdresse' })
  @ApiModelProperty()
  adresse: Adresse;

  /** CONNEXION */
  @Column({
    length: 50,
    unique: true
  })
  @ApiModelProperty()
  login: string;

  @Column({ select: false })
  motDePasse: string;

  @Column({ length: 50 })
  @ApiModelProperty()
  loginGoogleAgenda?: string;

  @Column()
  @ApiModelProperty()
  isInterne: boolean;

  @Column()
  @ApiModelProperty()
  isSuspendu: boolean;

  @ManyToOne(type => CUtilisateur)
  @JoinColumn({ name: 'idUtilisateurParent' })
  utilisateurParent?: CUtilisateur;

  @ManyToOne(type => Franchise, { nullable: true })
  @JoinColumn({ name: 'idFranchisePrincipale' })
  franchisePrincipale: Franchise;

  @Column({ nullable: true })
  idFranchisePrincipale: number;

  /** DROITS */

  @Column({ default: false })
  @ApiModelProperty()
  isHabilite: boolean;

  @Column()
  @ApiModelProperty()
  niveauHabilitation?: number;

  @Column('date')
  @ApiModelProperty()
  dateValiditeHabilitation?: Date;

  @OneToMany(type => UtilisateurProfil, utilisateurProfil => utilisateurProfil.utilisateur, { eager: true })
  profils: UtilisateurProfil[];

  listeProfil: Profil[];

  listeProfilsDroits: ProfilsDroits[];

  @OneToMany(type => Historique, historique => historique.utilisateur)
  historiques: Historique[];

  @ManyToOne(type => CUtilisateur, { nullable: true })
  @JoinColumn({ name: 'idCreatedBy' })
  createdBy?: CUtilisateur;

  @Column({ nullable: true })
  idCreatedBy?: number;

  @Column({ nullable: true })
  tokenResetPassword: string;

  @Column({ nullable: true })
  dateDemandeResetPassword: Date;

  @Column({ nullable: true })
  dateResetPassword: Date;

  @Column({ nullable: true })
  ipResetPassword: string;

  motDePasseConfirmation?: string;

  @ManyToOne(type => Fichier, { nullable: true })
  @JoinColumn({ name: 'idSignature' })
  signature: Fichier;

  @Column({ nullable: true })
  idSignature: number;
}
