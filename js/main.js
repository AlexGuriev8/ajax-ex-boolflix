$(document).ready(function(){

    var source = $('#movie-template').html();
    var template = Handlebars.compile(source);
    $('.search-movie_btn').click(function () {
        printMovie();
    });

    $(document).keyup(function (event) {
        if (event.which == 13 || event.keyCode == 13) {
           printMovie();
        }
     
    });

    function printMovie() {
        $('.movie-list').text('');
        var newSearch = $('.search-movie_input').val();
        $.ajax(
            {
                url: 'https://api.themoviedb.org/3/search/movie',
                method: "GET",
                data: {
                    api_key: '446128a52aa8b6fbb4623283f5c34042',
                    query: newSearch,
                    language: 'it-IT'

                },
                success: function (risposta) {
                    var movies = risposta.results;
                    for (var i = 0; i < movies.length; i++) {
                        var movieInfo = movies[i];

                        var movieToPrint = {
                            movieTitle: movieInfo.title,
                            movieOriginalTitle: movieInfo.original_title,
                            movieOriginalLanguage: movieInfo.original_language,
                            movieVote: movieInfo.vote_average
                        }
                        var html = template(movieToPrint);
                        $('.movie-list').append(html);
                    }
                    $('.search-movie_input').val('');
                },
                error: function () {
                    alert("E' avvenuto un errore. ");
                }
            }
        );
    }
});

  


 