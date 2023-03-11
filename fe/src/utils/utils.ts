import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdef");

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

export function generateFileName() {
  return nanoid();
}
