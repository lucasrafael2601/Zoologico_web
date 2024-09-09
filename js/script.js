const apiUrl = 'https://anryfnhhtlqxvtsejcse.supabase.co/rest/v1/animais';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucnlmbmhodGxxeHZ0c2VqY3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNDUwMTksImV4cCI6MjAzOTgyMTAxOX0.BR4Z8lIcEYmfYBU_N5dASDQ_Bn4xmXwnHFB64_9snUY';

const headers = {
    'Content-Type': 'application/json',
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`
};

// Função para adicionar um novo animal ou atualizar um existente
document.getElementById('animal-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('animal-id').value;
    const nome = document.getElementById('nome').value;
    const especie = document.getElementById('especie').value;
    const idade = document.getElementById('idade').value;
    const sexo = document.getElementById('sexo').value;
    const origem = document.getElementById('origem').value;

    const animal = { nome, especie, idade, sexo, origem };

    if (id) {
        await updateAnimal(id, animal);
    } else {
        await saveAnimal(animal);
    }

    document.getElementById('animal-form').reset();
    fetchAnimals();
});

// Função para salvar um novo animal na API
async function saveAnimal(animal) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(animal)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erro ao adicionar animal: ${error}`);
        }
    } catch (error) {
        console.error('Erro ao salvar animal:', error);
    }
}

// Função para atualizar um animal na API
async function updateAnimal(id, animal) {
    try {
        const response = await fetch(`${apiUrl}?id=eq.${id}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(animal)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erro ao atualizar animal: ${error}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar animal:', error);
    }
}

// Função para atualizar a lista de animais
async function fetchAnimals() {
    try {
        const response = await fetch(apiUrl, {
            headers: headers
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erro ao buscar animais: ${error}`);
        }

        const animals = await response.json();
        updateAnimalsList(animals);
    } catch (error) {
        console.error('Erro ao buscar animais:', error);
    }
}

function updateAnimalsList(animals) {
    const animalsList = document.getElementById('animals');
    animalsList.innerHTML = '';
    animals.forEach(animal => {
        const li = document.createElement('li');
        li.textContent = `Nome: ${animal.nome}, Espécie: ${animal.especie}, Idade: ${animal.idade}, Sexo: ${animal.sexo}, Origem: ${animal.origem}`;
        li.appendChild(createEditButton(animal));
        li.appendChild(createDeleteButton(animal.id));
        animalsList.appendChild(li);
    });
}

function createEditButton(animal) {
    const button = document.createElement('button');
    button.textContent = 'Editar';
    button.className = 'edit';
    button.onclick = () => {
        document.getElementById('animal-id').value = animal.id;
        document.getElementById('nome').value = animal.nome;
        document.getElementById('especie').value = animal.especie;
        document.getElementById('idade').value = animal.idade;
        document.getElementById('sexo').value = animal.sexo;
        document.getElementById('origem').value = animal.origem;
    };
    return button;
}

function createDeleteButton(id) {
    const button = document.createElement('button');
    button.textContent = 'Remover';
    button.className = 'remove';
    button.onclick = async () => {
        await deleteAnimal(id);
        fetchAnimals();
    };
    return button;
}

async function deleteAnimal(id) {
    try {
        const response = await fetch(`${apiUrl}?id=eq.${id}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erro ao remover animal: ${error}`);
        }
    } catch (error) {
        console.error('Erro ao remover animal:', error);
    }
}

// Função para preencher o campo de seleção de espécies
function populateSpecies() {
    const species = [
        "Leão", "Tigre", "Elefante", "Girafa", "Zebra", "Macaco", "Panda", "Pinguim", "Lobo", "Rinoceronte",
        "Hipopótamo", "Canguru", "Koala", "Puma", "Orangotango", "Urso Polar", "Tubarão", "Baleia", "Gorila",
        "Lince", "Suricata", "Papagaio", "Cobra", "Arara", "Camelo", "Polvo", "Golfinho", "Esquilo", "Águia",
        "Falcão", "Cavalo", "Búfalo", "Javali", "Pardal", "Pica-pau", "Cisne", "Cardeal", "Coruja", "Tartaruga",
        "Sapo", "Lagarto", "Serpente", "Coala", "Mariposa", "Libélula", "Besouro", "Bicho-pau", "Formiga",
        "Abelha", "Vespa", "Joaninha", "Tarântula", "Escorpião", "Centopeia", "Aranha", "Gafanhoto", "Barata",
        "Morcego", "Rato", "Cobra Coral", "Mico-leão-dourado", "Tamanduá-bandeira", "Anta", "Capivara",
        "Jaguar", "Onça-pintada", "Macaco-prego", "Macaco-aranha", "Boto", "Peixe-boi", "Tatu", "Jaguatirica",
        "Gato-do-mato", "Ariranha", "Quati", "Avestruz", "Tuiuiú", "Iaque", "Gnu", "Carneiro", "Furão",
        "Doninha", "Texugo", "Mangusto", "Tigre-branco", "Lobo-guará", "Lobo-marinho", "Cervo", "Raposa",
        "Pangolim", "Tamanduá", "Guanaco", "Puma", "Tatu-canastra", "Leopardo", "Leopardo-das-neves",
        "Morsa", "Rena", "Gazela", "Corça", "Corvo", "Gaivota", "Tordo"
    ];

    const selectSpecies = document.getElementById('especie');
    species.forEach(specie => {
        const option = document.createElement('option');
        option.textContent = specie;
        option.value = specie;
        selectSpecies.appendChild(option);
    });
}

// Inicializa a lista de animais e preenche o campo de espécies
fetchAnimals();
populateSpecies();
