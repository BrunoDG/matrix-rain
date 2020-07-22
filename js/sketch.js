var symbolSize = 20;
var fadeInterval = 1.6;
var streams = [];

function setup() {
    createCanvas(
        window.innerWidth,
        window.innerHeight
    );
    background(0);
    var x = 0;
    for (var i = 0; i <= width / symbolSize; i++) {
        var stream = new Stream();
        stream.generateSymbols(
            x, 
            random(-1920, 0)
        );
        streams.push(stream);
        x += symbolSize;
    }
    textFont('Consolas');
    textSize(symbolSize);
}

function draw() {
    background(0, 100); // backgroun (color, opacity)
    streams.forEach(function (stream) {
        stream.render();
    });
}

function Symbol(x, y, speed, first, opacity) {
    this.x = x;
    this.y = y;
    this.value;

    this.speed = speed;
    this.first = first;
    this.opacity = opacity;

    this.switchInterval = round(random(2, 25));

    // I'm using this because I want to send Katakana symbols over unicode.
    // To do this, I need to map all characters in Katakana within unicode table,
    // turns out that they start on U+30A0 and go until U+30FF, making a total of 96.

    // Also, checked out to look after Cyrillic table in Unicode as well.
    // So, I've found out that there are... 256 Cyrillic letters.
    // Let's make ANOTHER random for those 256 characters as well, 
    // this time, from U+0400 to Ux04FF.

    this.setToRandomSymbol = function() {
        var chartype = round(random(0, 5));
        if (frameCount % this.switchInterval == 0) {
            if (chartype > 1) {
                this.value = String.fromCharCode(
                    0x30A0 + round(random(0, 96))
                );
            } else {
                this.value = String.fromCharCode(
                    0x0400 + round(random(0, 256))
                );
            }
        }
    }

    // rains and resets the symbol's position
    this.rain = function() {
        this.y = (this.y >= height) ? 0 : this.y += this.speed;
    }
}

// I'll draw the streaming symbols here.
function Stream() {
    this.symbols = [];
    this.totalSymbols = round(random(5, 35));
    this.speed = random(5, 15);

    this.generateSymbols = function(x, y) {
        var opacity = 255;
        var first = round(random(0, 4)) == 1;
        for (var i = 0; i <= this.totalSymbols; i++) {
            symbol = new Symbol(x, y, this.speed, first, opacity);
            symbol.setToRandomSymbol();
            this.symbols.push(symbol);
            opacity -= (255 / this.totalSymbols) / fadeInterval;
            y -= symbolSize;
            first = false;
        }
    }

    // This is the function that's going to render the symbols on the screen.

    this.render = function() {
        this.symbols.forEach(function(symbol) {
            if (symbol.first) {
                fill(180, 255, 180, symbol.opacity);
            } else {
                fill(0, 255, 70, symbol.opacity);
            }
            text(symbol.value, symbol.x, symbol.y);
            symbol.rain();
            symbol.setToRandomSymbol();
        });
    }
}