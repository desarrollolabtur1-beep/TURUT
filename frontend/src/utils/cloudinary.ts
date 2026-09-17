import { api } from '../services/api.service';
import { CLOUDINARY_CLOUD_NAME } from '../config';

async function getToken(): Promise<string | null> {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export async function getUploadSignature(folder: string = 'turut') {
  const { data } = await api.post('/uploads/signature', { folder });
  return data.data;
}

export async function uploadToCloudinary(
  localUri: string,
  folder: string = 'turut'
): Promise<{ public_id: string; secure_url: string; width: number; height: number }> {
  const { timestamp, signature, folder: sigFolder, api_key, cloud_name } =
    await getUploadSignature(folder);

  const formData = new FormData();
  formData.append('file', { uri: localUri, name: 'photo.jpg', type: 'image/jpeg' });
  formData.append('api_key', api_key);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', sigFolder);

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`;
  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.status}`);
  }

  const result = await response.json();
  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    width: result.width,
    height: result.height,
  };
}

export function getAssetUrl(asset: string | { secure_url?: string }): string {
  if (typeof asset === 'string') return asset;
  return asset.secure_url ?? '';
}

export function buildDeliveryUrl(
  publicId: string,
  opts?: { width?: number; height?: number }
): string {
  const params = new URLSearchParams({
    fetch_format: 'auto',
    quality: 'auto',
    ...(opts.width ? { width: String(opts.width) } : {}),
    ...(opts.height ? { height: String(opts.height) } : {}),
  }).toString();
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${params}/${publicId}`;
}

export function buildPlaceholderUrl(publicId: string): string {
  const params = new URLSearchParams({
    width: '20',
    crop: 'fill',
    effect: 'blur:300',
    quality: 'low',
    fetch_format: 'auto',
  }).toString();
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${params}/${publicId}`;
}
