// Collection of utility functions for Firebase cloud storage
import * as admin from "firebase-admin";

const BUCKET_PATH = "gs://uplift-e96ab.appspot.com";

/**
 * Fetches the download URL for a given storage path
 * @param {string} filePath
 */

export const getDownloadURL = (filePath: string) => {
  if (filePath === null || filePath === undefined) {
    return null;
  }

  const storage = admin.storage();

  async function getContentType() {
    const [metadata] = await storage
      .bucket(BUCKET_PATH)
      .file(filePath)
      .getMetadata();

    return metadata.contentType;
  }

  const type = getContentType();

  const mediaData = {
    downloadURL: storage
      .bucket(BUCKET_PATH)
      .file(filePath)
      .getSignedUrl({ action: "read", expires: "09-09-2051" }),
    contentType: type,
  };

  return mediaData;
};

/**
 * Moves the specifed source file to the destintation path
 * @param {string} srcPath
 * @param {string} destPath
 */
export const moveFile = async (
  srcPath: string | undefined,
  destPath: string | null
) => {
  if (destPath === null || srcPath === undefined) {
    return null;
  }
  const storage = admin.storage().bucket(BUCKET_PATH);
  await storage.file(srcPath).copy(storage.file(destPath));

  return storage.file(srcPath).delete();
};

/**
 * Deletes the specifed file at path
 * @param {string} path
 */
export const deleteFile = (path: string | undefined) => {
  if (path === undefined) {
    return null;
  }
  const storage = admin.storage().bucket(BUCKET_PATH);
  return storage.file(path).delete();
};
