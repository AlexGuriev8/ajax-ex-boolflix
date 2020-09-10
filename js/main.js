$(document).ready(function(){
    
    trendMoviesHomePage('Tv');

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

    $('.home').click(function () {
        reset();
        trendMoviesHomePage('Tv');
    });
 
});




function trendMoviesHomePage(data) {
    PopularThisWeek = "https://api.themoviedb.org/3/trending/all/week";
    
    var titolo = "";
    printFilmTv(titolo, PopularThisWeek,data);
}

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
              movieVote: stars(movieInfo.vote_average),
              poster: insertPoster(movieInfo.poster_path,title),
              overview: insertOverview(movieInfo.overview)
          };
          var html = template(movieToPrint);
          if (tipo == 'Film'){
              $('.movie-list-film').append(html);
          } else{
              $('.movie-list-tv').append(html);
          }  
      }
  }

function insertOverview(stringa) {
    var shortText = "";
    if (stringa.length != 0) {
        for (var i = 0; i < stringa.length; i++) {
            if (stringa[i] == " " && i < 250) {
                var shortText = $.trim(stringa).substring(0, i) + "...";
            }
        }
    } else {
        shortText = "Trama Non Disponibile";
    }
    return shortText;
}

  function insertPoster(poster,titolo){
      var urlBase = 'https://image.tmdb.org/t/p/w185';
      var percorso = urlBase + poster;
      if(poster==null){
          var poster_image = '<img class= "cover-img cover-film" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALEAAAEcCAMAAAC/AqVzAAAAOVBMVEXc3d2foKDf4OCcnZ2am5vU1dXX2NirrKy2t7eoqamwsbG8vb3a29vCw8Oqq6ulpqbMzc2/wMDOz8/p8WOVAAAJZElEQVR4nO2ci5KsKAyGuSgioqjv/7ALSbhoe073qaV3p3bzV820RtRPOlxaAkKwWCwWi8VisVgsFovFYrFYLBaLxWKxWCwWi8VisVgsFovFYrFYLBaLxXqUUupj678vpcy+rutuLnxo3U9RrOoi8Rtru3dP34FXLGHQSUNYfAVZyaqnHY1qcSRrl2MfyWovVpOs6iCTas7qhqxOqWWW1itxjK119mCbdE4Fz7cBs9qu1smkpx3QkrYDHNe2G/FYyZKGQ71adfBALK/SIxDfjDJiGjxdn3GTzHsv4PsNZcoXIcLNCN/vnVgG9XSBWQk142b8xk56dt+LOGdmydN0F7XqO8bZEuejKeNeiOUQC+uCrrCofKlubpwvGDNxpy1bsijR28aaiWeXiZN1e7EuJWcnRRfI5aMD8ZI9TnmZ2YXIGT/m55BzJY6c5KeRqBBHzvx9pSsQvcr+YToBi5KHY7lJpMhA0hTiIFpiFaq1EmdrejqHWetFMfUmPgvxpmpN8Uvi+YlYNM+B3qbPMTt0d+LoZ1Shhlq+G+JY1v+EWBiskfdd5wzpRbyUPFQnKvrH3yROLoAp9HLo/Ay9iGs9dtam/4nYXIhlYWv9mKyTKllhLZ3RD7kUMjk4k6/7lritCSvxWq35GlNA5+jZD5oKstaH+oRYliZk2FXbghQrXLhphHQ/XnHtQegNs/ktMaYe3EMrrckFqH4DTV172ZcWWUdv/pQ4LCf23Z6sl+uW764XctvdRJf7LI/n9YFYbrk9bkrI2BU4delti/yL2q0h1kPpjDTEsS5HPur0qNL/C/1/eqkz1K/QPrcgbV0hjtru1LpCUN2OJa9W9R0bvAa5zeb4AG/r48eekGiyXtRvqmODBzIgr/bqFh8Q59btsc3bKE9LFvRU/EWGWktfMZa998RvW2lRHbmvG5fWa1WKeuRx832/YvsRxLlzf3xA/Lbv9jVi0RCvhfjv94+/SHw+EefKX/9E4rFgFq9YVfM7L7e1m/opxOW3khhpK1afhWItxXH5McSlizWUJsTXXowe8mOMP8YraossC0/6zaMfjD+EWB3DhQ1esQnT9uekniHlDyGOLtC8wtIO348ps7VGtE34axuIcQuIi1WEYkVi2u3eEVL+oGtLe9b3x7sjo8t99MOiUmuDW0s0L8UqGmtKn3e/0XVTftz3c7y+SFdiPC/G5kV88+L92dqm7w/MYrFYLBaLxWKxWCwWi8VisVgsFov1mZoBDdwXKUREvaSJppfhD3Ef7lDKGyNUc1L/kZBzm6bNCD/FjxTKbWwYBjlfQr7UmhIt8AHJUuq4kYIK0TbRENq+yWEILs0KGOcJU3ULlyal4X29Kq8xKOmkmCocdszEaZhdO3XkiG2K0p1UHSeG2QEWxzN1mkEwDnVwsjuxdBDjnaLd8CZ5aPeZeMlRDK4JbRrztAp45GGvcTxfIdaCiGEQPaxwpxpKfiWOoDWgP0fEpqeFgV1tLeYBfQ966BkaW4l3gXdNd4uZAreuYV834pAjrSOxh0eknIRLGUANRDzGYtwXmIjdlXjGp/gFsc5xF45C2B2GufmGWFK0SW/cTCw1eYVriesA743YhEIMpycnmWnKQCJOIuJusxReiFcilpV4fSaeY7r4rQcgRhNEaYhMbGDqFRGL/gPTudiHT4ldLFwUvu1wisqWUGNBJWJqNkrJ6zan6UosP81jHbdDhCbiCQrBkAoqBnHpcQHVGUj/OjHUbPogYqwmsBUiYt368beIwx8QU3WIxAJZgyyzhzR5w3eJg/0D4hMr61CaiXjaBDvkx3tL/K2SRxXGR8RmKxWcwxhPB04dMrFoib9Vu/mSx2/rY23SUwWPxDSBCU7PdYX/J4iFI+L3bZ42aScoJM6x5+DA/oHY9+8fIzFWADui2d/1K7RJaScibqZ9xLOx5GFWE/Gxrus3iL0hYnRoDMaraa7EMQ09lMMvA2No9YFBfGFu8zgFoH2FGHN1V3Xa0LA+94+hpxPpkBhOw7mS8SnO3Ilva7eeU8eQOM3k9moZqD2dIOhUD20/HI4m4pTIiCGmhJDBycM08JjHA0QPxoKYYGcbU8TfIBRu2DuPR/S09HHADOjTzvO0jJfycq5pnr2CDy9iSiPA4g+0GPiMffpxmefFp12Bx9b+fvzyW1o8/f69JCoRhDXtZZ5/k4KjClksFovFYrFYLBaLxfpP6Z/5oa8srq4QaEunF0BJqiy8AEvh4QoMc/rAQfadjo5phSa6xpTefCnY3puVG/qO3ZQpunnZAoMDokG1i2blF8pTeRNexvb2y5orlsZ94aQy77ovcchvf3FYNn7Cu2RX14fY1RNxs6SWqa+905T2LxOXSf678vRGFkYN6upnMIX+lbhOnybiZaLzbsQhhK7EYx4JP3CKNg4cAZakI+6JGBKnv7IgHIxHx8Q34rl3eQTntfAOG3kORVltIAdxxPmV2OejoY7uavSmK3H3WfTpqiH927CoaSsGdOczD97pJ+IUoYJHc8kD4rwy2ReJ09v3+YS8wjs4dGcPexoy2jwQA+yIz4bEZ7pUrAHvxOPYdX0eqBAceCCtCLLhaAAuwREElf87MdJ4HH6nukLj0lP3kqf10DXIYk7l29NIePKHAIOKtPDkpBDxlRiHyOBsVevjbX+sj7sSA4IgLrjDSu64wccsy/oPF2IHz4PBK3nVVfnkFWm0qSexwXFlHMHHdSkWHOlSWLs6zPAXYhw7x6oEif1ObeWN2FrXkxgqhBGjJBSOJ9qmclvp238teViFQ1N9qd1ikb3XFV3r43ZBukDr3Wyyttnkh68lzzRHTYkPgo/v1m7tuLL0dYmmdrkm4L8TN+u36NP/Po/7EoMfYODjJV9z3wz/7Tdi1Y7569XXVrrmcU40d14TG1zA2k3WvpDE22BkoIWAi6MllrNzKzzPhEctnrZi/ADmsZyc2/GxnHM94yADuinUaGtZ5FM76mScGKRiL8SSIh3zIzpRMzw1Pfkia3Ys3W8Vb1y0OrfI1BeSsvQ1iTj2Oe7EE+5jm+Mbp16+THzCaHckTkPkyRVo2fRYuNLWEInTEanSyunwqwmPWwkD7wpH0uuYubTR02hnWFeyDx2J/ZhUP82IilU+WeiTrHR4NNdUxQzR3XnP+2pnsVgsFovFYrFYLBaLxWKxWCwWi8VisVgsFovFYrFYLBaLxWKxWCwWi8VisVgs1v9TfwFJA2zZIxclUwAAAABJRU5ErkJggg==" class= "poster" alt = "' + titolo +'">';
      }else {
          var poster_image = '<img src="' + percorso + '" class= "cover-img" alt = "'+titolo+'">';
      } 
      return poster_image;
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