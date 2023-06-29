function encode(data) {
    return encodeURIComponent(btoa(data));
}
function decode(data) {
    return atob(decodeURIComponent(data));
}
var text = "Ana Kinouch";
var encoded = encode(text);
var decoded = decode(encoded);
console.log(" Input: " + text + " ENCODED: " + encoded + " DECODED: " + decoded);
