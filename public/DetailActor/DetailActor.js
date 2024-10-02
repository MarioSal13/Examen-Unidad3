const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTU2OTBkZjg3ZGQ4YjQ1ZmQ0OGM2MjEzNzgzMjAxMiIsIm5iZiI6MTcyNzU3NTA0Mi4zMDg0NDYsInN1YiI6IjY2ZjJmNmRjMDIyMDhjNjdjODhkOWJjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AeGm_NWqjLKptJznk1e5rGNSPdNkaxJZB6EBkPYB_Mc";
        const selectedActor = ref({});
        const knownForMovies = ref({});
        const actingRoles = ref({});
        const userRating = ref(0);
        const session_id = sessionStorage.getItem('session_id');
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

        // Get actor details
        const getActorDetails = async (actorId) => {
            const url = `https://api.themoviedb.org/3/person/${actorId}?append_to_response=movie_credits`;
            const data = await fetchData(url);
            
            if (data) {
                selectedActor.value = data;

                // Populate actor details
                selectedActor.value.name = data.name;
                selectedActor.value.biography = data.biography || "No biography available.";
                selectedActor.value.known_for_department = data.known_for_department || "Not available";
                selectedActor.value.known_credits = data.movie_credits.cast.length || 0; // Number of acting credits
                selectedActor.value.gender = data.gender === 1 ? "Female" : "Male";
                selectedActor.value.birthday = data.birthday || "N/A";
                selectedActor.value.place_of_birth = data.place_of_birth || "N/A";
                selectedActor.value.also_known_as = data.also_known_as.length > 0 ? data.also_known_as.join(', ') : "N/A";

                // Acting roles (movies known for)
                knownForMovies.value = data.movie_credits.cast.map(credit => ({
                    title: credit.title,
                    character: credit.character,
                    credit_id: credit.credit_id
                }));

                // You can adjust the number of acting roles you want to display
                actingRoles.value = data.movie_credits.cast.map(credit => ({
                    title: credit.title,
                    character: credit.character,
                    episode_count: credit.episode_count || "N/A" // For TV shows
                }));
            }
        };

        const goKeyword = (keyword) => {
            window.location.href = `../KeywordDetail/keyword.html?id=${keyword.id}`;
        };

        const goGenre = (genre) => {
            window.location.href = `../CategoryDetail/genre.html?id=${genre.id}`;
        };

        // On component mount
        onMounted(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const movieId = urlParams.get('id');
            if (movieId) {
                getActorDetails(movieId);
            } else {
                console.error('No actor ID found in URL');
            }
        });

        const irPelicula = (movie) => {
            window.location.href = `DetailPelicula.html?id=${movie.id}`;
        };

        return {
            selectedActor,
            userRating,
            cast,
            keywords,
            showMore,
            trailer,
            recommendations,
            getActorDetails,
            goKeyword,
            goGenre,
            irPelicula
        };
    }
}).mount('#app');
