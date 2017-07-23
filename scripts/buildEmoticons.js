import fs from 'fs';
import path from 'path';
import Spritesmith from 'spritesmith';
import Promise from 'bluebird';
import _ from 'lodash';
import CSSJSON from 'CSSJSON';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import constants from '../constants';
const aliases = require(constants.emoticons.paths.aliases);
Promise.promisifyAll(Spritesmith);

async function main() {
  const allEmotes = fs.readdirSync(constants.emoticons.paths.images)
    .filter(filename => path.extname(filename) === '.png')
    .map(filename => path.join(constants.emoticons.paths.images, filename));
  const allEmoteNames = allEmotes.map(emoticonPath => path.basename(emoticonPath, '.png'));
  const emoteChunks = _.chunk(allEmotes, constants.emoticons.perSpritesheet);

  // Clean
  mkdirp.sync(constants.emoticons.paths.build);
  rimraf.sync(path.join(constants.emoticons.paths.build, '*'));

  // Create spritesheets and CSS
  let cssJson = {};
  const actions = emoteChunks.map(processChunk);
  const results = Promise.all(actions);
  results.then(data => {
    data.forEach((result, i) => {
      cssJson.children = _.extend(cssJson.children, result.cssJson.children);
    });
    fs.writeFileSync(constants.emoticons.paths.stylesheet, CSSJSON.toCSS(cssJson));
  });

  // Create reddit markup
  const cols = 3;
  const redditTxt = [
    Array(cols).fill('Emote|Code').join('|'),
    Array(cols).fill('--:|:--').join('|')
  ];

  const emotesWithAliases = [];
  allEmoteNames.forEach(emoteName => {
    emotesWithAliases.push(emoteName);
    getAliases(emoteName).forEach(alias => emotesWithAliases.push[alias]  );
  });

  const chunks = _.chunk(emotesWithAliases, Math.ceil(emotesWithAliases.length / cols));

  chunks[0].forEach((name, i) => {
    const names = [name];
    chunks.slice(1).forEach(chunk => {
      if (chunk[i]) {
        names.push(chunk[i]);
      }
    });
    redditTxt.push(names.map(n => `[](/${n})|${n}`).join('|'));
  });

  fs.writeFileSync(constants.emoticons.paths.redditText, redditTxt.join("\n"));
}

async function getSpritesmithResults(src) {
  return await Spritesmith.runAsync({src: src});
}

function getAliases(emoteName) {
  const emoteAliases = aliases[emoteName];
  let emoteNames = [];
  if (emoteAliases) {
    emoteNames = emoteAliases.concat(emoteName);
  } else {
    emoteNames = [emoteName];
  }
  return emoteNames;
}

async function processChunk(chunk, i) {
  const result = { cssJson: { children: {} } };
  const spritesmithResult = await getSpritesmithResults(chunk);
  const overallSelector = [];
  const spriteFilename = `sprite${i+1}.png`;
  const spritePath = path.join(constants.emoticons.paths.build, spriteFilename);

  fs.writeFileSync(spritePath, spritesmithResult.image);
  for (const filePath in spritesmithResult.coordinates) {
    const emoteName = path.basename(filePath, '.png');
    const coords = spritesmithResult.coordinates[filePath];

    getAliases(emoteName).forEach(alias => {
      const selector = `.flair-${alias},a[href="/${alias}"]:after`;
      overallSelector.push(selector);
      result.cssJson.children[selector] = {
        attributes: {
          width: coords.width + 'px',
          height: coords.height + 'px',
          'background-position': (-coords.x) + 'px ' + (-coords.y) + 'px'
        }
      };
    });
  }
  result.cssJson.children[overallSelector] = {
    attributes: {
      cursor: 'default',
      display: 'inline-block',
      'background-image': `url("%%${path.basename(spriteFilename, '.png')}%%")`,
      'background-repeat': 'no-repeat',
      'content': '" "'
    }
  }
  return result;
}

main();
