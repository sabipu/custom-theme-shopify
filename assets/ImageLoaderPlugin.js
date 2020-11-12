// Awesome new ImageLoader Object written by Bipu & Travis
// 7/8/2019 Dilate.com.au

function ImageLoader (options) {
  if(typeof options != 'object') {
    options = {};
  }
  this.options = options;
  if(typeof this.options.loadedImages != "object")
  {
    this.options.loadedImages = [];
  }

  if(typeof this.options.images == "object" && this.options.images.length > 0) {
   this.loadImages();
  }
}

ImageLoader.prototype.loadNextImage = function(x) {
  if(x < this.options.images.length - 1) {
    this.loadImage( x + 1);
  } else {
    if(typeof this.options.complete == "function")
    {
      this.options.complete();
    }
  }
}

ImageLoader.prototype.loadImage = function(x) {
  var img = new Image();
  var __that = this;

  img.onload = function () {
    // go to another item in array
    __that.options.loadedImages.push(img);
    if(typeof __that.options.load == "function")
    {
      __that.options.load(x, img);
    }
    __that.loadNextImage(x);
  }
  img.onerror = function ()
  {
    if(typeof __that.options.error == "function")
    {
      __that.options.error(x, img);
    }
    var shouldLoadNext = true;
    if(typeof __that.options.stopOnError != "undefined" && __that.options.stopOnError == true)
    {
      shouldLoadNext = false;
    }
    if(shouldLoadNext)
    {
      __that.loadNextImage(x);
    }
    else
    {
      if(typeof __that.options.failed == "function")
      {
        __that.options.failed();
      }
    }
  }
  img.src = __that.options.images[x];
}

ImageLoader.prototype.loadImages = function () {
  this.loadImage(0);
}

var __imageFaders = 0;

function ImageFader(options) {
  if(typeof options != 'object') {
    options = {};
  }
  __imageFaders+=1;
  this.currentSlide = undefined;
  this.lastSlide = undefined;
  this.images = [];
  this.state = "play";
  this.options = options;
  this.interval = undefined;
  this.name = typeof this.options.name != "undefined" ? this.options.name : "ImageFader Obj #" + __imageFaders;
  var __that = this;

  this.options.ImageLoader = new ImageLoader({
    load: function(x, img) {
      __that.images.push(img);
      if(__that.currentSlide == undefined) {
        __that.start();
      }
    }
  });

  if(typeof this.options.images == "object" && this.options.images.length > 0) {
   this.load(this.options.images);

  }

  this.container = $(this.options.target);
}

ImageFader.prototype.load = function(images) {
  if(this.options.randomise === true) {
    images = this.shuffle(images);
  }

  this.options.ImageLoader.options.images = images;
  this.options.ImageLoader.loadImages();
}

ImageFader.prototype.shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

ImageFader.prototype.start = function() {
  this.showSlide(0);

}


ImageFader.prototype.play = function() {
  this.state = "play";
  this.runState();

}

ImageFader.prototype.pause = function() {
  this.state = "pause";
  this.runState();
}

ImageFader.prototype.stop = function() {
  this.state = "pause";
  this.currentSlide = -1;
  this.runState();
}

ImageFader.prototype.showSlide = function (x) {
  if(this.currentSlide != undefined && x === this.currentSlide) return;

  var __that = this;
  var img = typeof this.images[x] != "undefined" ? this.images[x] : undefined;
  if(img != undefined)
  {
    this.lastSlide = this.currentSlide;
    this.currentSlide = x;
    var firstImage = this.container.find('img');
    firstImage.fadeOut(function () {
      firstImage.remove();
    });
    var $image = $(img);
    $image.hide();
    this.container.append($image);
    $image.fadeIn();
    this.run();

  }

}

ImageFader.prototype.run = function () {
  var __that = this;
  if(this.interval == undefined)
  {
    this.interval = setInterval(function ()
    {
      __that.runState();
    }, this.options.duration * 1000);
  }
}

ImageFader.prototype.runState = function () {

  if(this.state == "play")
  {
    this.next();
  }
  else if(this.state == "pause")
  {
    clearInterval(this.interval);
    this.interval = undefined;
  }
}

ImageFader.prototype.next = function() {
  var nextSlide = this.currentSlide + 1;
  if(nextSlide > this.images.length - 1)
  {
    if(this.options.infinite) {
      nextSlide = 0;
    } else {
      nextSlide = this.images.length - 1;
    }
  }
  this.showSlide(nextSlide);
}

ImageFader.prototype.previous = function() {
  var prevSlide = this.currentSlide - 1;
  if(prevSlide < 0)
  {
    if(this.options.infinite) {
      prevSlide = this.images.length - 1;
    } else {
      prevSlide = 0;
    }
  }
  this.showSlide(prevSlide);
}

ImageFader.prototype.log = function (str) {
  if(typeof this.options.showLog != "undefined" && this.options.showLog === false) return;
  if(typeof str == "object")
  {
    console.log(this.name, str);
  }
  else
  {
    console.log(this.name + ": " + str);
  }

}