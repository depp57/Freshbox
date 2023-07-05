import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  selector: 'freshbox-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NxWelcomeComponent],
})
export class AppComponent {}
