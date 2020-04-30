/**
 * Fields in a request to get a Pre-signed URL
 */
export interface GenerateUploadUrlRequest {
  Bucket: string;
  Key: string;
  Expires: string;
}
