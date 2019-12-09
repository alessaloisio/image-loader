const fs = require("fs");
const path = require("path");

const imagemin = require("imagemin");
const Jimp = require("jimp");

// Config type files
const config = {
  gifsicle: {
    interlaced: false
  },
  mozjpeg: {
    quality: 65
  },
  pngquant: {
    quality: [0.65, 0.9],
    speed: 4
  },
  optipng: {
    enabled: false
  },
  svgo: {},
  webp: {
    quality: 75
  }
};

module.exports = async function(content) {
  // Verify if buffer or string
  const typeContent = Buffer.isBuffer(content) ? "buffer" : "string";
  const pathOutput = path.resolve(this._compiler.outputPath, "images");
  const fileExt = this.resourcePath.match(/\.([A-Za-z0-9]+)$/)[1];
  const fileName = this.resourcePath
    .split("/")
    .reverse()[0]
    .replace("." + fileExt, "");

  // if string read stream
  if (typeContent === "string") content = fs.createReadStream(content);

  // Optimizers
  const plugins = [];

  plugins.push(require("imagemin-mozjpeg")(config.mozjpeg));
  plugins.push(require("imagemin-pngquant")(config.pngquant));
  plugins.push(require("imagemin-optipng")(config.optipng));
  plugins.push(require("imagemin-svgo")(config.svgo));
  plugins.push(require("imagemin-gifsicle")(config.gifsicle));
  // plugins.push(require("imagemin-webp")(config.webp));

  // Run plugins
  const callback = this.async();

  const image = await imagemin.buffer(content, {
    plugins: plugins
  });

  if (fileExt !== "svg") {
    Jimp.read(image).then(img => {
      img
        .scale(0.5)
        .write(`${pathOutput}/${fileName}.zoomSmall.${img.getExtension()}`);

      img
        .scale(3)
        .write(`${pathOutput}/${fileName}.zoomLarge.${img.getExtension()}`);

      callback(null, image);
    });
  }
};

module.exports.raw = true;
