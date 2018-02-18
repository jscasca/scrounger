
function UrlUtils() {
    var makeUrl = function(base, params){
        if(params.length == 0) {
            return base;
        } else {
            return base + '?' + params.join('&');
        }
    };
    return {};
}