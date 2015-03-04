var im = require('./index')
  , assert = require('assert')
  , fs = require('fs')

describe('Extends GM (Image magick)', function () {

  it('buffers', function (done) {
    var buffer = fs.readFileSync(__dirname + '/linus.jpg')
    im(buffer)
      .resize(100, 100)
      .buffer(function (err, buf) {
        assert(!err)
        assert(buf)
        assert(buf.length < buffer.length)
        // This test isn't reliable between dev computers, make sure it's big, though.
        assert(buf.length >= 20000 && buf.length <= 25000, 'buffer size ' + buf.length + ' but expected between 22982 and 23076')
        done()
      })
  })

  it('thumbs', function (done) {
    var buffer = fs.readFileSync(__dirname + '/linus.jpg')

    im(buffer).size(function (err, size) {
      assert.equal(2340, size.width)
      assert.equal(2340, size.height)

      im(buffer).thumb(800, 450, 100, function (err, image) {
        assert(!err)
        assert(image)

        var writeStream = fs.writeFile(__dirname + '/thumb-linus.jpg', image, function (err, f) {
          im(__dirname + '/thumb-linus.jpg').size(function (err, size) {
            assert.equal(800, size.width)
            assert.equal(450, size.height)
            done()
          })
        })
      })
    })

    after(function (done) {
      fs.unlink(__dirname + '/thumb-linus.jpg', done)
    })
  })

  it('thumbs with weird sizes', function (done) {
    var buffer = fs.readFileSync(__dirname + '/dashboard-969x588.jpg')

    im(buffer).size(function (err, size) {
      assert.equal(969, size.width)
      assert.equal(588, size.height)

      im(buffer).thumb(800, 450, 100, function (err, image) {
        assert(!err)
        assert(image)

        var writeStream = fs.writeFile(__dirname + '/thumb-dashboard-969×588.jpg', image, function (err, f) {
          im(__dirname + '/thumb-dashboard-969×588.jpg').size(function (err, size) {
            assert.equal(800, size.width)
            assert.equal(450, size.height)
            done()
          })
        })
      })
    })

    after(function (done) {
      fs.unlink(__dirname + '/thumb-dashboard-969×588.jpg', done)
    })
  })

})
