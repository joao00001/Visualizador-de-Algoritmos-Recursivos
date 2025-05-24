document.addEventListener('DOMContentLoaded', () => {
    const visualizeBtn = document.getElementById('visualize-btn');
    const algorithmInputNumber = document.getElementById('algorithm-input-number');
    const algorithmInput = document.getElementById('algorithm-input'); // MODIFICADO
    const algorithmInputLabel = document.getElementById('algorithm-input-label'); // NOVO, se quiser mudar o label dinamicamente
    const inputHint = document.getElementById('input-hint'); // NOVO
    const stepsLog = document.getElementById('steps-log');
    const callStackList = document.getElementById('call-stack-list');
    const finalResult = document.getElementById('final-result');
    const algorithmSelect = document.getElementById('algorithm-select'); // Adicionado para obter o seletor

    const codeSectionAlgorithmNameSpan = document.getElementById('code-section-algorithm-name');
    const pageLineNumbersDiv = document.getElementById('page-line-numbers');
    const pageCodeDisplayPre = document.getElementById('page-code-display');

    const algorithmCodes = {
        factorial:
`function fatorial(n) { // Linha 1
  // Caso base: n é 0 ou 1
  if (n === 0 || n === 1) { // Linha 3
    return 1; // Linha 4
  }
  // Passo recursivo
  else { // Linha 7
    return n * fatorial(n - 1); // Linha 8
  }
}`,
        fibonacci:
`function fibonacci(n) { // Linha 1
  // Casos base
  if (n <= 0) { // Linha 3
    return 0; // Linha 4
  }
  if (n === 1) { // Linha 6
    return 1; // Linha 7
  }
  // Passo recursivo
  else { // Linha 10
    return fibonacci(n - 1) + fibonacci(n - 2); // Linha 11
  }
}`,
        bubbleSort: // NOVO
`function bubbleSortRecursive(arr, n) { // Linha 1
  // n é o tamanho da porção do array a ser ordenada
  // Caso base: se o tamanho é 1, está ordenado
  if (n <= 1) { // Linha 4
    return arr; // Linha 5
  }

  // Realiza uma passagem, "borbulhando" o maior elemento
  for (let i = 0; i < n - 1; i++) { // Linha 9
    if (arr[i] > arr[i + 1]) { // Linha 10
      // Troca arr[i] com arr[i+1]
      let temp = arr[i]; // Linha 12
      arr[i] = arr[i + 1]; // Linha 13
      arr[i + 1] = temp; // Linha 14
    }
  }

  // O maior elemento está na posição correta (n-1)
  // Chama recursivamente para o restante do array
  return bubbleSortRecursive(arr, n - 1); // Linha 20
}`,
        mergeSort: // NOVO
`function mergeSort(arr) { // Linha 1
  if (arr.length <= 1) { // Linha 2
    return arr; // Linha 3
  }

  const meio = Math.floor(arr.length / 2); // Linha 6
  const esquerda = arr.slice(0, meio); // Linha 7
  const direita = arr.slice(meio); // Linha 8

  // Chamadas recursivas e merge
  return merge(mergeSort(esquerda), mergeSort(direita)); // Linha 11
}

// Função auxiliar para mesclar dois arrays ordenados
function merge(esquerda, direita) { // Linha 14
  let resultado = []; // Linha 15
  let iEsquerda = 0; // Linha 16
  let iDireita = 0; // Linha 17

  while (iEsquerda < esquerda.length && iDireita < direita.length) { // Linha 19
    if (esquerda[iEsquerda] < direita[iDireita]) { // Linha 20
      resultado.push(esquerda[iEsquerda]); // Linha 21
      iEsquerda++; // Linha 22
    } else {
      resultado.push(direita[iDireita]); // Linha 24
      iDireita++; // Linha 25
    }
  }

  // Adiciona os elementos restantes (se houver)
  return resultado // Linha 30
    .concat(esquerda.slice(iEsquerda))
    .concat(direita.slice(iDireita));
}`,
        quickSort: // NOVO
`function quickSort(arr, baixo, alto) { // Linha 1
  if (baixo < alto) { // Linha 2
    // pi é o índice de particionamento, arr[pi] está no lugar certo
    let pi = particionar(arr, baixo, alto); // Linha 4

    quickSort(arr, baixo, pi - 1);  // Ordena antes da partição // Linha 6
    quickSort(arr, pi + 1, alto); // Ordena depois da partição // Linha 7
  }
  return arr; // Linha 9
}

// Função auxiliar para particionar o array
function particionar(arr, baixo, alto) { // Linha 12
  let pivo = arr[alto]; // Pivô é o último elemento // Linha 13
  let i = (baixo - 1);  // Índice do menor elemento // Linha 14

  for (let j = baixo; j < alto; j++) { // Linha 16
    if (arr[j] < pivo) { // Linha 17
      i++; // Linha 18
      // Troca arr[i] com arr[j]
      let temp = arr[i]; // Linha 20
      arr[i] = arr[j]; // Linha 21
      arr[j] = temp; // Linha 22
    }
  }
  // Troca arr[i+1] com arr[alto] (pivô)
  let temp = arr[i + 1]; // Linha 26
  arr[i + 1] = arr[alto]; // Linha 27
  arr[alto] = temp; // Linha 28
  return i + 1; // Linha 29
}`
    };

    let callIdCounter = 0;
    let activeCallStackFrames = [];
    const baseDelay = 1000; // Delay padrão para visualização

    // Atualiza o label e o código exibido ao mudar o algoritmo
    if (algorithmSelect) {
        algorithmSelect.addEventListener('change', (event) => {
            const selectedAlgorithm = event.target.value;
            let currentAlgorithmName = '';
            let currentAlgorithmCode = '';
            let currentMaxInput = "20"; // Default max for single number inputs
            let currentInputHint = "Para Fatorial/Fibonacci: um número. Para Ordenação: números separados por vírgula (ex: 5,2,8,1).";
            let currentInputValue = "5";

            if (selectedAlgorithm === 'factorial') {
                currentAlgorithmName = 'Fatorial';
                currentAlgorithmCode = algorithmCodes.factorial;
                currentMaxInput = "20";
                currentInputValue = "5";
            } else if (selectedAlgorithm === 'fibonacci') {
                currentAlgorithmName = 'Fibonacci';
                currentAlgorithmCode = algorithmCodes.fibonacci;
                currentMaxInput = "20"; // Fibonacci fica lento rápido
                currentInputValue = "5";
            } else if (selectedAlgorithm === 'bubbleSort') {
                currentAlgorithmName = 'Bubble Sort (Recursivo)';
                currentAlgorithmCode = algorithmCodes.bubbleSort;
                currentMaxInput = ""; // Não aplicável diretamente, mas limitaremos o tamanho do array no parse
                currentInputValue = "5,2,8,1,7,4";
            } else if (selectedAlgorithm === 'mergeSort') {
                currentAlgorithmName = 'Merge Sort';
                currentAlgorithmCode = algorithmCodes.mergeSort;
                currentMaxInput = "";
                currentInputValue = "5,2,8,1,7,4,3,9";
            } else if (selectedAlgorithm === 'quickSort') {
                currentAlgorithmName = 'Quick Sort';
                currentAlgorithmCode = algorithmCodes.quickSort;
                currentMaxInput = "";
                currentInputValue = "7,2,1,6,8,5,3,4";
            }

            if(codeSectionAlgorithmNameSpan) codeSectionAlgorithmNameSpan.textContent = currentAlgorithmName;
            if(typeof displayCode === "function") displayCode(currentAlgorithmCode, -1, true);
            
            if(algorithmInput) {
                // algorithmInput.max = currentMaxInput; // Atributo max não é para text input
                algorithmInput.value = currentInputValue; // Atualiza valor de exemplo
            }
            if(inputHint) inputHint.textContent = currentInputHint;
             // Atualizar o label do input se desejar, ex:
            if(algorithmInputLabel) {
                if (selectedAlgorithm.includes("Sort")) {
                    algorithmInputLabel.textContent = "Array (números separados por vírgula):";
                } else {
                    algorithmInputLabel.textContent = "Número (para Fatorial/Fibonacci):";
                }
            }
        });
        // Dispara o evento change para carregar o default (Fatorial)
        algorithmSelect.dispatchEvent(new Event('change'));
    }


    if (visualizeBtn) {
        visualizeBtn.addEventListener('click', () => {
            if(stepsLog) stepsLog.innerHTML = '';
            if(callStackList) callStackList.innerHTML = '';
            if(finalResult) finalResult.textContent = '---';

            callIdCounter = 0;
            activeCallStackFrames = [];

            const selectedAlgorithm = algorithmSelect ? algorithmSelect.value : 'factorial';

            if (!algorithmInput) { // Alterado de algorithmInputNumber
                console.error("Elemento 'algorithm-input' não encontrado!");
                return;
            }
            
            let numberValue;
            let arrayValue;
            const maxArrayLength = 15; // Limite para visualização de arrays

            if (selectedAlgorithm.includes("Sort")) {
                arrayValue = algorithmInput.value.split(',')
                                .map(s => s.trim()) // Remove espaços
                                .filter(s => s !== "") // Remove strings vazias
                                .map(s => parseInt(s, 10)); // Converte para número

                if (arrayValue.some(isNaN)) {
                    if(typeof addStepLog === "function") addStepLog("Input do array contém valores não numéricos. Use números separados por vírgula.", "error");
                    return;
                }
                if (arrayValue.length === 0 && selectedAlgorithm.includes("Sort")) {
                     if(typeof addStepLog === "function") addStepLog("Por favor, insira um array de números.", "error");
                    return;
                }
                if (arrayValue.length > maxArrayLength) {
                    if(typeof addStepLog === "function") addStepLog(`Para visualização, o array não deve exceder ${maxArrayLength} elementos.`, "error");
                    return;
                }
                finalResult.textContent = `Array original: [${arrayValue.join(', ')}]`; // Mostra array original
            } else {
                numberValue = parseInt(algorithmInput.value);
                const maxInput = selectedAlgorithm === 'fibonacci' ? 20 : 20; // Ajuste conforme o algoritmo
                if (isNaN(numberValue) || numberValue < 0 || numberValue > maxInput) {
                    if(typeof addStepLog === "function") addStepLog(`Por favor, insira um número entre 0 e ${maxInput}.`, "error");
                    return;
                }
            }


            // Atualiza nome e código sendo exibido
            if(codeSectionAlgorithmNameSpan) codeSectionAlgorithmNameSpan.textContent = algorithmSelect.options[algorithmSelect.selectedIndex].text;
            if(typeof displayCode === "function" && typeof algorithmCodes[selectedAlgorithm] !== "undefined") {
                 displayCode(algorithmCodes[selectedAlgorithm], -1, true);
            }


            // Chama a função de visualização correta
            switch (selectedAlgorithm) {
                case 'factorial':
                    if(typeof visualizeFactorial === "function") visualizeFactorial(numberValue);
                    break;
                case 'fibonacci':
                    if(typeof visualizeFibonacci === "function") visualizeFibonacci(numberValue);
                    break;
                case 'bubbleSort':
                    if(typeof visualizeBubbleSort === "function") visualizeBubbleSort([...arrayValue]); // Passa uma cópia
                    break;
                case 'mergeSort':
                    if(typeof visualizeMergeSort === "function") visualizeMergeSort([...arrayValue]); // Passa uma cópia
                    break;
                case 'quickSort':
                    if(typeof visualizeQuickSort === "function") visualizeQuickSort([...arrayValue]); // Passa uma cópia
                    break;
                default:
                    console.error("Algoritmo selecionado não reconhecido:", selectedAlgorithm);
            }
        });
    }

    function displayCode(codeString, highlightLineNumber = -1, isInitialSetup = false) {
        const lines = codeString.split('\n');
        let pageFullCodeLineNumbersHTML = '';
        let pageFullCodeHTML = '';

        lines.forEach((line, index) => {
            const currentLineNumber = index + 1;
            pageFullCodeLineNumbersHTML += `${currentLineNumber}<br>`;
            let styledLine = typeof tokenizeLine === "function" ? tokenizeLine(line) : line;

            if (currentLineNumber === highlightLineNumber) {
                pageFullCodeHTML += `<span class="highlight-line">${styledLine}</span>\n`;
            } else {
                pageFullCodeHTML += `${styledLine}\n`;
            }
        });

        if (pageLineNumbersDiv) pageLineNumbersDiv.innerHTML = pageFullCodeLineNumbersHTML;
        if (pageCodeDisplayPre) pageCodeDisplayPre.innerHTML = pageFullCodeHTML;
    }

    function tokenizeLine(line) {
        line = line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        line = line.replace(/\b(function|if|else|return|const|let|var)\b/g, '<span class="token keyword">$1</span>');
        line = line.replace(/(\/\/.*)/g, '<span class="token comment">$1</span>');
        line = line.replace(/\b(\d+)\b/g, '<span class="token number">$1</span>');
        line = line.replace(/(\b\w+)\s*(?=\()/g, '<span class="token function-name">$1</span>');
        line = line.replace(/([{}();=*-+])/g, '<span class="token punctuation">$1</span>');
        return line;
    }

    function addStepLog(message, type = 'info', callDepth = 0) {
        if (!stepsLog) return;
        let iconHTML = '';
        switch (type) {
            case 'info': iconHTML = '<i class="fa-solid fa-circle-info"></i> '; break;
            case 'error': iconHTML = '<i class="fa-solid fa-circle-exclamation"></i> '; break;
            case 'call': iconHTML = '<i class="fa-solid fa-angles-right"></i> '; break;
            case 'base-case': iconHTML = '<i class="fa-solid fa-flag-checkered"></i> '; break;
            case 'recursive-step': iconHTML = '<i class="fa-solid fa-gears"></i> '; break;
            case 'return': iconHTML = '<i class="fa-solid fa-angles-left"></i> '; break;
            case 'calculation': iconHTML = '<i class="fa-solid fa-calculator"></i> '; break;
            case 'check': iconHTML = '<i class="fa-solid fa-magnifying-glass"></i> '; break;
            case 'final': iconHTML = '<i class="fa-solid fa-trophy"></i> '; break;
            default: iconHTML = '<i class="fa-solid fa-chevron-right"></i> '; break;
        }
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.style.marginLeft = `${callDepth * 15}px`;
        entry.innerHTML = iconHTML + message;
        stepsLog.appendChild(entry);
        stepsLog.scrollTop = stepsLog.scrollHeight;
    }

    function updateCallStack(action, functionCall, callId) {
        if (!callStackList) return;
        if (action === 'push') {
            const frame = document.createElement('div');
            frame.className = 'call-stack-item entering';
            frame.id = `call-${callId}`;
            const [funcName, params] = functionCall.split(/[\(\)]/);
            frame.innerHTML = `
                <span class="function-name">${funcName}</span>(<span class="params">${params || ''}</span>)
                <span class="status">Executando...</span>`;
            callStackList.appendChild(frame);
            activeCallStackFrames.push(callId);
            if (typeof updateActiveFrameHighlight === "function") updateActiveFrameHighlight();
            void frame.offsetWidth;
        } else if (action === 'pop') {
            const frame = document.getElementById(`call-${callId}`);
            if (frame) {
                frame.classList.remove('entering', 'active');
                frame.classList.add('returning');
                const statusSpan = frame.querySelector('.status');
                if (statusSpan) statusSpan.textContent = 'Retornando...';
                activeCallStackFrames = activeCallStackFrames.filter(id => id !== callId);
                if (typeof updateActiveFrameHighlight === "function") updateActiveFrameHighlight();
                frame.addEventListener('animationend', function handleAnimationEnd() {
                    if (frame.classList.contains('returning')) { /* Mantém histórico */ }
                    frame.removeEventListener('animationend', handleAnimationEnd);
                });
            }
        }
    }

    function updateActiveFrameHighlight() {
        if (!callStackList) return;
        Array.from(callStackList.children).forEach(child => child.classList.remove('active'));
        if (activeCallStackFrames.length > 0) {
            const activeFrameId = activeCallStackFrames[activeCallStackFrames.length - 1];
            const activeFrameElement = document.getElementById(`call-${activeFrameId}`);
            if (activeFrameElement) {
                activeFrameElement.classList.add('active');
                const statusSpan = activeFrameElement.querySelector('.status');
                if (statusSpan) statusSpan.textContent = 'Ativo';
            }
        }
    }

    async function visualizeFactorial(n) {
        // ... (Função visualizeFactorial como antes, sem alterações internas)
        async function factorialRecursive(num, depth) {
            const currentCallId = ++callIdCounter;
            const functionCallSignature = `fatorial(${num})`;
            if(typeof updateCallStack === "function") updateCallStack('push', functionCallSignature, currentCallId);
            if(typeof addStepLog === "function") addStepLog(`Chamando <strong>${functionCallSignature}</strong>`, 'call', depth);
            if(typeof displayCode === "function") displayCode(algorithmCodes.factorial, 1);
            await new Promise(resolve => setTimeout(resolve, baseDelay));
            if(typeof addStepLog === "function") addStepLog(`Verificando caso base: ${num} === 0 ou ${num} === 1?`, 'check', depth);
            if(typeof displayCode === "function") displayCode(algorithmCodes.factorial, 3);
            await new Promise(resolve => setTimeout(resolve, baseDelay));
            if (num === 0 || num === 1) {
                if(typeof addStepLog === "function") addStepLog(`Caso base atingido para <strong>${functionCallSignature}</strong>. Retornando 1.`, 'base-case', depth);
                if(typeof displayCode === "function") displayCode(algorithmCodes.factorial, 4);
                await new Promise(resolve => setTimeout(resolve, baseDelay * 0.8));
                if(typeof updateCallStack === "function") updateCallStack('pop', functionCallSignature, currentCallId);
                if(typeof addStepLog === "function") addStepLog(`<strong>${functionCallSignature}</strong> retorna 1.`, 'return', depth);
                return 1;
            } else {
                if(typeof addStepLog === "function") addStepLog(`Passo recursivo: ${num} * fatorial(${num - 1})`, 'recursive-step', depth);
                if(typeof displayCode === "function") displayCode(algorithmCodes.factorial, 8);
                await new Promise(resolve => setTimeout(resolve, baseDelay));
                const resultFromPreviousCall = await factorialRecursive(num - 1, depth + 1);
                activeCallStackFrames.push(currentCallId);
                if(typeof updateActiveFrameHighlight === "function") updateActiveFrameHighlight();
                const currentFrame = document.getElementById(`call-${currentCallId}`);
                if(currentFrame) {
                    currentFrame.classList.remove('returning');
                    const statusSpan = currentFrame.querySelector('.status');
                    if(statusSpan) statusSpan.textContent = 'Continuando cálculo...';
                }
                if(typeof addStepLog === "function") addStepLog(`Recebido ${resultFromPreviousCall} de fatorial(${num - 1}). Calculando ${num} * ${resultFromPreviousCall}...`, 'calculation', depth);
                if(typeof displayCode === "function") displayCode(algorithmCodes.factorial, 8);
                await new Promise(resolve => setTimeout(resolve, baseDelay));
                const result = num * resultFromPreviousCall;
                if(typeof addStepLog === "function") addStepLog(`Cálculo para <strong>${functionCallSignature}</strong>: ${num} * ${resultFromPreviousCall} = ${result}. Retornando ${result}.`, 'calculation', depth);
                await new Promise(resolve => setTimeout(resolve, baseDelay * 0.8));
                if(typeof updateCallStack === "function") updateCallStack('pop', functionCallSignature, currentCallId);
                if(typeof addStepLog === "function") addStepLog(`<strong>${functionCallSignature}</strong> retorna ${result}.`, 'return', depth);
                return result;
            }
        }
        try {
            if(visualizeBtn) visualizeBtn.disabled = true;
            if(typeof addStepLog === "function") addStepLog(`Iniciando cálculo de fatorial(${n})...`, 'info');
            if(typeof displayCode === "function") displayCode(algorithmCodes.factorial, -1, true);
            const result = await factorialRecursive(n, 0);
            if(finalResult) finalResult.textContent = result;
            if(typeof addStepLog === "function") addStepLog(`Resultado Final: fatorial(${n}) = ${result}`, 'final');
            if(typeof displayCode === "function") displayCode(algorithmCodes.factorial, -1);
        } catch (e) {
            console.error(e);
            if(typeof addStepLog === "function") addStepLog(`Erro: ${e.message}`, 'error');
            if(finalResult) finalResult.textContent = "Erro na execução.";
        } finally {
            if(visualizeBtn) visualizeBtn.disabled = false;
        }
    }

    // NOVA FUNÇÃO: visualizeFibonacci
    async function visualizeFibonacci(n) {
        async function fibonacciRecursive(num, depth) {
            const currentCallId = ++callIdCounter;
            const functionCallSignature = `fibonacci(${num})`;

            if(typeof updateCallStack === "function") updateCallStack('push', functionCallSignature, currentCallId);
            if(typeof addStepLog === "function") addStepLog(`Chamando <strong>${functionCallSignature}</strong>`, 'call', depth);
            if(typeof displayCode === "function") displayCode(algorithmCodes.fibonacci, 1); // Linha da função
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            // Caso base: n <= 0
            if(typeof addStepLog === "function") addStepLog(`Verificando caso base: ${num} <= 0?`, 'check', depth);
            if(typeof displayCode === "function") displayCode(algorithmCodes.fibonacci, 3); // Linha: if (n <= 0)
            await new Promise(resolve => setTimeout(resolve, baseDelay));
            if (num <= 0) {
                if(typeof addStepLog === "function") addStepLog(`Caso base atingido para <strong>${functionCallSignature}</strong>. Retornando 0.`, 'base-case', depth);
                if(typeof displayCode === "function") displayCode(algorithmCodes.fibonacci, 4); // Linha: return 0;
                await new Promise(resolve => setTimeout(resolve, baseDelay * 0.8));
                if(typeof updateCallStack === "function") updateCallStack('pop', functionCallSignature, currentCallId);
                if(typeof addStepLog === "function") addStepLog(`<strong>${functionCallSignature}</strong> retorna 0.`, 'return', depth);
                return 0;
            }

            // Caso base: n === 1
            if(typeof addStepLog === "function") addStepLog(`Verificando caso base: ${num} === 1?`, 'check', depth);
            if(typeof displayCode === "function") displayCode(algorithmCodes.fibonacci, 6); // Linha: if (n === 1)
            await new Promise(resolve => setTimeout(resolve, baseDelay));
            if (num === 1) {
                if(typeof addStepLog === "function") addStepLog(`Caso base atingido para <strong>${functionCallSignature}</strong>. Retornando 1.`, 'base-case', depth);
                if(typeof displayCode === "function") displayCode(algorithmCodes.fibonacci, 7); // Linha: return 1;
                await new Promise(resolve => setTimeout(resolve, baseDelay * 0.8));
                if(typeof updateCallStack === "function") updateCallStack('pop', functionCallSignature, currentCallId);
                if(typeof addStepLog === "function") addStepLog(`<strong>${functionCallSignature}</strong> retorna 1.`, 'return', depth);
                return 1;
            }
            
            // Passo Recursivo
            if(typeof addStepLog === "function") addStepLog(`Passo recursivo: fibonacci(${num - 1}) + fibonacci(${num - 2})`, 'recursive-step', depth);
            if(typeof displayCode === "function") displayCode(algorithmCodes.fibonacci, 11); // Linha: return fibonacci(n-1) + fibonacci(n-2)
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            if(typeof addStepLog === "function") addStepLog(`Chamando primeiro termo: fibonacci(${num - 1})`, 'info', depth + 1);
            const result1 = await fibonacciRecursive(num - 1, depth + 1);

            // Re-ativa o frame atual na pilha para mostrar que voltou para ele
            activeCallStackFrames.push(currentCallId);
            if(typeof updateActiveFrameHighlight === "function") updateActiveFrameHighlight();
            const currentFrame = document.getElementById(`call-${currentCallId}`);
            if(currentFrame) {
                currentFrame.classList.remove('returning'); // Caso tenha sido marcado como returning por engano
                const statusSpan = currentFrame.querySelector('.status');
                if(statusSpan) statusSpan.textContent = `Calculando fibonacci(${num})... (res1=${result1})`;
            }
            if(typeof displayCode === "function") displayCode(algorithmCodes.fibonacci, 11); // Mantém o foco na linha do return
            if(typeof addStepLog === "function") addStepLog(`Recebido ${result1} de fibonacci(${num-1}). Chamando segundo termo: fibonacci(${num - 2})`, 'info', depth + 1);
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            const result2 = await fibonacciRecursive(num - 2, depth + 1);
            
            // Re-ativa o frame atual novamente
            activeCallStackFrames.push(currentCallId);
            if(typeof updateActiveFrameHighlight === "function") updateActiveFrameHighlight();
             if(currentFrame) { // Re-seleciona o frame
                const statusSpan = currentFrame.querySelector('.status');
                if(statusSpan) statusSpan.textContent = `Calculando fibonacci(${num})... (res1=${result1}, res2=${result2})`;
            }
            if(typeof displayCode === "function") displayCode(algorithmCodes.fibonacci, 11); // Mantém o foco

            const finalResultValue = result1 + result2;
            if(typeof addStepLog === "function") addStepLog(`Cálculo para <strong>${functionCallSignature}</strong>: ${result1} + ${result2} = ${finalResultValue}. Retornando ${finalResultValue}.`, 'calculation', depth);
            await new Promise(resolve => setTimeout(resolve, baseDelay * 0.8));

            if(typeof updateCallStack === "function") updateCallStack('pop', functionCallSignature, currentCallId);
            if(typeof addStepLog === "function") addStepLog(`<strong>${functionCallSignature}</strong> retorna ${finalResultValue}.`, 'return', depth);
            return finalResultValue;
        }

        try {
            if(visualizeBtn) visualizeBtn.disabled = true;
            if(typeof addStepLog === "function") addStepLog(`Iniciando cálculo de fibonacci(${n})...`, 'info');
            if(typeof displayCode === "function") displayCode(algorithmCodes.fibonacci, -1, true);
            const result = await fibonacciRecursive(n, 0);
            if(finalResult) finalResult.textContent = result;
            if(typeof addStepLog === "function") addStepLog(`Resultado Final: fibonacci(${n}) = ${result}`, 'final');
            if(typeof displayCode === "function") displayCode(algorithmCodes.fibonacci, -1);
        } catch (e) {
            console.error(e);
            if(typeof addStepLog === "function") addStepLog(`Erro: ${e.message}`, 'error');
            if(finalResult) finalResult.textContent = "Erro na execução.";
        } finally {
            if(visualizeBtn) visualizeBtn.disabled = false;
        }
    }
    

    // ... (mantenha displayCode, tokenizeLine, addStepLog, updateCallStack, updateActiveFrameHighlight, visualizeFactorial, visualizeFibonacci) ...

    // --- NOVAS FUNÇÕES DE VISUALIZAÇÃO PARA ORDENAÇÃO ---

    async function visualizeBubbleSort(arr) {
        const originalArray = [...arr]; // Para exibir no final se necessário

        async function bubbleSortRecursiveVisual(currentArr, n, depth) {
            const currentCallId = ++callIdCounter;
            const functionCallSignature = `bubbleSort([${currentArr.slice(0,n).join(', ')}], ${n})`;

            updateCallStack('push', functionCallSignature, currentCallId);
            addStepLog(`Chamando <strong>${functionCallSignature}</strong>. Array atual (porção relevante): [${currentArr.slice(0,n).join(', ')}]`, 'call', depth);
            displayCode(algorithmCodes.bubbleSort, 1); // Linha da função
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            if (n <= 1) {
                addStepLog(`Caso base: n (${n}) <= 1. Porção considerada ordenada.`, 'base-case', depth);
                displayCode(algorithmCodes.bubbleSort, 4); // Linha do if (n <= 1)
                await new Promise(resolve => setTimeout(resolve, baseDelay));
                updateCallStack('pop', functionCallSignature, currentCallId);
                addStepLog(`<strong>${functionCallSignature}</strong> retorna. Array: [${currentArr.join(', ')}]`, 'return', depth);
                return currentArr; // Retorna o array (embora modificado no local)
            }

            addStepLog(`Passagem para n = ${n}. Array: [${currentArr.join(', ')}]`, 'info', depth);
            displayCode(algorithmCodes.bubbleSort, 9); // Linha do for
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            let swappedInThisPass = false;
            for (let i = 0; i < n - 1; i++) {
                addStepLog(`Comparando arr[${i}] (${currentArr[i]}) e arr[${i+1}] (${currentArr[i+1]})`, 'check', depth + 1);
                displayCode(algorithmCodes.bubbleSort, 10); // Linha do if (arr[i] > arr[i+1])
                await new Promise(resolve => setTimeout(resolve, baseDelay * 0.8));

                if (currentArr[i] > currentArr[i + 1]) {
                    swappedInThisPass = true;
                    addStepLog(`Trocar ${currentArr[i]} e ${currentArr[i+1]}`, 'calculation', depth + 1);
                    displayCode(algorithmCodes.bubbleSort, 12); // Linha da troca
                    
                    let temp = currentArr[i];
                    currentArr[i] = currentArr[i + 1];
                    currentArr[i + 1] = temp;
                    
                    addStepLog(`Array após troca: [${currentArr.join(', ')}]`, 'info', depth + 1);
                    await new Promise(resolve => setTimeout(resolve, baseDelay));
                }
            }
             if (!swappedInThisPass && n > 1) { // Otimização: se não houve trocas, o array (ou porção) já está ordenado
                addStepLog(`Nenhuma troca nesta passagem para n = ${n}. A porção já está ordenada.`, 'base-case', depth);
                // Não há uma linha específica para isso no código fornecido, mas é uma otimização comum.
                // Poderíamos destacar a linha do loop ou a próxima chamada recursiva.
                await new Promise(resolve => setTimeout(resolve, baseDelay));
             }


            addStepLog(`Maior elemento da porção atual (arr[${n-1}] = ${currentArr[n-1]}) está no lugar. Chamada recursiva para n = ${n-1}.`, 'recursive-step', depth);
            displayCode(algorithmCodes.bubbleSort, 20); // Linha da chamada recursiva
            await new Promise(resolve => setTimeout(resolve, baseDelay));
            
            const sortedSubArray = await bubbleSortRecursiveVisual(currentArr, n - 1, depth + 1);
            
            // Re-ativa o frame atual na pilha
            activeCallStackFrames.push(currentCallId);
            updateActiveFrameHighlight();
             const currentFrame = document.getElementById(`call-${currentCallId}`);
            if(currentFrame) {
                const statusSpan = currentFrame.querySelector('.status');
                if(statusSpan) statusSpan.textContent = `Retornando de bubbleSort(..., ${n-1})`;
            }
            
            updateCallStack('pop', functionCallSignature, currentCallId);
            addStepLog(`<strong>${functionCallSignature}</strong> retorna. Array final da chamada: [${sortedSubArray.join(', ')}]`, 'return', depth);
            return sortedSubArray; // Retorna o array modificado
        }

        try {
            if(visualizeBtn) visualizeBtn.disabled = true;
            addStepLog(`Iniciando Bubble Sort (Recursivo) para: [${arr.join(', ')}]`, 'info');
            displayCode(algorithmCodes.bubbleSort, -1, true); // Mostra código completo
            
            const sortedArray = await bubbleSortRecursiveVisual(arr, arr.length, 0); // Passa o array e seu tamanho inicial
            
            if(finalResult) finalResult.textContent = `Array Ordenado: [${sortedArray.join(', ')}]`;
            addStepLog(`Bubble Sort (Recursivo) concluído! Array Final: [${sortedArray.join(', ')}]`, 'final');
            displayCode(algorithmCodes.bubbleSort, -1); // Limpa destaque
        } catch (e) {
            console.error(e);
            addStepLog(`Erro durante o Bubble Sort: ${e.message}`, 'error');
            if(finalResult) finalResult.textContent = "Erro na ordenação.";
        } finally {
            if(visualizeBtn) visualizeBtn.disabled = false;
        }
    }

    async function visualizeMergeSort(arr) {
        const originalArray = [...arr];

        async function mergeVisual(leftArr, rightArr, depth) {
            const currentCallId = ++callIdCounter;
            const functionCallSignature = `merge([${leftArr.join(',')}], [${rightArr.join(',')}])`;
            updateCallStack('push', functionCallSignature, currentCallId);
            addStepLog(`Chamando <strong>${functionCallSignature}</strong>`, 'call', depth);
            displayCode(algorithmCodes.mergeSort, 14); // Linha da função merge
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            let resultArray = [];
            let iEsquerda = 0;
            let iDireita = 0;

            addStepLog(`Iniciando mesclagem. Esquerda: [${leftArr.join(', ')}], Direita: [${rightArr.join(', ')}]`, 'info', depth + 1);
            
            while (iEsquerda < leftArr.length && iDireita < rightArr.length) {
                displayCode(algorithmCodes.mergeSort, 19); // Linha do while
                addStepLog(`Comparando ${leftArr[iEsquerda]} (esquerda) com ${rightArr[iDireita]} (direita)`, 'check', depth + 1);
                 await new Promise(resolve => setTimeout(resolve, baseDelay * 0.8));
                displayCode(algorithmCodes.mergeSort, 20); // Linha do if
                await new Promise(resolve => setTimeout(resolve, baseDelay * 0.8));

                if (leftArr[iEsquerda] < rightArr[iDireita]) {
                    resultArray.push(leftArr[iEsquerda]);
                    addStepLog(`Adicionando ${leftArr[iEsquerda]} (da esquerda) ao resultado. Resultado: [${resultArray.join(', ')}]`, 'calculation', depth + 1);
                    displayCode(algorithmCodes.mergeSort, 21); // Linha do push
                    iEsquerda++;
                } else {
                    resultArray.push(rightArr[iDireita]);
                    addStepLog(`Adicionando ${rightArr[iDireita]} (da direita) ao resultado. Resultado: [${resultArray.join(', ')}]`, 'calculation', depth + 1);
                    displayCode(algorithmCodes.mergeSort, 24); // Linha do push
                    iDireita++;
                }
                await new Promise(resolve => setTimeout(resolve, baseDelay));
            }
            
            displayCode(algorithmCodes.mergeSort, 30); // Linha do concat
            const remainingLeft = leftArr.slice(iEsquerda);
            const remainingRight = rightArr.slice(iDireita);

            if (remainingLeft.length > 0) {
                addStepLog(`Adicionando restantes da esquerda: [${remainingLeft.join(', ')}]`, 'info', depth + 1);
            }
            if (remainingRight.length > 0) {
                addStepLog(`Adicionando restantes da direita: [${remainingRight.join(', ')}]`, 'info', depth + 1);
            }

            resultArray = resultArray.concat(remainingLeft).concat(remainingRight);
            addStepLog(`Merge concluído. Resultado da mesclagem: [${resultArray.join(', ')}]`, 'base-case', depth + 1);
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            updateCallStack('pop', functionCallSignature, currentCallId);
            addStepLog(`<strong>${functionCallSignature}</strong> retorna [${resultArray.join(', ')}]`, 'return', depth);
            return resultArray;
        }

        async function mergeSortRecursiveVisual(currentArr, depth) {
            const currentCallId = ++callIdCounter;
            const functionCallSignature = `mergeSort([${currentArr.join(', ')}])`;
            updateCallStack('push', functionCallSignature, currentCallId);
            addStepLog(`Chamando <strong>${functionCallSignature}</strong>`, 'call', depth);
            displayCode(algorithmCodes.mergeSort, 1);
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            displayCode(algorithmCodes.mergeSort, 2); // Linha do if (arr.length <= 1)
            if (currentArr.length <= 1) {
                addStepLog(`Caso base: tamanho do array (${currentArr.length}) <= 1. Retornando [${currentArr.join(', ')}]`, 'base-case', depth);
                await new Promise(resolve => setTimeout(resolve, baseDelay));
                updateCallStack('pop', functionCallSignature, currentCallId);
                addStepLog(`<strong>${functionCallSignature}</strong> retorna [${currentArr.join(', ')}]`, 'return', depth);
                return currentArr;
            }

            const meio = Math.floor(currentArr.length / 2);
            displayCode(algorithmCodes.mergeSort, 6); // Linha do meio
            addStepLog(`Dividindo array. Meio = ${meio}`, 'info', depth + 1);
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            const esquerda = currentArr.slice(0, meio);
            displayCode(algorithmCodes.mergeSort, 7); // Linha da esquerda
            addStepLog(`Sub-array esquerdo: [${esquerda.join(', ')}]`, 'info', depth + 1);
            await new Promise(resolve => setTimeout(resolve, baseDelay));
            
            const direita = currentArr.slice(meio);
            displayCode(algorithmCodes.mergeSort, 8); // Linha da direita
            addStepLog(`Sub-array direito: [${direita.join(', ')}]`, 'info', depth + 1);
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            displayCode(algorithmCodes.mergeSort, 11); // Linha da chamada recursiva e merge
            addStepLog(`Chamada recursiva para ordenar sub-array esquerdo: [${esquerda.join(', ')}]`, 'recursive-step', depth +1);
            const sortedEsquerda = await mergeSortRecursiveVisual(esquerda, depth + 1);
            
            activeCallStackFrames.push(currentCallId); updateActiveFrameHighlight();
            const currentFrame1 = document.getElementById(`call-${currentCallId}`);
            if(currentFrame1) { currentFrame1.querySelector('.status').textContent = `Esquerda ordenada: [${sortedEsquerda.join(',')}]`;}
            addStepLog(`Esquerda ordenada: [${sortedEsquerda.join(', ')}]. Chamada recursiva para ordenar sub-array direito: [${direita.join(', ')}]`, 'recursive-step', depth + 1);
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            const sortedDireita = await mergeSortRecursiveVisual(direita, depth + 1);

            activeCallStackFrames.push(currentCallId); updateActiveFrameHighlight();
             const currentFrame2 = document.getElementById(`call-${currentCallId}`);
            if(currentFrame2) { currentFrame2.querySelector('.status').textContent = `Direita ordenada: [${sortedDireita.join(',')}]`;}
            addStepLog(`Direita ordenada: [${sortedDireita.join(', ')}]. Mesclando esquerda e direita.`, 'info', depth + 1);
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            const mergedArray = await mergeVisual(sortedEsquerda, sortedDireita, depth + 1);
            
            activeCallStackFrames.push(currentCallId); updateActiveFrameHighlight(); // Garante que o frame atual está ativo
             const currentFrame3 = document.getElementById(`call-${currentCallId}`);
            if(currentFrame3) { currentFrame3.querySelector('.status').textContent = `Mesclado: [${mergedArray.join(',')}]`;}


            updateCallStack('pop', functionCallSignature, currentCallId);
            addStepLog(`<strong>${functionCallSignature}</strong> retorna [${mergedArray.join(', ')}]`, 'return', depth);
            return mergedArray;
        }

        try {
            if(visualizeBtn) visualizeBtn.disabled = true;
            addStepLog(`Iniciando Merge Sort para: [${arr.join(', ')}]`, 'info');
            displayCode(algorithmCodes.mergeSort, -1, true);
            const sortedArray = await mergeSortRecursiveVisual(arr, 0);
            if(finalResult) finalResult.textContent = `Array Ordenado: [${sortedArray.join(', ')}]`;
            addStepLog(`Merge Sort concluído! Array Final: [${sortedArray.join(', ')}]`, 'final');
            displayCode(algorithmCodes.mergeSort, -1);
        } catch (e) {
            console.error(e);
            addStepLog(`Erro durante o Merge Sort: ${e.message}`, 'error');
            if(finalResult) finalResult.textContent = "Erro na ordenação.";
        } finally {
            if(visualizeBtn) visualizeBtn.disabled = false;
        }
    }

    async function visualizeQuickSort(arr) {
        const originalArray = [...arr];

        async function partitionVisual(currentArr, baixo, alto, depth) {
            const currentCallId = ++callIdCounter;
            const functionCallSignature = `particionar([${currentArr.slice(baixo, alto + 1).join(', ')}], ${baixo}, ${alto})`;
            updateCallStack('push', functionCallSignature, currentCallId);
            addStepLog(`Chamando <strong>${functionCallSignature}</strong>. Array atual (porção): [${currentArr.join(', ')}]`, 'call', depth);
            displayCode(algorithmCodes.quickSort, 12); // Linha da função particionar
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            let pivo = currentArr[alto];
            addStepLog(`Pivô escolhido: ${pivo} (arr[${alto}])`, 'info', depth + 1);
            displayCode(algorithmCodes.quickSort, 13);
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            let i = baixo - 1; // Índice do menor elemento
            displayCode(algorithmCodes.quickSort, 14);
            addStepLog(`Índice 'i' (menor elemento) inicializado em: ${i}`, 'info', depth + 1);
             await new Promise(resolve => setTimeout(resolve, baseDelay));


            for (let j = baixo; j < alto; j++) {
                displayCode(algorithmCodes.quickSort, 16); // Linha do for
                addStepLog(`Loop de partição: j = ${j}. Comparando arr[${j}] (${currentArr[j]}) com pivô (${pivo})`, 'check', depth + 1);
                await new Promise(resolve => setTimeout(resolve, baseDelay * 0.8));
                displayCode(algorithmCodes.quickSort, 17); // Linha do if arr[j] < pivo
                
                if (currentArr[j] < pivo) {
                    i++;
                    addStepLog(`arr[${j}] (${currentArr[j]}) < pivô (${pivo}). Incrementando i para ${i}.`, 'info', depth + 1);
                    displayCode(algorithmCodes.quickSort, 18);
                    await new Promise(resolve => setTimeout(resolve, baseDelay * 0.7));

                    if (i !== j) { // Só troca se i e j não forem o mesmo índice (ou se arr[i] !== arr[j])
                        addStepLog(`Trocando arr[${i}] (${currentArr[i]}) com arr[${j}] (${currentArr[j]})`, 'calculation', depth + 1);
                        displayCode(algorithmCodes.quickSort, 20); // Linha da troca
                        
                        let temp = currentArr[i];
                        currentArr[i] = currentArr[j];
                        currentArr[j] = temp;
                        addStepLog(`Array após troca: [${currentArr.join(', ')}]`, 'info', depth + 1);
                        await new Promise(resolve => setTimeout(resolve, baseDelay));
                    } else {
                         addStepLog(`Não é necessário trocar arr[${i}] e arr[${j}] pois i (${i}) == j (${j}) ou são iguais.`, 'info', depth + 1);
                         await new Promise(resolve => setTimeout(resolve, baseDelay * 0.7));
                    }
                }
            }

            addStepLog(`Loop de partição concluído. Trocando pivô (arr[${alto}] = ${currentArr[alto]}) com arr[${i+1}] (${currentArr[i+1]})`, 'calculation', depth + 1);
            displayCode(algorithmCodes.quickSort, 26); // Linha da troca do pivô
            
            let temp = currentArr[i + 1];
            currentArr[i + 1] = currentArr[alto];
            currentArr[alto] = temp;
            addStepLog(`Array após troca do pivô: [${currentArr.join(', ')}]. Pivô na posição ${i+1}.`, 'base-case', depth + 1); // Considera 'base-case' para o fim da partição
            await new Promise(resolve => setTimeout(resolve, baseDelay));
            
            const pivotIndex = i + 1;
            updateCallStack('pop', functionCallSignature, currentCallId);
            addStepLog(`<strong>${functionCallSignature}</strong> retorna índice do pivô: ${pivotIndex}`, 'return', depth);
            return pivotIndex;
        }

        async function quickSortRecursiveVisual(currentArr, baixo, alto, depth) {
            const currentCallId = ++callIdCounter;
            const functionCallSignature = `quickSort([${currentArr.slice(baixo, alto + 1).join(', ')}], ${baixo}, ${alto})`;
            updateCallStack('push', functionCallSignature, currentCallId);
            addStepLog(`Chamando <strong>${functionCallSignature}</strong>. Array atual (porção): [${currentArr.join(', ')}]`, 'call', depth);
            displayCode(algorithmCodes.quickSort, 1);
            await new Promise(resolve => setTimeout(resolve, baseDelay));

            displayCode(algorithmCodes.quickSort, 2); // Linha do if (baixo < alto)
            if (baixo < alto) {
                addStepLog(`Condição baixo (${baixo}) < alto (${alto}) é verdadeira. Particionando...`, 'info', depth + 1);
                await new Promise(resolve => setTimeout(resolve, baseDelay));
                displayCode(algorithmCodes.quickSort, 4); // Linha da chamada particionar
                
                let pi = await partitionVisual(currentArr, baixo, alto, depth + 1);

                activeCallStackFrames.push(currentCallId); updateActiveFrameHighlight();
                const currentFrame1 = document.getElementById(`call-${currentCallId}`);
                if(currentFrame1) { currentFrame1.querySelector('.status').textContent = `Pivô em ${pi}. Ordenando esquerda.`;}

                addStepLog(`Pivô posicionado em ${pi}. Chamada recursiva para quickSort(arr, ${baixo}, ${pi - 1})`, 'recursive-step', depth + 1);
                displayCode(algorithmCodes.quickSort, 6); // Linha da primeira chamada quickSort
                await quickSortRecursiveVisual(currentArr, baixo, pi - 1, depth + 1);

                activeCallStackFrames.push(currentCallId); updateActiveFrameHighlight();
                const currentFrame2 = document.getElementById(`call-${currentCallId}`);
                if(currentFrame2) { currentFrame2.querySelector('.status').textContent = `Esquerda ordenada. Ordenando direita.`;}

                addStepLog(`Chamada recursiva para quickSort(arr, ${pi + 1}, ${alto})`, 'recursive-step', depth + 1);
                displayCode(algorithmCodes.quickSort, 7); // Linha da segunda chamada quickSort
                await quickSortRecursiveVisual(currentArr, pi + 1, alto, depth + 1);
                
                activeCallStackFrames.push(currentCallId); updateActiveFrameHighlight();
                const currentFrame3 = document.getElementById(`call-${currentCallId}`);
                if(currentFrame3) { currentFrame3.querySelector('.status').textContent = `Direita ordenada. Porção concluída.`;}

            } else {
                 addStepLog(`Caso base: baixo (${baixo}) não é menor que alto (${alto}). Porção ordenada.`, 'base-case', depth);
                 await new Promise(resolve => setTimeout(resolve, baseDelay));
            }
            
            updateCallStack('pop', functionCallSignature, currentCallId);
            addStepLog(`<strong>${functionCallSignature}</strong> retorna. Array: [${currentArr.join(', ')}]`, 'return', depth);
            return currentArr; // quickSort geralmente modifica in-place, mas retornamos para consistência
        }

        try {
            if(visualizeBtn) visualizeBtn.disabled = true;
            addStepLog(`Iniciando Quick Sort para: [${arr.join(', ')}]`, 'info');
            displayCode(algorithmCodes.quickSort, -1, true);
            
            const sortedArray = await quickSortRecursiveVisual(arr, 0, arr.length - 1, 0);
            
            if(finalResult) finalResult.textContent = `Array Ordenado: [${sortedArray.join(', ')}]`;
            addStepLog(`Quick Sort concluído! Array Final: [${sortedArray.join(', ')}]`, 'final');
            displayCode(algorithmCodes.quickSort, -1);
        } catch (e) {
            console.error(e);
            addStepLog(`Erro durante o Quick Sort: ${e.message}`, 'error');
            if(finalResult) finalResult.textContent = "Erro na ordenação.";
        } finally {
            if(visualizeBtn) visualizeBtn.disabled = false;
        }
    }


    // Inicialização para o algoritmo padrão (Fatorial)
    if(algorithmSelect && typeof displayCode === "function" && typeof algorithmCodes !== "undefined") {
         const initialAlgorithm = algorithmSelect.value;
         if (algorithmCodes[initialAlgorithm]) {
            displayCode(algorithmCodes[initialAlgorithm], -1, true);
            if(codeSectionAlgorithmNameSpan) codeSectionAlgorithmNameSpan.textContent = algorithmSelect.options[algorithmSelect.selectedIndex].text;
            // Atualiza o label do input inicial
            if(algorithmInputLabel) {
                if (initialAlgorithm.includes("Sort")) {
                    algorithmInputLabel.textContent = "Array (números separados por vírgula):";
                } else {
                    algorithmInputLabel.textContent = "Número (para Fatorial/Fibonacci):";
                }
            }
            // Define o valor de exemplo inicial
            if (algorithmInput) {
                if (initialAlgorithm === 'factorial' || initialAlgorithm === 'fibonacci') {
                    algorithmInput.value = "5";
                } else {
                    algorithmInput.value = "5,2,8,1,7,4";
                }
            }


         }
    }

    // Exibe o código inicial (Fatorial por padrão)
    if(typeof displayCode === "function" && typeof algorithmCodes !== "undefined") {
         displayCode(algorithmCodes.factorial, -1, true);
         if(codeSectionAlgorithmNameSpan) codeSectionAlgorithmNameSpan.textContent = 'Fatorial';
    }
});