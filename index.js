const KEYS = {
    BOOKS: "books",
}
const $ = (id) => document.getElementById(`#${id}`);

function showToast(successful = true, message = null) {
    const toastResult = $('toastResult');
    if(successful) {
        toastResult.innerHTML = message || 'Book added.';
        toastResult.style.backgroundColor = 'green';
    }
    else {
        toastResult.innerHTML = message || 'Unknown error!';
        toastResult.style.backgroundColor = 'red';
    }
    toastResult.style.opacity = '1';
    setTimeout(() => {
        toastResult.style.opacity = '0';
    }, [5000])
}
function addBook() {
    try {
        const txtTitle = $("title"),
            txtAuthor = $("author"),
            txtISBN = $("isbn");
        const title = txtTitle.value,
            author = txtAuthor.value,
            isbn = txtISBN.value;
        if (title && author && isbn) {

            const newBook = {title, author, isbn};
            const objBooks = loadBooks();
            objBooks.push(newBook);
            saveBooks(objBooks);
            showToast();
            showBooksList();
            txtTitle.value = "";
            txtAuthor.value ="";
            txtISBN.value ="";
        } else
            showToast(false, "At least one text box is empty");
    } catch (error) {
        console.log(error);
        showToast(false);
    }
}
function loadBooks() {
    const jsonBooks = localStorage.getItem(KEYS.BOOKS);
    return jsonBooks ? JSON.parse(jsonBooks) : [];
}
function saveBooks(objBooks) {
    const jsonNewBooks = JSON.stringify(objBooks);
    localStorage.setItem(KEYS.BOOKS, jsonNewBooks);
}
function showBooksList() {
    const books = loadBooks();
    const headerHtml = `<tr>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th></th>
            </tr>`;
    const dataHtml = books.map((book, index) => '<tr style="background: ' +
        (index % 2 ? 'transparent' : 'lightgray') +
        '"><td>' + book.title + '</td>' +
        '<td>' + book.author + '</td>' +
        '<td>' + book.isbn + '</td>' +
        '<td><button class="delete-button" id="' + index + '">X</button></td>');
    $('booksList').innerHTML = headerHtml + dataHtml.join(' ');
    var deleteButtons = document.getElementsByClassName('delete-button');
    for(var i=0; i < deleteButtons.length; i++)
        deleteButtons[i].addEventListener('click', deleteBook);
}

function deleteBook() {
    const unwantedBookID = this.getAttribute('id');
    const books = loadBooks();
    books.splice(unwantedBookID, 1);
    saveBooks(books);
    showBooksList();
    showToast(true, "Book deleted!");
    return false;
}
window.addEventListener("load", () => {
    const btnAddBook = $("btnAddBook");
    btnAddBook.addEventListener("click", addBook);
    showBooksList();
});