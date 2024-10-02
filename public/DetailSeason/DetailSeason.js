import { createApp, ref, onMounted } from 'https://unpkg.com/vue@3.2.47/dist/vue.esm-browser.js';

createApp({
    setup(){
        const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZmI1MzM2MWZhYTMyMzYxNDM5MjQ5ODU0YTY3YTE5NyIsIm5iZiI6MTcyNzU5NDkxMy43Njc4MjIsInN1YiI6IjY2ZjJmNWM0MDIyMDhjNjdjODhkOWFjYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.evddOiHWvAWL_YSSJ2RnBHT_JKsK8tLUHpj2MnXJEVE';
        const selectedSeason = ref(null);
        const seasonId = ref(null);

        const getSeasonDetails = (seriesId, seasonNumber) => {
            fetch(`https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?append_to_response=credits`, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                }
            })
            .then(res => res.json())
            .then(data => {
                selectedSeason.value = data;
                // Inicializa la propiedad showGuests en cada episodio
                selectedSeason.value.episodes.forEach(episode => {
                    episode.showGuests = false;
                });
            })
            .catch(error => console.log('Error al obtener los detalles de la temporada:', error));
        };

        const toggleGuests = (episode) => {
            episode.showGuests = !episode.showGuests;
        };

        const goBack = () => {
            window.history.back();
        }

        onMounted(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const seriesId = urlParams.get('seriesId');
            const seasonNumber = urlParams.get('seasonNumber');

            //TODO eliminar esto
            console.log('URL completa:', window.location.href);
            console.log('Parámetros de URL:', window.location.search);
            console.log('ID serieId:', seriesId);
            console.log('ID seasonN:', seasonNumber);

            if(seriesId && seasonNumber) {
                getSeasonDetails(seriesId, seasonNumber);
            } else {
                console.error('No se encontro el ID de la serie o el numero de temporada')
            }
        });

        const cerrarSesion = () => {
            sessionStorage.removeItem('Usuario');
            sessionStorage.removeItem('session_id');
            sessionStorage.removeItem('account_id');
            window.location.href = '../login.html';
        };

        return {
            selectedSeason,
            goBack,
            cerrarSesion,
            toggleGuests
        }
    }
}).mount('#app');