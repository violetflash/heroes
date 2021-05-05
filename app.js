const headerImg = document.querySelector('.header__img');

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    class HeroesCards {
        constructor({root, db, filterBlock, cardsBlock}) {
            this.root = document.querySelector(root);
            this.db = db;
            this.movies = new Set();
            this.filterBlock = filterBlock;
            this.cardsBlock = cardsBlock;
        }

        async getMoviesData() {
            const response = await fetch(this.db);
            // console.log(result);
            const result = await response.json();
            console.log(result);
            const moviesSet = new Set();
            const actorsSet = new Set();

            result.forEach(element => {
                if (element.movies) {
                    element.movies.forEach(movie => moviesSet.add(movie));
                }
                if (element.actors) {
                    actorsSet.add(element.actors);
                }
            });

            this.createFilters(moviesSet, actorsSet);
        }

        createBase() {
            this.root.innerHTML = `
                <h1 class="title">Find your Hero!</h1>
                <div class="heroes">
                    <div class="filter">
                        
                    </div>
                    <div class="cards"></div>
                </div>
            `;
        }

        createSelectOption(target, value) {
            const option = document.createElement('option');
            option.textContent = value;
            option.value = value;
            target.append(option);
        }

        createFilters(movies, actors) {
            //iterate movies Set to create a link for each movie
            const filter = document.querySelector('.filter');

            //create movies select
            filter.innerHTML = '<label for="movie-option">filter by film:</label>';
            const moviesSelect = document.createElement('select');
            this.createSelectOption(moviesSelect, 'Choose film');
            movies.forEach(elem => {
                this.createSelectOption(moviesSelect, elem);
            });
            filter.append(moviesSelect);

            //actors filter
            //if checkbox checked - filter is visible
            filter.innerHTML += `
                <label for="actor-checkbox">search for the exact actor:
                    <input id="actor-checkbox" type="checkbox">
                </label>`;
            const actorCheckbox = document.getElementById('actor-checkbox');
            actorCheckbox.addEventListener('change', () => {
                if (actorCheckbox.checked) {
                    moviesSelect.selectedIndex = 0;
                    filter.innerHTML += '<label id="actor-label" for="actor-select">filter by actor:</label>';
                    const actorSelect = document.createElement('select');
                    actorSelect.id = 'actor-select';
                    actors.forEach(elem => {
                        this.createSelectOption(actorSelect, elem);
                    });
                    filter.append(actorSelect);
                } else {
                    document.getElementById('actor-label').remove();
                    document.getElementById('actor-select').remove();
                }
            });
            //create actors filter


        }

        addEventListeners() {
            const filter = document.querySelector('.filter');
            filter.addEventListener('mouseover', () => {
                filter.classList.add('js-active');
            });

            filter.addEventListener('mouseout', () => {
                filter.classList.remove('js-active');
            });

        }

        init() {
            this.createBase();
            this.getMoviesData();
            console.log(this.movies);
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

});

