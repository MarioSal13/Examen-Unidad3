import { createApp, ref, onMounted } from 'https://unpkg.com/vue@3.2.47/dist/vue.esm-browser.js';

createApp({
    setup() {
        const selectedSeries = ref(null);
        const rating = ref(5);
        const userRating = ref(0);
        const sessionId = ref(null);
        const isFavorite = ref(false);
        const cast = ref([]);
        const keywords = ref([]);
        const trailer = ref(null);
        const recommendations = ref([]);

        // obtains details serie
        const getSeriesDetails = (seriesId) => {
            fetch(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${process.env.VUE_APP_API_KEY}&append_to_response=credits,videos,keywords,recommendations`)
            .then(res => res.json())
            .then(data =>{
                selectedSeries.value = data;
                cast.value = data.credits.cast.slice(0,10);
                keywords.value = data.keywords.results;
                trailer.value = data.videos.results.find(video => video.type === 'trailer')?.key;
                recommendations.value = data.recommendations.results;
            })
            .catch(error => console.log('Error al obtener datos', error));
        };

        // Add/Delete favorites
        const toggleFavorite = () => {
            const method = isFavorite.value ? 'DELETE' : 'POST';
            fetch(`https://api.themoviedb.org/3/account/{account_id}/favorite?api_key=${process.env.VUE_APP_API_KEY}&session_id=${sessionId.value}`,{
                method,
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    media_type: 'tv',
                    media_id: selectedSeries.value.id,
                    favorite: !isFavorite.value
                })
            })
            .then(res => res.json())
            .then(() =>{
                isFavorite.value = !isFavorite.value;
            })
            .catch(error => console.log('Error al cambiar favorito: ', error));
        };

        // rate series
        const rateSeries = () => {
            fetch(`https://api.themoviedb.org/3/tv/${selectedSeries.value.id}/rating?api_key=${process.env.VUE_APP_API_KEY}&session_id=${sessionId.value}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    value: rating.value
                })
            })
            .then(res => res.json())
            .then(() => {
                userRating.value = rating.value;
            })
            .catch(error => console.log('Error al enviar rating', error));
        };

        // delete rate
        const deleteRating = () => {
            fetch(`https://api.themoviedb.org/3/tv/${selectedSeries.value.id}/rating?api_key=${process.env.VUE_APP_API_KEY}&session_id=${sessionId.value}`, {
                method: 'DELETE'
            })
            .then(res =>{
                if(res.ok) {
                    userRating.value = 0;
                }
            })
            .catch(error => console.log('Error al eleiminar rating:', error));
        };

        // On mount
        onMounted(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const seriesId = urlParams.get('id');
            if(seriesId) {
                getSeriesDetails(seriesId);
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
            deleteRating
        }
    }
}).mount('app');