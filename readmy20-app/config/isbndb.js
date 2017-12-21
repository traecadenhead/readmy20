const key = "439TPE8L";

export default class isbndb {
    
        static get = (isbn) => {
            return new Promise(function(resolve, reject){
                const url = `http://isbndb.com/api/v2/json/${key}/book/${isbn}`;
                fetch(url, {
                    method: 'GET',
                    headers: { 
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(response => response.json())
                .then(responseJson => { 
                    if(responseJson != undefined && responseJson != null && responseJson.error == null){
                        isbndb.parseBooksResponse(responseJson).then(function(books){
                            resolve(books);
                        }, function(err){
                            reject(err);
                        });
                    }
                    else{
                        resolve([]);
                    }
                })
                .catch(err => {
                    reject(err);
                });
            });
        };
    
        static search = (query) => {
            return new Promise(function(resolve, reject){
                fetch(`http://isbndb.com/api/v2/json/${key}/books?q=${query}`, {
                    method: 'GET',
                    headers: { 
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(response => response.json())
                .then(responseJson => { 
                    if(responseJson != undefined && responseJson != null && responseJson.error == null){
                        isbndb.parseBooksResponse(responseJson).then(function(books){
                            resolve(books);
                        }, function(err){
                            reject(err);
                        });
                    }
                    else{
                        resolve([]);
                    }
                })
                .catch(err => {
                    reject(err);
                });
            });
        };

        static parseBooksResponse = (responseJson) => {
            return new Promise(function(resolve, reject){
                try{
                    let books = [];
                    let matches = [];
                    for(const item of responseJson.data){
                        // filters out invalid books
                        if(item.summary != null && item.summary != '' && item.author_data.length > 0 && item.edition_info != null && item.edition_info != ''){
                            let author = "";
                            for(const auth of item.author_data){
                                if(author.length > 0){
                                    author += ", ";
                                }
                                author += auth.name;
                            }
                            const matchID = item.title + author;
                            if(matches.indexOf(matchID) < 0){
                                let isbn = item.isbn13;
                                if(isbn == null || isbn == ''){
                                    isbn = item.isbn10;
                                }
                                
                                const book = {
                                    isbn,
                                    title: item.title,
                                    author,
                                    title_full: item.title_long,
                                    edition: item.edition_info,
                                    publisher: item.publisher_name,
                                    imageUrl: `http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
                                    summary: item.summary
                                };
                                books.push(book);
                                matches.push(matchID);
                            }
                        }
                    }
                    resolve(books);
                }
                catch(e){
                    console.error(e);
                    reject(e);
                }
            });
        };
    }