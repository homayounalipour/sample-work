import {useRef, useState} from 'react';
import Avatar from '@/kit/Avatar';
import Button from '@/kit/Button';
import {useAuth} from '@/contexts/AuthContext';
import {getStorageErrorMessage} from '@/lib/firebase/errors';
import {deleteUserAvatar, uploadUserAvatar} from '@/lib/firebase/storage';

type AvatarUploadControlProps = {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
};

export default function AvatarUploadControl(props: AvatarUploadControlProps) {
  const {displayName, email, photoURL, onSuccess, onError} = props;
  const {user, updatePhotoURL} = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const avatarName = displayName ?? email ?? undefined;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !user) return;

    setUploading(true);
    try {
      const downloadUrl = await uploadUserAvatar(user.uid, file);
      await updatePhotoURL(downloadUrl);
      onSuccess?.('Profile photo updated.');
    } catch (error) {
      onError?.(getStorageErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!user) return;

    setRemoving(true);
    try {
      try {
        await deleteUserAvatar(user.uid);
      } catch {
        // Avatar may not exist in storage (e.g. Google photo only).
      }
      await updatePhotoURL('');
      onSuccess?.('Profile photo removed.');
    } catch (error) {
      onError?.(getStorageErrorMessage(error));
    } finally {
      setRemoving(false);
    }
  };

  const isBusy = uploading || removing;

  return (
    <div className="flex flex-row items-center gap-4 justify-between">
      <Avatar
        src={photoURL ?? undefined}
        name={avatarName}
        size="lg"
        className="h-20 w-20 text-body-md"
      />
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={event => void handleFileChange(event)}
        />
        <Button
          variant="secondary"
          size="sm"
          isLoading={uploading}
          disabled={!isBusy}
          onClick={() => inputRef.current?.click()}
          className="h-6"
        >
          {photoURL ? 'Change photo' : 'Upload photo'}
        </Button>
        {photoURL && (
          <Button
            variant="ghost"
            size="sm"
            isLoading={removing}
            disabled={isBusy}
            onClick={() => void handleRemove()}
          >
            Remove photo
          </Button>
        )}
      </div>
    </div>
  );
}
