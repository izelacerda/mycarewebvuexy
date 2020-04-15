// Especifico
import CryptoJS from "crypto-js";

var keypr = "EA81AA1D5FC1EC53E84F30AA746139EEBAFF8A9B76638895";
var ivpr = "87AF7EA221F3FFF5";

export const encryptByDESModeCBC = message => {
  let iv = CryptoJS.enc.Hex.parse(ivpr);
  let pt = CryptoJS.enc.Utf8.parse(message);
  let key = CryptoJS.enc.Hex.parse(keypr);

  let result = CryptoJS.TripleDES.encrypt(pt, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC
  });

  let output = CryptoJS.enc.Hex.stringify(
    CryptoJS.enc.Base64.parse(result.toString())
  );

  return output.toString();
};
export const decryptByDESModeCBC = message => {
  let iv = CryptoJS.enc.Hex.parse(ivpr);
  let pt = CryptoJS.enc.Hex.parse(message);
  let key = CryptoJS.enc.Hex.parse(keypr);

  var result = CryptoJS.TripleDES.decrypt(
    {
      ciphertext: pt
    },
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC
    }
  );

  let output = result.toString(CryptoJS.enc.Utf8);
  return output.toString();
};
