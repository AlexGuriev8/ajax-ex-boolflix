$(document).ready(function(){

    
    $('.search-movie_btn').click(function () {
        var newSearch = $('.search-movie_input').val();
        reset();
        printMovie(newSearch);
       
    });

    $(document).keyup(function (event) {
        var newSearch = $('.search-movie_input').val();
        if (event.which == 13 || event.keyCode == 13) {
           reset();
           printMovie(newSearch);
          
        }
     
    });

   
});

function printMovie(data) {
    
    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/search/movie',
            method: "GET",
            data: {
                api_key: '446128a52aa8b6fbb4623283f5c34042',
                query: data,
                language: 'it-IT'

            },
            success: function (risposta) {
                if(risposta.total_results > 0){
                    printFilm(risposta);
                }else{
                    noResult();
                }
                
            },
            error: function () {
                alert("E' avvenuto un errore. ");
            }
        }
    );
}

  function printFilm(data){
      var source = $('#movie-template').html();
      var template = Handlebars.compile(source);

      for (var i = 0; i < data.results.length; i++) {
          var movieInfo = data.results[i];

          var movieToPrint = {
              movieTitle: movieInfo.title,
              movieOriginalTitle: movieInfo.original_title,
              movieOriginalLanguage: movieInfo.original_language,
              movieVote: movieInfo.vote_average
          };
          var html = template(movieToPrint);
          $('.movie-list').append(html);
      }
  }

function reset(){
    $('.movie-list').empty();
    $('.search-movie_input').val('');
}


function noResult (){
    var source = $('#no-result-template').html();
    var template = Handlebars.compile(source);
    var context = {
        noResult: 'Non ci sono risultati'
    };
    var html = template(context);
    $('.movie-list').append(html);
}
 