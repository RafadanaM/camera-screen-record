/* eslint-disable import/prefer-default-export */
export function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(blob);

    fileReader.onloadend = () => {
      if (typeof fileReader.result === "string") {
        resolve(fileReader.result);
      }
    };
  });
}
