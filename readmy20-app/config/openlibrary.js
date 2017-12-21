export default class openlibrary {

    static get = (identifier, type = "ISBN") => {
        return new Promise(function(resolve, reject){
            const query = `${type}:${identifier}`;
            const url = `https://openlibrary.org/api/books?bibkeys=${query}&jscmd=data&format=json`;
            fetch(url, {
                method: 'GET',
                headers: { 
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(response => response.json())
            .then(responseJson => { 
                const item = responseJson[query];
                let books = [];
                if(item != undefined && item != null){
                    let subjects = [];
                    for(subject of item.subjects){
                        subjects.push(subject.name);
                    }
                    const isbn = item.identifiers["lccn"][0];
                    let publisher = null;
                    if(item.publishers != null && item.publishers.length > 0){
                        publisher = item.publishers[0].name
                    }
                    const book = {
                        isbn,
                        title: item.title,
                        author: item.by_statement,
                        imageUrl: `http://covers.openlibrary.org/b/lccn/${isbn}-M.jpg`,
                        subtitle: item.subtitle,
                        publish_year: item.publish_date,
                        publisher,
                        pages: item.number_of_pages,
                        subjects
                    };
                    books.push(book);
                }
                resolve(books);
            })
            .catch(err => {
                reject(err);
            });
        });
    };

    static search = (query, field = "q") => {
        return new Promise(function(resolve, reject){
            fetch(`http://openlibrary.org/search.json?${field}=${query}`, {
                method: 'GET',
                headers: { 
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(response => response.json())
            .then(responseJson => { 
                let books = [];
                let ids = [];
                for(const doc of responseJson.docs){
                    let isbn = null;                    
                    if(doc.lccn != null && doc.lccn.length > 0){
                        isbn = doc.lccn[0];
                    }
                    if(isbn != null && ids.indexOf(isbn) < 0){
                        ids.push(isbn);
                        const book = {
                            isbn,
                            title: doc.title,
                            author: doc.author_name
                        };
                        books.push(book);
                    }
                }
                resolve(books);
            })
            .catch(err => {
                reject(err);
            });
        });
    };
}