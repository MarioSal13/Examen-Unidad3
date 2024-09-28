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

        };

        // Add/Delete favorites
        const toggleFavorite = () => {
            
        };

        // rate series
        const rateSeries = () => {

        };

        // delete rate
        const deleteRating = () => {

        };

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