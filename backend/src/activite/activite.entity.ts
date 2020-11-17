import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { Adresse } from '../adresse/adresse.entity';
import { Franchise } from '../franchise/franchise.entity';
import { IActivite } from '@aleaac/shared';
import { Contact } from '../contact/contact.entity';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { Categorie } from '../categorie/categorie.entity';


@Entity()
export class Activite implements IActivite {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({ nullable: true })
    @ApiModelProperty()
    idFranchise: number;

    @ManyToOne(type => Franchise)
    @JoinColumn({ name: 'idFranchise' })
    @ApiModelProperty()
    franchise: Franchise;

    @Column({ nullable: true })
    @ApiModelProperty()
    idContact: number;

    @ManyToOne(type => Contact)
    @JoinColumn({ name: 'idContact' })
    @ApiModelProperty()
    contact: Contact;


    @ManyToOne(type => Adresse, { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idAdresse' })
    @ApiModelProperty()
    adresse: Adresse;

    @Column({ nullable: true })
    idAdresse: number;

    @Column()
    @ApiModelProperty()
    idCategorie: number;

    @ManyToOne(type => Categorie, { onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'idCategorie' })
    @ApiModelProperty()
    categorie: Categorie;

    @Column()
    @ApiModelProperty()
    date: string;

    @Column()
    @ApiModelProperty()
    time: string;

    @Column()
    @ApiModelProperty()
    duree: number;

    @Column({ nullable: true })
    idUtilisateur: number;

    @ManyToOne(type => CUtilisateur, { onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'idUtilisateur' })
    @ApiModelProperty()
    utilisateur: CUtilisateur;

    @Column({ type: 'text' })
    @ApiModelProperty()
    contenu: string;

    @Column()
    @ApiModelProperty()
    objet: string;
}
