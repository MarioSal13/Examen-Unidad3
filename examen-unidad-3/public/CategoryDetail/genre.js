const { createApp, ref, watch, onMounted } = Vue;

const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTU2OTBkZjg3ZGQ4YjQ1ZmQ0OGM2MjEzNzgzMjAxMiIsIm5iZiI6MTcyNzU3NTA0Mi4zMDg0NDYsInN1YiI6IjY2ZjJmNmRjMDIyMDhjNjdjODhkOWJjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AeGm_NWqjLKptJznk1e5rGNSPdNkaxJZB6EBkPYB_Mc";
const urlParams = new URLSearchParams(window.location.search);
const generId = urlParams.get('id');

const language = 'en-US';

createApp({
    setup() {
        const movies = ref([]);
        const type = ref("movie");
        const sortBy = ref("popularity.desc");
        const genreName = ref("");
        const currentPage = ref(1);  
        const totalPages = ref(1); 
        const totalResults= ref(' ');


        const resetPage = () => {
            currentPage.value = 1;
            movies.value = [];  
            fetchResults();  
        };

        watch([type, sortBy], resetPage);

        const fetchGenreName = async () => {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${API_KEY}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            const url = `https://api.themoviedb.org/3/genre/${generId}?language=${language}`;

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    genreName.value = result.name;
                    console.log("Nombre del genre:", result.name);
                })
                .catch((error) => console.error('Error obteniendo el nombre del genre:', error));
        };

        const fetchResults = async () => {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${API_KEY}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            const url = `https://api.themoviedb.org/3/discover/${type.value}?include_null_first_air_dates=false&language=${language}&page=${currentPage.value}&sort_by=${sortBy.value}&with_genres=${generId}`;

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    movies.value = [...movies.value, ...result.results]; 
                    totalResults.value=result.total_results;
                    totalPages.value = result.total_pages;  
                    console.log(result);
                })
                .catch((error) => console.error('Error:', error));
        };

        const showDetails = (result) => {
            if(type.value=='tv'){
                window.location.href = `../DetailSerie/DetailSerie.html?id=${result.id}`;
            }else if (type.value== 'movie'){
                window.location.href = `../DetailPelicula/DetailPelicula.html?id=${result.id}`;
            }
        };

        const loadMoreResults = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value += 1;
                fetchResults();
            }
        };

        onMounted(() => {
            fetchGenreName();
            fetchResults();
        });

        return {
            movies,
            type,
            sortBy,
            genreName,
            fetchResults,
            showDetails,
            loadMoreResults,
            currentPage,
            totalPages,
            totalResults
        };
    },
}).mount('#app');
