// Função para formatar o CEP (adiciona o traço automaticamente)
function formatCEP(cepInput) {
    let cep = cepInput.value.replace(/\D/g, '');
    if (cep.length > 5) {
        cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    cepInput.value = cep;
}

// Função para buscar o endereço usando a API do Via CEP
async function fetchAddress(cep) {
    if (cep.length !== 8) {
        throw new Error('CEP inválido. Digite um CEP com 8 dígitos.');
    }

    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.erro) {
        throw new Error('CEP não encontrado.');
    }

    return data;
}

// Função para preencher os campos do formulário
function fillFormFields(data) {
    document.getElementById('logradouro').value = data.logradouro || '';
    document.getElementById('bairro').value = data.bairro || '';
    document.getElementById('localidade').value = data.localidade || '';
    document.getElementById('uf').value = data.uf || '';
}

// Função para salvar o endereço no localStorage
function saveAddress() {
    const address = {
        cep: document.getElementById('cep').value,
        logradouro: document.getElementById('logradouro').value,
        numero: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value,
        bairro: document.getElementById('bairro').value,
        localidade: document.getElementById('localidade').value,
        uf: document.getElementById('uf').value,
    };

    localStorage.setItem('savedAddress', JSON.stringify(address));

    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('hidden');
    setTimeout(() => successMessage.classList.add('hidden'), 3000); // Oculta após 3 segundos
}

// Função para carregar o endereço salvo
function loadSavedAddress() {
    const savedAddress = localStorage.getItem('savedAddress');
    if (savedAddress) {
        const address = JSON.parse(savedAddress);
        document.getElementById('cep').value = address.cep;
        document.getElementById('logradouro').value = address.logradouro;
        document.getElementById('numero').value = address.numero;
        document.getElementById('complemento').value = address.complemento;
        document.getElementById('bairro').value = address.bairro;
        document.getElementById('localidade').value = address.localidade;
        document.getElementById('uf').value = address.uf;
    }
}

// Função para inicializar o formulário de CEP
export function setupCEPForm() {
    const cepInput = document.getElementById('cep');
    const fetchAddressButton = document.getElementById('fetchAddressButton');

    cepInput.addEventListener('input', () => formatCEP(cepInput));

    fetchAddressButton.addEventListener('click', async () => {
        const cep = cepInput.value.replace(/\D/g, '');

        try {
            const addressData = await fetchAddress(cep);
            fillFormFields(addressData);
        } catch (error) {
            alert(error.message);
        }
    });
}

// Função para inicializar a funcionalidade de salvar endereço
export function setupSaveAddress() {
    const saveAddressButton = document.getElementById('saveAddressButton');

    saveAddressButton.addEventListener('click', saveAddress);

    loadSavedAddress();
}