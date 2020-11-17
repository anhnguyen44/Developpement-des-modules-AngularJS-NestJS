import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {ApiModelProperty} from '@nestjs/swagger';
import {IAdresse} from '@aleaac/shared';

@Entity()
export class Adresse implements IAdresse {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @Column()
    @ApiModelProperty()
    adresse: string;

    @Column()
    @ApiModelProperty()
    complement?:  string | null;

    @Column()
    @ApiModelProperty()
    cp: string;

    @Column()
    @ApiModelProperty()
    ville: string;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    email: string;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    telephone: string;

    @Column({default: null, nullable: true})
    @ApiModelProperty()
    fax: string;

    @Column('decimal', { precision: 10, scale: 8, nullable: true })
    @ApiModelProperty()
    latitude: number;

    @Column('decimal', { precision: 11, scale: 8, nullable: true })
    @ApiModelProperty()
    longitude: number;
}
