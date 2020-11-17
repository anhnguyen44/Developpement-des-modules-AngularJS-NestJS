import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class rhFonction1565699480037 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'rh_fonction',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'idRh',
                    type: 'int',
                    isNullable: true
                },
                {
                    name: 'idFonction',
                    type: 'int',
                    isNullable: true
                }
            ]
        }));

        await queryRunner.createForeignKey('rh_fonction', new TableForeignKey({
            columnNames: ['idFonction'],
            referencedColumnNames: ['id'],
            referencedTableName: 'fonction'
        }));


        await queryRunner.createForeignKey('rh_fonction', new TableForeignKey({
            columnNames: ['idRh'],
            referencedColumnNames: ['id'],
            referencedTableName: 'ressource_humaine',
            onDelete: 'CASCADE'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
