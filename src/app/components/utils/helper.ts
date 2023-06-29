function encode(data) {
    return encodeURIComponent(btoa(data));
}

function decode(data) {
    return atob(decodeURIComponent(data));
}


let text = "Ana Kinouch"
let encoded = encode(text)
let decoded= decode(encoded)

console.log(" Input: " + text + " ENCODED: " + encoded + " DECODED: " + decoded)
