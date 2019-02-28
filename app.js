const varPlayer = "X";
const varIA = "O";

var arrayPl = new Array();
var arrayIa = new Array();

var tours = 0;
var ligne = [
   { ligne: "0,1,2" },
   { ligne: "3,4,5" },
   { ligne: "6,7,8" },
   { ligne: "0,3,6" },
   { ligne: "1,4,7" },
   { ligne: "2,5,8" },
   { ligne: "0,4,8" },
   { ligne: "2,4,6" },
]

var pions = document.querySelectorAll("#game button");
var choiceIA = document.getElementById('customSwitch1');
var st = document.getElementById("status");

var playWithIa = null;

var lastPlayIA = null;
var lastPlayPL = null;

function setSymbol(btn, symbol) {
   btn.innerHTML = symbol;
}

function getSymbol(id){
   return pions[id].innerHTML;
}

function reset() {
   setStatus(true);
   for (var i = 0; i < pions.length; i++) {
      setSymbol(pions[i], " ");
   }
}

function setStatus(b) {
   if (b) {
      st.style.display = "block";
   } else {
      st.style.display = "none";
   }
}

function loadPlayed(cases, entity) {
   if (entity == varIA) {
      if (!arrayIa.includes(cases)) arrayIa.push(cases);
   } else {
      if (!arrayPl.includes(cases)) arrayPl.push(cases);
   }
}

function resetPlayerAll() {
   arrayIa.splice(0);
   arrayPl.splice(0);
   lastPlayIA = null;
   lastPlayPL = null;
   choiceIA.disabled = false;
   playWithIa = null;
   setStatus(false);
   tours = 0;
}

function isWinner(tab) {
   for (var i = 0; i < ligne.length; i++) {
      var ltot;
      //console.log("Cas possible : "+ligne[i].ligne);
      ltot = ligne[i].ligne.split(",");
      //console.log("LTOT : "+ltot);
      //console.log("ArrayPl : "+arrayPl);
      var conf = 0;
      for (var il = 0; il < tab.length; il++) {
         if (ltot.includes(tab[il])) {
            conf++;
         }
      }
      if (conf == 3) {
         return true;
      }
   }
   return false;
}


function getWinner(cases, players, a_this) {
   if (getSymbol(cases) != varIA && getSymbol(cases) != varPlayer) {
      setSymbol(a_this, players);
      tours++;
      if (playWithIa == null) {
         playWithIa = choiceIA.checked;
         choiceIA.disabled = true;
      }

      loadPlayed(cases, players);

      if (isWinner(arrayIa)) {
         //console.log("GAGNANT IA");
         document.getElementById('win').innerHTML = "L'IA vient de gagner !";
         reset();
      } else if (isWinner(arrayPl)) {
         //console.log("GAGNANT PL");
         document.getElementById('win').innerHTML = "Le joueur vient de gagner !";
         reset();
      } else if (tours == 9) {
         document.getElementById('win').innerHTML = "Match Nul !";
         reset();
      } else {
         if (players == varIA) lastPlayIA = cases;
         else lastPlayPL = cases;
         console.log("Joue avec IA ? " + playWithIa);
         if (getStateIA) {
            IAPlay();
         }
      }
   }
}

function main() {
   setStatus(false);
   for (var i = 0; i < ligne.length; i++) {
      console.log("Ligne n°" + i + " : " + ligne[i].ligne)
   }
   for (var i = 0; i < pions.length; i++) {
      pions[i].addEventListener("click", function () {
         var casePlayed = event.target.id;
         if (tours % 2) {
            getWinner(casePlayed, varIA, this);
         } else {
            getWinner(casePlayed, varPlayer, this);
         }
         console.log("clique sur pions n°" + casePlayed);
      })
   }
   document.getElementById('btn_loop_btn').addEventListener("click", function () {
      resetPlayerAll();
   })
}

main();

//Partie IA, très vague comme manière de faire
//Et pas vraiment mise au point

function getStateIA() {
   return playWithIa;
}

function canPlayIn() {
   var a = new Array();
   for (var i = 0; i < pions.length; i++) {
      if (getSymbol(i) != varIA && getSymbol(i) != varPlayer) {
         a.push(pions[i]);
      }
   }
   return a;
}

function bestCanPlay() {
   var free = canPlayIn();
   var b_l = new Array();
   for (var i = 0; i < ligne.length; i++) {
      for (var il = 0; il < free.length; il++) {
         if (ligne[i].ligne.includes(free[il].id)) {
            if (!b_l.includes(ligne[i].ligne)) {
               var r = ligne[i].ligne.split(",");
               var f = 0;
               for (var iz = 0; iz < r.length; iz++) {
                  if (r[iz] == varIA || r[iz] == varPlayer) {
                     f++;
                  }
               }
               if (f < 3) {
                  b_l.push(ligne[i].ligne);
               }
            }
         }
      }
   }
   return b_l;
}

function canPlayInLine(line) {
   var a = line.split(",");
   for (var i = 0; i < a.length; i++) {
      if (getSymbol(a[i]) != varPlayer && getSymbol(a[i]) != varIA) {
         pions[a[i]].innerHTML = varIA;
         tours++;
         console.log("L'ia a joué : " + pions[a[i]].id);
         return pions[a[i]].id;
         break;
      }
   }
}

function b_analyze(tab) {
   return ligne[Math.floor(Math.random() * tab.length)].ligne;
}

function IAPlay() {
   if (getStateIA()) {
      var best_play_capacity = bestCanPlay();
      var getLine = b_analyze(best_play_capacity);
      var toPlay = canPlayInLine(getLine);
      loadPlayed(toPlay, varIA);
      if (isWinner(arrayIa)) {
         //console.log("GAGNANT IA");
         document.getElementById('win').innerHTML = "L'IA vient de gagner !";
         reset();
      } else if (isWinner(arrayPl)) {
         //console.log("GAGNANT PL");
         document.getElementById('win').innerHTML = "Le joueur vient de gagner !";
         reset();
      } else if (tours == 9) {
         document.getElementById('win').innerHTML = "Match Nul !";
         reset();
      }
   }
}
