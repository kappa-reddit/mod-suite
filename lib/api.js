import Snoowrap from 'snoowrap';
import packageJson from '../package.json';
import constants from '../constants';
import credentials from '../credentials';

export default new Snoowrap({
  userAgent: `${constants.userAgentName}:${packageJson.version}`,
  ...credentials.reddit
});
