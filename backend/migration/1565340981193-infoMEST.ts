import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class infoMEST1565340981193 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('prelevement', [
            new TableColumn({
                name: 'idPointPrelevementMEST',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'referenceFlaconMEST',
                type: 'varchar',
                isNullable: true
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
