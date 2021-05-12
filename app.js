//TODO уведомляшка снизу слева с советом отфильтровать героев и кнопкой GOT IT!, которая прекратит повторение показа
//https://www.youtube.com/watch?v=QGVXmoZWZuw&ab_channel=TylerPotts
//https://www.youtube.com/watch?v=GUEB9FogoP8&ab_channel=DevEd


'use strict';

class HeroesCards {
    constructor({ root, db, filterBlock, cardsBlock }) {
        this.root = document.querySelector(root);
        this.db = db;
        this.cardsBlock = cardsBlock;
        this.movies = new Set();
    }

    render(array) {
        const cardsBlock = document.querySelector('.cards');
        cardsBlock.innerHTML = '';
        array.forEach((elem) => {
            this.renderCard(elem, cardsBlock);
        });
    }

    renderCard(hero, target) {

        const createRow = (target, tag, className, content = '') => {
            const elem = document.createElement(tag);
            elem.className = className;
            elem.textContent = content;
            target.append(elem);
        };

        const article = document.createElement('article');
        article.className = 'card';

        const header = document.createElement('div');
        header.className = 'card__header';

        const figure = document.createElement('figure');
        figure.className = 'card__figure';

        const img = document.createElement('img');
        img.src = hero.photo;
        img.className = 'card__image';

        figure.append(img);
        header.append(figure);
        article.append(header);

        const body = document.createElement('div');
        body.className = 'card__body';
        article.append(body);


        createRow(body, 'h2', 'card__name', `name: ${hero.name}`);
        const realName = hero.realName ? hero.realName : 'unknown';
        createRow(body, 'h3', 'card__real-name', `real name: ${realName}`);
        createRow(body, 'p', 'card__species', `species: ${hero.species}`);
        const birthDay = hero.birthDay ? hero.birthDay : 'unknown';
        createRow(body, 'p', 'card__birthday', `birthday: ${birthDay}`);
        const gender = hero.gender ? hero.gender : 'unknown';
        createRow(body, 'p', 'card__gender', `gender: ${gender}`);
        const citizenship = hero.citizenship ? hero.citizenship : 'unknown';
        createRow(body, 'p', 'card__citizenship', `citizenship: ${citizenship}`);
        createRow(body, 'p', 'card__status', `status: ${hero.status}`);

        const movies = document.createElement('div');
        movies.className = 'card__movies';
        movies.textContent = 'Movies:';
        body.append(movies);

        if (hero.movies) {
            hero.movies.forEach((movie, index) => {
                createRow(movies, 'p', 'card__movie', `${index + 1}) ${movie}`);
            });
        } else {
            createRow(movies, 'p', 'card__movie', `no movies`);
        }


        target.append(article);
    }



    async fetchData() {
        this.response = await(await fetch(this.db)).json();

        let response = this.response;

        const movies = new Set();
        const actors = new Set();
        const names = new Set();
        const species = new Set();

        response.forEach(element => {
            if (element.movies) {
                element.movies.forEach(movie => movies.add(movie));
            }
            if (element.actors) {
                actors.add(element.actors);
            }
            if (element.name) {
                names.add(element.name);
            }
            if (element.species) {
                species.add(element.species);
            }
        });

        this.render(response);
        this.createFilters(movies, actors, names, species);
    }

    createBase() {
        this.root.innerHTML = `
            
            <section class="heroes">
                <aside class="aside">
                    <form class="filter"></form>
                </aside>
                <section class="cards"></section>
            </section>
        `;
    }

    disableElements(exception, target) {
        const elements = target.querySelectorAll('input, select');
        elements.forEach(elem => {
            if (elem.id === exception) return;
            if (elem.type.toLowerCase() === 'select') {
                elem.selectedIndex = 0;
            }
            elem.setAttribute('disabled', 'true');
        });
    }

    enableElements(target) {
        const elements = target.querySelectorAll('input, select');
        elements.forEach(elem => {
            elem.removeAttribute('disabled');
        });
    }


    createFilters(movies, actors, heroesNames, species) {
        const filter = document.querySelector('.filter');

        const createSelectOption = (target, value) => {
            const option = document.createElement('option');
            option.textContent = value;
            option.value = value;
            target.append(option);
        };

        const createSelect = (id, fillsFrom, firstOption, target = filter) => {
            const select = document.createElement('select');
            select.id = id;
            //initial empty option
            createSelectOption(select, firstOption);
            fillsFrom.forEach(elem => {
                createSelectOption(select, elem);
            });
            target.append(select);
        };

        const createLabel = (id, linkedWith, text, target = filter) => {
            const label = document.createElement('label');
            label.id = id;
            label.setAttribute('for', linkedWith);
            label.innerText = text;
            target.append(label);
        };

        const createCheckbox = (id, target = filter) => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;
            target.append(checkbox);
        };

        const createClearButton = (target) => {
            const button = document.createElement('button');
            button.className = 'clear-row-filter';
            button.value = 'clear';
            target.append(button);
        };

        const createRow = (className, target = filter) => {
            const div = document.createElement('div');
            div.className = 'filter__row';
            div.classList.add(className);
            target.append(div);
        };

        const removeElement = selector => document.querySelector(selector).remove();

        //name select
        createRow('name-filter');
        const nameRow = document.querySelector('.name-filter');
        createLabel('name-label', 'name-select', 'Filter by Hero name:', nameRow);
        createSelect('name-select', heroesNames, 'Choose hero...', nameRow);
        createClearButton(nameRow);

        //species select
        createRow('species-filter');
        const speciesRow = document.querySelector('.species-filter');
        createLabel('species-label', 'species-select', 'Filter by Hero species:', speciesRow);
        createSelect('species-select', species, 'Choose species...', speciesRow);
        createClearButton(speciesRow);

        //movies select
        createRow('movie-filter');
        const movieRow = document.querySelector('.movie-filter');
        createLabel('movies-label', 'movies-select', 'Filter by Film:', movieRow);
        createSelect('movies-select', movies, 'Choose film...', movieRow);
        createClearButton(movieRow);

        //actors filter
        createRow('actor-filter');
        const actorRow = document.querySelector('.actor-filter');
        createRow('actor-checkbox-filter', actorRow);
        const actorCheckRow = document.querySelector('.actor-checkbox-filter');
        createLabel('actor-label', 'actor-checkbox', 'Search for the exact Actor:', actorCheckRow);
        createCheckbox('actor-checkbox', actorCheckRow);

        const actorCheckbox = document.getElementById('actor-checkbox');

        actorCheckbox.addEventListener('change', () => {

            if (actorCheckbox.checked) {
                this.disableElements('actor-checkbox', filter);
                createLabel('select-actor-label', 'actor-select', 'filter by actor:', actorRow);
                createSelect('actor-select', actors, 'Choose actor...', actorRow);
            } else {
                this.enableElements(filter);
                removeElement('#select-actor-label');
                removeElement('#actor-select');
            }
        });

        //gender checkbox
        createRow('gender-filter');
        const genderRow = document.querySelector('.gender-filter');
        createLabel('gender-label', 'gender-checkbox', 'female', genderRow);
        createCheckbox('gender-checkbox', genderRow);

        //status checkbox
        createRow('status-filter');
        const statusRow = document.querySelector('.status-filter');
        createLabel('status-label', 'status-checkbox', 'Status: deceased', statusRow);
        createCheckbox('status-checkbox', statusRow);

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.id = 'search-btn';
        submitBtn.innerText = 'Search';
        // submitBtn.disabled = true;
        filter.append(submitBtn);
    }

    addEventListeners() {
        const filter = document.querySelector('.filter');
        // filter.addEventListener('mouseover', () => {
        //     filter.classList.add('js-active');
        // });
        //
        // filter.addEventListener('mouseout', () => {
        //     filter.classList.remove('js-active');
        // });
        const nameHandler = (e) => {
            console.log(e.target.value);
            // fil
        };

        const submitBtnHandler = () => {
            console.log(1)
            console.log(this.response);
        };

        const moviesHandler = (e) => {
            const film = e.target.value;
            console.log(film);
            const cards = this.response.filter(card => {
                if (card.movies) {
                    for (const movie of card.movies) {
                        if (movie === film) {
                            return card;
                        }
                    }
                }
            });
            this.render(cards);
        };

        filter.addEventListener('click', (e) => {
            const target = e.target;
            if (target.id === 'name-select') {
                target.addEventListener('change', nameHandler);
            }

            if (target.id === 'search-btn') {
                e.preventDefault();
                target.addEventListener('click', submitBtnHandler);
            }

            if (target.id === 'movies-select') {
                target.addEventListener('change', moviesHandler);
            }
        });

    }

    init() {
        this.createBase();
        this.fetchData();
        this.addEventListeners();
    }
}

//https://stackoverflow.com/questions/2722159/how-to-filter-object-array-based-on-attributes
//iterate array async


//create instance of heroes class
const cards = new HeroesCards({
    root: '.content',
    db: './base.json',
});

cards.init();



