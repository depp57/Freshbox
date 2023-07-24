import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'freshbox-authenticated',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthenticatedComponent implements OnInit {
  user: Subject<Record<never, never>> = new Subject();
  adminOnly: Subject<{ message: string }> = new Subject<{ message: string }>();

  constructor(
    private keycloak: KeycloakService,
    private httpClient: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    const profile = await this.keycloak.loadUserProfile();
    this.user.next(profile);

    this.httpClient
      .get<{ message: string }>('http://localhost:3000/admin')
      .subscribe((a) => {
        this.adminOnly.next(a);
      });
  }
}
