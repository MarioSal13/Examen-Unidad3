const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZmI1MzM2MWZhYTMyMzYxNDM5MjQ5ODU0YTY3YTE5NyIsIm5iZiI6MTcyNzU5NDkxMy43Njc4MjIsInN1YiI6IjY2ZjJmNWM0MDIyMDhjNjdjODhkOWFjYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.evddOiHWvAWL_YSSJ2RnBHT_JKsK8tLUHpj2MnXJEVE';
        const selectedMovie = ref({});
        const rating = ref(5);
        const userRating = ref(0);
        const sessionId = ref(null);
        const isFavorite = ref(false);
        const cast = ref([]);
        const keywords = ref([]);
        const trailer = ref(null);
        const recommendations = ref([]);

        // Fetch data from a given URL
        const fetchData = async (url) => {
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return await response.json();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Get movie details
        const getMovieDetails = async (movieId) => {
            const url = `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits,videos,keywords,recommendations`;
            const data = await fetchData(url);
            if (data) {
                selectedMovie.value = data;
                cast.value = data.credits?.cast?.slice(0, 10) || [];
                keywords.value = data.keywords?.results || [];
                trailer.value = data.videos?.results?.find(video => video.type === 'Trailer')?.key || null;
                recommendations.value = data.recommendations?.results || [];
            }
        };

        // Toggle favorite status
        const toggleFavorite = async () => {
            const method = isFavorite.value ? 'DELETE' : 'POST';
            const url = `https://api.themoviedb.org/3/account/{account_id}/favorite?session_id=${sessionId.value}`;
            await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    media_type: 'movie',
                    media_id: selectedMovie.value.id,
                    favorite: !isFavorite.value
                })
            });
            isFavorite.value = !isFavorite.value;
        };

        // Rate the movie
        const rateMovie = async () => {
            const url = `https://api.themoviedb.org/3/movie/${selectedMovie.value.id}/rating?session_id=${sessionId.value}`;
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ value: rating.value })
            });
            userRating.value = rating.value;
        };

        // Delete the rating
        const deleteRating = async () => {
            const url = `https://api.themoviedb.org/3/movie/${selectedMovie.value.id}/rating?session_id=${sessionId.value}`;
            await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                }
            });
            userRating.value = 0;
        };

        // Navigate back to home
        const goBack = () => {
            window.location.href = '../home.html';
        };

        // On component mount
        onMounted(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const movieId = urlParams.get('id');
            if (movieId) {
                getMovieDetails(movieId);
            } else {
                console.error('No movie ID found in URL');
            }
        });

        const irPelicula = (movie) => {
            window.location.href = `DetailPelicula.html?id=${movie.id}`;
        };

        return {
            selectedMovie,
            rating,
            userRating,
            isFavorite,
            cast,
            keywords,
            trailer,
            recommendations,
            getMovieDetails,
            toggleFavorite,
            rateMovie,
            deleteRating,
            goBack,
            irPelicula
        };
    }
}).mount('#app');
