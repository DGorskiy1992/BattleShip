var view = {
    displayMessage: function(msg){
        var messageArea = document.querySelector('#messageArea');
        messageArea.innerHTML = msg;
    },

    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};


var model = {
    boardSize: 7, // размер игрового поля
    numShips: 3, // число кораблей в игре
    shipLength: 3, // длинна корабля
    shipsSunk: 0, // число потопленных кораблей

    ships: [
        ship1 = {
        location: ['0','0','0'],
        hits: ['','','']
        },
        ship2 = {
        location: ['0','0','0'],
        hits: ['','','']
        },
        ship3 = {
        location: ['0','0','0'],
        hits: ['','','']
    }
    ],

    fire: function(guess){ // получает координаты вытрела
        for(var i = 0; i < this.numShips; i++){
            var ship = this.ships[i];
            var index = ship.location.indexOf(guess);
            if(index >=0){
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage("HIT!!!");
                if(this.isSunk(ship)){
                    view.displayMessage("You sank my ship!");
                    this.shipsSunk++;
                }
                return true;
            }

        }
             view.displayMiss(guess);
            view.displayMessage("You missed!");
            return false;
    },

    isSunk: function(ship){
        for(var i = 0; i < this.shipLength; i++){
            if (ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },

    generateShipLocation: function(){
        var location;
        for(var i = 0; i < this.numShips; i++){
            do{
                location = this.generateShip();
            } while(this.collision(location));
            this.ships[i].location = location;
        }
    },

    generateShip: function(){
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if(direction === 1){
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * this.boardSize- this.shipLength);
            col = Math.floor(Math.random() * (this.boardSize));
        }

        var newShipLocation = [];

        for(var i = 0; i < this.shipLength; i++){
            if(direction === 1){
                newShipLocation.push(row + "" + (col + i));
            } else {
                newShipLocation.push((row + i) + "" + col);
            }
        }
        return newShipLocation;
    },

    collision: function(location){
        for(var i = 0; i < this.shipLength; i++){
            var ship = model.ships[i];
            for(var j = 0; j < location.length; j++){
                if(ship.location.indexOf(location[j]) >= 0){
                    return true;
                }
            }
        }
        return false;
    }
};

var controller = {
    guesses: 0,

    processGuess: function(guess){
        var location = parseGuess(guess);
        if(location){
            this.guesses++;
            var hit = model.fire(location);
            if(hit && model.shipsSunk === model.numShips){
                view.displayMessage("Потопили" + model.numShips + "корабли за "+ this.guesses + "выстрелов");
                document.getElementById("is_won").value = "true";
                document.getElementById("is_won_form").submit();
            }
        }
    }
}

function parseGuess(guess){
    var alphabet = ["A", "B","C", "D", "E", "F", "G"];
    if (guess === null || guess.length !== 2){
        alert("Вы ввели неверные координаты!");
    } else {
        firstChar = guess.charAt(0); //извлекаем из строки первый символ
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if(isNaN(row) || isNaN(column)){
            alert("Вы ввели неверные координаты!");
        } else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){alert("Вы ввели неверные координаты!");}
     else {
        return row+ column;
    }
}
}

// controller.processGuess("A1");

function init(){
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocation();
}

function handleFireButton(){
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = "";
}

function handleKeyPress(e){
    var fireButton = document.getElementById("fireButton");
    if(e.keyCode === 13){
        fireButton.click();
        return false;
    }
}

window.onload = init;