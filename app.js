(() => {
  'use strict';

  const MIN_NUM = 1;
  const MAX_NUM = 1000;

  /** @type {{name: string, roundsWon: number}[]} */
  let players = [];
  let starterIndex = 0; // index into players[] of whoever picks first this round
  let roundNumber = 1;
  let mode = 'multi'; // 'multi' | 'solo'

  // Per-round scratch state
  let turn = null; // 1 or 2
  let pickerIndex = null;
  let guesserIndex = null;
  let secret = null;
  let attempts = 0;
  let guesses = []; // {value, result}
  let turnResults = []; // [{guesserIndex, attempts}, ...] for this round

  // What the handoff screen should do once the holder taps "ready"
  let handoffNext = null; // 'pick' | 'guess'

  const screens = {
    nameEntry: document.getElementById('screen-name-entry'),
    handoff: document.getElementById('screen-handoff'),
    picking: document.getElementById('screen-picking'),
    guessing: document.getElementById('screen-guessing'),
    turnSummary: document.getElementById('screen-turn-summary'),
    roundResult: document.getElementById('screen-round-result'),
  };

  function showScreen(name) {
    Object.values(screens).forEach((el) => el.classList.add('hidden'));
    screens[name].classList.remove('hidden');
  }

  function parseValidNumber(raw) {
    if (!/^\d+$/.test(raw.trim())) return null;
    const n = parseInt(raw, 10);
    if (n < MIN_NUM || n > MAX_NUM) return null;
    return n;
  }

  // Custom on-screen keypad so the phone's own keyboard never pops up
  // (the inputs it drives are readonly/inputmode=none for exactly that reason).
  const MAX_DIGITS = String(MAX_NUM).length;

  function wireNumberPad(padId, inputId, errorId) {
    const pad = document.getElementById(padId);
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    pad.addEventListener('click', (e) => {
      const key = e.target.closest('.pad-key')?.dataset.key;
      if (!key) return;
      errorEl.classList.add('hidden');
      if (key === 'back') {
        input.value = input.value.slice(0, -1);
      } else if (key === 'clear') {
        input.value = '';
      } else if (input.value.length < MAX_DIGITS) {
        input.value += key;
      }
    });
  }

  // ---------- Name entry ----------

  document.getElementById('form-name-entry').addEventListener('submit', (e) => {
    e.preventDefault();
    const name1 = document.getElementById('input-player1').value.trim() || 'Player 1';
    const name2 = document.getElementById('input-player2').value.trim() || 'Player 2';
    mode = 'multi';
    players = [
      { name: name1, roundsWon: 0 },
      { name: name2, roundsWon: 0 },
    ];
    starterIndex = Math.random() < 0.5 ? 0 : 1;
    roundNumber = 1;
    startRound();
  });

  document.getElementById('btn-solo-game').addEventListener('click', () => {
    mode = 'solo';
    players = [{ name: 'You', roundsWon: 0 }];
    roundNumber = 1;
    startSoloRound();
  });

  document.getElementById('btn-share-game').addEventListener('click', async () => {
    const shareData = {
      title: 'Stupid Game',
      text: 'Play Stupid Game with me — guess the secret number in the fewest tries!',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled the share sheet, or it failed silently; nothing to do.
      }
      return;
    }
    const feedbackEl = document.getElementById('share-feedback');
    try {
      await navigator.clipboard.writeText(shareData.url);
      feedbackEl.textContent = 'Link copied!';
    } catch (err) {
      window.prompt('Copy this link:', shareData.url);
      return;
    }
    feedbackEl.classList.remove('hidden');
    setTimeout(() => feedbackEl.classList.add('hidden'), 2000);
  });

  // ---------- Round / turn setup ----------

  function startSoloRound() {
    turn = null;
    pickerIndex = null;
    guesserIndex = 0;
    secret = Math.floor(Math.random() * (MAX_NUM - MIN_NUM + 1)) + MIN_NUM;
    attempts = 0;
    guesses = [];
    turnResults = [];
    goToGuessing();
  }

  function startRound() {
    turnResults = [];
    startTurn(1, starterIndex, 1 - starterIndex);
  }

  function startTurn(turnNum, picker, guesser) {
    turn = turnNum;
    pickerIndex = picker;
    guesserIndex = guesser;
    secret = null;
    attempts = 0;
    guesses = [];
    goToHandoff(pickerIndex, 'pick');
  }

  // ---------- Handoff ----------

  function goToHandoff(playerIndex, next) {
    handoffNext = next;
    const player = players[playerIndex];
    document.getElementById('handoff-name').textContent = player.name;
    const sub = document.getElementById('handoff-sub');
    if (next === 'pick') {
      sub.textContent = `Round ${roundNumber} · Turn ${turn} of 2 — you'll choose a secret number.`;
    } else {
      const pickerName = players[pickerIndex].name;
      sub.textContent = `Round ${roundNumber} · Turn ${turn} of 2 — try to guess ${pickerName}'s number!`;
    }
    showScreen('handoff');
  }

  document.getElementById('btn-handoff-ready').addEventListener('click', () => {
    if (handoffNext === 'pick') {
      goToPicking();
    } else {
      goToGuessing();
    }
  });

  // ---------- Picking ----------

  wireNumberPad('picking-pad', 'input-secret', 'picking-error');
  wireNumberPad('guessing-pad', 'input-guess', 'guessing-error');

  function goToPicking() {
    document.getElementById('picking-banner').textContent =
      `${players[pickerIndex].name}, choose your secret number`;
    document.getElementById('input-secret').value = '';
    document.getElementById('picking-error').classList.add('hidden');
    showScreen('picking');
  }

  document.getElementById('form-picking').addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = document.getElementById('input-secret').value;
    const n = parseValidNumber(raw);
    const errorEl = document.getElementById('picking-error');
    if (n === null) {
      errorEl.classList.remove('hidden');
      return;
    }
    errorEl.classList.add('hidden');
    secret = n;
    goToHandoff(guesserIndex, 'guess');
  });

  // ---------- Guessing ----------

  function goToGuessing() {
    document.getElementById('guessing-banner').textContent =
      mode === 'solo'
        ? `Guess the number (${MIN_NUM}-${MAX_NUM})`
        : `${players[guesserIndex].name}, guess the number (${MIN_NUM}-${MAX_NUM})`;
    document.getElementById('input-guess').value = '';
    document.getElementById('guessing-error').classList.add('hidden');
    document.getElementById('guess-feedback').classList.add('hidden');
    updateAttemptCount();
    renderGuessHistory();
    showScreen('guessing');
  }

  function updateAttemptCount() {
    document.getElementById('attempt-count-num').textContent = String(attempts);
    document.getElementById('attempt-count-plural').textContent = attempts === 1 ? '' : 's';
  }

  function showGuessPopup(result) {
    if (result !== 'higher' && result !== 'lower') return;
    const popup = document.getElementById('guess-popup');
    const text = document.getElementById('guess-popup-text');
    popup.classList.remove('show', 'higher', 'lower');
    void popup.offsetWidth; // restart the animation even on repeated same-direction guesses
    text.textContent = result === 'higher' ? 'HIGHER' : 'LOWER';
    popup.classList.add('show', result);
  }

  function renderGuessHistory() {
    const list = document.getElementById('guess-history');
    list.innerHTML = '';
    for (let i = guesses.length - 1; i >= 0; i--) {
      const g = guesses[i];
      const li = document.createElement('li');
      if (g.result === 'correct') li.classList.add('correct');
      const label = document.createElement('span');
      label.textContent = g.value;
      const hint = document.createElement('span');
      hint.classList.add('hint');
      hint.textContent = g.result === 'higher' ? '⬆️ Higher' : g.result === 'lower' ? '⬇️ Lower' : '🎯 Correct!';
      li.appendChild(label);
      li.appendChild(hint);
      list.appendChild(li);
    }
  }

  document.getElementById('form-guessing').addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = document.getElementById('input-guess').value;
    const n = parseValidNumber(raw);
    const errorEl = document.getElementById('guessing-error');
    if (n === null) {
      errorEl.classList.remove('hidden');
      return;
    }
    errorEl.classList.add('hidden');

    attempts += 1;
    let result;
    if (n < secret) result = 'higher';
    else if (n > secret) result = 'lower';
    else result = 'correct';

    guesses.push({ value: n, result });
    updateAttemptCount();
    renderGuessHistory();
    showGuessPopup(result);

    const feedbackEl = document.getElementById('guess-feedback');
    feedbackEl.classList.remove('hidden', 'higher', 'lower', 'correct');
    feedbackEl.classList.add(result);
    feedbackEl.textContent =
      result === 'higher' ? '⬆️ Higher!' : result === 'lower' ? '⬇️ Lower!' : '🎯 Correct!';

    document.getElementById('input-guess').value = '';

    if (result === 'correct') {
      turnResults.push({ guesserIndex, attempts });
      setTimeout(showTurnSummary, 600);
    }
  });

  // ---------- Turn summary ----------

  function showTurnSummary() {
    const guesserName = players[guesserIndex].name;
    const attemptWord = attempts === 1 ? 'attempt' : 'attempts';
    document.getElementById('turn-summary-text').textContent =
      `${guesserName} guessed it in ${attempts} ${attemptWord}!`;
    document.getElementById('turn-summary-secret').textContent = String(secret);
    showScreen('turnSummary');
  }

  document.getElementById('btn-turn-continue').addEventListener('click', () => {
    if (mode === 'solo') {
      startSoloRound();
    } else if (turn === 1) {
      startTurn(2, guesserIndex, pickerIndex);
    } else {
      showRoundResult();
    }
  });

  // ---------- Round result ----------

  function showRoundResult() {
    const [r1, r2] = turnResults; // r1: turn1 guesser result, r2: turn2 guesser result
    const titleEl = document.getElementById('round-result-title');
    const emojiEl = document.getElementById('result-emoji');

    let winnerIndex = null;
    if (r1.attempts < r2.attempts) winnerIndex = r1.guesserIndex;
    else if (r2.attempts < r1.attempts) winnerIndex = r2.guesserIndex;

    if (winnerIndex === null) {
      emojiEl.textContent = '🤝';
      titleEl.textContent = `It's a tie! Both guessed in ${r1.attempts}.`;
    } else {
      players[winnerIndex].roundsWon += 1;
      emojiEl.textContent = '🏆';
      titleEl.textContent = `${players[winnerIndex].name} wins the round!`;
    }

    const board = document.getElementById('score-board');
    board.innerHTML = '';
    players.forEach((p, idx) => {
      const item = document.createElement('div');
      item.classList.add('score-item');
      if (winnerIndex === idx) item.classList.add('winner');
      const nameEl = document.createElement('span');
      nameEl.classList.add('score-name');
      nameEl.textContent = p.name;
      const valueEl = document.createElement('span');
      valueEl.classList.add('score-value');
      valueEl.textContent = String(p.roundsWon);
      item.appendChild(nameEl);
      item.appendChild(valueEl);
      board.appendChild(item);
    });

    showScreen('roundResult');
  }

  document.getElementById('btn-next-round').addEventListener('click', () => {
    roundNumber += 1;
    starterIndex = 1 - starterIndex; // alternate who picks first
    startRound();
  });

  // ---------- Full reset ----------

  function resetGame() {
    mode = 'multi';
    players = [];
    starterIndex = 0;
    roundNumber = 1;
    turn = null;
    pickerIndex = null;
    guesserIndex = null;
    secret = null;
    attempts = 0;
    guesses = [];
    turnResults = [];
    handoffNext = null;
    document.getElementById('input-player1').value = '';
    document.getElementById('input-player2').value = '';
    showScreen('nameEntry');
  }

  const resetOverlay = document.getElementById('reset-confirm-overlay');

  document.getElementById('btn-reset-game').addEventListener('click', () => {
    const hasProgress = players.length > 0;
    if (hasProgress) {
      document.getElementById('overlay-text').textContent =
        mode === 'solo'
          ? 'Reset the game? This clears your progress.'
          : 'Reset the whole game? This clears both players and all scores.';
      resetOverlay.classList.remove('hidden');
    } else {
      resetGame();
    }
  });

  document.getElementById('btn-reset-cancel').addEventListener('click', () => {
    resetOverlay.classList.add('hidden');
  });

  document.getElementById('btn-reset-confirm').addEventListener('click', () => {
    resetOverlay.classList.add('hidden');
    resetGame();
  });
})();
