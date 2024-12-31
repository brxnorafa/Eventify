// Função para alternar a visibilidade do dropdown
function toggleDropdown(dropdownId) {
    // Alternar o dropdown clicado
    const dropdown = document.getElementById(dropdownId);
    dropdown.classList.toggle('hidden');
    dropdown.classList.toggle('show');
}

// Função para preencher o dropdown de estados
async function loadStates() {
    const stateDropdown = document.getElementById('dropdownMenu1');
    try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const states = await response.json();
        stateDropdown.innerHTML = ''; // Limpa as opções anteriores

        const allStatesOption = document.createElement('li');
        allStatesOption.classList.add('px-4', 'py-2', 'hover:bg-blue-500', 'cursor-pointer');
        allStatesOption.textContent = 'Todas os estados';
        allStatesOption.onclick = () => selectState('Todos os estados');
        stateDropdown.appendChild(allStatesOption);

        states.forEach(state => {
            const stateOption = document.createElement('li');
            stateOption.classList.add('px-4', 'py-2', 'hover:bg-blue-500', 'cursor-pointer');
            stateOption.textContent = state.nome; // Exibe o nome completo do estado (ex: "São Paulo")
            stateOption.onclick = () => selectState(state.sigla); // Usa a sigla do estado (ex: "SP")
            stateDropdown.appendChild(stateOption);
        });
    } catch (error) {
        console.error('Erro ao carregar estados:', error);
    }
}

// Função para selecionar um estado
async function selectState(stateSigla) {
    console.log('Estado selecionado:', stateSigla);
    document.getElementById('selectedState').innerHTML = stateSigla;

    // Verifica o dropdown da cidade e ativa o campo de seleção de cidades
    const cityDropdown = document.getElementById('dropdownButton2');
    if (cityDropdown) {
        cityDropdown.disabled = false; // Ativa o dropdown de cidades
    }

    // Limpa o texto da cidade e preenche as cidades
    document.getElementById('selectedCity').innerHTML = 'Selecione uma cidade';

    try {
        await loadCities(stateSigla); // Passa a sigla do estado
    } catch (error) {
        console.error('Erro ao carregar cidades:', error);
    }

    // Fecha o menu de estados
    document.getElementById('dropdownMenu1').classList.add('hidden');
    searchEvent();
}

// Função para preencher o dropdown de cidades
async function loadCities(stateSigla) {
    const cityDropdown = document.getElementById('dropdownMenu2');
    cityDropdown.innerHTML = ''; // Limpa as opções anteriores

    try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateSigla}/municipios`);
        const cities = await response.json();

        if (Array.isArray(cities)) {
            // Adiciona a opção "Todas as cidades"
            const allCitiesOption = document.createElement('li');
            allCitiesOption.classList.add('px-4', 'py-2', 'hover:bg-blue-500', 'cursor-pointer');
            allCitiesOption.textContent = 'Todas as cidades';
            allCitiesOption.onclick = () => selectCity('Todas as cidades');
            cityDropdown.appendChild(allCitiesOption);

            // Adiciona a opção "Selecione uma cidade"
            const defaultOption = document.createElement('li');
            defaultOption.classList.add('px-4', 'py-2', 'text-gray-400');
            defaultOption.textContent = 'Selecione uma cidade';
            cityDropdown.appendChild(defaultOption);

            // Adiciona as opções de cidade
            cities.forEach(city => {
                const cityOption = document.createElement('li');
                cityOption.classList.add('px-4', 'py-2', 'hover:bg-blue-500', 'cursor-pointer');
                cityOption.textContent = city.nome;
                cityOption.onclick = () => selectCity(city.nome);
                cityDropdown.appendChild(cityOption);
            });
        } else {
            console.error('Formato inesperado recebido da API de cidades:', cities);
        }
    } catch (error) {
        console.error('Erro ao carregar cidades:', error);
    }
}



// Função para selecionar a cidade
function selectCity(city) {
    document.getElementById('selectedCity').innerHTML = city;
    document.getElementById('dropdownMenu2').classList.add('hidden');
    searchEvent();
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM totalmente carregado');
    await loadStates();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getLocationSuccess, getLocationError);
    } else {
        console.log("Geolocalização não é suportada por este navegador.");
    }

    function getLocationSuccess(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        // Chama a função para buscar a cidade e o estado com as coordenadas
        getCityState(latitude, longitude);
    }

    function getLocationError(error) {
        console.error("Erro ao obter localização:", error);
    }

    // Função para obter cidade e estado da geolocalização
    function getCityState(latitude, longitude) {
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const address = data.address;
                const city = address.city || address.town || address.village;
                const state = address.state; // Nome do estado, ex: "São Paulo"

                console.log(`Cidade: ${city}, Estado: ${state}`);

                // Mapeamento para a sigla do estado (ex: "São Paulo" -> "SP")
                const stateSigla = getStateSigla(state);

                // Passa a sigla para a função selectState
                selectState(stateSigla);
                selectCity(city);
            })
            .catch(error => console.error('Erro ao buscar cidade e estado:', error));
    }

    // Função para mapear o nome do estado para a sigla
    function getStateSigla(stateName) {
        const states = {
            'Acre': 'AC', 'Alagoas': 'AL', 'Amapá': 'AP', 'Amazonas': 'AM', 'Bahia': 'BA',
            'Ceará': 'CE', 'Distrito Federal': 'DF', 'Espírito Santo': 'ES', 'Goiás': 'GO',
            'Maranhão': 'MA', 'Mato Grosso': 'MT', 'Mato Grosso do Sul': 'MS', 'Minas Gerais': 'MG',
            'Pará': 'PA', 'Paraíba': 'PB', 'Paraná': 'PR', 'Pernambuco': 'PE', 'Piauí': 'PI',
            'Rio de Janeiro': 'RJ', 'Rio Grande do Norte': 'RN', 'Rio Grande do Sul': 'RS',
            'Rondônia': 'RO', 'Roraima': 'RR', 'Santa Catarina': 'SC', 'São Paulo': 'SP',
            'Sergipe': 'SE', 'Tocantins': 'TO'
        };

        return states[stateName] || stateName; // Retorna a sigla ou o nome caso não encontre
    }

});


// Função para carregar eventos da API
async function searchEvent() {
    const nome = document.getElementById('event-name').value;
    const estadoTexto = document.getElementById('selectedState').innerText;
    const cidadeTexto = document.getElementById('selectedCity').innerText; 
    let cidade = '';
    let estado = '';
    if (cidadeTexto !== "Selecione uma cidade" && cidadeTexto !== "Todas as cidades") {
        cidade = cidadeTexto;
    }   
    if (estadoTexto !== "Selecione um estado" && estadoTexto !== "Todos os estados") {
        estado = estadoTexto;
    }   

    const params = new URLSearchParams({
        nome,
        estado,
        cidade
    }).toString();  // Cria a string de parâmetros para a query

    try {
        const response = await fetch(`http://localhost:5000/api/eventos/search?${params}`);
        const events = await response.json();
        
        // Chama a função para atualizar a UI com os novos eventos
        updateEventsCards(events);
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
    }
}


function updateEventsCards(events) {
    const eventSection = document.getElementById('proximos-eventos');
    const eventList = eventSection.querySelector('.grid');
    eventList.innerHTML = '';

    // Verifica se há eventos
    if (events.length === 0) {
        eventList.innerHTML = '<p>Nenhum evento encontrado.</p>';
        document.getElementById('event-alert').classList.add('hidden'); 
    } else {
        // Adiciona os cards novos
        events.slice(0, 6).forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('bg-gray-100', 'rounded-lg', 'shadow-lg', 'overflow-hidden');
        
            const eventImage = event.imagem_url || 'https://via.placeholder.com/400x200';
            eventCard.innerHTML = `
                <img src="${eventImage}" alt="${event.nome}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-2xl font-semibold text-violet-950 poppins">${event.nome}</h3>
                    <p class="text-gray-600 roboto mt-2">Data: ${formatDate(event.data_inicio)}</p>
                    <p class="text-gray-600 roboto">Local: ${event.local}, ${event.cidade} - ${event.estado}</p>
                    <button
                        class="mt-4 px-6 py-2 bg-violet-950 text-white poppins rounded-lg hover:bg-violet-800 transition duration-300">
                        Saiba Mais
                    </button>
                </div>
            `;
            eventList.appendChild(eventCard);
        });
        document.getElementById('event-alert').classList.remove('hidden');        
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}