// font.js - Font measurement functions for Moonwalk
import { options } from './globals.js';

// Font measurement for UI scaling
export let fontMeasurement;

/**
 * Set the font measurement based on UI scale
 */
export function setFontMeasurement() {
  fontMeasurement = 15 * options.uiScale;
}
