$(document).ready(function(){

    
    $('.search-movie_btn').click(function () {
        var newSearch = $('.search-movie_input').val();
        reset();
        printFilm(newSearch);
        printTv(newSearch);
       
    });

    $(document).keyup(function (event) {
        var newSearch = $('.search-movie_input').val();
        if (event.which == 13 || event.keyCode == 13) {
           reset();
           printFilm(newSearch);
           printTv(newSearch);      
        }
     
    });

   
});

function printFilm(data) {
    
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
                    printResult(risposta,'Film');
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
function printTv(data) {
    
    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/search/tv',
            method: "GET",
            data: {
                api_key: '446128a52aa8b6fbb4623283f5c34042',
                query: data,
                language: 'it-IT'

            },
            success: function (risposta) {
                if(risposta.total_results > 0){
                    printResult(risposta,'Tv');
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

  function printResult(data,tipo){
      var source = $('#movie-template').html();
      var template = Handlebars.compile(source);
      
      for (var i = 0; i < data.results.length; i++) {
          var movieInfo = data.results[i];
          if (tipo == 'Film') {
              var title = movieInfo.title;
              var originalTitle=  movieInfo.original_title;
          }else if (tipo == 'Tv'){
              var title = movieInfo.name;
              var originalTitle = movieInfo.original_name;
          }

          var movieToPrint = {
              tipo: tipo,
              movieTitle: title,
              movieOriginalTitle: originalTitle,
              movieOriginalLanguage: flag(movieInfo.original_language),
              movieVote: stars(movieInfo.vote_average)
          };
          var html = template(movieToPrint);
          $('.movie-list').append(html);
      }
  }

  function flag(lingua){
    var language = ['en', 'it','de','es','ja','fr'];
    if(language.includes(lingua)){
        return '<img src="img/'+ lingua+ '.png">';
    }
    return lingua;
  }


  function stars(num){
    var resto = num%2;
    num = Math.floor(num/2);
    var star = '';
    for (var i = 0; i < 5; i++) {
        if(i < num){
            star += '<i class="fa fa-star"></i>';
        }else if(resto != 0){
            star += '<i class="fa fa-star-half-o" ></i>'
            resto = 0;
        }
        else {
            star += '<i class="fa fa-star-o"></i>'
        }   
        
    }
    return star;
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
 