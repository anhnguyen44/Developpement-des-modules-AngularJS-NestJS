import { Injectable, HttpService } from '@nestjs/common';
import { LatLng } from './LatLng';
import { map } from 'rxjs/internal/operators/map';

@Injectable()
export class GeocodingService {
    constructor(private readonly http: HttpService) { }

    async getLatLng(adresse: string, codePostal: string): Promise<LatLng> {
        const result = new LatLng();
        const re: RegExp = /\ /gi;
        if (!adresse) {
            adresse = '';
        }
        const adresseFormat = adresse.replace(re, '+');
        // tslint:disable-next-line: max-line-length
        return await this.http.get('https://api-adresse.data.gouv.fr/search/?q=' + adresseFormat + '&postcode=' + codePostal + '&limit=1&autocomplete=0')
            .pipe(
                map(response => response.data)
            ).toPromise().then(data => {
                // console.log(data);
                if (data.features && data.features[0] && data.features[0].geometry && data.features[0].geometry.coordinates) {
                    result.latitude = data.features[0].geometry.coordinates[1];
                    result.longitude = data.features[0].geometry.coordinates[0];
                } else {
                    result.latitude = null;
                    result.longitude = null;
                }
                return result;
            }, err => {
                console.error(err);
                result.latitude = null;
                result.longitude = null;
                return result;
            });
    }
}
