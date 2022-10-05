import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import { verify } from "jsonwebtoken";
import * as middy from "middy";
import { secretsManager } from "middy/middlewares";
import "source-map-support/register";

import { createLogger } from "../../utils/logger";
import { JwtPayload } from "../../auth/JwtPayload";

const logger = createLogger("auth");

const secretId = process.env.AUTH_0_SECRET_ID;
const secretField = process.env.AUTH_0_SECRET_FIELD;


export const handler = middy(
  async (
    event: CustomAuthorizerEvent,
    context
  ): Promise<CustomAuthorizerResult> => {
    try {
      const decodedToken = await verifyToken(
        event.authorizationToken,
        context.AUTH0_SECRET[secretField]
      );
      logger.info(`User was authorized ${decodedToken}`);

      return {
        principalId: decodedToken.sub,
        policyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: "execute-api:Invoke",
              Effect: "Allow",
              Resource: "*",
            },
          ],
        },
      };
    } catch (e) {
      console.log("User was not authorized", e.message);

      return {
        principalId: "user",
        policyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: "execute-api:Invoke",
              Effect: "Deny",
              Resource: "*",
            },
          ],
        },
      };
    }
  }
);

async function verifyToken(
  authHeader: string,
  secret: string
): Promise<JwtPayload> {
  const token = getToken(authHeader);

  return verify(token, secret) as JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  return token;
}

handler.use(
  secretsManager({
    cache: true,
    cacheExpiryInMillis: 60000,
    // Throw an error if can't read the secret
    throwOnFailedCall: true,
    secrets: {
      AUTH0_SECRET: secretId,
    },
  })
);
