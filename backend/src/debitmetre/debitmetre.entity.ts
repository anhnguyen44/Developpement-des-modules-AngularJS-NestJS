import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import {ApiModelProperty} from '@nestjs/swagger';
import {Bureau} from '../bureau/bureau.entity';
import {IDebitmetre} from '@aleaac/shared';


@Entity()
export  class Debitmetre implements IDebitmetre {

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
    ref: string;

    @Column()
    @ApiModelProperty()
    idFranchise: number;

}
