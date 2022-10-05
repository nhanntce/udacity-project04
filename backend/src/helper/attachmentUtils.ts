import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { createLogger } from "../utils/logger";

const XAWS = AWSXRay.captureAWS(AWS);
const log = createLogger("Todo Access");

export class AttachMentUtils {
  constructor(
    private readonly BUCKET_NAME = process.env.ATTACHMENT_S3_BUCKET,
    private readonly TIME_EXPIRATION = process.env.SIGNED_URL_EXPIRATION,
    private readonly S3_CLIENT = createS3Client()
  ) {}

  async createPresignedUrl(fileName: string) {
    log.info(`[START] create signed url to put file: ${fileName}`);

    return this.S3_CLIENT.getSignedUrl("putObject", {
      Bucket: this.BUCKET_NAME,
      Key: fileName,
      Expires: parseInt(this.TIME_EXPIRATION),
    });
  }
}

function createS3Client() {
  return new XAWS.S3({
    signatureVersion: "v4",
  });
}
