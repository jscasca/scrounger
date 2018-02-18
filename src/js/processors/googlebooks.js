
const request = require("request");
module.exports = GoogleBooks;

function GoogleBooks() {
    //url = "https://www.googleapis.com/books/v1/volumes?q=".urlencode($query)."&maxResults=".$limit
    const url = "https://www.googleapis.com/books/v1/volumes";
    const maxResults = 20;

    var getSearchResults = function(queryString) {
        //should return a promise
        return new Promise(function(resolve, reject){
            //
            request.get({
                url: '',
                headers: {
                    'User-Agent': 'request'
                }
            }, function(err, resp, body) {
                if(err) {
                    reject(err);
                } else {
                    //Prepare an array of books
                    var books = [];
                    var data = JSON.parse(body);
                    console.log(data);
                    if(data.items !== undefined) {
                        //
                        data.items.forEach(function(item) {
                            var result =  item.volumeInfo;
                            if(result.title !== undefined) {
                                books.push({
                                    author: result.authors !== undefined ? result.authors : [],
                                    title: result.title,
                                    lang: result.language !== undefined ? result.language : 'en',
                                    icon: result.imageLinks.thumbnail,
                                    thumbnail: result.imageLinks.smallThumbnail
                                });
                            }
                        });
                    }
                    console.log(books);
                    resolve(books);
                }
            });
        });
    };

    return {
        a: console.log("logging"),
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