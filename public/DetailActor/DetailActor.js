const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTU2OTBkZjg3ZGQ4YjQ1ZmQ0OGM2MjEzNzgzMjAxMiIsIm5iZiI6MTcyNzU3NTA0Mi4zMDg0NDYsInN1YiI6IjY2ZjJmNmRjMDIyMDhjNjdjODhkOWJjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AeGm_NWqjLKptJznk1e5rGNSPdNkaxJZB6EBkPYB_Mc";
        const selectedActor = ref({});
        const knownForMovies = ref([]);
        const actingRoles = ref([]);
        const userRating = ref(0);
        const recommendations = ref([]);
        const showMore = ref(false);
        const displayedRoles = ref(5);
        const crewByDepartment = ref({});
        const crewDisplayCount = ref({});

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

        const getActorDetails = async (actorId) => {
            const url = `https://api.themoviedb.org/3/person/${actorId}?append_to_response=movie_credits`;
            const data = await fetchData(url);
            
            if (data) {
                selectedActor.value = data;

                selectedActor.value.name = data.name;
                selectedActor.value.biography = data.biography || "No biography available.";
                selectedActor.value.known_for_department = data.known_for_department || "Not available";
                selectedActor.value.known_credits = data.movie_credits.cast.length || 0; 
                selectedActor.value.gender = data.gender === 1 ? "Female" : "Male";
                selectedActor.value.birthday = data.birthday || "N/A";
                selectedActor.value.place_of_birth = data.place_of_birth || "N/A";
                selectedActor.value.also_known_as = data.also_known_as || [];

                knownForMovies.value = data.movie_credits.cast.map(credit => ({
                    title: credit.title,
                    poster_path: credit.poster_path,
                    id: credit.id
                }));

                actingRoles.value = data.movie_credits.cast.map(credit => ({
                    title: credit.title,
                    character: credit.character,
                    release_date: credit.release_date,
                    episode_count: credit.episode_count || "N/A" // For TV shows
                }));

                // Obtén créditos del crew
                const crewCredits = data.movie_credits.crew.map(credit => ({
                    title: credit.title,
                    release_date: credit.release_date,
                    department: credit.department,
                    job: credit.job
                }));

                // Agrupar los créditos del crew por departamento
                crewCredits.forEach(credit => {
                    if (!crewByDepartment.value[credit.department]) {
                        crewByDepartment.value[credit.department] = [];
                        crewDisplayCount.value[credit.department] = 5; // Inicializa la cantidad a mostrar
                    }
                    crewByDepartment.value[credit.department].push(credit);
                });

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
            window.location.href = `../DetailPelicula/DetailPelicula.html?id=${movie.id}`;
        };

        const cerrarSesion = () => {
            sessionStorage.removeItem('Usuario');
            sessionStorage.removeItem('session_id');
            sessionStorage.removeItem('account_id');
            window.location.href = '../login.html';
        };

        return {
            selectedActor,
            knownForMovies,
            actingRoles,
            userRating,
            recommendations,
            showMore,
            displayedRoles,
            crewByDepartment,
            crewDisplayCount,
            fetchData,
            getActorDetails,
            irPelicula,
            cerrarSesion
        };
    }
}).mount('#app');
