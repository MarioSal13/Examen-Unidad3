const { createApp, ref, onMounted } = Vue;

const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNTU2OTBkZjg3ZGQ4YjQ1ZmQ0OGM2MjEzNzgzMjAxMiIsIm5iZiI6MTcyNzU3NTA0Mi4zMDg0NDYsInN1YiI6IjY2ZjJmNmRjMDIyMDhjNjdjODhkOWJjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AeGm_NWqjLKptJznk1e5rGNSPdNkaxJZB6EBkPYB_Mc";

createApp({
    setup() {
        const movies = ref([]);
        const moviesPopulares = ref([]);
        const moviesMejorPunt = ref([]);
        const moviesProxima = ref ([]);

        const serie = ref([]);
        const seriesAireHoy = ref ([]);
        const seriesAire = ref ([]);
        const seriesPopular = ref ([]);
        const seriesMejorRaqueda = ref ([]);
        const imagenBaner = ref ([]);

        const estado = ref(0);

        onMounted(() => {
            checkSession();
            fetchMovies();
            fetchMoviesPopulares();
            fetchMoviesMejorPunt();
            fetchMoviesProximas();
            fetchSerie();
            fetchSerieAireHoy();
            fetchSerieAire();
            fetchSeriePopular();
            fetchSerieRaqued();
            obtenerImagenBaner()
        });

        const checkSession = () => {
            const session = sessionStorage.getItem('Usuario');
            if (!session) {
                window.location.href = 'login.html';
            }
        };
        
        const cerrarSesion = () => {
            sessionStorage.removeItem('Usuario');
            window.location.href = 'login.html';
        };

        const fetchMovies = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_KEY}`);

                const requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const response = await fetch("https://api.themoviedb.org/3/trending/movie/day", requestOptions);
                const data = await response.json();
                movies.value = data.results.map(movie => ({
                    ...movie,
                    userRating: null
                }));
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchMoviesPopulares = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_KEY}`);
                const requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const response = await fetch("https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1", requestOptions);
                const data = await response.json();
                moviesPopulares.value = data.results.map(movie => ({
                    ...movie,
                    userRating: null
                }));
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchMoviesMejorPunt = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_KEY}`);
                const requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const response = await fetch("https://api.themoviedb.org/3/movie/top_rated", requestOptions);
                const data = await response.json();
                moviesMejorPunt.value = data.results.map(movie => ({
                    ...movie,
                    userRating: null
                }));
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchMoviesProximas = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_KEY}`);
                const requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const response = await fetch("https://api.themoviedb.org/3/movie/upcoming", requestOptions);
                const data = await response.json();
                moviesProxima.value = data.results.map(movie => ({
                    ...movie,
                    userRating: null
                }));
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchSerie = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_KEY}`);

                const requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const response = await fetch("https://api.themoviedb.org/3/trending/tv/day", requestOptions);
                const data = await response.json();
                serie.value = data.results.map(movie => ({
                    ...movie,
                    userRating: null
                }));
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchSerieAireHoy = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_KEY}`);

                const requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const response = await fetch("https://api.themoviedb.org/3/tv/airing_today", requestOptions);
                const data = await response.json();
                seriesAireHoy.value = data.results.map(movie => ({
                    ...movie,
                    userRating: null
                }));
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchSerieAire = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_KEY}`);

                const requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const response = await fetch("https://api.themoviedb.org/3/tv/on_the_air", requestOptions);
                const data = await response.json();
                seriesAire.value = data.results.map(movie => ({
                    ...movie,
                    userRating: null
                }));
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchSeriePopular = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_KEY}`);

                const requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const response = await fetch("https://api.themoviedb.org/3/tv/popular", requestOptions);
                const data = await response.json();
                seriesPopular.value = data.results.map(movie => ({
                    ...movie,
                    userRating: null
                }));
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchSerieRaqued = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_KEY}`);

                const requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const response = await fetch("https://api.themoviedb.org/3/tv/top_rated", requestOptions);
                const data = await response.json();
                seriesMejorRaqueda.value = data.results.map(movie => ({
                    ...movie,
                    userRating: null
                }));
            } catch (error) {
                console.error(error.message);
            }
        };

        const irSerie = (movie) =>{
            window.location.href = `DetailSerie/DetailSerie.html?id=${movie.id}`;
        }

        const irPelicula = (movie) =>{
            window.location.href = `detailPelicula/detailPelicula.html?id=${movie.id}`;
        }

        const obtenerImagenBaner = async () =>{
            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_KEY}`);

                const requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                const response = await fetch("https://api.themoviedb.org/3/trending/all/day",requestOptions);
                const data = await response.json();

                const randomIndex = Math.floor(Math.random() * data.results.length);
                imagenBaner.value = data.results[randomIndex];

            } catch (error) {
                console.error(error.message);
            }
        };

        return {
            movies,
            moviesPopulares,
            moviesMejorPunt,
            moviesProxima,
            serie,
            seriesAireHoy,
            seriesAire,
            seriesPopular,
            seriesMejorRaqueda,
            estado,
            irSerie,
            irPelicula,
            imagenBaner,
            cerrarSesion 
        };
    },

}).mount('#app');
