import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { IFormation, IUtilisateur, Utilisateur, FormationContact, EnumStatutSessionFormation } from '@aleaac/shared';
import { Produit } from '../produit/produit.entity';
import { TypeFormation } from '../type-formation/type-formation.entity';
import { CFormationContact } from '../formation-contact/formation-contact.entity';
import { Salle } from '../salle/salle.entity';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { Franchise } from '../franchise/franchise.entity';
import { Bureau } from '../bureau/bureau.entity';
import { FormateurFormation } from '../formateur-formation/formateur-formation.entity';



@Entity({name: 'formation'})
export class CFormation implements IFormation {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    nbrJour: number;

    @Column({ nullable: true })
    @ApiModelProperty()
    dateDebut: Date;

    @Column({ nullable: true })
    @ApiModelProperty()
    idTypeFormation: number;

    @ApiModelProperty()
    @ManyToOne(type => TypeFormation)
    @JoinColumn({ name: 'idTypeFormation' })
    typeFormation: TypeFormation;

    @Column({ nullable: true })
    @ApiModelProperty()
    dateFin: Date;

    @OneToMany(type => CFormationContact, formationContact => formationContact.formation, { eager: true })
    stagiaire: CFormationContact[];

    @OneToMany(type => FormateurFormation, formateurFormation => formateurFormation.formation, { eager: true })
    formateur: FormateurFormation[];

    @Column({ nullable: true })
    @ApiModelProperty()
    idSalle: number;

    @ManyToOne(type => Salle, { nullable: true })
    @JoinColumn({ name: 'idSalle' })
    salle: Salle;

    @Column({ nullable: true })
    @ApiModelProperty()
    idBureau: number;

    @ManyToOne(type => Bureau, { nullable: true })
    @JoinColumn({ name: 'idBureau' })
    bureau: Bureau;

    // @ManyToOne(type => CUtilisateur , { nullable: true })
    // @JoinColumn({ name: 'idFormateur' })
    // formateur: CUtilisateur;

    @Column()
    @ApiModelProperty()
    commentaire: string;

    @Column()
    @ApiModelProperty()
    phrCertificat: string;

    @Column()
    @ApiModelProperty()
    heureDebutForma: string;

    @Column()
    @ApiModelProperty()
    heureFinForma: string;

    @Column({ nullable: true })
    @ApiModelProperty()
    idFranchise: number;

    @Column({ nullable: true })
    @ApiModelProperty()
    idStatutFormation: EnumStatutSessionFormation;

    @ManyToOne(type => Franchise)
    @JoinColumn({ name: 'idFranchise' })
    @ApiModelProperty()
    franchise: Franchise;


}