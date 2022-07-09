# discord-music
A discord bot focused around playing music from Youtube URLs.

Before running `npm install` you'll probably need to have the VS 2015 build tools installed. You can get them [here](https://www.microsoft.com/en-us/download/details.aspx?id=48159).

You also might need to run `npm i -g node-gyp` as well before running `npm install`, though feel free to just try running `npm install` before hand and referring to this afterwards if stuff goes wrong.

One other issue I encountered when initially developing this is that I needed to install bin-version-check-cli since installing another package failed for some reason. `npm i -g bin-version-check-cli` is your friend here too probably. Or even `npm i -D bin-version-check-cli`

After everything is installed, copy `config.json.example` to `config.json` and replace the values as accordingly for your own Discord bot/server. Then you'll probably need to run `node authorize.js` and follow the instructions there.  This is for play-dl (the thing that grabs the audio streams), I don't know why it needs it, but hey, just follow the instructions listed [here](https://github.com/play-dl/play-dl/tree/ce9c57460701535ca077f479fb9c9c2d88fa0c7f/instructions) for more context.
