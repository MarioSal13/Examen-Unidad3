const { createApp, ref, onMounted } = Vue;

const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTU2OTBkZjg3ZGQ4YjQ1ZmQ0OGM2MjEzNzgzMjAxMiIsIm5iZiI6MTcyNzU3NTA0Mi4zMDg0NDYsInN1YiI6IjY2ZjJmNmRjMDIyMDhjNjdjODhkOWJjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AeGm_NWqjLKptJznk1e5rGNSPdNkaxJZB6EBkPYB_Mc";
const urlParams = new URLSearchParams(window.location.search);
const keywordId = urlParams.get('id');

console.log('URL completa:', window.location.href);
console.log('Parámetros de URL:', window.location.search);
console.log('ID extraído:', keywordId);

const language = 'es-MX';

createApp({
    setup() {
        const movies = ref([]);
        const type = ref("movie");
        const sortBy = ref("popularity.desc");
        const keywordName = ref("");


        const fetchKeywordName = async () => {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${API_KEY}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            const url = `https://api.themoviedb.org/3/keyword/${keywordId}?language=${language}`;

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    keywordName.value = result.name;
                    console.log("Nombre del keyword:", result.name);
                })
                .catch((error) => console.error('Error obteniendo el nombre del keyword:', error));
        };

        const fetchResults = async () => {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${API_KEY}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            const url = `https://api.themoviedb.org/3/discover/${type.value}?include_null_first_air_dates=false&language=${language}&page=1&sort_by=${sortBy.value}&with_keywords=${keywordId}`;

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    movies.value = result.results;
                    console.log(result);
                })
                .catch((error) => console.error('Error:', error));
        };

        const showDetails = (movie) => {
            window.location.href = `../DetailSerie/DetailSerie.html?id=${movie.id}`;

        };


        onMounted(() => {
            fetchKeywordName();
            fetchResults();
        });

        return {
            movies,
            type,
            sortBy,
            keywordName,
            fetchResults,
            showDetails
        };
    },
}).mount('#app');
