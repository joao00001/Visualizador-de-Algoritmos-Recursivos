#Visualizador de Algoritmos Recursivos 

Este projeto é um site interativo focado em demonstrar visualmente como funcionam algoritmos de recursão e algoritmos de ordenação. O objetivo é auxiliar no aprendizado e na compreensão desses conceitos fundamentais da ciência da computação através de animações textuais do fluxo de execução, da pilha de chamadas e das transformações de dados.

##Funcionalidades

* **Visualização Passo a Passo:** Acompanhe cada etapa da execução do algoritmo.
* **Pilha de Chamadas (Call Stack) Dinâmica:** Observe como as funções são empilhadas e desempilhadas durante a recursão.
* **Exibição de Código:** O código fonte do algoritmo selecionado é exibido, com a linha relevante sendo destacada (de forma simplificada) durante a execução.
* **Seleção de Algoritmos:** Permite escolher entre diferentes algoritmos para visualização.
* **Entrada de Dados Configurável:**
    * Para algoritmos como Fatorial e Fibonacci: entrada de um número.
    * Para algoritmos de ordenação: entrada de uma lista de números separados por vírgula.
* **Design Moderno e Responsivo:** Interface inspirada no design "Swish", com foco na clareza e usabilidade.
* **Ícones:** Utiliza Font Awesome para ícones informativos nos logs.

##Tecnologias Utilizadas

* **HTML5:** Para a estrutura semântica do site.
* **CSS3:** Para estilização, layout (Flexbox, Grid) e animações, seguindo uma paleta de cores e design inspirados no tema "Swish".
* **JavaScript (Vanilla):** Para toda a lógica de visualização, manipulação do DOM, controle dos algoritmos e interatividade.
* **Google Fonts:** Para as fontes 'Poppins', 'Roboto' e 'Fira Code'.
* **Font Awesome:** Para a biblioteca de ícones.

##Como Executar e Usar

1.  **Clone ou baixe este repositório:**
    ```bash
    # Se estiver usando Git
    git clone https://SEU_REPOSITORIO_AQUI.git
    cd nome-do-diretorio-do-projeto
    ```
    Ou simplesmente baixe os arquivos (`site.html`, `site.css`, `site.js`).

2.  **Abra o arquivo `site.html`:**
    Navegue até o diretório onde você salvou os arquivos e abra o `site.html` em qualquer navegador web moderno (Chrome, Firefox, Edge, Safari).

3.  **Utilizando o Visualizador:**
    * **Escolha um Algoritmo:** Selecione o algoritmo que deseja visualizar no menu dropdown (ex: Fatorial, Fibonacci, Merge Sort).
    * **Insira os Dados:**
        * Para Fatorial/Fibonacci, digite um número no campo de entrada.
        * Para algoritmos de Ordenação, digite uma lista de números separados por vírgula (ex: `7,2,1,6,8,5`).
    * **Visualize:** Clique no botão "Visualizar Execução".
    * **Acompanhe:**
        * A seção "Passo a Passo da Execução" mostrará cada ação do algoritmo.
        * A "Pilha de Chamadas" mostrará as funções entrando e saindo.
        * A seção "Código Completo do Algoritmo" destacará (de forma simples) as linhas relevantes.
        * O "Resultado Final" será exibido ao término da execução.

##Algoritmos Implementados

Atualmente, o visualizador suporta os seguintes algoritmos:

* **Recursão Clássica:**
    * Fatorial
    * Fibonacci
* **Algoritmos de Ordenação (Sorting):**
    * Bubble Sort (versão recursiva)
    * Merge Sort
    * Quick Sort

##Estrutura do Código

* **`site.html`**: Contém a estrutura principal da página, incluindo os elementos de interface para seleção de algoritmos, entrada de dados, e as áreas de visualização.
* **`site.css`**: Responsável por toda a estilização visual do site, incluindo o design "Swish", responsividade básica, e animações de UI.
* **`site.js`**: Contém toda a lógica do visualizador:
    * Manipulação do DOM para atualizar a interface.
    * Implementação das funções dos algoritmos (Fatorial, Fibonacci, etc.).
    * Funções de visualização (`visualizeFactorial`, `visualizeFibonacci`, `visualizeMergeSort`, etc.) que controlam a execução passo a passo, atualizam os logs, a pilha de chamadas e o destaque do código.
    * Funções auxiliares como `addStepLog`, `updateCallStack`, `displayCode`, `tokenizeLine`.

##Possíveis Melhorias Futuras

* Adicionar mais algoritmos recursivos (ex: Torre de Hanói, Busca Binária recursiva).
* Adicionar mais algoritmos de ordenação.
* Implementar visualização gráfica para os algoritmos de ordenação (ex: barras representando os elementos do array).
* Controles de animação mais refinados (pausa, próximo passo manual, velocidade da animação).
* Permitir que o usuário insira seu próprio código recursivo simples para visualização (modo sandbox).
* Melhorar o destaque de sintaxe e a navegação no código.
* Internacionalização (suporte a outros idiomas).

---

Sinta-se à vontade para contribuir, reportar issues ou sugerir melhorias!
