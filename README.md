# image-loader
 
## Loader webpack to resize and compress images

### Installation

```
npm i @alessio95/image-loader
```

### Add the loader on your webpack.config.js
```
{
  test: /\.(png|svg|jpg|gif)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: 'images/[name].[ext]',
      },
    },
    'image-loader', // Minify & Resize images
  ],
},
```

The loader recovers all images from your project called in your /[s?css]/ or js files. 
His task is to compress your image and resize them.

**Resize info :**
- small version : *scale(0.5) | divide by 2*
- large version : *scale(3) | 1/4 more larger*
