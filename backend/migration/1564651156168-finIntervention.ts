import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class finIntervention1564651156168 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('affectation_prelevement', [
            new TableColumn({
                name: 'idPosition',
                type: 'int',
                isNullable: true
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
