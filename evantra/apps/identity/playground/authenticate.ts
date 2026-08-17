import "dotenv/config";

import { Pool } from "pg";

import { IdentityFactory } from "../src/IdentityFactory";
import { EvantraId } from "../src/account";
import {
  AuthenticationClient,
  AuthenticationContext,
  AuthenticationDetails,
  AuthenticationDevice,
  AuthenticationNetwork,
} from "../src/authentication";
import {
  AuthenticationLevel,
  AuthenticationMethod,
  DeviceType,
  MfaMethod,
  NetworkType,
} from "../src/session/enums";

async function main() {

  const db = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const identity =
    IdentityFactory.create(db);

  const context = AuthenticationContext.create({
    device: AuthenticationDevice.create({
      type: DeviceType.DESKTOP,
    }),
    network: AuthenticationNetwork.create({
      ipAddress: "127.0.0.1",
      networkType: NetworkType.WIRED,
    }),
    client: AuthenticationClient.create({}),
    details: AuthenticationDetails.create({
      method: AuthenticationMethod.PASSWORD,
      level: AuthenticationLevel.LOW,
      mfaMethod: MfaMethod.NONE,
    }),
  });

  const result =
    await identity
      .workflows
      .authenticate
      .execute({

        evantraId:
          EvantraId.from("evans"),

        password:
          "Password123!",

        context,

      });

  console.log(
    "Authenticated Account"
  );

  console.log(result.account);

  console.log();

  console.log(
    "Created Session"
  );

  console.log(result.session);

  await db.end();

}

main().catch(console.error);