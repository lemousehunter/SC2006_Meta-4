/**
 * Calculates the luminance of a given color and returns the resulting color as a hexadecimal string.
 *
 * @param hex a hexadecimal string representing the original color
 * @param lum the amount of luminance to apply, represented as a decimal number between -1 and 1. Positive values lighten the color, negative values darken the color, and 0 leaves the color unchanged. If omitted or set to 0, the color will be returned unchanged.
 * @return a hexadecimal string representing the resulting color
 */
export default function ColorLuminance(hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = '#',
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ('00' + c).substr(c.length);
  }

  return rgb;
}
