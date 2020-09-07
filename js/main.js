$(document).ready(function(){
    
    $('.search-movie_btn').click(function () {
        var newSearch = $('.search-movie_input').val();
        reset();
        init(newSearch);
       
    });

    $(document).keyup(function (event) {
        var newSearch = $('.search-movie_input').val();
        if (event.which == 13 || event.keyCode == 13) {
            reset();
            init(newSearch);      
        }
    });
});

function printFilmTv(data,url,tipo) {
    
    $.ajax(
        {
            url: url,
            method: "GET",
            data: {
                api_key: '446128a52aa8b6fbb4623283f5c34042',
                query: data,
                language: 'it-IT'
            },
            success: function (risposta) {
                if(risposta.total_results > 0){
                    printResult(risposta,tipo);
                }else{
                    noResult(tipo);
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
          if (tipo == 'Film'){
              $('.movie-list-film').append(html);
          } else{
              $('.movie-list-tv').append(html);
          }  
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
    $('.movie-list-film').empty();
    $('.movie-list-tv').empty();
    $('.search-movie_input').val('');
}

function noResult (tipo){
    var source = $('#no-result-template').html();
    var template = Handlebars.compile(source);
    var context = {
        noResult: 'Non ci sono risultati nella sezione' + ' '+ tipo
    };
    var html = template(context);
    if (tipo == 'Film') {
        $('.movie-list-film').append(html);
    } else {
        $('.movie-list-tv').append(html);
    }  
}
 
function init(data){
    var url1 = 'https://api.themoviedb.org/3/search/movie';
    var url2 = 'https://api.themoviedb.org/3/search/tv';
    printFilmTv(data, url1, 'Film');
    printFilmTv(data, url2, 'Tv');
}