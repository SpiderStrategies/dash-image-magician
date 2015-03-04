var im = require('gm').subClass({imageMagick: true})

/*
 * GM/IM has a .thumb convenience function, but it's different than
 * what we want. This creates a thumb function that does what we want:
 *
 * Creates a thumbnail of an image, with some quality, cropping
 * it to preserve aspect ratios, while saving it as a progressive
 * jpeg.
 *
 */
im.prototype.thumb = function (w, h, quality, next) {
  var self = this
  self.size(function (err, size) {
    if (err) {
      return next.apply(self, arguments)
    }

    w = parseInt(w, 10)
    h = parseInt(h, 10)

    self
      .quality(quality)
      .thumbnail(w, h + '^') // Resize to the thumbnail, but with the ^ flag to cut it
      .gravity('center') // Don't know
      .crop(w, h) // Crop down to the correct aspect ratio
      .interlace('Line')  // Progressive JPEGS?
      .strip() // No comments and superfluous information
      .noProfile()
      .buffer(next)
  })

  return self
}

/*
 * Enables simple buffering of an image binary for
 * content-length detection, which is needed by S3
 */
im.prototype.buffer = function (next) {
  this.stream(function (err, stdout, stderr) {
    if (err) {
      return next(err)
    }

    var buf = []
      , len = 0

    stdout.on('data', function (data) {
      buf.push(data)
      len += data.length
    })

    stdout.on('end', function () {
      next(null, Buffer.concat(buf, len))
    })
  })

  return this
}

module.exports = im
