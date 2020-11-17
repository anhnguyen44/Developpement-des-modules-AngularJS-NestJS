import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class MeteoAffectationToPrelevement1564731052288 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        // SUPPRESSION METEO AFFECTATION PRELEVEMENT
        await queryRunner.dropColumn('affectation_prelevement', 'pluieAvant');
        await queryRunner.dropColumn('affectation_prelevement', 'vistesseVentAvant');
        await queryRunner.dropColumn('affectation_prelevement', 'directionVentAvant');
        await queryRunner.dropColumn('affectation_prelevement', 'temperatureAvant');
        await queryRunner.dropColumn('affectation_prelevement', 'humiditeAvant');
        await queryRunner.dropColumn('affectation_prelevement', 'pressionAvant');
        await queryRunner.dropColumn('affectation_prelevement', 'pluiePendant');
        await queryRunner.dropColumn('affectation_prelevement', 'vistesseVentPendant');
        await queryRunner.dropColumn('affectation_prelevement', 'directionVentPendant');
        await queryRunner.dropColumn('affectation_prelevement', 'temperaturePendant');
        await queryRunner.dropColumn('affectation_prelevement', 'humiditePendant');
        await queryRunner.dropColumn('affectation_prelevement', 'pressionPendant');
        await queryRunner.dropColumn('affectation_prelevement', 'pluieApres');
        await queryRunner.dropColumn('affectation_prelevement', 'vistesseVentApres');
        await queryRunner.dropColumn('affectation_prelevement', 'directionVentApres');
        await queryRunner.dropColumn('affectation_prelevement', 'temperatureApres');
        await queryRunner.dropColumn('affectation_prelevement', 'humiditeApres');
        await queryRunner.dropColumn('affectation_prelevement', 'pressionApres');

        // SUPPRESSION TACHES PROCESSUS
        await queryRunner.dropColumn('affectation_prelevement', 'tachesProcessus');

        await queryRunner.addColumns('prelevement', [
            // METEO AVANT
            new TableColumn({
                name: 'pluieAvant',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'vistesseVentAvant',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'directionVentAvant',
                type: 'varchar',
                isNullable: true
            }),
            new TableColumn({
                name: 'temperatureAvant',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'humiditeAvant',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'pressionAvant',
                type: 'int',
                isNullable: true
            }),
            // METEO PEANDANT
            new TableColumn({
                name: 'pluiePendant',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'vistesseVentPendant',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'directionVentPendant',
                type: 'varchar',
                isNullable: true
            }),
            new TableColumn({
                name: 'temperaturePendant',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'humiditePendant',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'pressionPendant',
                type: 'int',
                isNullable: true
            }),
            // METEO APRES
            new TableColumn({
                name: 'pluieApres',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'vistesseVentApres',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'directionVentApres',
                type: 'varchar',
                isNullable: true
            }),
            new TableColumn({
                name: 'temperatureApres',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'humiditeApres',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'pressionApres',
                type: 'int',
                isNullable: true
            }),
            // CONDITION INTERIEUR
            new TableColumn({
                name: 'temperature',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'pression',
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: 'humidite',
                type: 'int',
                isNullable: true
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
