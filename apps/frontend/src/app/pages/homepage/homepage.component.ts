import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { AddressAutocompleteComponent } from '@shared/components/address-autocomplete/address-autocomplete.component';
import { MatCardModule } from '@angular/material/card';
import { MapService } from '@core/services/map.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'freshbox-homepage',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    NgOptimizedImage,
    RouterLink,
    GoogleMapsModule,
    AddressAutocompleteComponent,
    MatCardModule,
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomepageComponent {
  isScrolled = false;
  defaultMapCenter: google.maps.LatLngLiteral = { lat: 46.76, lng: 2.45 };
  defaultMapZoom = 6;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  mapMarkers: google.maps.LatLngLiteral[] = [
    { lat: 48.86, lng: 2.33 },
    { lat: 48.58, lng: 7.75 },
    { lat: 43.6, lng: 1.44 },
    { lat: 45.75, lng: 1 },
    { lat: 47.21, lng: -1.55 },
    { lat: 43.29, lng: 5.36 },
    { lat: 45.75, lng: 4.83 },
  ];

  constructor(protected map: MapService, private keycloak: KeycloakService) {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 0;
  }

  async login(): Promise<void> {
    await this.keycloak.login({
      redirectUri: `${window.location.href}/authenticated`,
    });
  }

  async signup(): Promise<void> {
    await this.keycloak.register();
  }
}
