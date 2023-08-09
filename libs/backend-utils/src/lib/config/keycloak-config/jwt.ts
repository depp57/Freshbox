export interface Jwt {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string; // user uuid
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: RealmAccess;
  resource_access: ResourceAccess;
  scope: string;
  sid: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export interface RealmAccess {
  roles: string[];
}

export interface ResourceAccess {
  backend?: ResourceAccessClient;
  account: Account;
}

export interface ResourceAccessClient {
  roles: string[];
}

export interface Account {
  roles: string[];
}
