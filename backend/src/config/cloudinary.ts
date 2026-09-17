import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryAsset {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  blurhash?: string;
}

export type ImageAsset = CloudinaryAsset;

export function signUploadParams(folder: string = 'turut') {
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = { timestamp, folder };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    env.CLOUDINARY_API_SECRET
  );
  return { cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, timestamp, signature, folder };
}

export function buildDeliveryUrl(
  publicId: string,
  opts?: { width?: number; height?: number }
): string {
  const transformations: Record<string, unknown> = {
    fetch_format: 'auto',
    quality: 'auto',
    ...opts,
  };
  return cloudinary.url(publicId, { ...transformations, secure: true });
}

export function buildPlaceholderUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    width: 20,
    crop: 'fill',
    effect: 'blur:300',
    quality: 'low',
    fetch_format: 'auto',
    secure: true,
  });
}

export function normalizeImageAsset(input: string | ImageAsset): ImageAsset {
  if (typeof input === 'string') {
    return { public_id: '', secure_url: input, width: 0, height: 0 };
  }
  return { ...input };
}

export function extractMeta(response: Record<string, unknown>): CloudinaryAsset {
  return {
    public_id: String(response.public_id ?? ''),
    secure_url: String(response.secure_url ?? ''),
    width: Number(response.width ?? 0),
    height: Number(response.height ?? 0),
    blurhash: response.blurhash as string | undefined,
  };
}

export async function uploadBase64ToCloudinary(
  dataUri: string,
  folder: string = 'turut'
): Promise<CloudinaryAsset> {
  const response = await cloudinary.uploader.upload(dataUri, { folder });
  return extractMeta(response);
}
