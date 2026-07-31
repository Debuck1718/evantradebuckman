import { AccessToken } from "./AccessToken";

export interface AccessTokenRepository {

  create(
    token: AccessToken,
  ): Promise<void>;

  update(
    token: AccessToken,
  ): Promise<void>;

  findById(
    id: string,
  ): Promise<AccessToken | null>;

  findByToken(
    token: string,
  ): Promise<AccessToken | null>;

  findActiveByToken(
    token: string,
  ): Promise<AccessToken | null>;

  delete(
    id: string,
  ): Promise<void>;

}