import AWS from "aws-sdk";
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3({});
export async function uploadToS3({
  data,
  fileName,
}: {
  data: any;
  fileName: string;
}): Promise<{ status: boolean; data?: any; error?: any }> {
  return new Promise((resolve, reject) => {
    var buf = Buffer.from(
      data.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    var params = {
      Key: fileName,
      Body: buf,
      Bucket: process.env.BUCKET_NAME!,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    };
    s3.putObject(params, function (err, data) {
      if (err) {
        console.log(err);
        resolve({ status: false, error: err });
      } else {
        resolve({ status: true, data: data });
      }
    });
  });
}
