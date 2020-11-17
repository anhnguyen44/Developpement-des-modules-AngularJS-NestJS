import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddConditionPrelevementAvantApresPendant1565102337285 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns('prelevement', [
            new TableColumn({
                name: 'conditionTemperatureAvant',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'conditionPressionAvant',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'conditionHumiditeAvant',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'conditionTemperaturePendant',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'conditionPressionPendant',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'conditionHumiditePendant',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'conditionTemperatureApres',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'conditionPressionApres',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'conditionHumiditeApres',
                type: 'int',
                isNullable: true
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
