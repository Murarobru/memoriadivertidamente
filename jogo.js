
document.addEventListener('DOMContentLoaded', function () {
    // Elementos da interface
    const telaInicio = document.getElementById('tela-inicio');
    const telaJogo = document.getElementById('tela-jogo');
    const telaInstrucoes = document.getElementById('tela-instrucoes');
    const btnInicio = document.getElementById('btn-inicio');
    const btnJogo = document.getElementById('btn-jogo');
    const btnInstrucoes = document.getElementById('btn-instrucoes');
    const btnNivelFacil = document.getElementById('nivel-facil');
    const btnNivelMedio = document.getElementById('nivel-medio');
    const btnNivelDificil = document.getElementById('nivel-dificil');
    const btnVoltar = document.getElementById('btn-voltar');
    const tabuleiro = document.getElementById('tabuleiro');
    const nivelAtual = document.getElementById('nivel-atual');
    const tempoEl = document.getElementById('tempo');
    const paresEncontradosEl = document.getElementById('pares-encontrados');
    const totalParesEl = document.getElementById('total-pares');
    const modalVitoria = document.getElementById('modal-vitoria');
    const tempoFinal = document.getElementById('tempo-final');
    const btnJogarNovamente = document.getElementById('btn-jogar-novamente');
    const btnMudarNivel = document.getElementById('btn-mudar-nivel');

    // Variáveis do jogo
    let cardSizeClass = ''; // Declare cardSizeClass aqui
    let nivel = 'facil';
    let totalPares = 6;
    let paresEncontrados = 0;
    let cartasViradas = [];
    let bloqueado = false;
    let tempoInicio;
    let cronometro;
    let emJogo = false;

    const emocoes = [
        { nome: 'Alegria', cor: '#FFCC33', imagem: 'alegria.jpg' },
        { nome: 'Alegria e Tristeza', cor: '#33CCCC', imagem: 'aletri.jpg' },
        { nome: 'Ansiedade', cor: '#FF99CC', imagem: 'ansiedade.jpg' },
        { nome: 'Ansiedade e Medo', cor: '#66FF99', imagem: 'ansime.jpg' },
        { nome: 'Inveja', cor: '#CCCCCC', imagem: 'inveja.jpg' },
        { nome: 'Medo', cor: '#9966CC', imagem: 'medo.jpg' },
        { nome: 'Nojinho', cor: '#66CC66', imagem: 'nojinho.jpg' },
        { nome: 'Nostalgia', cor: '#884422', imagem: 'nostalgia.jpg' },
        { nome: 'Railey', cor: '#FFCC33', imagem: 'railey.jpg' },
        { nome: 'Raiva Medo e Nojo', cor: '#9933FF', imagem: 'raimenoji.jpg' },
        { nome: 'Raiva', cor: '#DD3333', imagem: 'raiva.jpg' },
        { nome: 'Tédio', cor: '#AAAAAA', imagem: 'tedio.jpg' },
        { nome: 'Todos', cor: '#FF7733', imagem: 'todos.jpg' },
        { nome: 'Tristeza', cor: '#5555FF', imagem: 'teste.png' },
        { nome: 'Vergonha', cor: '#3399FF', imagem: 'vergonha.jpg' }
    ];





    // Funções de navegação
    function mostrarTela(tela) {
        telaInicio.classList.add('hidden');
        telaJogo.classList.add('hidden');
        telaInstrucoes.classList.add('hidden');

        btnInicio.classList.remove('bg-indigo-600');
        btnInicio.classList.add('bg-indigo-500');
        btnJogo.classList.remove('bg-indigo-600');
        btnJogo.classList.add('bg-indigo-500');
        btnInstrucoes.classList.remove('bg-indigo-600');
        btnInstrucoes.classList.add('bg-indigo-500');

        if (tela === 'inicio') {
            telaInicio.classList.remove('hidden');
            btnInicio.classList.remove('bg-indigo-500');
            btnInicio.classList.add('bg-indigo-600');
        } else if (tela === 'jogo') {
            telaJogo.classList.remove('hidden');
            btnJogo.classList.remove('bg-indigo-500');
            btnJogo.classList.add('bg-indigo-600');
        } else if (tela === 'instrucoes') {
            telaInstrucoes.classList.remove('hidden');
            btnInstrucoes.classList.remove('bg-indigo-500');
            btnInstrucoes.classList.add('bg-indigo-600');
        }
    }

    // Iniciar jogo com nível selecionado
    function iniciarJogo(nivelSelecionado) {
        nivel = nivelSelecionado;

        if (nivel === 'facil') {
            totalPares = 6;
            nivelAtual.textContent = 'Fácil';
            tabuleiro.className = 'grid grid-cols-3 md:grid-cols-4 gap-4 mb-4';
            cardSizeClass = 'card-size-facil';
        } else if (nivel === 'medio') {
            totalPares = 10;
            nivelAtual.textContent = 'Médio';
            tabuleiro.className = 'grid grid-cols-4 md:grid-cols-5 gap-4 mb-4';
            cardSizeClass = 'card-size-medio';
        } else if (nivel === 'dificil') {
            totalPares = 15;
            nivelAtual.textContent = 'Difícil';
            tabuleiro.className = 'grid grid-cols-4 md:grid-cols-5 gap-3 mb-4';
            cardSizeClass = 'card-size-dificil';
        }

        totalParesEl.textContent = totalPares;
        paresEncontrados = 0;
        paresEncontradosEl.textContent = '0';

        // Limpar tabuleiro
        tabuleiro.innerHTML = '';

        // Criar cartas de acordo com o nível
        criarCartas();

        iniciarCronometro();
        mostrarTela('jogo');
        emJogo = true;
    }

    // Criar cartas (fora de iniciarJogo!)
    function criarCartas() {
        let emocoesJogo;

        if (nivel === 'facil') {
            emocoesJogo = emocoes.slice(0, 6);   // 6 pares
        } else if (nivel === 'medio') {
            emocoesJogo = emocoes.slice(0, 10);  // 10 pares
        } else if (nivel === 'dificil') {
            emocoesJogo = emocoes.slice(0, 15);  // 15 pares
        }

        let cartas = [];
        emocoesJogo.forEach(emocao => {
            cartas.push(emocao);
            cartas.push({ ...emocao }); // duplicar para formar pares
        });

        cartas = embaralhar(cartas);

        // Criar elementos HTML
        cartas.forEach((carta, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = `card aspect-square ${cardSizeClass}`;
            cardElement.dataset.index = index;

            cardElement.innerHTML = `
            <div class="card-inner w-full h-full">
                <div class="card-front flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-12 h-12 text-white">
                        <path fill="currentColor" d="M9.5 14.25h5c.38 0 .693-.282.743-.648L16 9.5A3.5 3.5 0 0 0 12.5 6h-1A3.5 3.5 0 0 0 8 9.5l.757 4.102a.75.75 0 0 0 .743.648zm-1.993-4.54L8 9.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2l-.757 4.102A2.25 2.25 0 0 1 13.25 15.5h-2.5a2.25 2.25 0 0 1-2.243-1.898L7.507 9.71z"/>
                        <path fill="currentColor" d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    </svg>
                </div>
                <div class="card-back bg-white">
                    <img src="${carta.imagem}" alt="${carta.nome}" class="w-full h-full object-cover rounded">
                </div>
            </div>
        `;

            cardElement.addEventListener('click', () => virarCarta(cardElement, carta));
            tabuleiro.appendChild(cardElement);
        });
    }


    // Virar carta
    function virarCarta(cardElement, carta) {
        // Verificar se o jogo está bloqueado ou se a carta já está virada
        if (bloqueado || cardElement.classList.contains('flipped') || cartasViradas.length >= 2) {
            return;
        }

        // Virar carta
        cardElement.classList.add('flipped');
        cartasViradas.push({ element: cardElement, carta: carta });

        // Verificar se há duas cartas viradas
        if (cartasViradas.length === 2) {
            bloqueado = true;

            // Verificar se as cartas são iguais
            if (cartasViradas[0].carta.nome === cartasViradas[1].carta.nome) {
                // Par encontrado
                setTimeout(() => {
                    cartasViradas[0].element.classList.add('matched');
                    cartasViradas[1].element.classList.add('matched');
                    cartasViradas = [];
                    bloqueado = false;

                    // Atualizar contador de pares
                    paresEncontrados++;
                    paresEncontradosEl.textContent = paresEncontrados;

                    // Verificar vitória
                    if (paresEncontrados === totalPares) {
                        finalizarJogo();
                    }
                }, 500);
            } else {
                // Par não encontrado
                setTimeout(() => {
                    cartasViradas[0].element.classList.remove('flipped');
                    cartasViradas[1].element.classList.remove('flipped');
                    cartasViradas = [];
                    bloqueado = false;
                }, 1000);
            }
        }
    }

    // Iniciar cronômetro
    function iniciarCronometro() {
        // Limpar cronômetro anterior
        if (cronometro) {
            clearInterval(cronometro);
        }

        // Iniciar novo cronômetro
        tempoInicio = new Date();
        tempoEl.textContent = '00:00';

        cronometro = setInterval(() => {
            const agora = new Date();
            const diferenca = new Date(agora - tempoInicio);
            const minutos = diferenca.getUTCMinutes().toString().padStart(2, '0');
            const segundos = diferenca.getUTCSeconds().toString().padStart(2, '0');
            tempoEl.textContent = `${minutos}:${segundos}`;
        }, 1000);
    }

    // Finalizar jogo
    function finalizarJogo() {
        // Parar cronômetro
        clearInterval(cronometro);
        emJogo = false;

        // Mostrar tempo final
        tempoFinal.textContent = tempoEl.textContent;

        // Criar confetes
        criarConfetes();

        // Mostrar modal de vitória
        setTimeout(() => {
            modalVitoria.classList.remove('hidden');
        }, 500);
    }

    // Criar confetes
    function criarConfetes() {
        const confetesContainer = document.createElement('div');
        confetesContainer.className = 'fixed inset-0 pointer-events-none z-40';
        document.body.appendChild(confetesContainer);

        const cores = ['#FFCC33', '#3399FF', '#DD3333', '#9966CC', '#66CC66', '#FF99CC'];

        for (let i = 0; i < 100; i++) {
            const confete = document.createElement('div');
            confete.className = 'confetti';
            confete.style.left = `${Math.random() * 100}%`;
            confete.style.backgroundColor = cores[Math.floor(Math.random() * cores.length)];
            confete.style.width = `${Math.random() * 10 + 5}px`;
            confete.style.height = `${Math.random() * 10 + 5}px`;
            confete.style.animationDelay = `${Math.random() * 3}s`;
            confete.style.animationDuration = `${Math.random() * 3 + 2}s`;

            confetesContainer.appendChild(confete);
        }

        // Remover confetes após 5 segundos
        setTimeout(() => {
            confetesContainer.remove();
        }, 10000);
    }

    // Função para embaralhar array
    function embaralhar(array) {
        let currentIndex = array.length;
        let temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    // Event listeners
    btnInicio.addEventListener('click', () => mostrarTela('inicio'));
    btnJogo.addEventListener('click', () => {
        if (emJogo) {
            mostrarTela('jogo');
        } else {
            mostrarTela('inicio');
        }
    });
    btnInstrucoes.addEventListener('click', () => mostrarTela('instrucoes'));

    btnNivelFacil.addEventListener('click', () => iniciarJogo('facil'));
    btnNivelMedio.addEventListener('click', () => iniciarJogo('medio'));
    btnNivelDificil.addEventListener('click', () => iniciarJogo('dificil'));

    btnVoltar.addEventListener('click', () => {
        clearInterval(cronometro);
        emJogo = false;
        mostrarTela('inicio');
    });

    btnJogarNovamente.addEventListener('click', () => {
        modalVitoria.classList.add('hidden');
        iniciarJogo(nivel);
    });

    btnMudarNivel.addEventListener('click', () => {
        modalVitoria.classList.add('hidden');
        mostrarTela('inicio');
    });

    // Iniciar na tela de início
    mostrarTela('inicio');
});
