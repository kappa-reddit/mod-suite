import fs from 'fs';
import constants from '../constants';
import api from '../lib/api';

api.getSubreddit(constants.subreddit).updateStylesheet({
  css: fs.readFileSync(constants.styles.paths.output),
});
