import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ApiModelProperty} from '@nestjs/swagger';
import {IBureau} from '@aleaac/shared';
import {Qualite} from '../qualite/qualite.entity';
import {Adresse} from '../adresse/adresse.entity';
import {Franchise} from '../franchise/franchise.entity';


@Entity()
export  class Bureau implements IBureau {
    email: any;
    fax: any;
    telephone: any;

    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({nullable: true})
    @ApiModelProperty()
    idFranchise: number;

    @ManyToOne(type => Franchise)
    @JoinColumn({ name: 'idFranchise'})
    @ApiModelProperty()
    franchise: Franchise;

    @Column()
    @ApiModelProperty()
    bPrincipal: boolean;

    @Column()
    @ApiModelProperty()
    nom: string;

    @Column({nullable: true})
    @ApiModelProperty()
    idAdresse: number;

    @OneToOne(type => Adresse)
    @JoinColumn({ name: 'idAdresse'})
    @ApiModelProperty()
    adresse: Adresse;

    @Column()
    @ApiModelProperty()
    portable: string;

    @Column({ nullable: true })
    @ApiModelProperty()
    numeroAccreditation: string;

    @Column({ nullable: true })
    @ApiModelProperty()
    dateValiditeAccreditation: Date;

    @Column({ nullable: true })
    @ApiModelProperty()
    nomCommercial: string;
}
