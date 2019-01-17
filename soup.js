var myGamePiece;
var myObstacles = [];
var myScore;
var heat;
var waterTemp;

function startGame() {
    myGamePiece = new component(70, 70, 'red', 205, 100, 'bowl');
    myGamePiece.ingredients = [];
    myGamePiece.heat = 0;
    myGamePiece.waterTemp = 23;
    myGamePiece.score = 0;
    myGamePiece.temps = {
        'corn': 0,
        'potato': 0,
        'bean': 0,
        'carrot': 0
    };
    myGamePiece.cookingTime = {
        'corn': 3,
        'potato': 6,
        'bean': 10,
        'carrot': 5
    };
    myScore = new component("30px", "Consolas", "black", 0, 40, "text");
    heat = new component("15px", "Consolas", "black", 280, 40, "text");
    waterTemp = new component("15px", "Consolas", "blue", 0, 200, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    myGameArea.clear();
    myGameArea.frameNo += 1;

    if (myGamePiece.ingredients.indexOf('water') > -1) {
        myObstacles.push(new component(50, 50, 'aqua', 215, 110, 'ingredient'));
        if (myGamePiece.waterTemp < 100) {
            myGamePiece.waterTemp += myGamePiece.heat * (100 - myGamePiece.waterTemp) / 100;
        }
        if (myGamePiece.waterTemp > 23) {
            //myGamePiece.waterTemp -= 100 / Math.min(100 - myGamePiece.waterTemp, 0) * 100;
            myGamePiece.waterTemp -= 0.08;
        }
    }

    var getColour = function(ing) {
        var ingColours = {
            'corn': 'yellow',
            'potato': 'brown',
            'bean': 'white',
            'carrot': 'orange'
        };
        if (myGamePiece.temps[ing] >= 100) return 'black';
        else return ingColours[ing];
    }

    function increaseTemp(ing) {
        myGamePiece.temps[ing] += Math.max(0, myGamePiece.waterTemp - 40) / (10 * myGamePiece.cookingTime[ing]);
    }

    if (myGamePiece.ingredients.indexOf('corn') > -1) {
        myObstacles.push(new component(20, 20, getColour('corn'), 220, 115, 'ingredient'));
        increaseTemp('corn');
    }
    if (myGamePiece.ingredients.indexOf('potato') > -1) {
        myObstacles.push(new component(20, 20, getColour('potato'), 240, 135, 'ingredient'));
        increaseTemp('potato');
    }
    if (myGamePiece.ingredients.indexOf('bean') > -1) {
        myObstacles.push(new component(20, 20, getColour('bean'), 220, 135, 'ingredient'));
        increaseTemp('bean');
    }
    if (myGamePiece.ingredients.indexOf('carrot') > -1) {
        myObstacles.push(new component(20, 20, getColour('carrot'), 240, 115, 'ingredient'));
        increaseTemp('carrot');
    }

    for (i = 0; i < myGamePiece.length; i++) {
        var ing = myGamePiece.ingredients[i];
        myGamePiece.temps.ing += myGamePiece.waterTemp / myGamePiece.cookingTime.ing;
        console.log(myGamePiece.temps);
    }

    if (myGameArea.frameNo == 1 || everyinterval(150)) {
    }

    myGamePiece.update();
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGamePiece.score;
    myScore.update();

    waterTemp.text="WATER TEMPERATURE: " + myGamePiece.waterTemp;
    waterTemp.update();

    heat.text="HEAT: " + myGamePiece.heat;
    heat.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function addIngredient(n) {
    if (myGamePiece.ingredients.indexOf(n) === -1) myGamePiece.ingredients.push(n);
    console.log(myGamePiece.ingredients);
}

function turnHeatUp() {
    if (myGamePiece.heat < 9) myGamePiece.heat++;
}

function turnHeatDown() {
    if (myGamePiece.heat > 0) myGamePiece.heat--;
}

function endGame() {
    clearInterval(myGameArea.interval);
    var end = new component("10px", "Consolas", "black", 0, 100, "text");
    end.text = "Soup!";
    end.update();

    var endText = 0;
    var tempScore = 0;
    var displacement = 10;
    for (let key in myGamePiece.temps) {
        end = new component("10px", "Consolas", "black", 0, 100 + displacement, "text");
        if (myGamePiece.temps[key] < 100) {
            tempScore += myGamePiece.temps[key];
            end.text = `${key}: ${myGamePiece.temps[key]}` + "\n";
        } else {
            tempScore -= 10;
            end.text = `You burnt your ${key}! -10 points` + "\n";
        }
        end.update();
        displacement+=10;
    }
    end = new component("10px", "Consolas", "black", 0, 100 + displacement, "text");
    end.text = `Total: ${tempScore}`;
    end.update();
}
