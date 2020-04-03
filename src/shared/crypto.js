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
//CBC Schema decryption

// function decryptByDESModeCBCx(ciphertext2, key, iv) {
//     var keyHex = CryptoJS.enc.Utf8.parse(key);
//     var ivHex = CryptoJS.enc.Utf8.parse(key);
//     // direct decrypt ciphertext
//     var decrypted = CryptoJS.DES.decrypt({
//     ciphertext: CryptoJS.enc.Hex.parse(ciphertext2)
//     }, keyHex, {
//     iv:ivHex,
//     mode: CryptoJS.mode.CBC
//     });
//     return decrypted.toString(CryptoJS.enc.Utf8);
// }
// function encryptByDES(message, key, iv){
//     //var keyHex = CryptoJS.enc.Utf8.parse(key);
//     var keyHex = CryptoJS.enc.Utf8.parse(key);
//     var ivHex = CryptoJS.enc.Utf8.parse(iv);
//     var encryptd = CryptoJS.TripleDES.encrypt(message, keyHex, {
//         iv: ivHex,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7
//     });
//     return encryptd.toString();
// }

// const encryptByDESModeECB = (message) =>  {
//     var iv = 'E8217521';//CryptoJS.enc.Utf8.parse(key);
//     var key = 'EA81AA1D5FC1EC53E84F30AA746139EEBAFF8A9B76638895';

//     console.log(ivHex);
//     var keyHex = CryptoJS.enc.Utf8.parse(key);
//     var ivHex = CryptoJS.enc.Utf8.parse(iv);
//     var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7
//     });
//     console.log('teste 3', encrypted.ciphertext.toString());
//     return encrypted.toString();
// }

// const decryptByDESModeECB = (ciphertext)  => {
//     var key = 'EA81AA1D5FC1EC53E84F30AA746139EEBAFF8A9B76638895';
//     var keyHex = CryptoJS.enc.Utf8.parse(key);
//     // direct decrypt ciphertext
//     var decrypted = CryptoJS.DES.decrypt({
//         ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
//     }, keyHex, {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7
//     });
//     return decrypted.toString(CryptoJS.enc.Utf8);
// }
