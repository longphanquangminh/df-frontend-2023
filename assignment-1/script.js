// Your JS code goes here

let chosenBookId = -1;

const TOPIC_ENUM = ["Programming", "Database", "DevOps"];

TOPIC_ENUM.forEach(item => {
  document.getElementById("addBookTopic").innerHTML += `
    <option value="${item}">${item}</option>
   `;
});

const DEFAULT_DUMMY_BOOK_DATA = [
  {
    id: 1,
    name: "Refactoring",
    author: "Martin Fowler",
    topic: "Programming",
  },
  {
    id: 2,
    name: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    topic: "Database",
  },
  {
    id: 3,
    name: "The Phoenix Project",
    author: "Gene Kim",
    topic: "DevOps",
  },
];

let storedData = JSON.parse(localStorage.getItem("book_data"));

if (!storedData || !Array.isArray(storedData) || storedData.length === 0) {
  localStorage.setItem("book_data", JSON.stringify(DEFAULT_DUMMY_BOOK_DATA));
  storedData = JSON.parse(localStorage.getItem("book_data"));
}

function displayData(arrayBookParam) {
  if (arrayBookParam.length === 0) {
    document.getElementById("book-table").style.display = "none";
    document.getElementById("show-books-status").innerHTML =
      "There are no books avaiable, please add more or refresh page (load default data localStorage if empty data).";
    return;
  }
  document.getElementById("show-books-status").innerHTML = "";
  document.getElementById("book-table").style.display = "block";
  document.getElementById("bookTableBody").innerHTML = "";
  arrayBookParam.forEach(item => {
    document.getElementById("bookTableBody").innerHTML += `
          <tr>
              <td>${item.name}</td>
              <td>${item.author}</td>
              <td>${item.topic}</td>
              <td><a onclick="openDeleteBookModal(${item.id})">Delete</a></td>
          </tr>
          `;
  });
}

displayData(storedData);

document.getElementById("overlay").onclick = () => {
  closeModal();
};

function openDeleteBookModal(id) {
  chosenBookId = id;
  document.getElementById("overlay").style.display = "block";
  document.getElementById("deleteBookModal").style.display = "block";
  const book = storedData.find(book => book.id === id);
  document.getElementById("deleteBookModal").innerHTML = `
  <div class="modal-heading">
    <div></div>
    <div class="modal-heading__text">Delete book</div>
    <div><i onclick="closeModal()" class="fa-solid fa-x"></i></div>
    </div>
    <div>Do you want to delete <span class="bold-text">${book.name}</span> book?</div>
    <div id="deleteBookButtonSection">
    <button type="button" onClick="deleteBook()" class="conflict-button">Delete</button>
    <button type="button" onClick="closeModal()">Cancel</button>
</div>
  `;
  document.body.style.overflow = "hidden";
}

function openAddBookModal() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("addBookModal").style.display = "block";
  document.body.style.overflow = "hidden";
  document.getElementById("addBookName").focus();
}

function dataChangeAction() {
  document.getElementById("searchField").value = "";
  localStorage.setItem("book_data", JSON.stringify(storedData));
  displayData(storedData);
  resetErrorMessage();
  closeModal();
  resetForm();
}

function resetForm() {
  document.getElementById("addBookName").value = "";
  document.getElementById("addBookAuthor").value = "";
  document.getElementById("addBookTopic").value = TOPIC_ENUM[0];
}

function resetErrorMessage() {
  document.getElementById("nameErrorMessage").innerHTML = "";
  document.getElementById("authorErrorMessage").innerHTML = "";
}

function addBook() {
  resetErrorMessage();
  let newBookName = document.getElementById("addBookName").value;
  let newBookAuthor = document.getElementById("addBookAuthor").value;
  if (newBookName.length === 0) {
    document.getElementById("nameErrorMessage").innerHTML = "Name cannot be empty!";
  }

  if (newBookAuthor.length === 0) {
    document.getElementById("authorErrorMessage").innerHTML = "Author cannot be empty!";
  }
  if (newBookName.length === 0 || newBookAuthor.length === 0) {
    return;
  }
  let newBookTopic = document.getElementById("addBookTopic").value;
  const newId = storedData.length > 0 ? storedData[storedData.length - 1].id + 1 : 1;
  storedData.push({
    id: newId,
    name: newBookName,
    author: newBookAuthor,
    topic: newBookTopic,
  });
  dataChangeAction();
}

function closeModal() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("addBookModal").style.display = "none";
  document.getElementById("deleteBookModal").style.display = "none";
  document.body.style.overflow = "auto";
  resetErrorMessage();
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

function deleteBook() {
  const bookIdToDelete = chosenBookId;
  const bookIndex = storedData.findIndex(book => book.id === bookIdToDelete);
  if (bookIndex !== -1) {
    storedData.splice(bookIndex, 1);
  }
  dataChangeAction();
}

// ở đây em làm chức năng tìm kiếm theo cả tên, tác giả và loại sách, user gõ gì là tìm cái liên quan để hiển thị
// nếu xóa hết (hoặc input search trống) thì show hết các book như ban đầu
document.getElementById("searchField").addEventListener("input", event => {
  const inputValue = convertVietnameseToEnglish(removeExtraSpaces(event.target.value.trim().toLowerCase()));
  if (inputValue === "") {
    displayData(storedData);
    return;
  }
  const matchingBooks = [];
  for (const book of storedData) {
    for (const property in book) {
      if (typeof book[property] === "string" && book[property].toLowerCase().includes(inputValue)) {
        matchingBooks.push(book);
        break;
      }
    }
  }
  displayData(matchingBooks);
});

function removeExtraSpaces(inputString) {
  return inputString.replace(/\s+/g, " ").trim();
}

function convertVietnameseToEnglish(input) {
  const diacriticsMap = {
    à: "a",
    á: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ằ: "a",
    ắ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    ầ: "a",
    ấ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    â: "a",
    è: "e",
    é: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ề: "e",
    ế: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    ì: "i",
    í: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ò: "o",
    ó: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ồ: "o",
    ố: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ổ: "o",
    ố: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ờ: "o",
    ớ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ù: "u",
    ú: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ừ: "u",
    ứ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    ỳ: "y",
    ý: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
    đ: "d",
  };

  return input.replace(/[àáảãạăằắẳẵặầấẩẫậâèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộổốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/g, match => diacriticsMap[match] || match);
}

document.addEventListener("contextmenu", e => {
  e.preventDefault();
});

document.addEventListener("keydown", e => {
  if (e.key === "F12" || (e.ctrlKey && e.key === "u") || (e.ctrlKey && e.key === "s")) {
    e.preventDefault();
  }
});
