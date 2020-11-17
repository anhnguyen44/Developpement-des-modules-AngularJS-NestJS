import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex} from 'typeorm';
import {int} from 'aws-sdk/clients/datapipeline';

export class CmdAnalyseCreate1562226881368 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'cmd_analyse',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'idChantier',
                    type: 'int',
                },
                {
                    name: 'idTypePrelevement',
                    type: 'int',
                },
                {
                    name: 'dateEnvoi',
                    type: 'date',
                    isNullable: true,
                },
                {
                    name: 'dateRetour',
                    type: 'date',
                    isNullable: true
                }
            ]
        }));

        await queryRunner.addColumn('prelevement', new TableColumn({
            name: 'idCmdAnalyse',
            type: 'int',
            isNullable: true,
            default: null
        }));

        await queryRunner.createForeignKey('prelevement', new TableForeignKey({
            columnNames: ['idCmdAnalyse'],
            referencedColumnNames: ['id'],
            referencedTableName: 'cmd_analyse',
            onDelete: 'CASCADE'
        }))

    }

    public async down(queryRunner: QueryRunner): Promise<any> {

    }

}
