const SQUARE_POSITIONS = [
    { id: 1, x: 55, y: 15 }, { id: 2, x: 15, y: 21 }, { id: 3, x: 85, y: 21 },
    { id: 4, x: 38, y: 41 }, { id: 5, x: 19, y: 57 }, { id: 6, x: 69, y: 55 },
    { id: 7, x: 46, y: 77 }, { id: 8, x: 10, y: 86 }, { id: 9, x: 86, y: 84 }
];

const TRIAL_DIRECT_SEQUENCES = [[8, 3], [5, 9]];
const TRIAL_INVERSE_SEQUENCES = [[9, 4], [2, 5]];
const DIRECT_SEQUENCES = [
    [3, 8], [5, 1], [6, 2, 9], [4, 7, 1], [1, 5, 4, 7], [8, 2, 3, 6],
    [9, 3, 1, 4, 8], [7, 2, 5, 1, 6], [2, 6, 8, 5, 9, 1], [4, 8, 3, 7, 1, 2],
    [5, 9, 2, 7, 6, 3, 4], [1, 6, 8, 3, 5, 9, 7], [6, 4, 8, 1, 3, 7, 2, 5],
    [3, 9, 8, 2, 4, 6, 7, 1], [7, 1, 5, 6, 3, 8, 2, 9, 4], [6, 2, 9, 4, 1, 7, 8, 5, 3]
];

const INVERSE_SEQUENCES = [
    [5, 2], [9, 1], [7, 2, 3], [1, 4, 8], [8, 5, 2, 9], [4, 7, 3, 1],
    [6, 3, 8, 2, 7], [5, 1, 9, 4, 6], [1, 5, 8, 6, 2, 4], [9, 3, 7, 4, 8, 2],
    [3, 6, 7, 2, 9, 5, 4], [7, 9, 5, 3, 8, 6, 1], [5, 2, 7, 3, 1, 8, 4, 6],
    [1, 7, 6, 4, 2, 8, 9, 3], [4, 9, 2, 8, 3, 6, 5, 1, 7], [3, 5, 8, 7, 1, 4, 9, 2, 6]
];

let state = {
    stage: 'NAME_SCREEN', // Inicia pela tela de nome
    participantId: '',
    isTrial: true,
    isInverse: false,
    currentIndex: 0,
    userSelection: [],
    errorsInCurrentPair: 0,
    results: { ad: 0, ai: 0, sd: 0, si: 0 },
    trials: [],
    canClick: false
};

const container = document.getElementById('screen-container');

function render() {
    container.innerHTML = '';
    if (state.stage === 'NAME_SCREEN') renderNameScreen();
    else if (state.stage === 'WELCOME') renderWelcome();
    else if (state.stage === 'TRIAL_RAPPORT') renderTrialRapport(); 
    else if (state.stage === 'RAPPORT') renderRapport();
    else if (state.stage === 'TESTING') renderTesting();
    else if (state.stage === 'RESULTS') renderResults();
}

function renderNameScreen() {
    container.innerHTML = `
        <h1 class="title" style="margin-bottom: 0;">Bem-vindo(a) ao Experimento</h1>
        <h2 class="title" style="color: var(--text); font-size: 1.8rem; margin-top: 10px;">Span Visuoespacial</h2>
        <p style="margin-bottom: 2rem; font-size: 1.1rem; color: var(--text-dim);">Para começar, por favor, digite seu ID ou nome.</p>
        
        <input type="text" id="participant-name-input" class="input-name" placeholder="Digite seu nome ou ID..." autocomplete="off">
        
        <div style="display: flex; justify-content: center; width: 100%;">
            <button id="submit-name-button" class="btn-main">AVANÇAR PARA INSTRUÇÕES</button>
        </div>
    `;
    
    const input = document.getElementById('participant-name-input');
    const btn = document.getElementById('submit-name-button');
    
    input.focus();
    
    const submitName = () => {
        let val = input.value.trim();
        if (!val) {
            alert("Por favor, digite seu nome ou ID para começar o teste.");
            input.focus();
            return;
        }
        state.participantId = val;
        nextStage('WELCOME');
    };
    
    btn.onclick = submitName;
    input.onkeypress = (e) => { 
        if (e.key === 'Enter') submitName(); 
    };
}

function renderWelcome() {
    container.innerHTML = `
        <h1 class="title">Span Visuoespacial</h1>
        <p style="margin:20px 0; color: var(--text-dim); font-size: 1.1rem;">Avaliação neuropsicológica de memória operacional visuoespacial e atenção concentrada.</p>
        <button onclick="nextStage('TRIAL_RAPPORT')">Iniciar Aplicativo</button>
    `;
}

function renderTrialRapport() {
    if (!state.isInverse) {
        container.innerHTML = `
            <h2 class="title">Treino - Span Visual (Etapa Direta)</h2>
            <div class="instructions-text">
                <p>Nesse teste você verá 9 quadrados azuis dispostos na tela. Ao iniciar o teste, alguns quadrados irão piscar na cor amarela, um de cada vez, em uma ordem.</p>
                <p>Assim que a sequência terminar, você deverá selecionar os blocos que piscaram, clicando neles usando o seu mouse, na mesma ordem em que eles piscaram.</p>
                <p>Quando terminar, clique no botão para seguir para a próxima sequência.</p>
                <p>Se cometer um erro durante a seleção clique no botão "refazer" e tente novamente.</p>
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--border);">
                    <h3 style="color: var(--cyan); text-align: center; margin-bottom: 15px; font-size: 1.2rem;">⚠️ IMPORTANTE</h3>
                    <p style="text-align: center; margin: 0 auto; max-width: 480px;">A sequência será reproduzida <strong>uma única vez</strong>.<br>A sequência <strong>não pode ser vista novamente</strong>.<br>Preste <strong>muita</strong> atenção!</p>
                </div>
            </div>
            <button onclick="nextStage('TESTING')">Começar Treino Direto</button>
        `;
    } else {
        container.innerHTML = `
            <h2 class="title">Treino - Span Visual (Etapa Inversa)</h2>
            <div class="instructions-text">
                <p>Nessa próxima etapa de treino você vai ver novas sequências nos quadrados piscando, assim como na parte anterior.</p>
                <p>No entanto, desta vez, sua tarefa será selecionar os quadrados na <strong>ordem inversa (de trás para frente)</strong> que eles piscaram.</p>
                <p>Quando terminar de selecionar, clique no botão para seguir para a próxima sequência.</p>
                <p>Se cometer um erro durante a seleção clique no botão "refazer" e tente novamente.</p>
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--border);">
                    <h3 style="color: var(--cyan); text-align: center; margin-bottom: 15px; font-size: 1.2rem;">⚠️ IMPORTANTE</h3>
                    <p style="text-align: center; margin: 0 auto; max-width: 480px;">A sequência será reproduzida <strong>uma única vez</strong>.<br>A sequência <strong>não pode ser vista novamente</strong>.<br>Preste <strong>muita</strong> atenção!</p>
                </div>
            </div>
            <button onclick="nextStage('TESTING')">Começar Treino Inverso</button>
        `;
    }
}

function renderRapport() {
    if (!state.isInverse) {
        container.innerHTML = `
            <h2 class="title">Teste - Span Visual (Etapa Direta)</h2>
            <div class="instructions-text">
                <p>Excelente! Agora que você já sabe como o teste funciona, vamos iniciar a avaliação oficial.</p>
                <p>Lembre-se da regra principal: selecione os blocos usando o mouse <strong>na exata mesma ordem</strong> em que eles piscaram na tela.</p>
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--border);">
                    <h3 style="color: var(--cyan); text-align: center; margin-bottom: 15px; font-size: 1.2rem;">⚠️ IMPORTANTE</h3>
                    <p style="text-align: center; margin: 0 auto; max-width: 480px;">A sequência será reproduzida <strong>uma única vez</strong>.<br>A sequência <strong>não pode ser vista novamente</strong>.<br>Preste <strong>muita</strong> atenção!</p>
                </div>
            </div>
            <button onclick="nextStage('TESTING')">Começar Etapa Direta</button>
        `;
    } else {
        container.innerHTML = `
            <h2 class="title">Teste - Span Visual (Etapa Inversa)</h2>
            <div class="instructions-text">
                <p>Muito bem! Agora que você compreendeu a mecânica de inversão, vamos para o teste oficial desta etapa.</p>
                <p>Lembre-se da regra principal: selecione os quadrados na <strong>ordem inversa (de trás para frente)</strong> em que eles piscaram.</p>
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--border);">
                    <h3 style="color: var(--cyan); text-align: center; margin-bottom: 15px; font-size: 1.2rem;">⚠️ IMPORTANTE</h3>
                    <p style="text-align: center; margin: 0 auto; max-width: 480px;">A sequência será reproduzida <strong>uma única vez</strong>.<br>A sequência <strong>não pode ser vista novamente</strong>.<br>Preste <strong>muita</strong> atenção!</p>
                </div>
            </div>
            <button onclick="nextStage('TESTING')">Começar Etapa Inversa</button>
        `;
    }
}

function renderTesting() {
    container.innerHTML = `
        <h2 id="status-msg">Prepare-se...</h2>
        <div class="corsi-grid" id="grid"></div>
        <div class="ui-layer" id="controls" style="visibility:hidden; display: flex; gap: 15px; justify-content: center;">
            <button class="btn-secondary" onclick="resetSelection()">Refazer</button>
            <button onclick="checkSequence()">Próximo</button>
        </div>
    `;
    const grid = document.getElementById('grid');
    SQUARE_POSITIONS.forEach(pos => {
        const block = document.createElement('div');
        block.className = 'block';
        block.style.left = `${pos.x}%`;
        block.style.top = `${pos.y}%`;
        block.id = `block-${pos.id}`;
        block.onclick = () => handleBlockClick(pos.id);
        grid.appendChild(block);
    });
    startSequence();
}

async function startSequence() {
    state.canClick = false;

    let sequences;
    if (state.isTrial) {
        sequences = state.isInverse ? TRIAL_INVERSE_SEQUENCES : TRIAL_DIRECT_SEQUENCES;
    } else {
        sequences = state.isInverse ? INVERSE_SEQUENCES : DIRECT_SEQUENCES;
    }

    let sequenceToShow = sequences[state.currentIndex];

    if (state.isInverse) {
        sequenceToShow = [...sequenceToShow].reverse();
    }
    
    await new Promise(r => setTimeout(r, 1200));
    document.getElementById('status-msg').innerText = "Observe!";

    for (let id of sequenceToShow) {
        await flashBlock(id);
        await new Promise(r => setTimeout(r, 450));
    }

    document.getElementById('status-msg').innerText = "Sua vez!";
    document.getElementById('controls').style.visibility = 'visible';
    state.canClick = true;
}

async function flashBlock(id) {
    const el = document.getElementById(`block-${id}`);
    if(!el) return;
    playBeep(440);
    el.classList.add('active');
    await new Promise(r => setTimeout(r, 850));
    el.classList.remove('active');
}

function handleBlockClick(id) {
    if (!state.canClick) return;
    state.userSelection.push(id);
    const el = document.getElementById(`block-${id}`);
    el.classList.add('selected');
    playBeep(550);
    setTimeout(() => el.classList.remove('selected'), 600);
}

function resetSelection() {
    state.userSelection = [];
    document.querySelectorAll('.block').forEach(b => {
        b.classList.remove('selected');
        b.classList.add('reset-animation');
        setTimeout(() => b.classList.remove('reset-animation'), 400);
    });
    const statusMsg = document.getElementById('status-msg');
    statusMsg.innerText = "Seleção reiniciada!";
    statusMsg.style.color = "var(--error)";
    playBeep(330);
    setTimeout(() => {
        statusMsg.innerText = "Sua vez!";
        statusMsg.style.color = "var(--cyan)";
    }, 1000);
}

function checkSequence() {
    let sequences;
    if (state.isTrial) {
        sequences = state.isInverse ? TRIAL_INVERSE_SEQUENCES : TRIAL_DIRECT_SEQUENCES;
    } else {
        sequences = state.isInverse ? INVERSE_SEQUENCES : DIRECT_SEQUENCES;
    }

    const currentCorrectSeq = sequences[state.currentIndex];
    const isCorrect = JSON.stringify(state.userSelection) === JSON.stringify(currentCorrectSeq);

    if (state.isTrial) {
        if (!isCorrect) {
            const statusMsg = document.getElementById('status-msg');
            statusMsg.innerText = "Incorreto! Observe a sequência novamente.";
            statusMsg.style.color = "var(--error)";
            playBeep(330);
            document.getElementById('controls').style.visibility = 'hidden';

            setTimeout(() => {
                statusMsg.style.color = "var(--cyan)";
                statusMsg.innerText = "Prepare-se...";
                state.userSelection = [];
                document.querySelectorAll('.block').forEach(b => b.classList.remove('selected'));
                startSequence();
            }, 2000);
            return;
        }
    }
    else {
        state.trials.push({
            stage: state.isInverse ? 'inversa' : 'direta',
            span: currentCorrectSeq.length,
            sequence: currentCorrectSeq.slice(),
            userAnswer: state.userSelection.slice(),
            isCorrect
        });

        if (isCorrect) {
            if (state.isInverse) {
                state.results.ai++;
                state.results.si = Math.max(state.results.si, currentCorrectSeq.length);
            } else {
                state.results.ad++;
                state.results.sd = Math.max(state.results.sd, currentCorrectSeq.length);
            }
        } 
        
        if (!isCorrect) {
            state.errorsInCurrentPair++;
        }
    }

    const nextIndex = state.currentIndex + 1;
    const pairFinished = nextIndex % 2 === 0;
    let shouldStop = false;

    if (state.isTrial) {
        shouldStop = nextIndex >= sequences.length;
    } else {
        shouldStop = (pairFinished && state.errorsInCurrentPair >= 2) || nextIndex >= sequences.length;
    }

    if (shouldStop) {
        state.userSelection = []; 
        if (state.isTrial && !state.isInverse) {
            state.isTrial = false;
            state.currentIndex = 0;
            state.errorsInCurrentPair = 0;
            state.stage = 'RAPPORT';
            render();
        } else if (!state.isTrial && !state.isInverse) {
            state.isTrial = true;
            state.isInverse = true;
            state.currentIndex = 0;
            state.errorsInCurrentPair = 0;
            state.stage = 'TRIAL_RAPPORT';
            render();
        } else if (state.isTrial && state.isInverse) {
            state.isTrial = false;
            state.currentIndex = 0;
            state.errorsInCurrentPair = 0;
            state.stage = 'RAPPORT';
            render();
        } else {
            state.stage = 'RESULTS';
            render();
        }
    } else {
        if (pairFinished && !state.isTrial) {
            state.errorsInCurrentPair = 0;
        }
        state.currentIndex = nextIndex;
        state.userSelection = [];
        renderTesting();
    }
}

// --- TELA DE RESULTADOS COM ENVIO AUTOMÁTICO ---
function renderResults() {
    container.innerHTML = `
        <h1 class="title" style="font-size: 2.25rem;">Você finalizou o teste!</h1>
        <p id="email-status-text" style="margin-bottom: 2.5rem; font-weight: 600; color: var(--text-dim); font-size: 1.1rem;">⏳ Processando resultados...</p>
        
        <div style="display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 400px; margin: 0 auto;">
            <button class="btn-secondary" onclick="copyToClipboard()" style="margin: 0; width: 100%;">COPIAR DADOS BRUTOS (BKP)</button>
            <button class="btn-secondary" style="margin: 0; width: 100%; background: var(--border);" onclick="location.reload()">SAIR</button>
        </div>
    `;
    
    sendResultsByEmail();
}

async function sendResultsByEmail() {
    const statusText = document.getElementById('email-status-text');
    if(!statusText) return;
    statusText.textContent = '⏳ Enviando resultados para o servidor...';
    
    const fields = ['etapa', 'span', 'sequencia_esperada', 'resposta_usuario', 'acertou'];
    const rows = state.trials.map(t => [
        t.stage,
        t.span,
        `"${t.sequence.join(' ')}"`,
        `"${t.userAnswer.join(' ')}"`,
        t.isCorrect ? 'sim' : 'nao'
    ]);
    const headerRow = fields.join(';');
    const csvContent = [headerRow, ...rows.map(r => r.join(';'))].join('\n');

    try {
        const response = await fetch('/api/enviar', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dadosCSV: csvContent,
                participante: state.participantId
            })
        });

        if (response.ok) {
            statusText.innerHTML = '✅ Resultados salvos e enviados com sucesso!';
            statusText.style.color = 'var(--cyan)';
        } else {
            throw new Error('Erro no servidor');
        }
    } catch (error) {
        console.error("Erro:", error);
        statusText.innerHTML = '❌ Erro no envio automático. Por favor, clique em "COPIAR DADOS BRUTOS".';
        statusText.style.color = 'var(--error)';
    }
}

function copyToClipboard() {
    const fields = ['etapa', 'span', 'sequencia_esperada', 'resposta_usuario', 'acertou'];
    const rows = state.trials.map(t => [
        t.stage,
        t.span,
        `"${t.sequence.join(' ')}"`,
        `"${t.userAnswer.join(' ')}"`,
        t.isCorrect ? 'sim' : 'nao'
    ]);
    
    let clipText = fields.join('\t') + '\n';
    rows.forEach(row => { clipText += row.join('\t') + '\n'; });
    
    navigator.clipboard.writeText(clipText).then(() => {
        alert("Resultados copiados! Cole (Ctrl+V) no Excel.");
    }).catch(err => {
        alert("Erro ao copiar.");
    });
}

function playBeep(freq) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.connect(gain); gain.connect(context.destination);
    osc.frequency.value = freq; osc.start(); osc.stop(context.currentTime + 0.1);
}

function nextStage(s) { state.stage = s; render(); }
render();