module.exports = UrlUtils;

function UrlUtils() {
    
    var compose = function(base, pairs){
        var params = flatten(pairs);
        if(params.length == 0) {
            return base;
        } else {
            return base + '?' + params.join('&');
        }
    };

    var flatten = function(pairs) {
        return Object.keys(pairs).reduce(function(acc, key){
            //encode and do stuff
            return acc.concat([encodeURI(key) + "=" + encodeURI(pairs[key])]);
        }, []);
    };
    return {
        composeUrl: compose
    };
};