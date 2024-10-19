const API_URL = 'https://thronesapi.com/api/v2/characters';
const SECOND_API_URL = 'https://anapioficeandfire.com/api/characters';

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const charactersContainer = document.getElementById('characters-container');
const characterDetailsContainer = document.getElementById('character-details-container');
const backBtn = document.getElementById('back-btn');

let characters = [];

console.log('Button clicked for character ID:', characterId);

async function fetchCharacters() {
    try {
        const response = await fetch(API_URL);
        characters = await response.json();
        renderCharacters();
    } catch (error) {
        console.error('Error fetching characters:', error);
    }
}

function renderCharacters() {
    charactersContainer.innerHTML = '';
    characters.forEach((character) => {
        const characterCard = document.createElement('div');
        characterCard.classList.add('character-card');
        characterCard.innerHTML = `
            <img src="${character.imageUrl || 'default-image.jpg'}" alt="Character Image">
            <h2>${character.firstName} ${character.lastName}</h2>
            <button class="view-details-btn" data-id="${character.id}">View Details</button>
        `;
        charactersContainer.appendChild(characterCard);
    });

    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', () => {
            const characterId = button.getAttribute('data-id');
            fetchCharacterDetails(characterId);
        });
    });
}

async function fetchCharacterDetails(id) {
    try {
        const characterResponse = await fetch(`${API_URL}/${id}`);
        const asoiafResponse = await fetch(`${SECOND_API_URL}/${id}`);
        
        if (!characterResponse.ok || !asoiafResponse.ok) {
            throw new Error('Character not found in one of the APIs');
        }

        const character = await characterResponse.json();
        const asoiafCharacter = await asoiafResponse.json();

        const characterData = {
            ...character,
            titles: asoiafCharacter.titles || [],
            aliases: asoiafCharacter.aliases || [],
            family: asoiafCharacter.family || 'None',
            familyCrest: asoiafCharacter.familyCrest || 'default-crest.jpg',
        };

        renderCharacterDetails(characterData);
    } catch (error) {
        console.error('Error fetching character details:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.view-details-btn');
  
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const characterId = event.target.getAttribute('data-id');
        console.log('Button clicked for character ID:', characterId);
        // Redirect to the character details page
        window.location.href = `/characters/${characterId}`;
      });
    });
  });
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const characterId = event.target.getAttribute('data-id');
            try {
                const response = await fetch(`/character/${characterId}`);
                const character = await response.json();

                displayCharacterDetails(character);
            } catch (error) {
                console.error('Error fetching character details:', error);
            }
        });
    });

function displayCharacterDetails(character) {
    const detailsContainer = document.getElementById('character-details-container');
    detailsContainer.innerHTML = `
        <h2>${character.firstName} ${character.lastName}</h2>
        <img src="${character.imageUrl || 'default-image.jpg'}" alt="Character Image">
        <p>Titles: ${character.titles.join(', ') || 'None'}</p>
        <p>Aliases: ${character.aliases.join(', ') || 'None'}</p>
        <p>Family: ${character.family || 'None'}</p>
        <img src="${character.familyCrest || 'default-crest.jpg'}" alt="Family Crest">
    `;
    detailsContainer.style.display = 'block';
}

function renderCharacterDetails(character) {
    characterDetailsContainer.style.display = 'block';
    charactersContainer.style.display = 'none';

    document.getElementById('character-name').textContent = `${character.firstName} ${character.lastName}`;
    document.getElementById('character-id').textContent = `ID: ${character.id}`;
    document.getElementById('character-born').textContent = `Born: ${character.born || 'Unknown'}`;
    document.getElementById('character-died').textContent = `Died: ${character.died || 'Unknown'}`;
    document.getElementById('character-titles').textContent = `Titles: ${character.titles.join(', ') || 'None'}`;
    document.getElementById('character-aliases').textContent = `Aliases: ${character.aliases.join(', ') || 'None'}`;
    document.getElementById('character-family').textContent = `Family: ${character.family}`;
    document.getElementById('character-family-crest').src = character.familyCrest || 'default-crest.jpg';
}

backBtn.addEventListener('click', () => {
    characterDetailsContainer.style.display = 'none';
    charactersContainer.style.display = 'block';
});

searchBtn.addEventListener('click', () => {
    const searchQuery = searchInput.value.trim();
    window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
    const filteredCharacters = characters.filter(character => 
        character.firstName.toLowerCase().includes(searchQuery) || 
        character.lastName.toLowerCase().includes(searchQuery) || 
        (`${character.firstName} ${character.lastName}`).toLowerCase().includes(searchQuery)
    );
    renderFilteredCharacters(filteredCharacters);
});

function renderFilteredCharacters(filteredCharacters) {
    charactersContainer.innerHTML = '';
    filteredCharacters.for}