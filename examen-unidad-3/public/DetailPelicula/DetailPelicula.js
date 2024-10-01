const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTU2OTBkZjg3ZGQ4YjQ1ZmQ0OGM2MjEzNzgzMjAxMiIsIm5iZiI6MTcyNzU3NTA0Mi4zMDg0NDYsInN1YiI6IjY2ZjJmNmRjMDIyMDhjNjdjODhkOWJjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AeGm_NWqjLKptJznk1e5rGNSPdNkaxJZB6EBkPYB_Mc";
        const selectedMovie = ref({});
        const rating = ref(5);
        const userRating = ref(0);
        const account_id = sessionStorage.getItem('account_id');
        const session_id = sessionStorage.getItem('session_id');
        const isFavorite = ref(false);
        const cast = ref([]);
        const keywords = ref([]);
        const trailer = ref(null);
        const recommendations = ref([]);
        const showMore = ref(false);

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

                selectedMovie.value.tagline = data.tagline;
                selectedMovie.value.status = data.status;
                selectedMovie.value.original_language = data.original_language;
                selectedMovie.value.budget = data.budget;
                selectedMovie.value.revenue = data.revenue;

                cast.value = data.credits?.cast?.slice(0, 10) || [];
                keywords.value = data.keywords?.keywords || [];
                trailer.value = data.videos?.results?.find(video => video.type === 'Trailer')?.key || null;
                recommendations.value = data.recommendations?.results || [];

                isFavorite.value = data.account_states?.favorite
            }
        };

        // Toggle favorite status
        const toggleFavorite = async () => {
       
            const options = {
                method: 'POST',
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json',
                  Authorization: `Bearer ${API_KEY}`
                },
                body: JSON.stringify({media_type: 'movie', media_id: selectedMovie.value.id, favorite: !isFavorite.value})
              };
              
              fetch(`https://api.themoviedb.org/3/account/${account_id}/favorite?session_id=${session_id}`, options)
                .then(response => response.json())
                .then(response => console.log(response))
                .catch(err => console.error(err));
        };

        
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
            showMore,
            trailer,
            recommendations,
            getMovieDetails,
            toggleFavorite,
            goBack,
            irPelicula
        };
    }
}).mount('#app');
