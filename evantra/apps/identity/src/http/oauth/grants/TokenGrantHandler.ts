import { TokenRequest } from "../TokenRequest";
import { TokenResponse } from "../../../oauth";

export interface TokenGrantHandler {

  supports(
    grantType: string,
  ): boolean;

  execute(
    request: TokenRequest,
  ): Promise<TokenResponse>;

}