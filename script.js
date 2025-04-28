// Tutte le carte
const carte = {
  1: { ATT: 40, SPE: 10, DIF: 50, HP: 120, STA: 3 },
  2: { ATT: 5, SPE: 7, DIF: 5, HP: 100, STA: 1 },
  3: { ATT: 100, SPE: 5, DIF: 30, HP: 300, STA: 5 },
  4: { ATT: 50, SPE: 15, DIF: 0, HP: 100, STA: 3, speciale: true }, // Carta 4 con abilità speciale
  5: { ATT: 1, SPE: 10, DIF: 99, HP: 100, STA: 10 }, // Carta 5 con le specifiche nuove
  B1: { ATT: 0, SPE: 20, DIF: 0, HP: 0, STA: 1 },
  B2: { ATT: 0, SPE: -10, DIF: 30, HP: 0, STA: 2 },
  B3: { ATT: 40, SPE: -5, DIF: 0, HP: 0, STA: 1 },
  B4: { ATT: 40, SPE: 0, DIF: -10, HP: 0, STA: 1 },
  B5: { ATT: 100, SPE: 50, DIF: 0, HP: 0, STA: 1 }
};

// Stato corrente della partita
let attCartaCorrente = null;
let defCartaCorrente = null;

// Funzione per controllare la stamina e mostrare il messaggio
function controllaStamina(campo, stamina) {
  if (stamina <= 0) {
    // Mostra il pop-up con il messaggio che specifica il campo
    alert("La stamina della carta nel " + campo + " è finita! Sostituiscila.");
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
    }
  }

  // Controllo stamina
  controllaStamina("Attaccante", attCartaCorrente.STA);
  controllaStamina("Difensore", defCartaCorrente.STA);

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
