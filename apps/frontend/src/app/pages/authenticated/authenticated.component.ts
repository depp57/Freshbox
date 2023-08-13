import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { env } from '@env/environment.development';

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
  test = env.ENV;

  constructor(private keycloak: KeycloakService, private httpClient: HttpClient) {}

  async ngOnInit(): Promise<void> {
    const profile = await this.keycloak.loadUserProfile();
    this.user.next(profile);
    this.httpClient.get<unknown>(`${env.USER_API_BASE_URL}/health`).subscribe((a) => {
      this.adminOnly.next({ message: JSON.stringify(a) });
    });
  }
}
