import fetch from "node-fetch";
import fs from "fs";

async function getImageAsBase64(imageUrl) {
  const response = await fetch(imageUrl);
  const buffer = await response.buffer();
  const base64Image = buffer.toString('base64');

  return base64Image;
}
export default getImageAsBase64