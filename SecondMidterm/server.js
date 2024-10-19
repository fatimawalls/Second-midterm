import express from 'express';
import path from 'path';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = 'https://thronesapi.com/api/v2/characters';
const SECOND_API_URL = 'https://anapioficeandfire.com/api/characters';

app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'views'));
app.use(express.static(path.join(path.resolve(), 'public')));

app.get('/', async (req, res) => {
    const searchQuery = req.query.search || '';

    try {
        const characters = await fetch(API_URL).then(response => response.json());
        const filteredCharacters = characters.filter(character =>
            character.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            character.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (`${character.firstName} ${character.lastName}`).toLowerCase().includes(searchQuery.toLowerCase())
        );
        res.render('index', { characters: filteredCharacters, searchQuery, error: null });
    } catch (error) {
        console.error('Error fetching characters:', error);
        res.render('index', { characters: [], searchQuery, error: 'Could not fetch characters' });
    }
});

app.get('/character/:id', async (req, res) => {
    const characterId = req.params.id;

    try {
        const characterResponse = await fetch(`${API_URL}/${characterId}`);
        const asoiafResponse = await fetch(`${SECOND_API_URL}/${characterId}`);
        
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

        res.render('character', { character: characterData });
    } catch (error) {
        console.error('Error fetching character:', error);
        res.render('character', { error: 'Character not found' });
    }
});

app.get('/api/characters', async (req, res) => {
    try {
        const characters = await fetch(API_URL).then(response => response.json());
        res.json(characters);
    } catch (error) {
        console.error('Error fetching character:', error);
        res.status(404).json({ error: 'Character not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});