import EditionCrafter from './EditionCrafter';

/**
 * Default Mirador instantiation
 */
function viewer(config) {
  return new EditionCrafter(config);
}

export { viewer };
