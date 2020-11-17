import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class typeFormationCompetence1565696018799 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 't_formation_d_competence',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'idTypeFormation',
                    type: 'int',
                    isNullable: true
                },
                {
                    name: 'idDCompetence',
                    type: 'int',
                    isNullable: true
                },
                {
                    name: 'typePratique',
                    type: 'tinyint',
                    isNullable: true,
                }
            ]
        }));

        await queryRunner.createForeignKey('t_formation_d_competence', new TableForeignKey({
            columnNames: ['idTypeFormation'],
            referencedColumnNames: ['id'],
            referencedTableName: 'type_formation'
        }));


        await queryRunner.createForeignKey('t_formation_d_competence', new TableForeignKey({
            columnNames: ['idDCompetence'],
            referencedColumnNames: ['id'],
            referencedTableName: 'domaine-competence'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
