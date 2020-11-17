import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class FiltreTemoin1564748731604 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('intervention', [
            // METEO AVANT
            new TableColumn({
                name: 'idFiltreTemoinPI',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'idFiltreTemoinPPF',
                type: 'int',
                isNullable: true
            })
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
