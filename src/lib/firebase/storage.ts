import {deleteObject, getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {resizeAvatarImage} from '@/lib/profile/resizeAvatarImage';
import {storage} from '@/lib/firebase/client';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

function getAvatarStoragePath(userId: string): string {
  return `avatars/${userId}/avatar.webp`;
}

export function validateAvatarFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Please upload a PNG, JPG, or WEBP image.';
  }
  if (file.size > MAX_SIZE_BYTES) {
    return 'Image must be 2MB or smaller.';
  }
  return null;
}

export async function uploadUserAvatar(
  userId: string,
  file: File,
): Promise<string> {
  const validationError = validateAvatarFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const resized = await resizeAvatarImage(file);
  const avatarRef = ref(storage, getAvatarStoragePath(userId));

  await uploadBytes(avatarRef, resized, {
    contentType: 'image/webp',
    cacheControl: 'public,max-age=3600',
  });

  return getDownloadURL(avatarRef);
}

export async function deleteUserAvatar(userId: string): Promise<void> {
  const avatarRef = ref(storage, getAvatarStoragePath(userId));
  await deleteObject(avatarRef);
}
