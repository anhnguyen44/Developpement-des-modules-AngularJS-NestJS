import { Entity, ManyToMany, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne, JoinColumn } from 'typeorm';

import { ApiModelProperty } from '@nestjs/swagger';
import { IContactChantier } from '@aleaac/shared';
import { Contact } from '../contact/contact.entity';
import { TypeContactChantier } from '../type-contact-chantier/type-contact-chantier.entity';
import { Chantier } from '../chantier/chantier.entity';


@Entity()
export class ContactChantier implements IContactChantier {
    @PrimaryGeneratedColumn()
    @ApiModelProperty()
    id: number;

    @ManyToOne(() => Contact, { eager: true })
    @JoinColumn({ name: 'idContact' })
    contact: Contact;

    @Column()
    @ApiModelProperty()
    idContact: number;

    @ManyToOne(() => TypeContactChantier)
    @JoinColumn({ name: 'idTypeContact' })
    typeContact: TypeContactChantier;

    @Column()
    @ApiModelProperty()
    idTypeContact: number;

    @ManyToOne(() => Chantier, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'idChantier' })
    chantier: Chantier;

    @Column({ nullable: true })
    @ApiModelProperty()
    idChantier: number;
}
