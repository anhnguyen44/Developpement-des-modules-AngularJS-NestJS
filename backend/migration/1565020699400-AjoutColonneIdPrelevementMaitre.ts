import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AjoutColonneIdPrelevementMaitre1565020699400 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.addColumns('prelevement', [
            new TableColumn({
                name: 'idPrelevementMateriaux',
                type: 'int',
                isNullable: true
            })
        ]);

        await queryRunner.createForeignKey('prelevement', new TableForeignKey({
            columnNames: ['idPrelevementMateriaux'],
            referencedColumnNames: ['id'],
            referencedTableName: 'prelevement'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
