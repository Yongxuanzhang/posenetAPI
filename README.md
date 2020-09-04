posenetAPI
===
install:
---
brew install ffmpeg

npm install @tensorflow/tfjs-node

npm install @tensorflow-models/posenet

npm install ffmpeg

for unbuntu:

sudo apt-get install build-essential
npm i node-pre-gyp -g
npm rebuild @tensorflow/tfjs-node --build-from-source
npm install canvas
run:
---
node posetest.js

Reference:
---

1.https://dev.to/kojikanao/run-posenet-with-nodejs-12be

2.https://github.com/tensorflow/tfjs-models/tree/master/posenet

3.https://www.npmjs.com/package/ffmpeg
