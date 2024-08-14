let categories = [];
let ingredients = [];
let seasonings = [];
let menus = [];

function setupEventListeners() {
    document.getElementById('addCategoryButton').addEventListener('click', addCategory);
    document.getElementById('addIngredientButton').addEventListener('click', addIngredient);
    document.getElementById('addSeasoningButton').addEventListener('click', addSeasoning);
    document.getElementById('registerMenuButton').addEventListener('click', registerMenu);
    document.getElementById('selectMenuButton').addEventListener('click', selectRandomMenu);
    document.getElementById('toggleDeleteButton').addEventListener('change', toggleDeleteButtons);
}

function loadLocalStorageData() {
    categories = JSON.parse(localStorage.getItem('categories')) || [];
    ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
    seasonings = JSON.parse(localStorage.getItem('seasonings')) || [];
    menus = JSON.parse(localStorage.getItem('menus')) || [];
    updateCategoryList();
    updateIngredientList();
    updateSeasoningList();
    updateSelectCategory();
}

function saveToLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
    localStorage.setItem('seasonings', JSON.stringify(seasonings));
    localStorage.setItem('menus', JSON.stringify(menus));
}

function loadCategoriesFromCookie() {
    const categoriesData = getCookie('categories');
    if (categoriesData) {
        categories = JSON.parse(categoriesData);
        updateCategoryList();
    }
}

function saveCategoriesToCookie() {
    const categoriesData = JSON.stringify(categories);
    setCookie('categories', categoriesData, 7); // Save for 7 days
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function addCategory() {
    const categoryInput = document.getElementById('categoryInput');
    const category = categoryInput.value.trim();
    if (category && !categories.some(c => c.name === category)) {
        categories.push({ name: category, selected: false });
        categoryInput.value = '';
        updateCategoryList();
        updateSelectCategory();
        saveToLocalStorage();
        saveCategoriesToCookie();
    }
}

function updateCategoryList() {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';
    categories.forEach((category, index) => {
        const categoryItem = document.createElement('div');
        categoryItem.classList.add('category-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = category.selected;
        checkbox.onchange = () => category.selected = checkbox.checked;

        const label = document.createElement('label');
        label.textContent = category.name;
        label.style.marginLeft = '8px';

        const deleteButton = createDeleteButton(() => {
            categories.splice(index, 1);
            updateCategoryList();
            updateSelectCategory();
            saveToLocalStorage();
            saveCategoriesToCookie();
        });

        categoryItem.append(checkbox, label, deleteButton);
        categoryList.appendChild(categoryItem);
    });
}

function updateSelectCategory() {
    const selectCategory = document.getElementById('selectCategory');
    selectCategory.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        selectCategory.appendChild(option);
    });
}

function addIngredient() {
    const ingredientInput = document.getElementById('ingredientInput');
    const ingredient = ingredientInput.value.trim();
    if (ingredient && !ingredients.some(i => i.name === ingredient)) {
        ingredients.push({ name: ingredient, selected: false });
        ingredientInput.value = '';
        updateIngredientList();
        saveToLocalStorage();
    }
}

function updateIngredientList() {
    const ingredientList = document.getElementById('ingredientList');
    ingredientList.innerHTML = '';
    ingredients.forEach((ingredient, index) => {
        const ingredientItem = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = ingredient.selected;
        checkbox.onchange = () => ingredient.selected = checkbox.checked;

        const label = document.createElement('label');
        label.textContent = ingredient.name;
        label.style.marginLeft = '8px';

        const deleteButton = createDeleteButton(() => {
            ingredients.splice(index, 1);
            updateIngredientList();
            saveToLocalStorage();
        });

        ingredientItem.append(checkbox, label, deleteButton);
        ingredientList.appendChild(ingredientItem);
    });
}

function addSeasoning() {
    const seasoningInput = document.getElementById('seasoningInput');
    const seasoning = seasoningInput.value.trim();
    if (seasoning && !seasonings.some(s => s.name === seasoning)) {
        seasonings.push({ name: seasoning, selected: false });
        seasoningInput.value = '';
        updateSeasoningList();
        saveToLocalStorage();
    }
}

function updateSeasoningList() {
    const seasoningList = document.getElementById('seasoningList');
    seasoningList.innerHTML = '';
    seasonings.forEach((seasoning, index) => {
        const seasoningItem = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = seasoning.selected;
        checkbox.onchange = () => seasoning.selected = checkbox.checked;

        const label = document.createElement('label');
        label.textContent = seasoning.name;
        label.style.marginLeft = '8px';

        const deleteButton = createDeleteButton(() => {
            seasonings.splice(index, 1);
            updateSeasoningList();
            saveToLocalStorage();
        });

        seasoningItem.append(checkbox, label, deleteButton);
        seasoningList.appendChild(seasoningItem);
    });
}

function registerMenu() {
    const menuNameInput = document.getElementById('menuName');
    const menuName = menuNameInput.value.trim();
    if (menuName) {
        const selectedCategories = categories.filter(c => c.selected).map(c => c.name);
        const selectedIngredients = ingredients.filter(i => i.selected).map(i => i.name);
        const selectedSeasonings = seasonings.filter(s => s.selected).map(s => s.name);
        menus.push({
            name: menuName,
            categories: selectedCategories,
            ingredients: selectedIngredients,
            seasonings: selectedSeasonings
        });
        menuNameInput.value = '';
        clearAllCheckboxes();
        alert('献立が登録されました！');
        saveToLocalStorage();
    } else {
        alert('献立名を入力してください。');
    }
}

function clearAllCheckboxes() {
    categories.forEach(c => c.selected = false);
    ingredients.forEach(i => i.selected = false);
    seasonings.forEach(s => s.selected = false);
    updateCategoryList();
    updateIngredientList();
    updateSeasoningList();
    saveToLocalStorage();
}

function selectRandomMenu() {
    const selectedCategory = document.getElementById('selectCategory').value;
    let filteredMenus = menus.filter(menu => menu.categories.includes(selectedCategory) || selectedCategory === '');
    if (filteredMenus.length === 0) {
        alert('該当する献立がありません。');
        return;
    }
    const randomMenu = filteredMenus[Math.floor(Math.random() * filteredMenus.length)];
    displaySelectedMenu(randomMenu);
}

function displaySelectedMenu(menu) {
    const selectedMenuDiv = document.getElementById('selectedMenu');
    selectedMenuDiv.innerHTML = '';
    const nameHeader = document.createElement('h3');
    nameHeader.textContent = menu.name;
    nameHeader.classList.add('menu-name');
    const categoryList = document.createElement('p');
    categoryList.textContent = `カテゴリ: ${menu.categories.join(', ')}`;
    categoryList.classList.add('menu-category');
    const ingredientList = document.createElement('p');
    ingredientList.textContent = `材料: ${menu.ingredients.join(', ')}`;
    ingredientList.classList.add('menu-ingredients');
    const seasoningList = document.createElement('p');
    seasoningList.textContent = `調味料: ${menu.seasonings.join(', ')}`;
    seasoningList.classList.add('menu-seasonings');
    selectedMenuDiv.append(nameHeader, categoryList, ingredientList, seasoningList);
}

function createDeleteButton(onClickFunction) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.style.display = document.getElementById('toggleDeleteButton').checked ? 'inline' : 'none';
    deleteButton.onclick = onClickFunction;
    return deleteButton;
}

function toggleDeleteButtons() {
    const buttons = document.querySelectorAll('.btn-danger');
    buttons.forEach(button => {
        button.style.display = document.getElementById('toggleDeleteButton').checked ? 'inline' : 'none';
    });
}

window.onload = function() {
    setupEventListeners();
    loadLocalStorageData();
    loadCategoriesFromCookie();
};
