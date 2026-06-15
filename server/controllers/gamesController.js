const fs = require('fs');
const path = require('path');
class GameController{

    constructor() {
        this.games = {}; // Almacenar juegos por ID
        this.gamesFile = path.join(__dirname, '../data/games.json');
        this.RAWG_API_KEY = '9720fe89ee77407ea36f4a52d730f7d1';
        this.RAWG_BASE_URL = 'https://api.rawg.io/api/games';
    }

    // Mapear solo los campos necesarios
    mapGameData(rawgGame) {
        return {
        id: rawgGame.id,
        slug: rawgGame.slug,
        name: rawgGame.name,
        released: rawgGame.released,
        tba: rawgGame.tba,
        background_image: rawgGame.background_image
        };
    }

    // Guardar en archivo
    saveGamesToFile() {
        try {
            const dir = path.dirname(this.gamesFile);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.gamesFile, JSON.stringify(this.games, null, 2));
            console.log('✅ Juegos guardados en archivo');
        } 
        catch (error) {
            console.error('❌ Error guardando juegos:', error.message);
        }
    }

    // Guardar en archivo
    getGamesFromJson() {
        try {
            const dir = path.dirname(this.gamesFile);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            const data = JSON.parse(fs.readFileSync(this.gamesFile, { encoding: 'utf8', flag: 'r'}));
            const dataList = Object.values(data);

            this.games = {};
            dataList.forEach(game => {
                this.games[game.id] = game;
            });

            console.log('✅ Juegos obtenidos del archivo json '+this.games);
            return Object.values(this.games);
        } 
        catch (error) {
            console.error('❌ Error guardando juegos:', error.message);
            return [];
        }
    }


    // Obtener juegos de RAWG y almacenarlos
    async getGamesFromApi(page_size) {
        try {
        const url = `${this.RAWG_BASE_URL}?key=${this.RAWG_API_KEY}&page_size=${page_size}`;
        const response = await fetch(url);
        const data = await response.json();

        // Transformar y almacenar solo los campos que necesitas
        const cleanGames = data.results.map(game => this.mapGameData(game));
        
        // Guardar en memoria
        cleanGames.forEach(game => {
            this.games[game.id] = game;
        });

        this.games = Object.values(this.games);
        console.log(this.games);

        this.saveGamesToFile();

        return {
            ok: true,
            games: cleanGames,
            count: data.count,
            next: data.next,
            previous: data.previous
        };
        } catch (error) {
            return { ok: false, error: error.message };
        }
    }

    getGame(id) {
        return this.games[id] || null;
    }

    getAllGames() {
        return Object.values(this.games);
    }
}

module.exports = new GameController();