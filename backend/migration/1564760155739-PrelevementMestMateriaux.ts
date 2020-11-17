import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class PrelevementMestMateriaux1564760155739 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('prelevement', [
            // METEO AVANT
            new TableColumn({
                name: 'isPrelevementMateriaux',
                type: 'tinyint',
                default: false
            }),
            new TableColumn({
                name: 'isPrelevementMEST',
                type: 'tinyint',
                default: false
            }),
            new TableColumn({
                name: 'isFicheExposition',
                type: 'tinyint',
                default: true
            }),
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
