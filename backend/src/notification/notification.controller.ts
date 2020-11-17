import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Put,
    UseInterceptors,
    Delete, Req, Patch
} from '@nestjs/common';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';


@ApiUseTags('notification')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'notification'))
export class NotificationController {
    constructor(private notificationService: NotificationService) { }

    @ApiOperation({ title: 'Recupération de toute les valeurs d\'une notification' })
    @Get('getAll/:idUser')
    @Authorized()
    async getAll(@Param() params, @Req() res) {
        return await this.notificationService.getAll(Number.parseInt(params.idUser), res.query)
    }

    @ApiOperation({ title: 'Count de toute les valeurs d\'une notification' })
    @Get('countAll/:idUser')
    @Authorized()
    async countAll(@Param() params, @Req() res) {
        return await this.notificationService.countAll(Number.parseInt(params.idUser), res.query)
    }

    @ApiOperation({ title: 'Count de toute les valeurs d\'une notification' })
    @Get('countUnread/:idUser')
    @Authorized()
    async countUnread(@Param() params, @Req() res) {
        return await this.notificationService.countUnread(Number.parseInt(params.idUser), res.query)
    }

    @ApiOperation({ title: 'Get 1 valeur notification en fonction de son id' })
    @Get(':idNotification')
    @Authorized()
    async get(@Param() params) {
        return await this.notificationService.get(params.idNotification)
    }

    @ApiOperation({ title: 'Création notification' })
    @Post()
    @Authorized()
    async post(@Body() requestBody: Notification) {
        return await this.notificationService.create(requestBody)
    }

    @ApiOperation({ title: 'Update notification' })
    @Put()
    @Authorized()
    async update(@Body() requestBody: Notification) {
        return await this.notificationService.update(requestBody)
    }

    @ApiOperation({ title: 'Update notification' })
    @Patch(':id')
    @Authorized()
    async updatePartial(@Body() requestBody: Notification) {
        return await this.notificationService.update(requestBody)
    }
}
