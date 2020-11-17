import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinTable, OneToOne } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Civilite } from '../civilite/civilite.entity';
import { IContact } from '@aleaac/shared';
import { Franchise } from '../franchise/franchise.entity';
import { Adresse } from '../adresse/adresse.entity';
import { Bureau } from '../bureau/bureau.entity';
import { Fonction } from '../fonction/fonction.entity';
import { CompteContact } from '../compte-contact/compte-contact.entity';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { ContactDevisCommande } from '../contact-devis-commande/contact-devis-commande.entity';
import { Qualite } from '../qualite/qualite.entity';

@Entity()
export class Contact implements IContact {

    @ManyToOne(type => Qualite, { eager: true, nullable: true })
    @JoinColumn({ name: 'idQualite' })
    @ApiModelProperty()
    qualite: Qualite | null;

    @Column({ nullable: true })
    @ApiModelProperty()
    idQualite: number | null;

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({ nullable: true })
    @ApiModelProperty()
    idBureau: number;

    @ManyToOne(type => Bureau)
    @JoinColumn({ name: 'idBureau' })
    @ApiModelProperty()
    bureau: Bureau;

    @Column({ nullable: true })
    @ApiModelProperty()
    idFonction: number;

    @ManyToOne(type => Fonction)
    @JoinColumn({ name: 'idFonction' })
    @ApiModelProperty()
    fonction: Fonction;

    @Column({ nullable: true })
    @ApiModelProperty()
    idFranchise: number;

    @ManyToOne(type => Franchise)
    @JoinColumn({ name: 'idFranchise' })
    @ApiModelProperty()
    franchise: Franchise;

    @ManyToOne(type => Civilite)
    @JoinColumn({ name: 'idCivilite' })
    @ApiModelProperty()
    civilite: Civilite;

    @Column({ nullable: true })
    @ApiModelProperty()
    idCivilite: number;

    @Column({ nullable: true })
    @ApiModelProperty()
    idUtilisateur: number | null;

    @OneToOne(type => CUtilisateur)
    @JoinColumn({ name: 'idUtilisateur' })
    @ApiModelProperty()
    utilisateur: CUtilisateur;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column()
    @ApiModelProperty()
    prenom: string;

    @Column()
    @ApiModelProperty()
    portable: string;

    @Column({ nullable: true })
    idAdresse: number;

    @ManyToOne(type => Adresse)
    @JoinColumn({ name: 'idAdresse' })
    @ApiModelProperty()
    adresse: Adresse;

    @Column()
    @ApiModelProperty()
    bProspect: boolean;

    @Column()
    @ApiModelProperty()
    phase: string;

    @Column()
    @ApiModelProperty()
    objectif: string;

    @Column()
    @ApiModelProperty()
    potentiel: string;

    @Column({ nullable: true, default: null })
    @ApiModelProperty()
    qualification: string;

    @Column()
    @ApiModelProperty()
    secteur: string;

    @Column({ nullable: true })
    @ApiModelProperty()
    anniversaire: Date;

    @Column()
    @ApiModelProperty()
    editeur: string;

    @Column()
    @ApiModelProperty()
    application: string;

    @Column()
    @ApiModelProperty()
    commentaire: string;

    @OneToOne(type => CompteContact, compteContacts => compteContacts.contact)
    compteContacts: CompteContact;

    @Column({ default: false })
    @ApiModelProperty()
    isLinked: boolean;  // Pour savoir si lié à d'autres objets (devis, etc.)

    @ApiModelProperty()
    @OneToMany(type => ContactDevisCommande, contactDevisCommande => contactDevisCommande.contact)
    @JoinColumn({ name: 'idContact' })
    contactDevisCommandes: ContactDevisCommande[];
}
