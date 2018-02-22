
const request = require("request");
const cheerio = require("cheerio");
module.exports = GandhiScraper;

function GandhiScraper() {
    //https://isbndb.com/search/books/encoded(query)
    const url = "https://busqueda.gandhi.com.mx/busca?q=";
    const maxResults = 20;

    var cleanSrc = function(src) {
        return "http:" + src; //Haha this is not going to stay this way. Just in the meantime
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
                    console.log('FAIL');
                    reject(err);
                } else {
                    var books = [];
                    var dom = cheerio.load(body);
                    dom('ul#neemu-products-container').each(function(i, e) {
                        var productList = dom(e);
                        productList.find('li.item').each(function(i, e){
                            var book = {
                                lang: 'n/a'
                            };
                            var bookrow = dom(e);
                            var imgSrc = bookrow.find('a.product-image > img').first().attr('src');
                            var title = bookrow.find('h2.product-name > a').first().text();
                            var authors = [];
                            bookrow.find('h3 > a').each(function(i, e){
                                var a = dom(e);
                                authors.push(trim(a.text()));
                            });
                            book.title = title;
                            book.authors = authors;
                            book.icon = cleanSrc(imgSrc);
                            book.thumbnail = cleanSrc(imgSrc);
                            books.push(book);
                        });
                        console.log(i);
                    });
                    console.log(books);
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