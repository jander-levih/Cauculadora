// Variáveis globais para a calculadora científica
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;

// Histórico de cálculos proporcionais
let calculationHistory = [];

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function () {
    initializeTabs();
    loadHistory();
    setDefaultDates();
});

// Sistema de abas
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove classe active de todos os botões e conteúdos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Adiciona classe active ao botão clicado e conteúdo correspondente
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// ===== CALCULADORA CIENTÍFICA =====

function appendNumber(number) {
    if (shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }

    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    updateDisplay();
}

function appendDecimal() {
    if (shouldResetScreen) {
        currentOperand = '0.';
        shouldResetScreen = false;
        updateDisplay();
        return;
    }

    if (currentOperand.includes('.')) return;
    currentOperand += '.';
    updateDisplay();
}

function setOperation(selectedOperation) {
    if (currentOperand === '') return;

    if (previousOperand !== '') {
        calculateResult();
    }

    operation = selectedOperation;
    previousOperand = currentOperand;
    shouldResetScreen = true;
    updateDisplay();
}

function calculateResult() {
    if (previousOperand === '' || currentOperand === '') return;

    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert('Erro: Divisão por zero!');
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }

    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    shouldResetScreen = true;
    updateDisplay();
}

function calculate(functionName) {
    const current = parseFloat(currentOperand);
    let result;

    switch (functionName) {
        case 'sin':
            result = Math.sin(current * Math.PI / 180); // Converte para radianos
            break;
        case 'cos':
            result = Math.cos(current * Math.PI / 180);
            break;
        case 'tan':
            result = Math.tan(current * Math.PI / 180);
            break;
        case 'log':
            if (current <= 0) {
                alert('Erro: Logaritmo de número não positivo!');
                return;
            }
            result = Math.log10(current);
            break;
        case 'ln':
            if (current <= 0) {
                alert('Erro: Logaritmo natural de número não positivo!');
                return;
            }
            result = Math.log(current);
            break;
        case 'sqrt':
            if (current < 0) {
                alert('Erro: Raiz quadrada de número negativo!');
                return;
            }
            result = Math.sqrt(current);
            break;
        case 'power':
            result = Math.pow(current, 2);
            break;
        case 'factorial':
            if (current < 0 || !Number.isInteger(current)) {
                alert('Erro: Fatorial apenas para números inteiros não negativos!');
                return;
            }
            if (current > 170) {
                alert('Erro: Número muito grande para fatorial!');
                return;
            }
            result = factorial(current);
            break;
        case 'inverse':
            if (current === 0) {
                alert('Erro: Divisão por zero!');
                return;
            }
            result = 1 / current;
            break;
        case 'abs':
            result = Math.abs(current);
            break;
        case 'percent':
            result = current / 100;
            break;
        case 'pi':
            result = Math.PI;
            break;
        case 'e':
            result = Math.E;
            break;
    }

    currentOperand = result.toString();
    shouldResetScreen = true;
    updateDisplay();
}

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function clearEntry() {
    currentOperand = '0';
    updateDisplay();
}

function backspace() {
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('current-operand').textContent = currentOperand;

    if (operation != null) {
        document.getElementById('previous-operand').textContent = `${previousOperand} ${operation}`;
    } else {
        document.getElementById('previous-operand').textContent = '';
    }
}

// ===== CALCULADORA DE DATAS =====

function setDefaultDates() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    document.getElementById('start-date').value = todayStr;
    document.getElementById('end-date').value = todayStr;
    document.getElementById('base-date').value = todayStr;
}

function calculateDateDifference() {
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        showResult('date-result', 'Por favor, selecione datas válidas.', 'error');
        return;
    }

    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const startFormatted = startDate.toLocaleDateString('pt-BR');
    const endFormatted = endDate.toLocaleDateString('pt-BR');

    let resultText = `De ${startFormatted} até ${endFormatted}:<br>`;
    resultText += `<strong>${daysDiff} dias</strong>`;

    if (daysDiff === 0) {
        resultText = 'As datas são iguais (0 dias)';
    }

    showResult('date-result', resultText, 'success');
}

function addDays() {
    const baseDate = new Date(document.getElementById('base-date').value);
    const daysToAdd = parseInt(document.getElementById('days-to-add').value);

    if (isNaN(baseDate.getTime()) || isNaN(daysToAdd)) {
        showResult('add-subtract-result', 'Por favor, insira uma data válida e número de dias.', 'error');
        return;
    }

    const newDate = new Date(baseDate);
    newDate.setDate(baseDate.getDate() + daysToAdd);

    const baseFormatted = baseDate.toLocaleDateString('pt-BR');
    const newFormatted = newDate.toLocaleDateString('pt-BR');

    const resultText = `${baseFormatted} + ${daysToAdd} dias = <strong>${newFormatted}</strong>`;
    showResult('add-subtract-result', resultText, 'success');
}

function subtractDays() {
    const baseDate = new Date(document.getElementById('base-date').value);
    const daysToSubtract = parseInt(document.getElementById('days-to-add').value);

    if (isNaN(baseDate.getTime()) || isNaN(daysToSubtract)) {
        showResult('add-subtract-result', 'Por favor, insira uma data válida e número de dias.', 'error');
        return;
    }

    const newDate = new Date(baseDate);
    newDate.setDate(baseDate.getDate() - daysToSubtract);

    const baseFormatted = baseDate.toLocaleDateString('pt-BR');
    const newFormatted = newDate.toLocaleDateString('pt-BR');

    const resultText = `${baseFormatted} - ${daysToSubtract} dias = <strong>${newFormatted}</strong>`;
    showResult('add-subtract-result', resultText, 'success');
}

// ===== CALCULADORA PROPORCIONAL =====

function calculateProportional() {
    const totalValue = parseFloat(document.getElementById('total-value').value);
    const totalPeriod = parseInt(document.getElementById('total-period').value);
    const usedPeriod = parseInt(document.getElementById('used-period').value);

    if (isNaN(totalValue) || isNaN(totalPeriod) || isNaN(usedPeriod)) {
        showResult('proportional-result', 'Por favor, preencha todos os campos com valores válidos.', 'error');
        return;
    }

    if (totalValue <= 0 || totalPeriod <= 0 || usedPeriod <= 0) {
        showResult('proportional-result', 'Todos os valores devem ser maiores que zero.', 'error');
        return;
    }

    if (usedPeriod > totalPeriod) {
        showResult('proportional-result', 'O período utilizado não pode ser maior que o período total.', 'error');
        return;
    }

    const proportionalValue = (totalValue * usedPeriod) / totalPeriod;

    const resultText = `
        <strong>Valor Total:</strong> R$ ${totalValue.toFixed(2)}<br>
        <strong>Período Total:</strong> ${totalPeriod} dias<br>
        <strong>Período Utilizado:</strong> ${usedPeriod} dias<br>
        <strong>Valor Devido:</strong> <span style="color: #27ae60; font-size: 1.2em;">R$ ${proportionalValue.toFixed(2)}</span>
    `;

    showResult('proportional-result', resultText, 'success');

    // Adiciona ao histórico
    addToHistory(totalValue, totalPeriod, usedPeriod, proportionalValue);
}

function addToHistory(totalValue, totalPeriod, usedPeriod, proportionalValue) {
    const calculation = {
        id: Date.now(),
        totalValue: totalValue,
        totalPeriod: totalPeriod,
        usedPeriod: usedPeriod,
        proportionalValue: proportionalValue,
        timestamp: new Date().toLocaleString('pt-BR')
    };

    calculationHistory.unshift(calculation);

    // Limita o histórico a 50 itens
    if (calculationHistory.length > 50) {
        calculationHistory = calculationHistory.slice(0, 50);
    }

    saveHistory();
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #6c757d; font-style: italic;">Nenhum cálculo realizado ainda.</p>';
        return;
    }

    calculationHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="calculation">
                R$ ${item.totalValue.toFixed(2)} ÷ ${item.totalPeriod} dias × ${item.usedPeriod} dias
            </div>
            <div class="result">
                R$ ${item.proportionalValue.toFixed(2)}
            </div>
            <div class="timestamp">
                ${item.timestamp}
            </div>
        `;
        historyList.appendChild(historyItem);
    });
}

function clearHistory() {
    if (confirm('Tem certeza que deseja limpar todo o histórico de cálculos?')) {
        calculationHistory = [];
        saveHistory();
        updateHistoryDisplay();
    }
}

function saveHistory() {
    localStorage.setItem('proportionalCalculatorHistory', JSON.stringify(calculationHistory));
}

function loadHistory() {
    const saved = localStorage.getItem('proportionalCalculatorHistory');
    if (saved) {
        calculationHistory = JSON.parse(saved);
        updateHistoryDisplay();
    }
}

// ===== FUNÇÕES AUXILIARES =====

function showResult(elementId, message, type) {
    const resultElement = document.getElementById(elementId);
    resultElement.innerHTML = message;
    resultElement.className = 'result show';

    // Remove a classe após 5 segundos para mensagens de erro
    if (type === 'error') {
        setTimeout(() => {
            resultElement.classList.remove('show');
        }, 5000);
    }
}

// Teclas de atalho para a calculadora científica
document.addEventListener('keydown', function (event) {
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendDecimal();
    } else if (event.key === '+') {
        setOperation('+');
    } else if (event.key === '-') {
        setOperation('-');
    } else if (event.key === '*') {
        setOperation('×');
    } else if (event.key === '/') {
        event.preventDefault();
        setOperation('÷');
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculateResult();
    } else if (event.key === 'Escape') {
        clearAll();
    } else if (event.key === 'Backspace') {
        backspace();
    }
});
