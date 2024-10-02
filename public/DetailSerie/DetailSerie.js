import { createApp, ref, onMounted } from 'https://unpkg.com/vue@3.2.47/dist/vue.esm-browser.js';

createApp({
    setup() {
        const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZmI1MzM2MWZhYTMyMzYxNDM5MjQ5ODU0YTY3YTE5NyIsIm5iZiI6MTcyNzU5NDkxMy43Njc4MjIsInN1YiI6IjY2ZjJmNWM0MDIyMDhjNjdjODhkOWFjYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.evddOiHWvAWL_YSSJ2RnBHT_JKsK8tLUHpj2MnXJEVE';
        const selectedSeries = ref({});
        const selectedSeason = ref({});
        const rating = ref(5);
        const userRating = ref(0);
        const account_id = sessionStorage.getItem('account_id');
        const session_id = sessionStorage.getItem('session_id');
        const isFavorite = ref(false);
        const cast = ref([]);
        const keywords = ref([]);
        const trailer = ref(null);
        const recommendations = ref([]);
        const showFullCast = ref(false);
        const showAllSeasons = ref(false);

        // Obtains details of the series
        const getSeriesDetails = (seriesId) => {
            fetch(`https://api.themoviedb.org/3/tv/${seriesId}?append_to_response=credits,videos,keywords,recommendations,seasons`, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                }
            })
            .then(res => res.json())
            .then(data => {
                selectedSeries.value = data;
                cast.value = data.credits?.cast || [];
                keywords.value = data.keywords?.results || [];
                trailer.value = data.videos?.results?.find(video => video.type === 'Trailer')?.key || null;
                recommendations.value = data.recommendations?.results || [];
                if (data.seasons.length > 0) {
                    const lastSeason = data.seasons[data.seasons.length - 1];
                    const seasonToFetch = lastSeason.season_number >= 0 ? lastSeason.season_number : 0;
                    getSeasonDetails(seriesId, seasonToFetch);
                }
            })
            .catch(error => console.log('Error al obtener datos', error));
        };

        // Obtains details from season
        const getSeasonDetails = (seriesId, seasonNumber) => {
            fetch(`https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}`, {
                headers: {
                    'Authorization' : `Bearer ${API_KEY}`
                }
            })
            .then(res => res.json())
            .then(data => {
                selectedSeason.value = data;
            })
            .catch(error => console.log('Error al obtener datos temporada', error));
        }

        // Add/Delete favorites
        const toggleFavorite = () => {
            const method = isFavorite.value ? 'DELETE' : 'POST';
            fetch(`https://api.themoviedb.org/3//account/${account_id}/favorite?session_id=${session_id}`, {
                method,
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    media_type: 'tv',
                    media_id: selectedSeries.value.id,
                    favorite: !isFavorite.value
                })
            })
            .then(res => res.json())
            .then(() => {
                isFavorite.value = !isFavorite.value;
            })
            .catch(error => console.log('Error al cambiar favorito: ', error));
        };

        // show all actors
        const toggleShowCast = () => {
            showFullCast.value = !showFullCast.value;
        };

        // show all seasons
        const toggleAllSeasons = () => {
            showAllSeasons.value = !showAllSeasons.value;
        }

        // Rate series
        const rateSeries = () => {
            fetch(`https://api.themoviedb.org/3/tv/${selectedSeries.value.id}/rating?session_id=${sessionId.value}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    value: rating.value
                })
            })
            .then(res => res.json())
            .then(() => {
                userRating.value = rating.value;
            })
            .catch(error => console.log('Error al enviar rating', error));
        };

        // Delete rating
        const deleteRating = () => {
            fetch(`https://api.themoviedb.org/3/tv/${selectedSeries.value.id}/rating?session_id=${sessionId.value}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                }
            })
            .then(res => {
                if (res.ok) {
                    userRating.value = 0;
                }
            })
            .catch(error => console.log('Error al eliminar rating:', error));
        };

        // redirect to SeasonDetail
        const redirectSeasonDetail = (seasonNumber) => {
            const seriesId = selectedSeries.value.id;
            if (seriesId !== undefined && seasonNumber >= 0) {
                window.location.href = `../DetailSeason/DetailSeason.html?seriesId=${seriesId}&seasonNumber=${seasonNumber}`;
            }
        }

        // keywords
        const goKeyword = (keyword) => {
            window.location.href = `../KeywordDetail/keyword.html?id=${keyword.id}`;
        };

        // genres
        const goGenre = (genre) => {
            window.location.href = `../CategoryDetail/genre.html?id=${genre.id}`;
        };

        // On mount
        onMounted(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const seriesId = urlParams.get('id');
            const seasonNumber = urlParams.get('seasonNumber') ||  1;

            if (seriesId) {
                getSeriesDetails(seriesId);
                getSeasonDetails(seriesId, seasonNumber);
            } else {
                console.error('No se encontró el id de la serie en URL');
            }
        });

        const cerrarSesion = () => {
            sessionStorage.removeItem('Usuario');
            sessionStorage.removeItem('session_id');
            sessionStorage.removeItem('account_id');
            window.location.href = '../login.html';
        }

        return {
            selectedSeries,
            selectedSeason,
            rating,
            userRating,
            isFavorite,
            cast,
            keywords,
            trailer,
            recommendations,
            showFullCast,
            showAllSeasons,
            getSeriesDetails,
            getSeasonDetails,
            toggleFavorite,
            rateSeries,
            deleteRating,
            redirectSeasonDetail,
            toggleAllSeasons,
            toggleShowCast,
            goKeyword,
            goGenre,
            cerrarSesion
        };
    }
}).mount('#app');
