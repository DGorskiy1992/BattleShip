var view = {   // элемент view подхода MVC, отвечающая за представление пользователю визуальной иноформации
    displayMessage: function(msg){     // отображает в верхней строке сообщения HIT, MISS, SANK и т.д., получая значение сообщения в аргумента msg
        var messageArea = document.querySelector('#messageArea');
        messageArea.innerHTML = msg;
    },

    displayHit: function(location){    // отображает попадания в клетке, определяемой получаемой локацией
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");       // задает атрибут class элемента cell (клетке) в значение "hit". Клетка с классом hit должна отображать попадание
    },
    displayMiss: function(location){ // то же что и предыдущее но отображает попадания
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};


var model = {   // MVC - модель документа, отвечающая за структурный состав модели элемента (бизнес логика)
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

    fire: function(guess){ // получает координаты вытрела, вводимые в переменнойg uess
        for(var i = 0; i < this.numShips; i++){ // перебирает все имеющиеся модели корабли
            var ship = this.ships[i]; // переменная получает ссылку на перебираемой на данном шаге корабль из объекта ships
            var index = ship.location.indexOf(guess); // проверяет попадание значение guess в массив location корабля
            if(index >=0){   // если найдено попадание guess в массив location корабля,
                ship.hits[index] = 'hit'; // то отображаем, что подбито hit
                view.displayHit(guess);  // отображаем значок попадания в клетке с координатами guess
                view.displayMessage("HIT!!!"); // отображаем hit в поле сообщений
                if(this.isSunk(ship)){  // если функция isSunk модели возвращает true, то
                    view.displayMessage("You sank my ship!"); // в поле отображается сообщение о потоплении
                    this.shipsSunk++; // переменная shipsSunk - количество потопленнвых кораблеей - увеличивается на единицу
                }
                return true;
            }

        }
             view.displayMiss(guess);   // если guess не попадает в массив location ни одного из перечисляемых кораблей объекта ships модели,
            view.displayMessage("You missed!");  // то отображаем сообщение о промахе (miss)
            return false;
    },

    isSunk: function(ship){   // возвращает true, если в все элементы массивов hits кораюлей из объекта ships модели равны hit
        for(var i = 0; i < this.shipLength; i++){
            if (ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },

    generateShipLocation: function(){  // окончательно генерирует положение кораюля на доске, получая массив newShipLocaion и передавая его
        var location;                  // в функцию collision для проверки перекрытия других кораблей
        for(var i = 0; i < this.numShips; i++){
            do{
                location = this.generateShip();
            } while(this.collision(location));
            this.ships[i].location = location;
        }
    },

    generateShip: function(){ // генерирует позицию корабля на доске
        var direction = Math.floor(Math.random() * 2); // случацно определяет вертикальное или горизонтальное положение будущего корабля
        var row, col; // переменные строка row и столбец col начальной точки генерации массива точек положения корабля на ддоске

        if(direction === 1){ // если направление горизонтальное,
            row = Math.floor(Math.random() * this.boardSize); // выбираем любую строку точки начала
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength)); // выбираем столбец точки начала так, чтобы длинна корабля shipLength не превысила размер поля boardsize
        } else {
            row = Math.floor(Math.random() * this.boardSize- this.shipLength); // то же самое, но для вертикального положения
            col = Math.floor(Math.random() * (this.boardSize));
        }

        var newShipLocation = []; // переменная, которая будет содержать массив точек положения корабля

        for(var i = 0; i < this.shipLength; i++){ // заполнение массива newShipLocation
            if(direction === 1){
                newShipLocation.push(row + "" + (col + i));
            } else {
                newShipLocation.push((row + i) + "" + col);
            }
        }
        return newShipLocation; // заполненный массив newShipLocation возвращается функцией
    },

    collision: function(location){ // принимает на проверку новый массив позиций корабля
        for(var i = 0; i < this.numShips; i++){ // перебираем все корабли, как уже созданные, так и еще не созданные (с пустым списокм locations)
            var ship = model.ships[i];
            for(var j = 0; j < location.length; j++){ // перебираем элементы списка location
                if(ship.location.indexOf(location[j]) >= 0){ // если есть совпадение, то имеет место перекрытие, и выдвется true
                    return true;
                }
            }
        }
        return false; // если нет перекрытий, то выдается false
    }
};

var controller = { // контроллер - принимает ввод пользователя, реализует логику игры
    guesses: 0, // начальное значение ходов равно нулю

    processGuess: function(guess){ // обработка ввода координат
        var location;
        if (Number.isNaN(location)){ // проверка корректности ввода (true or false) (если ввели с инпута)
            location = parseGuess(guess);
        }
        else{
            location = guess; // если кликаем мышкой, то координаты априори верны и сразу представляют собой число
        }
        if(location){ // если ввод корректен
            this.guesses++; // количество ходов растет
            var hit = model.fire(location);
            if(hit && model.shipsSunk === model.numShips){ // если есть попадание (метод model.fire возвращает true) и кол-во потопленных сравнялось с общим числом кораблей,
                view.displayMessage("Потопили" + model.numShips + "корабли за "+ this.guesses + "выстрелов"); // отображаем сообщение о потоплении
                document.getElementById("is_won").value = "true"; // отправляем форму на страницу game won
                document.getElementById("is_won_form").submit(); //
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
    var fireButton = document.getElementById("fireButton"); // устанавливаем кнопку fireVutton в переменную
    fireButton.onclick = handleFireButton; // при нажаитии вызывается обработчик события handleFireButton
    var guessInput = document.getElementById("guessInput"); // строка ввожа координат
    guessInput.onkeypress = handleKeyPress; // при нажатии и отпусакании клавиши (onkeypress) при вводе в строку вызывается обработчик handleKeyPress

//    var cells = document.getElementById('table').getElementsByTagName('td');
//    cells.forEach(function(el){
//        el.addEventListener("click",handleCellClick);
//    });

    model.generateShipLocation(); // при запуске окна автоматически генерируется позиция кораблей

}

function clickHandle(clicked_id){
    var guess = clicked_id;
    controller.processGuess(guess);
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