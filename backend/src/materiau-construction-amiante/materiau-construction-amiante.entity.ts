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
import {IMateriauConstructionAmiante, EnumListeMateriauxAmiante} from '@aleaac/shared';

@Entity()
export  class MateriauConstructionAmiante implements IMateriauConstructionAmiante {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column({ type: 'int' })
    @ApiModelProperty()
    liste: number;

    @Column()
    @ApiModelProperty()
    partieStructure: string;

    @Column()
    @ApiModelProperty()
    composantConstruction: string;

    @Column()
    @ApiModelProperty()
    partieComposant: string;
}
