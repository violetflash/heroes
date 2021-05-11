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

        const cardTitle = document.createElement('h2');
        cardTitle.className = 'card__name';
        cardTitle.textContent = hero.name;

        article.append(cardTitle);

        if (hero.realName) {
            const cardSubtitle = document.createElement('h3');
            cardSubtitle.className = 'card__real-name';
            cardSubtitle.textContent = `Real name: ${hero.realName}`;
            article.append(cardSubtitle);
        }

        const species = document.createElement('p');
        species.className = 'card__species';
        species.textContent = hero.species;

        article.append(species);





        target.append(article);

        // return `
        //     <article class="card">
        //       <div class="card__header">
        //         <figure class="card__figure">
        //           <img src="${hero.photo}" alt="" class="card__image">
        //         </figure>
        //       </div>
        //       <div class="card__body">
        //         <h2 class="card__title">${hero.name}</h2>
        //         <h3 class="card__subtitle">
        //           Card Subtitle
        //         </h3>
        //         <p class="card__copy">
        //           Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis sint perspiciatis
        //           deleniti ab possimus ut? Ducimus fugiat hic velit necessitatibus. Lorem ipsum dolor
        //           sit amet consectetur adipisicing elit. Repellendus sapiente harum soluta excepturi ut
        //           temporibus, at amet corporis id asperiores.
        //         </p>
        //       </div>
        //       <footer class="card__footer">
        //         <div class="card__actions">
        //           <button class="button">
        //             Button
        //           </button>
        //         </div>
        //       </footer>
        //     </article>
        // `;
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
            <h1 class="title">Find your Hero!</h1>
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
        const movieHandler = (e) => {
            console.log(e.target.value);
            // fil
        };

        const submitBtnHandler = () => {
            console.log(1)
            console.log(this.response);
        }

        filter.addEventListener('click', (e) => {
            const target = e.target;
            if (target.id === 'name-select') {
                target.addEventListener('change', movieHandler);
            }

            if (target.id === 'search-btn') {
                e.preventDefault()
                target.addEventListener('click', submitBtnHandler);
            }
        });

    }

    init() {
        this.createBase();
        const button = document.querySelector('.search-btn');
        this.fetchData();
        console.log(this.response);
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



