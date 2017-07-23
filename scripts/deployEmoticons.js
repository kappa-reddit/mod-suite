import fs from 'fs';
import path from 'path';
import constants from '../constants';
import api from '../lib/api';

fs.readdirSync(constants.emoticons.paths.build)
  .filter(filename => path.extname(filename) === '.png')
  .forEach(spritesheet => {
    api.getSubreddit(constants.subreddit).uploadStylesheetImage({
      name: path.basename(spritesheet, path.extname(spritesheet)),
      file: path.join(constants.emoticons.paths.build, spritesheet),
    });
});
