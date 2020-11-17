import { Global, Module, HttpService, HttpModule } from '@nestjs/common';
import { GeocodingService } from './geocoding';
import { LatLng } from './LatLng';

@Global()
@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [GeocodingService, LatLng],
    exports: [GeocodingService, LatLng]
})
export class GeocodingModule { }
