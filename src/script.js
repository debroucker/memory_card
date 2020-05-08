var cardList; //the string of the cards png
var listReturnCard = []; //the inedx of the returned cards
var cptGlobal = 0 //to show the number of click
var cpt = 0; //to know if there are 1 or 2 cards returned
var nbCardsOK = 0; //number of mathcing cards returned
var extension = ".png"; //the extension of the img for the cards
var loose = false;
var win = false;
//chrono
var time = 0, sec = 1.5;
var chronoTime = null;

function getBoard(i) {
/*
 
*/
    let xhr = new XMLHttpRequest() ;
    xhr.open("GET", "plateaux/plateau" + i + ".json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200){
            cardList = shuffle(JSON.parse(xhr.responseText).plateau);
            alert("You choose board number " + i)
            writeCardHTML();
            main();
        }
    }
    xhr.send(null);
};

function writePannel(){
/*
 
*/
    res = "<ul>List of boards : <br>"
    for (let i = 1; i < 6; i++){
        res += "<br><li><button onclick = getBoard(" + i + ")> Board " + i + "</button></li>";
    }
    res += "</ul>"
    document.body.innerHTML = res;
}

function initCardList(){
/* 
initialize the list of the string card
    return : list of the string of all cards
*/
    let cardList = [];
    let colorList = ["C", "P", "S", "T"]; 
    let symbList = ["1", "D", "R", "V","X"]; 
    let cardString;
    let i,j;
    for(i = 0; i < 4; i++){ //for all colors
        for(j = 0; j < 5; j++){ //for all symbs
            cardString = symbList[j]+ colorList[i] + extension; //create string card
            cardList.push(cardString);
        }
    }
    return cardList;
}

function shuffle(a){
/*
suffle a list
    param : 
        args[0] : the list to shuffle
    return :
        the suffle list
*/
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function writeHomePage(){
/*
write the Home Page, with rules and the button tu start to play 
*/
    let rules, button, welcome;
    welcome = "<h1> Welcome to Memory Game !</h1>"
    rules = "<h3><p><span id = 'underline'>The rules</span> : </p> " + 
    "<p>You must discover a couple of card.</p>" +
    "<p> If the two cards turned over are the same height (example : two kings) or the same color (♣ or ♠ or ♥ or ♦) " +
    "then, the two cards stay turned over.</p> " +
    "<p>Else, the two cards are delivered figure not visible. </p></h3>"
    button = "<button onclick = 'writePannel()' id = 'homeButton'> Click here to play </button>"; //click in this and lunch main()
    let res = welcome + rules + button;
    document.write(res);
}

function writeCardHTML(){
/**
write the table of cards in the html
also write the timer, the number of click and the number of returned cards
*/
    let n = 0;
    let res, nbcards, chrono, count;
    let i, j, imgCard;
    count = "<p id = 'countCSS'>Number of clicks : <span id = cpt >0</span></p>"; // the number of clicks
    nbcards = "<p id = 'nbcardsCSS'>Number of cards founded : <span id = cardsFounded >0</span></p>"; //the number of returned cards
    chrono = "<p id = 'chronoCSS'>Timer : <span id='chrono'> <span id='minutes'>0</span>" //for the chrono
    + "'<span id='seconds'>00</span>"
    + "\"<span id='tenth'>0</span></span></p>";
    res = count + nbcards + chrono + "<table>";
    for(i = 0; i < 4; i++){ // 4 lines
        res += "<tr>"; 
        for(j = 0; j < 5; j++){ //5 rows
            imgCard = "<img id=" + n + " src='./cartespng/backside.png'" //at begening, the cards are returned
            + "onclick = rotateCard(" + n + ") >";
            res += "<td>" + imgCard + "</td>";
            n++;
        }
        res += "</tr>"; //end of lines
    }
    res += "</td>" 
    res += "<table>";
    document.body.innerHTML = res; //write in html and delete the buton start
}

function rotateCard(id){
/**
do the algo og this game
    param :
        args[0] : the id of the card that you have click of
*/
    let symb1, color1;
    let symb2, color2; 
    let l;
    l = listReturnCard.length;
    if ( ! inList(id, listReturnCard)){ //the card is not returned
        listReturnCard.push(id)
        showCard(id); 
        incCptGlobal();
        cpt++; //incremente the cpt of click
        l++;//add the card in the list of returned card, so incremente the length
    }
    if (cpt == 2){ //if 2 cards are returned 
        cpt = 0;
        //take the two lasts cards that we add in the returned card list
        id1 = listReturnCard[l-1];
        res = takeSymbAndColor(id1);
        symb1 = res[0]; color1 = res[1];
        id2 = listReturnCard[l-2];
        res = takeSymbAndColor(id2);
        symb2 = res[0]; color2 = res[1];
        if (symb1 != symb2 && color1 != color2 ){
            setTimeout(function () { returnTowCards(id1, id2);}, sec*1000); //wait 2sec before hide cards
            doublePop(listReturnCard);
            if (nbCardsOK == 18)
                loose = true; //if leaves 2 cards that not matching  
        }
        else {
            incNbCards(); //incremente the nuber of returned cards
            if (nbCardsOK == 20)
                win = true
        }
    }
}  

function doublePop(list){
/**
delete two lasted element in the list 
    param : 
        args[0] : the list to delete two lasted element
*/
    list.pop(); list.pop();
}

function incCptGlobal(){
/**
to incremente the number of clicks
*/
    cptGlobal ++;
    document.getElementById("cpt").innerHTML = cptGlobal;
}

function incNbCards(){
/**
to incremente the number of goods cards returned
*/
    nbCardsOK += 2;
    document.getElementById("cardsFounded").innerHTML = nbCardsOK;
}

function takeSymbAndColor(id){
/**
take the height and the color of the if of card
    param : 
        args[0] : the id of the card to take the height and the color
    return : 
        list with the first element is the height, and the second is the color 
 */
    color1 = cardList[id][1];
    symb1 = cardList[id][0];
    return [symb1, color1]
}

function inList(id, list){
/**
check if id is in the list
    params : 
        args[0] : the id to check if is in the list
        args[1] : the list
    return :
        frue if id is in the list, else, false
 */
    let l = list.length;
    let i = 0;
    found = false;
    while (! found && i < l){
        if (list[i] == id)
            found = true;
        else 
            i++;
    }
    return found;
}

function returnTowCards(id1, id2){
/**
change the src of the 2 id given by the backside, to hide the two cards
    params : 
        args[0] : the id of the first card to hide
        args[1] : the id of the second card to hide
*/
    let card1 = document.getElementById(id1);
    card1.setAttribute("src", "./cartespng/backside.png");
    let card2 = document.getElementById(id2);
    card2.setAttribute("src", "./cartespng/backside.png");
}

function showCard(id){
/**
change the src of the id given, to show the card
    params : 
        args[0] : the id of the first card to show
*/
    let imgCard = document.getElementById(id); 
    imgCard.setAttribute("src", "./cartespng/" + cardList[id]);
}


function chrono() {
/**
do the timer in the html
*/
  tenth = document.getElementById("tenth");
  seconds = document.getElementById("seconds");
  minutes = document.getElementById("minutes");
  time++;
  tenth.textContent++;
  // Display management
  if(seconds.textContent == '0'){
    seconds.textContent = '0'+seconds.textContent;
  }
  if(time % 10 == 0){
    seconds.textContent++;
    tenth.textContent = 0;
    // Display management
    if(seconds.textContent < 10){
      seconds.textContent = '0'+seconds.textContent;
    }
  }
  if(seconds.textContent == 60){
    minutes.textContent++;
    seconds.textContent = '00';
  }
  if (win){
    alert("You won ! :D ");
      clearInterval(chronoTime);
  }
  if (loose){
    alert("You loose :( ");
      clearInterval(chronoTime);
  }
}

function resete_chorno() {
    tenth = document.getElementById("tenth");
    seconds = document.getElementById("seconds");
    minutes = document.getElementById("minutes");
    tenth.textContent = 0;
    minutes.textContent = 0;
    seconds.textContent = '00';
}

function main(){
    cardList = shuffle(initCardList());
    writeCardHTML();
    clearInterval(chronoTime);
    resete_chorno();
    chronoTime = window.setInterval(chrono, 100);
}

writeHomePage();