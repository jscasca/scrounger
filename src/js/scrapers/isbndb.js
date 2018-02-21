
const request = require("request");
const cheerio = require("cheerio");
module.exports = IsbndbScraper;

function IsbndbScraper() {
    //https://isbndb.com/search/books/encoded(query)
    const url = "https://isbndb.com/search/books/";
    const maxResults = 20;

    var getBookCover = function(element) {
        return element.children().first().attr('data');
    };

    var trim = function(string) {
        return string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };

    var getSearchResults = function(queryString) {
        //should return a promise
        return new Promise(function(resolve, reject){
            //
            request.get({
                url: url + encodeURI(queryString),
                headers: {
                    'User-Agent': 'request'
                }
            }, function(err, resp, body) {
                if(err) {
                    reject(err);
                } else {
                    //Prepare an array of books
                    var books = [];
                    var dom = cheerio.load(body);
                    dom('.book-row').each(function(i, e) {
                        var book = {
                            lang: 'en'
                        };
                        var bookrow = dom(e);
                        bookrow.children().each(function(i, e){
                            var innerdiv = dom(e);
                            if(innerdiv.hasClass('book-cover')) {
                                var cover = innerdiv.children().first().attr('data');
                                book.icon = cover;
                                book.thumbnail = cover;
                            } else if(innerdiv.hasClass('search-buy-button')) {
                                //
                            } else {
                                var title = trim(innerdiv.find('h2').text());
                                book.title = title;
                                innerdiv.find('dt').each(function(i, e){
                                    var dt = dom(e);
                                    if(dt.text().indexOf('Authors') > -1) {
                                        var authors = [];
                                        dt.find('a').each(function(i,e) {
                                            var a = dom(e);
                                            authors.push(a.text());
                                        });
                                        book.authors = authors;
                                    }
                                });
                            }
                        });
                        books.push(book);
                    });
                    resolve(books);
                }
            });
        });
    };

    return {
        getSearchResults: getSearchResults
    }
};

/*
$gQuery = "https://www.googleapis.com/books/v1/volumes?q=".urlencode($query)."&maxResults=".$limit;
$gCall = file_get_contents($gQuery);
$gItems = json_decode($gCall, true);
$gResults = array();
if(isset($gItems['items'])) {
	foreach($gItems['items'] as $result) {
		//$book['author'] = isset($result['volumeInfo']['authors'][0])?$result['volumeInfo']['authors'][0]:'';
		$book['authors'] = isset($result['volumeInfo']['authors'])?$result['volumeInfo']['authors']:array();
		$book['title'] = isset($result['volumeInfo']['title'])?$result['volumeInfo']['title']:'';
		$book['lang'] = isset($result['volumeInfo']['language'])?$result['volumeInfo']['language']:'';
		$book['icon'] = isset($result['volumeInfo']['imageLinks']['thumbnail'])?$result['volumeInfo']['imageLinks']['thumbnail']:'';
		$book['thumbnail'] = isset($result['volumeInfo']['imageLinks']['smallThumbnail'])?$result['volumeInfo']['imageLinks']['smallThumbnail']:'';
		$book['q'] = $gQuery;
		
		$gResults[] = $book;
	}
}
*/