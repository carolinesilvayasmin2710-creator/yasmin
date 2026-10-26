// Dados das perguntas da influencer
const questionsData = [
    { id: 1, title: "Tempo como Influencer", icon: "fa-camera-retro" },
    { id: 2, title: "Início do Casal", icon: "fa-people-arrows" },
    { id: 3, title: "Abertura da Marca", icon: "fa-store" },
    { id: 4, title: "Número de Filhos", icon: "fa-child-reaching" },
    { id: 5, title: "Início da Carreira", icon: "fa-star" },
    { id: 6, title: "Local de Nascimento", icon: "fa-location-dot" }
];

let currentStep = 1;
const totalSteps = questionsData.length;
const userAnswers = {};

// Elementos do DOM
const formSteps = document.querySelectorAll('.question-step');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const currentStepSpan = document.getElementById('current-step');
const progressBar = document.getElementById('progress-bar');
const flowchartContainer = document.getElementById('flowchart-container');

// Atualiza a visualização do passo atual
function updateStepView() {
    formSteps.forEach(step => {
        if (parseInt(step.dataset.step) === currentStep) {
            step.classList.add('active');
            // Foca no input ativo
            const input = step.querySelector('input');
            if (input) input.focus();
        } else {
            step.classList.remove('active');
        }
    });

    currentStepSpan.textContent = currentStep;
    progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;

    // Mostra/Oculta botão Voltar
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
    }

    // Altera texto do botão Próximo no último passo
    if (currentStep === totalSteps) {
        nextBtn.innerHTML = 'Finalizar Fluxograma <i class="fa-solid fa-check"></i>';
    } else {
        nextBtn.innerHTML = 'Próximo <i class="fa-solid fa-arrow-right"></i>';
    }
}

// Renderiza o fluxograma dinâmico de acordo com as respostas preenchidas
function renderFlowchart() {
    flowchartContainer.innerHTML = '';

    const answeredKeys = Object.keys(userAnswers);

    if (answeredKeys.length === 0) {
        flowchartContainer.innerHTML = `
            <div class="empty-flowchart">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <p>Suas respostas aparecerão aqui em formato de fluxograma interativo e dinâmico!</p>
            </div>
        `;
        return;
    }

    answeredKeys.forEach((key, index) => {
        const qIndex = parseInt(key) - 1;
        const qInfo = questionsData[qIndex];
        const answerValue = userAnswers[key];

        // Cria o nó do fluxograma
        const node = document.createElement('div');
        node.className = 'flow-node';
        node.innerHTML = `
            <div class="node-title"><i class="fa-solid ${qInfo.icon}"></i> ${qInfo.title}</div>
            <div class="node-value">${answerValue}</div>
        `;
        flowchartContainer.appendChild(node);

        // Adiciona a seta conectora se não for o último elemento preenchido
        if (index < answeredKeys.length - 1) {
            const connector = document.createElement('div');
            connector.className = 'flow-connector';
            flowchartContainer.appendChild(connector);
        }
    });

    // Rola para o final do fluxograma automaticamente
    flowchartContainer.scrollTop = flowchartContainer.scrollHeight;
}

// Botão Próximo / Salvar resposta
nextBtn.addEventListener('click', () => {
    const activeStepElement = document.querySelector(`.question-step[data-step="${currentStep}"]`);
    const inputElement = activeStepElement.querySelector('input');
    const value = inputElement.value.trim();

    if (value === "") {
        alert("Por favor, preencha o campo antes de continuar!");
        inputElement.focus();
        return;
    }

    // Salva a resposta
    userAnswers[currentStep] = value;
    renderFlowchart();

    if (currentStep < totalSteps) {
        currentStep++;
        updateStepView();
    } else {
        alert("Parabéns! Seu fluxograma de trajetória está completo e pronto!");
    }
});

// Botão Voltar
prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateStepView();
    }
});

// Suporte para tecla ENTER avançar o passo
document.querySelectorAll('.question-step input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextBtn.click();
        }
    });
});

// Inicialização
updateStepView();