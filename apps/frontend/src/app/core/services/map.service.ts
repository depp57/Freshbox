import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  isApiLoaded$: Observable<boolean>;
  placeSubject: Subject<google.maps.places.PlaceResult>;

  private static readonly API_KEY = environment.GOOGLE_MAP_API_KEY;

  constructor(private httpClient: HttpClient) {
    this.placeSubject = new Subject<google.maps.places.PlaceResult>();
    this.isApiLoaded$ = httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?libraries=places&key=${MapService.API_KEY}`,
        'callback'
      )
      .pipe(
        shareReplay(1),
        map(() => true),
        catchError(() => of(false))
      );
  }

  setupAddressAutocomplete(addressInput: HTMLInputElement): void {
    const autocomplete = new google.maps.places.Autocomplete(addressInput, {
      componentRestrictions: { country: ['FR'] },
      types: ['geocode'],
      fields: ['name', 'formatted_address'],
    });

    google.maps.event.addListener(autocomplete, 'place_changed', () =>
      this.placeSubject.next(autocomplete.getPlace())
    );
  }
}
