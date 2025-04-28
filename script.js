// Tutte le carte
const carte = {
  1: { ATT: 40, SPE: 10, DIF: 50, HP: 120, STA: 3, STA_iniziale: 3 },
  2: { ATT: 5, SPE: 7, DIF: 5, HP: 100, STA: 1, STA_iniziale: 1 },
  3: { ATT: 100, SPE: 5, DIF: 30, HP: 300, STA: 5, STA_iniziale: 5 },
  4: { ATT: 50, SPE: 15, DIF: 0, HP: 100, STA: 3, STA_iniziale: 3, speciale: true },
  5: { ATT: 1, SPE: 10, DIF: 99, HP: 100, STA: 10, STA_iniziale: 10 },
  B1: { ATT: 0, SPE: 20, DIF: 0, HP: 0, STA: 1, STA_iniziale: 1 },
  B2: { ATT: 0, SPE: -10, DIF: 30, HP: 0, STA: 2, STA_iniziale: 2 },
  B3: { ATT: 40, SPE: -5, DIF: 0, HP: 0, STA: 1, STA_iniziale: 1 },
  B4: { ATT: 40, SPE: 0, DIF: -10, HP: 0, STA: 1, STA_iniziale: 1 },
  B5: { ATT: 100, SPE: 50, DIF: 0, HP: 0, STA: 1, STA_iniziale: 1 },
  B6: { ATT: 0, SPE: -30, DIF: 40, HP: 0, STA: 3, STA_iniziale: 3 }
};

// Stato corrente della partita
let attCartaCorrente = null;
let defCartaCorrente = null;

// Funzione per controllare la stamina e mostrare il messaggio
function controllaStamina(campo, stamina, carta) {
  if (stamina <= 0) {
    // Mostra il pop-up con il messaggio che specifica il campo
    const risposta = prompt("La stamina della carta nel " + campo + " è finita! Vuoi ripristinarla? (OK per confermare)");
    
    if (risposta === 'OK') {
      // Ripristina la stamina della carta al valore iniziale
      carta.STA = carta.STA_iniziale;
      alert("La stamina è stata ripristinata!");
    } else {
      alert("La carta non è stata ripristinata.");
    }
  }
}

// Gestisci il gioco al click di "Avvia Gioco"
document.getElementById('avviaGioco').addEventListener('click', () => {
  document.getElementById('schermataIniziale').style.display = 'none';
  document.getElementById('gioco').style.display = 'block';
});

// Gestisci l'invio del form
document.getElementById('formGioco').addEventListener('submit', function (e) {
  e.preventDefault();

  const attId = document.getElementById('attCarta').value.trim().toUpperCase();
  const attBonusId = document.getElementById('attBonus').value.trim().toUpperCase();
  const defId = document.getElementById('defCarta').value.trim().toUpperCase();
  const defBonusId = document.getElementById('defBonus').value.trim().toUpperCase();

  // Controllo validità delle carte principali
  if (!carte[attId] || !carte[defId]) {
    document.getElementById('messaggioRisultato').textContent = "Errore: codice carta non valido!";
    return;
  }

  if (attId.startsWith('B') || defId.startsWith('B')) {
    document.getElementById('messaggioRisultato').textContent = "Errore: nei campi principali puoi usare solo carte normali!";
    return;
  }

  // Costruzione stato delle carte
  if (!attCartaCorrente || attCartaCorrente.id !== attId) {
    attCartaCorrente = {
      ...carte[attId],
      id: attId,
      STA: carte[attId].STA
    };
    if (attBonusId && carte[attBonusId]) {
      attCartaCorrente.ATT += carte[attBonusId].ATT;
      attCartaCorrente.SPE += carte[attBonusId].SPE;
      attCartaCorrente.DIF += carte[attBonusId].DIF;
      attCartaCorrente.HP += carte[attBonusId].HP;
      attCartaCorrente.STA += carte[attBonusId].STA;

      // Controllo se STA e/o DIF superano 100
      if (attCartaCorrente.STA > 100 || attCartaCorrente.DIF > 100) {
        document.getElementById('messaggioRisultato').textContent = "Errore: non è possibile usare questa carta bonus (STA o DIF superano 100)!";
        return;
      }
    }
  }

  if (!defCartaCorrente || defCartaCorrente.id !== defId) {
    defCartaCorrente = {
      ...carte[defId],
      id: defId,
      STA: carte[defId].STA
    };
    if (defBonusId && carte[defBonusId]) {
      defCartaCorrente.ATT += carte[defBonusId].ATT;
      defCartaCorrente.SPE += carte[defBonusId].SPE;
      defCartaCorrente.DIF += carte[defBonusId].DIF;
      defCartaCorrente.HP += carte[defBonusId].HP;
      defCartaCorrente.STA += carte[defBonusId].STA;

      // Controllo se STA e/o DIF superano 100
      if (defCartaCorrente.STA > 100 || defCartaCorrente.DIF > 100) {
        document.getElementById('messaggioRisultato').textContent = "Errore: non è possibile usare questa carta bonus (STA o DIF superano 100)!";
        return;
      }
    }
  }

  // Controllo stamina
  controllaStamina("Attaccante", attCartaCorrente.STA, attCartaCorrente);
  controllaStamina("Difensore", defCartaCorrente.STA, defCartaCorrente);

  // Simulazione del turno
  let danno = attCartaCorrente.ATT;

  // Se carta speciale 10% chance attacco boostato (Carta 4)
  if (attCartaCorrente.id === "4" && Math.random() < 0.1) {
    danno = 100;
    document.getElementById('messaggioRisultato').textContent += " L'attacco della carta 4 è stato potenziato a 100!";
  }

  // Se carta 5, la difesa è praticamente insormontabile (99 DIF)
  if (defCartaCorrente.id === "5") {
    danno *= (1 - defCartaCorrente.DIF / 100); // La difesa è talmente alta che riduce quasi tutto il danno
    document.getElementById('messaggioRisultato').textContent += " La carta 5 ha una difesa quasi impenetrabile!";
  }

  const schivata = Math.random() * 100 < defCartaCorrente.SPE;

  if (schivata) {
    document.getElementById('messaggioRisultato').textContent = "Il difensore ha schivato!";
    attCartaCorrente.STA -= 1;
    defCartaCorrente.STA -= 1;
  } else {
    const dannoEffettivo = danno * (1 - defCartaCorrente.DIF / 100);
    defCartaCorrente.HP -= dannoEffettivo;
    attCartaCorrente.STA -= 1;
    document.getElementById('messaggioRisultato').textContent = `Danno inflitto: ${dannoEffettivo.toFixed(2)} | HP difensore rimasti: ${defCartaCorrente.HP.toFixed(2)}`;
  }
});
