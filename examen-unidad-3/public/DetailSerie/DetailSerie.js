import { createApp, ref, onMounted } from 'https://unpkg.com/vue@3.2.47/dist/vue.esm-browser.js';

createApp({
    setup() {
        const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZmI1MzM2MWZhYTMyMzYxNDM5MjQ5ODU0YTY3YTE5NyIsIm5iZiI6MTcyNzU5NDkxMy43Njc4MjIsInN1YiI6IjY2ZjJmNWM0MDIyMDhjNjdjODhkOWFjYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.evddOiHWvAWL_YSSJ2RnBHT_JKsK8tLUHpj2MnXJEVE';
        const selectedSeries = ref({});
        const rating = ref(5);
        const userRating = ref(0);
        const sessionId = ref(null);
        const isFavorite = ref(false);
        const cast = ref([]);
        const keywords = ref([]);
        const trailer = ref(null);
        const recommendations = ref([]);

        // Obtains details of the series
        const getSeriesDetails = (seriesId) => {
            fetch(`https://api.themoviedb.org/3/tv/${seriesId}?append_to_response=credits,videos,keywords,recommendations`, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}` // Usar el token de acceso V4
                }
            })
            .then(res => res.json())
            .then(data => {
                selectedSeries.value = data;
                cast.value = data.credits?.cast?.slice(0, 10) || [];
                keywords.value = data.keywords?.results || [];
                trailer.value = data.videos?.results?.find(video => video.type === 'Trailer')?.key || null;
                recommendations.value = data.recommendations?.results || [];
            })
            .catch(error => console.log('Error al obtener datos', error));
        };

        // Add/Delete favorites
        const toggleFavorite = () => {
            const method = isFavorite.value ? 'DELETE' : 'POST';
            fetch(`https://api.themoviedb.org/3/account/{account_id}/favorite?session_id=${sessionId.value}`, {
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

        // back to home
        const goBack = () => {
            window.location.href = '../home.hmtl';
        }

        // On mount
        onMounted(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const seriesId = urlParams.get('id');

            console.log('URL completa:', window.location.href);
            console.log('Parámetros de URL:', window.location.search);
            console.log('ID extraído:', seriesId);

            if (seriesId) {
                getSeriesDetails(seriesId);
                console.log('data', selectedSeries.value);
                console.log('el id es' + seriesId);
            } else {
                console.error('No se encontró el id de la serie en URL');
            }
        });

        return {
            selectedSeries,
            rating,
            userRating,
            isFavorite,
            cast,
            keywords,
            trailer,
            recommendations,
            getSeriesDetails,
            toggleFavorite,
            rateSeries,
            deleteRating,
            goBack
        };
    }
}).mount('#app');
