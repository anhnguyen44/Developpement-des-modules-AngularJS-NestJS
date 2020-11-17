import {ApiOperation, ApiUseTags, ApiResponse} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Post, Req,
    UseInterceptors
} from '@nestjs/common';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {HistoriqueService} from './historique.service';
import {Authorized} from '../common/decorators/authorized.decorator';
import {Historique} from './historique.entity';

@ApiUseTags('historique')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'historique'))
export class HistoriqueController {
    constructor(private historiqueService: HistoriqueService) {}

    @ApiOperation({title: 'historique via application et idParent'})

    @Get('/:application/:idParent')
    @Authorized()
    async find(@Param() params, @Req() req) {
        return await this.historiqueService.getByApplication(params.application, params.idParent, req.query)
    }

    @Get('count/:application/:idParent')
    @Authorized()
    async count(@Param() params) {
        return await this.historiqueService.countByApplication(params.application, params.idParent)
    }

    @ApiOperation({title: 'Nouvel historique'})
    @ApiResponse({
        status: 200,
        description: 'Historique créé',
        type: Historique
    })
    @Post()
    @Authorized()
    async create(@Body() requestBody: Historique, @Req() req) {
        try {
            // console.log(requestBody);
            if (req.user) {
                requestBody.idUser = req.user.id;
            }
            return await  this.historiqueService.create(requestBody);
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }
}