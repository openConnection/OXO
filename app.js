const varPlayer = "X";
const varIA = "O";

var arrayPl = new Array();
var arrayIa = new Array();

var tours = 0;
var ligne = [
   {ligne : "0,1,2"},
   {ligne : "3,4,5"},
   {ligne : "6,7,8"},
   {ligne : "0,3,6"},
   {ligne : "1,4,7"},
   {ligne : "2,5,8"},
   {ligne : "0,4,8"},
   {ligne : "2,4,6"},
]

var combIa;
var pions = document.querySelectorAll("#game button");
var choiceIA = document.getElementById('customSwitch1');
var st = document.getElementById("status");

var playWithIa = null;

function setSymbol(btn, symbol){
   btn.innerHTML = symbol;
}

function reset(){
   setStatus(true);
   for(var i = 0 ; i < pions.length; i++){
      setSymbol(pions[i], " ");
   }
}

function setStatus(b){
   if(b){
      st.style.display = "block";
   }else{
      st.style.display = "none";
   }
}

function loadPlayed(cases, entity){
   if(entity == varIA){
      if(!arrayIa.includes(cases))arrayIa.push(cases);
   }else{
      if(!arrayPl.includes(cases))arrayPl.push(cases);
   }
}

function resetPlayerAll(){
   arrayIa.splice(0);
   arrayPl.splice(0);
   choiceIA.disabled = false;
   playWithIa = null;
   setStatus(false);
}

function isWinner(cases, tab){
   for(var i = 0; i < ligne.length; i++){
      var ltot;
      if(ligne[i].ligne.includes(cases)){
         //console.log("Cas possible : "+ligne[i].ligne);
         ltot = ligne[i].ligne.split(",");
         //console.log("LTOT : "+ltot);
         //console.log("ArrayPl : "+arrayPl);
         var conf = 0;
         for(var il = 0; il < tab.length; il++){
            if(ltot.includes(tab[il])){
               conf++;
            }
         }
         if(conf == 3){
            return true;
         }
      }
   }
   return false;
}


function getWinner(cases , players, tour){
   if(playWithIa == null){
      playWithIa = choiceIA.checked;
      choiceIA.disabled = true;
   }

   loadPlayed(cases, players);

   if(isWinner(cases, arrayIa)){
      //console.log("GAGNANT IA");
      document.getElementById('win').innerHTML = "L'IA vient de gagner !";
      reset();
   }else if(isWinner(cases, arrayPl)){
      //console.log("GAGNANT PL");
      document.getElementById('win').innerHTML = "Le joueur vient de gagner !";
      reset();
   }
   console.log("Joue avec IA ? "+playWithIa);
}

function main(){
   setStatus(false);
   for(var i = 0; i < ligne.length; i++){
      console.log("Ligne n°"+i+" : "+ligne[i].ligne)
   }
   for(var i = 0 ; i < pions.length; i++){
      pions[i].addEventListener("click", function() {
         var casePlayed = event.target.id;
         tours++;
         if(tours%2){
            setSymbol(this,varIA);
            getWinner(casePlayed, varIA, tours)
         }else{
            setSymbol(this,varPlayer);
            getWinner(casePlayed, varPlayer, tours)
         }
         console.log("clique sur pions n°"+casePlayed);
      })
   }
   document.getElementById('btn_loop_btn').addEventListener("click", function() {
      resetPlayerAll();
   })
}

main();