import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapService } from '@core/services/map.service';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'freshbox-address-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './address-autocomplete.component.html',
  styleUrls: ['./address-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressAutocompleteComponent implements AfterViewInit {
  @ViewChild('addressText') addressText!: ElementRef;

  constructor(protected map: MapService) {}

  ngAfterViewInit(): void {
    this.map.isApiLoaded$.subscribe(() => {
      this.map.setupAddressAutocomplete(this.addressText.nativeElement);
    });
  }
}
