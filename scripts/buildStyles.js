import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import sass from 'node-sass';
import CleanCSS from 'clean-css';
import constants from '../constants';

// Prepare
mkdirp.sync(constants.styles.paths.build);

// Load SASS
const result = sass.renderSync({
  data: fs.readFileSync(constants.styles.paths.input, { encoding: 'utf-8' }),
  includePaths: [constants.styles.paths.assets],
});

// Load emote styles
const emoteStyles = fs.readFileSync(constants.emoticons.paths.stylesheet);

// Write out
const allStyles = Buffer.concat([result.css, emoteStyles]).toString();
const minified = new CleanCSS().minify(allStyles);
fs.writeFileSync(constants.styles.paths.output, minified.styles);
