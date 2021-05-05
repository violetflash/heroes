/*
Задания на КОНКУРС ЛУЧШИХ РАБОТ
1) Загрузить JSON файл
2) При помощи ajax запросов к загруженному файлу сформировать на странице карточки
Героев со всеми данными (фото, имя, настоящее имя,  список фильмов, статус).
1 персонаж - 1 карточка.
3) Реализовать переключатели-фильтры по фильмам.
    Выпадающее меню или список, на ваше усмотрение
Показывать только те карточки, которые подходят под выбранный фильтр.
    Стилизация карточек и всего внешнего вида - на ваше усмотрение.
    Упор сделать на главную цель - донесение информации, никаких вырвиглазных цветов и шрифтов.
4) Добавить ссылку на выполненное задание
Оцениваться будет в основном чистота кода и правильность реализации.
    В случае идеального кода у претендентов - будем смотреть на стили.
*/

const headerImg = document.querySelector('.header__img');

// const headerImgArrival = () => {
//     const moveImg = (img) => {
//         const imgTop = img.getBoundingClientRect().top;
//         console.log(imgTop);
//         if (imgTop < 0) {
//             img.style.top = imgTop + 1 + 'px';
//
//         } else {
//             clearInterval(headerInterval);
//         }
//     };
//     const headerInterval = setInterval(moveImg, 0.1, headerImg);
//     // headerImg.style.position = 'block';
// };

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
                    element.movies.forEach(movie => moviesSet.add(movie));
                }
            });
            console.log(this.movies);
            this.createFilters();
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

        createFilters() {
            //iterate movies Set to create a link for each movie
            const filter = document.querySelector('.filter');

            //create movies select
            const moviesSelect = document.createElement('select');
            const moviesLabel = document.createElement('label');
            moviesLabel.for = 'movie-option';
            moviesLabel.textContent = 'filter by film:';
            this.movies.forEach(elem => {
                const option = document.createElement('option');
                option.textContent = elem;
                option.id = 'movie-option';
                moviesSelect.append(option);
            });
            filter.append(moviesLabel);
            filter.append(moviesSelect);


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

