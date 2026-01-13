const getData = () => {
  const listsData = localStorage.getItem("lists-data");
  const parsedData = listsData && JSON.parse(listsData);
  return parsedData;
};

const listsCategories = getData() ?? [];

const saveData = () => {
  const listsData = JSON.stringify(listsCategories);
  localStorage.setItem("lists-data", listsData);
};

const setEmptyList = () => {
  if (listsCategories.length < 1) {
    const wallTitle = document.getElementById("wall-title");
    wallTitle.innerHTML = `<h1 class="text-4xl font-bold text-gray-600 p-4">No choose lists</h1>`;
    const notesContainer = document.getElementById("list-items");
    notesContainer.innerHTML = `<img src="/img/animal-domestic-orangoutang2-svgrepo-com (1).svg" />`;
    const createTaskButton = document.getElementById("create-task");
    const hiddenTaskButton = () => createTaskButton.classList.add("hidden");
    hiddenTaskButton();
    const filterSelect = document.getElementById("filter-select");
    const hiddenFilterSelect = () => filterSelect.classList.add("hidden");
    hiddenFilterSelect();
  }
};

const drawLists = (categories = listsCategories) => {
  const listCategoriesContainer = document.getElementById("list-categories");
  listCategoriesContainer.innerHTML = ``;

  if (categories.length === 0) {
    listCategoriesContainer.innerHTML = `
      <li class="text-center text-gray-400 text-sm py-6">
        🔍 nothing found
      </li>
    `;
    return;
  }

  categories.forEach((category) => {
    listCategoriesContainer.innerHTML += `<li class="flex group w-full justify-around items-center">
    <div class="flex w-full justify-between gap-1">
      <button data-id="${category.id}" class="button-rename-category opacity-0 cursor-pointer group-hover:opacity-100 transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-gray-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
        </svg>
      </button>
      <button data-id="${category.id}"
        class="button-list-item text-sm cursor-pointer font-semibold text-gray-700"
      >
        ${category.title}
      </button>
      <button data-id="${category.id}" class="button-delete-category opacity-0 cursor-pointer group-hover:opacity-100 transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-gray-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
      </div>
    </li>`;
    const createTaskButton = document.getElementById("create-task");
    const showTaskButton = () => createTaskButton.classList.remove("hidden");
    showTaskButton();
  });

  const buttonLists = document.getElementsByClassName("button-list-item");
  for (let button of buttonLists) {
    button.addEventListener("click", () => {
      let currentList = listsCategories.find(
        (category) => category.id === button.dataset.id
      );
      setActiveList(currentList.id);
    });
  }

  const renameCategoryButton = document.getElementsByClassName(
    "button-rename-category"
  );
  for (let button of renameCategoryButton) {
    button.addEventListener("click", () => {
      let currentList = listsCategories.find(
        (category) => category.id === button.dataset.id
      );
      const newTitle = prompt("Enter new list name", currentList.title);
      if (newTitle) {
        currentList.title = newTitle;
        saveData();
        drawLists();
        setActiveList(currentList.id);
      }
    });
  }

  const deleteCategoryButton = document.getElementsByClassName(
    "button-delete-category"
  );
  for (let button of deleteCategoryButton) {
    button.addEventListener("click", () => {
      let currentList = listsCategories.find(
        (category) => category.id === button.dataset.id
      );
      console.log(currentList);
      if (!currentList) {
        console.log("not found list");
        return;
      }

      const currCategorieIndex = listsCategories.findIndex(
        (category) => category.id === currentList.id
      );
      if (currCategorieIndex === -1) {
        console.log("not found index");
        return;
      }

      listsCategories.splice(currCategorieIndex, 1);
      saveData();
      drawLists();
      if (listsCategories[0]) {
        setActiveList(listsCategories[0].id);
      } else {
        setEmptyList();
      }
    });
  }
};

drawLists();

const createId = () => Math.random().toString(36).slice(2);

const createListButton = document.getElementById("create-list");
createListButton.addEventListener("click", () => {
  const newList = {
    title: "New List",
    id: createId(),
    notes: [],
  };

  listsCategories.push(newList);
  saveData();
  drawLists();
  setActiveList(newList.id);
});

const drawItems = (notes) => {
  const notesContainer = document.getElementById("list-items");
  notesContainer.innerHTML = ``;

  const filteredNotes = filterNotes(notes);

  filteredNotes.forEach((currentNote) => {
    notesContainer.innerHTML += `<div
    class="note-card group relative rounded-md shadow-xl z-0 transition-transform duration-300 ease-out focus-within:scale-[1.05] p-4 text-sm text-gray-800 flex gap-3 flex-col justify-between ${
      currentNote.isDone ? "bg-green-100" : "bg-orange-200"
    }"
  >
    <textarea data-id="${
      currentNote.id
    }" placeholder="Write here" class="note-textarea w-full resize-none overflow-hidden focus:outline-none min-h-5">${
      currentNote.note
    }</textarea>
    <div class="flex justify-between">
      <button data-id="${
        currentNote.id
      }" class="button-done-task cursor-pointer opacity-0 group-hover:opacity-100 transition"
    }">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </button>
      <button data-id="${
        currentNote.id
      }" class="button-delete-task cursor-pointer opacity-0 group-hover:opacity-100 transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-gray-600">
          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      </button>
    </div>
  </div>`;
  });

  const textareas = document.querySelectorAll("textarea");
  for (let textarea of textareas) {
    const currentCategory = listsCategories.find((category) => {
      const currentNote = category.notes.find(
        (note) => note.id === textarea.dataset.id
      );
      return !!currentNote;
    });

    const currentNote = currentCategory.notes.find(
      (note) => note.id === textarea.dataset.id
    );

    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
      currentNote.note = textarea.value;
      saveData();
    });
  }

  const doneTaskButtons = document.getElementsByClassName("button-done-task");
  for (let button of doneTaskButtons) {
    button.addEventListener("click", () => {
      const currentCategorie = listsCategories.find((a) => {
        // console.log(a);
        // console.log(button.dataset.id);
        const currentNote = a.notes.find(
          (note) => note.id === button.dataset.id
        );
        return !!currentNote;
      });
      const currentNote = currentCategorie.notes.find(
        (note) => note.id === button.dataset.id
      );
      currentNote.isDone = !currentNote.isDone;
      saveData();
      drawItems(currentCategorie.notes);
    });
  }

  const deleteTaskButton =
    document.getElementsByClassName("button-delete-task");
  for (let button of deleteTaskButton) {
    button.addEventListener("click", () => {
      const currentCategorie = listsCategories.find((a) => {
        const currentNote = a.notes.find(
          (note) => note.id === button.dataset.id
        );
        return !!currentNote;
      });
      const currentNote = currentCategorie.notes.find(
        (note) => note.id === button.dataset.id
      );

      const currNoteIndex = currentCategorie.notes.findIndex(
        (note) => note.id === currentNote.id
      );
      if (currNoteIndex === -1) {
        console.log("not found");
        return;
      }

      currentCategorie.notes.pop(currNoteIndex);
      saveData();
      drawItems(currentCategorie.notes);
    });
  }
};

const filterNotes = () => {
  const filterValue = filterSelect.value;
  const activeCategory = listsCategories.find((a) => a.id === activeListId);
  if (!activeCategory) return;

  let filteredNotes = activeCategory.notes;

  if (filterValue === "done") {
    filteredNotes = activeCategory.notes.filter((note) => note.isDone);
  } else if (filterValue === "not-done") {
    filteredNotes = activeCategory.notes.filter((note) => !note.isDone);
  }
  return filteredNotes;
};

const filterSelect = document.getElementById("filter-select");
const showFilterSelect = () => filterSelect.classList.remove("hidden");
showFilterSelect();

filterSelect.addEventListener("change", () => {
  drawItems(filterNotes());
});

let activeListId = "";

const setActiveList = (listId) => {
  const activeList = listsCategories.find((a) => a.id === listId);
  if (!activeList) {
    console.log("Don`t find element");
    return;
  }
  activeListId = listId;
  const wallTitle = document.getElementById("wall-title");
  wallTitle.innerHTML = activeList.title;

  drawItems(activeList.notes);
};

listsCategories.length && setActiveList(listsCategories[0].id);

const createTaskButton = document.getElementById("create-task");
createTaskButton.addEventListener("click", () => {
  const newNote = {
    id: createId(),
    note: "",
    isDone: false,
  };
  const arrayOfNotes = listsCategories.find((a) => a.id === activeListId);
  if (!arrayOfNotes) {
    console.log("Don`t find element");
    return;
  }
  arrayOfNotes.notes.push(newNote);
  saveData();
  drawItems(arrayOfNotes.notes);
});

const searchInput = document.getElementById("search-list-name");
searchInput.addEventListener("input", (event) => {
  const searchQuery = event.target.value.toLowerCase();
  const filterGategories = listsCategories.filter((category) =>
    category.title.toLowerCase().includes(searchQuery)
  );
  drawLists(filterGategories);
});
