import EditionCrafter from './lib/EditionCrafter';

/**
 * Default Mirador instantiation
 */
function viewer(config) {
  return new EditionCrafter(config);
}

export default {
  viewer,
};
