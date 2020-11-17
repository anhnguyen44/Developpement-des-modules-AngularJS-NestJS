import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Req,
    UseInterceptors,
    Put, Delete
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { NotificationVuParService } from './notification-vu-par.service';
import { NotificationVuPar } from './notification-vu-par.entity';
import { HistoriqueService } from '../historique/historique.service';


@ApiUseTags('notification-vu-par')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'notification-vu-par'))
export class NotificationVuParController {
    constructor(
        private notificationVuParService: NotificationVuParService,
        private historiqueService: HistoriqueService
    ) { }

    @ApiOperation({ title: 'liste des notificationVuPar' })
    @Get('get-by-processus/:idProcessus')
    @Authorized()
    async getAllByIdProcessus(@Param() params, @Req() req) {
        return await this.notificationVuParService.getAllByProcessus(params.idProcessus, req.query)
    }

    @ApiOperation({ title: 'liste des notificationVuPar' })
    @Get('get-by-processus/:idZone')
    @Authorized()
    async getAllByIdZone(@Param() params, @Req() req) {
        return await this.notificationVuParService.getAllByZone(params.idZone, req.query)
    }

    @ApiOperation({ title: 'Récupération d\'un notificationVuPar' })
    @Get(':idNotificationVuPar')
    @Authorized()
    async get(@Param() params, @Req() req) {
        return await this.notificationVuParService.get(params.idNotificationVuPar)
    }

    @ApiOperation({ title: 'Création d\'un notificationVuPar' })
    @Post('')
    @Authorized()
    async create(@Body() requestBody: NotificationVuPar, @Req() req) {
        const newNotificationVuPar = await this.notificationVuParService.create(requestBody);
        this.historiqueService.add(req.user.id, 'notification-vu-par', requestBody.id, 'Ajout d\'un notificationVuPar');
        return newNotificationVuPar
    }

    @ApiOperation({ title: 'Création d\'un notificationVuPar' })
    @Delete(':idNotificationVuPar')
    @Authorized()
    async delete(@Req() req, @Param() params) {
        const processToDelete = await this.notificationVuParService.get(params.idNotificationVuPar);
        this.historiqueService.add(req.user.id, 'notification-vu-par', processToDelete.id, 'Supression du notificationVuPar ' + JSON.stringify(processToDelete));
        return await this.notificationVuParService.delete(processToDelete)
    }

    @ApiOperation({ title: 'Update d\'un notificationVuPar' })
    @Put('')
    @Authorized()
    async update(@Body() requestBody: NotificationVuPar, @Req() req) {
        const oldNotificationVuPar = await this.notificationVuParService.get(requestBody.id);
        const newNotificationVuPar = await this.notificationVuParService.update(requestBody);

        let historique = '';

        return newNotificationVuPar
    }
}