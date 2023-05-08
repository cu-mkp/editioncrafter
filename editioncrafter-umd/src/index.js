import EditionCrafter from './EditionCrafter.jsx';

/**
 * Default Mirador instantiation
 */
function viewer(config) {
  return new EditionCrafter(config);
}

export default {
  viewer
};
