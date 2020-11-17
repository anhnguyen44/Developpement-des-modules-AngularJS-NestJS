import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class DebitInitiauxFinaux1564733469412 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('prelevement', 'tempsExposition');
        await queryRunner.dropColumn('prelevement', 'debitInitial1');
        await queryRunner.dropColumn('prelevement', 'debitInitial2');
        await queryRunner.dropColumn('prelevement', 'debitInitial3');
        await queryRunner.dropColumn('prelevement', 'debitMoyenInitial');
        await queryRunner.dropColumn('prelevement', 'debitFinal1');
        await queryRunner.dropColumn('prelevement', 'debitFinal2');
        await queryRunner.dropColumn('prelevement', 'debitFinal3');
        await queryRunner.dropColumn('prelevement', 'debitMoyenFinal');

        await queryRunner.addColumns('affectation_prelevement', [
            new TableColumn({
                name: 'debitInitial1',
                type: 'decimal',
                precision: 10,
                scale: 3,
                default: null,
                isNullable: true
            }),
            new TableColumn({
                name: 'debitInitial2',
                type: 'decimal',
                precision: 10,
                scale: 3,
                default: null,
                isNullable: true
            }),
            new TableColumn({
                name: 'debitInitial3',
                type: 'decimal',
                precision: 10,
                scale: 3,
                default: null,
                isNullable: true
            }),
            new TableColumn({
                name: 'debitMoyenInitial',
                type: 'decimal',
                precision: 10,
                scale: 3,
                default: null,
                isNullable: true
            }),
            new TableColumn({
                name: 'debitFinal1',
                type: 'decimal',
                precision: 10,
                scale: 3,
                default: null,
                isNullable: true
            }),
            new TableColumn({
                name: 'debitFinal2',
                type: 'decimal',
                precision: 10,
                scale: 3,
                default: null,
                isNullable: true
            }),
            new TableColumn({
                name: 'debitFinal3',
                type: 'decimal',
                precision: 10,
                scale: 3,
                default: null,
                isNullable: true
            }),
            new TableColumn({
                name: 'debitMoyenFinal',
                type: 'decimal',
                precision: 10,
                scale: 3,
                default: null,
                isNullable: true
            })
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
