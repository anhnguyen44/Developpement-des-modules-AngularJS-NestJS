import {Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ApiModelProperty} from '@nestjs/swagger';
import {Adresse} from '../adresse/adresse.entity';
import {Franchise} from '../franchise/franchise.entity';
import {IActivite} from '@aleaac/shared';
import {Contact} from '../contact/contact.entity';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';
import {Categorie} from '../categorie/categorie.entity';
import {IConsommable} from '@aleaac/shared';
import {Bureau} from '../bureau/bureau.entity';


@Entity()
export  class Consommable implements IConsommable {

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    idBureau: number;

    @ManyToOne(type => Bureau)
    @JoinColumn({ name: 'idBureau'})
    @ApiModelProperty()
    bureau: Bureau;

    @Column()
    @ApiModelProperty()
    libelle: string;

    @Column()
    @ApiModelProperty()
    nombreParCommande: number;

    @Column({default: 0})
    @ApiModelProperty()
    stock: number;

    @Column()
    @ApiModelProperty()
    ref: string;

    @Column()
    @ApiModelProperty()
    idFranchise: number;
}
