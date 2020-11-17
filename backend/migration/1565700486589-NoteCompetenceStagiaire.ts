import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class NoteCompetenceStagiaire1565700486589 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'note_competence_stagiaire',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name:'note',
                    type:'int',
                },
                {
                    name:'idStagiaire',
                    type:'int',
                    isNullable:true
                },
                {
                    name:'idCompetence',
                    type:'int',
                    isNullable:true
                }
            ]
        }));

        await queryRunner.createForeignKey('note_competence_stagiaire', new TableForeignKey({
            columnNames: ['idStagiaire'],
            referencedColumnNames: ['id'],
            referencedTableName: 'formation_contact',
            onDelete: 'CASCADE'
        }));

        await queryRunner.createForeignKey('note_competence_stagiaire', new TableForeignKey({
            columnNames: ['idCompetence'],
            referencedColumnNames: ['id'],
            referencedTableName: 't_formation_d_competence',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
