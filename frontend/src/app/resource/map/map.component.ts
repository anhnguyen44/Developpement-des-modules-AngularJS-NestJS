import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { CodePostal, LegendeDto } from '@aleaac/shared';
import { NotificationService } from '../../notification/notification.service';
import { tileLayer, latLng, marker, icon, LatLng, featureGroup, Map, Marker } from 'leaflet';
import { LatLngDto } from '@aleaac/shared/src/dto/chantier/latlng.dto';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    providers: []
})
export class MapComponent implements OnInit {
    @Input() cssHeight: string = '300px';
    @Input() cssWidth: string = '100%';
    @Input() zoom: number = 12;
    @Input() autoFit: boolean = true;
    @Input() displayCaption: boolean = false;
    @Input() caption: LegendeDto[] = new Array<LegendeDto>();
    @Input() center: LatLngDto;
    @Input() markers: LatLngDto[];

    ol: any;
    map: any;
    options: any;
    fitBoundsOptions: any = {};
    layersControl: any;
    cssStyle = {};
    listeLeafletMarqueurs: Array<Marker<any>> = new Array<Marker<any>>()

    ngOnInit() {
        this.cssStyle = {
            width: `${this.cssWidth}`,
            height: `${this.cssHeight}`,
        };

        console.log(this.center);
        console.log(this.markers);

        this.options = {
            layers: [
                tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    { maxZoom: 18, attribution: '© OpenStreetMap contributors' }),
            ],
            zoom: this.zoom,
            center: latLng(this.center.latitude, this.center.longitude)
        };

        for (const truc of this.markers) {
            const layer = marker([truc.latitude, truc.longitude], {
                icon: icon({
                    iconSize: [25, 41],
                    iconAnchor: [13, 41],
                    iconUrl: truc.iconPath ? truc.iconPath : 'assets/marker-icon.png',
                    shadowUrl: 'assets/marker-shadow.png'
                }),
            });

            if (truc.popupHTMLContent) {
                layer.bindPopup(truc.popupHTMLContent);
            }
            if (truc.tooltipHTMLContent) {
                layer.bindTooltip(truc.tooltipHTMLContent);
            }
            this.listeLeafletMarqueurs.push(layer);
            this.options.layers.push(layer);
        }
    }

    onMapReady(map: Map) {
        // Auto zoom
        if (this.autoFit) {
            map.fitBounds(featureGroup(this.listeLeafletMarqueurs).getBounds());
        }
    }
}
