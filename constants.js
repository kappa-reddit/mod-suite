import path from 'path';

const constants = {
  subreddit: process.env.NODE_ENV === 'production' ? 'Kappa' : 'KappaExperiments',
  userAgentName: '/r/KappaModSuite',
  paths: {
    build: path.join(__dirname, 'build'),
    assets: path.join(__dirname, 'assets'),
  },
};

const emoticonsBuildPath = path.join(constants.paths.build, 'emoticons');
const emoticonsAssetsPath = path.join(constants.paths.assets, 'emoticons');
constants.emoticons = {
  perSpritesheet: 140,
  paths: {
    build: emoticonsBuildPath,
    assets: emoticonsAssetsPath,
    stylesheet: path.join(emoticonsBuildPath, 'styles.css'),
    images: path.join(emoticonsAssetsPath, 'images'),
    aliases: path.join(emoticonsAssetsPath, 'aliases.json'),
    redditText: path.join(emoticonsBuildPath, 'reddit.txt'),
  },
};

const stylesBuildPath = path.join(constants.paths.build, 'styles');
const stylesAssetsPath = path.join(constants.paths.assets, 'styles');
constants.styles = {
  paths: {
    build: stylesBuildPath,
    assets: stylesAssetsPath,
    input: path.join(stylesAssetsPath, 'base.scss'),
    output: path.join(stylesBuildPath, 'style.css'),
  },
};

export default constants;
