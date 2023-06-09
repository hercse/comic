var comiclist;
var output;

// 檢查 URL query string 以獲取 sheet 名稱
function getSheetNameFromQueryString() {
  const urlParams = new URLSearchParams(window.location.search);
  const sheetName = urlParams.get("sheet") || "";
  return sheetName !== "" ? sheetName : "Comic Storage List";
}

const sheetName = getSheetNameFromQueryString();

fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/193NLQaDa9eKSApAHpW0PQQ16rPOlZX2VzPzU2eaSzAc/values/${sheetName}?alt=json&key=AIzaSyDx9l2u11YUgI_XZ7KB3n0v7yvvN_ERhCk`
)
  .then((res) => res.json())
  .then((res) => {
    console.log(res.values);
    comiclist = res.values;
    displayComics(comiclist.slice(1), "");

    // Get the search term from the query string and display filtered results
    const searchTerm = getSearchTermFromQueryString();
    filterAndDisplayComics(searchTerm);

    // 為搜尋欄位添加事件監聽器
    document
      .getElementById("search-input")
      .addEventListener("input", handleSearchInput);
  });

// 當頁面加載時，並沒有調用QueryString並出現搜尋結果
function getSearchTermFromQueryString() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("search") || "";
}

// 新函數：從 query string 獲取 patch
function getPatchFromQueryString() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("patch") || "";
}
function filterAndDisplayComics(searchTerm) {
  const patchFilter = getPatchFromQueryString();

  if (searchTerm === "" && patchFilter === "") {
    displayComics(comiclist.slice(1), "");
  } else {
    document.getElementById("search-input").value = searchTerm;
    const filteredComicList = comiclist.slice(1).filter((comic) => {
      const titleMatch = comic[0]
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const patchMatch =
        patchFilter === "" ? true : comic[6].includes(patchFilter);
      return titleMatch && patchMatch;
    });
    displayComics(filteredComicList, searchTerm);
  }
}

// function filterAndDisplayComics(searchTerm) {
//   if (searchTerm === "") {
//     displayComics(comiclist.slice(1), "");
//   } else {
//     document.getElementById("search-input").value = searchTerm;
//     const filteredComicList = comiclist
//       .slice(1)
//       .filter((comic) =>
//         comic[0].toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     displayComics(filteredComicList, searchTerm);
//   }
// }

function updateQueryString(searchTerm) {
  if (searchTerm) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("search", searchTerm);
    window.history.pushState(null, "", newUrl.toString());
  } else {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("search");
    window.history.pushState(null, "", newUrl.toString());
  }
}

function handleSearchInput(event) {
  const searchTerm = event.target.value;
  updateQueryString(searchTerm);

  if (searchTerm === "") {
    // 如果搜尋欄位是空的，則顯示所有漫畫
    displayComics(comiclist.slice(1), "");
  } else {
    const filteredComicList = comiclist
      .slice(1)
      .filter((comic) =>
        comic[0].toLowerCase().includes(searchTerm.toLowerCase())
      );
    displayComics(filteredComicList, searchTerm);
  }
}

function displayComics(comicList, searchTerm) {
  document.querySelector("section.comiclist").innerHTML = "";
  comicList.forEach((i) => {
    let isChecked = "";

    if (searchTerm !== "") {
      const regExpChars = /[.*+\-?^${}()|[\]\\]/g;
      const escapedSearchTerm = searchTerm.replace(regExpChars, "\\$&");
      const regex = new RegExp(escapedSearchTerm, "gi");

      if (i[0].match(regex)) {
        isChecked = "checked";
      }
    }

    output = `<label>
    <input type="checkbox"  class=""  ${isChecked} />
    <div class="comiclist__title">
      <div class="comiclist__title__name">${i[0]}</div>
      <div class="comiclist__title__year">${i[1]}</div>
      <div class="comiclist__title__authors">${i[2]}</div>
      <div class="comiclist__title__authors">${i[3]}</div>
      <div class="grades">
      ${i[4]} <span>(${GradeInfo(i[4])})</span>
      </label>
    </div>
      <div class="comiclist__title__">${i[5]}</div>
      <div class="comiclist__title__link"><a href="?patch=${i[6]}">${
      i[6]
    }</a></div>
      <div class="comiclist__title__price">${i[9]}</div>
    </div>
    <div class="comiclist__content">
      <img class="" src="${i[7]}" alt="" />
      <div class="">${i[8]}</div>
    </div>
  </label>`; // 在此處使用 highlightedTitle 替換原始模板中的 ${i[0]}
    wirtein();
  });
}

function wirtein() {
  document.querySelector("section.comiclist").innerHTML += output;
}

function GradeInfo(e) {
  switch (e) {
    case "NEW":
      info =
        "A brand new comic is completely unused and has no signs of wear or damage.";
      break;
    case "GM":
      info = "10.0 Gem Mint is in perfect condition.";
      break;
    case "MT":
      info = "9.9 Mint is in near perfect condition.";
      break;
    case "NM/MT":
      info = "9.8 Near Mint/Mint is in very close to perfect condition.";
      break;
    case "NM+":
      info = "9.6 Near Mint+ is in excellent condition.";
      break;
    case "NM":
      info = "9.4 Near Mint is in very good condition.";
      break;
    case "NM-":
      info = "9.2 Near Mint- is in good condition.";
      break;
    case "VF/NM":
      info = "9.0 Very Fine/Near Mint is in very fine condition.";
      break;
    case "VF+":
      info = "8.5 Very Fine+ is in fine condition.";
      break;
    case "VF":
      info = "8.0 Very Fine is in very good condition.";
      break;
    case "VF-":
      info = "7.5 Very Fine- is in good condition.";
      break;
    case "FN/VF":
      info = "7.0 Fine/Very Fine is in fine condition.";
      break;
    case "FN+":
      info = "6.5 Fine+ is in very good condition.";
      break;
    case "FN":
      info = "6.0 Fine is in good condition.";
      break;
    case "FN-":
      info = "5.5 Fine- is in fair condition.";
      break;
    case "VG/FN":
      info = "5.0 Very Good/Fine is in very good condition.";
      break;
    case "VG+":
      info = "4.5 Very Good+ is in good condition.";
      break;
    case "VG":
      info = "4.0 Very Good is in fair condition.";
      break;
    case "VG-":
      info = "3.5 Very Good- is in poor condition.";
      break;
    case "GD/VG":
      info = "3.0 Good/Very Good is in poor condition.";
      break;
    case "GD+":
      info = "2.5 Good+ is in fair condition.";
      break;
    case "GD":
      info = "2.0 Good is in poor condition.";
      break;
    case "GD-":
      info = "1.8 Good- is in very poor condition.";
      break;
    case "FR/GD":
      info = "1.5 Fair/Good is in very poor condition.";
      break;
    case "FR":
      info = "1.0 Fair is in very poor condition.";
      break;
    case "PR":
      info = "0.5 Poor is in very poor condition.";
      break;
    default:
      info = "?";
      break;
  }
  return info;
}

// 為全選框添加事件監聽器
document
  .getElementById("select-all-checkbox")
  .addEventListener("change", (event) => {
    const selectAllChecked = event.target.checked;
    toggleAllCheckboxes(selectAllChecked);
  });

function toggleAllCheckboxes(selectAllChecked) {
  // 選擇或取消選擇所有 section.comiclist 中的 checkboxes
  const allCheckboxes = document.querySelectorAll(
    "section.comiclist input[type=checkbox]"
  );
  allCheckboxes.forEach((checkbox) => {
    checkbox.checked = selectAllChecked;
  });
}

// GRID

// 為切換 test 類別的 checkbox 添加事件監聽器
document
  .getElementById("toggle-test-class-checkbox")
  .addEventListener("change", (event) => {
    const testClassChecked = event.target.checked;
    toggleTestClass(testClassChecked);
  });

function toggleTestClass(testClassChecked) {
  // 根據 checkbox 的狀態，為 section.comiclist 添加或移除 test 類別
  const comicListSection = document.querySelector("body");
  if (testClassChecked) {
    comicListSection.classList.add("test");
  } else {
    comicListSection.classList.remove("test");
  }
}
