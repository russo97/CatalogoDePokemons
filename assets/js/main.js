(async function () {

  const baseURL = 'https://pokeapi.co/api/v2/pokemon';

  const pokeInfo = {
    currentType: null
  };



  const typeTranslate = Object.freeze({
    ice: 'Gelo',
    steel: 'Aço',
    fire: 'Fogo',
    bug: 'Inseto',
    rock: 'Pedra',
    fairy: 'Fada',
    water: 'Água',
    grass: 'Planta',
    dark: 'Sombrio',
    dragon: 'Dragão',
    flying: 'Voador',
    normal: 'Normal',
    ghost: 'Fantasma',
    ground: 'Terreste',
    poison: 'Venenoso',
    fighting: 'Lutador',
    psychic: 'Psíquico',
    electric: 'Elétrico'
  });



  async function pokemonsFetch () {
    let pokemonList = Array.from({ length: 150 }, () => null);

    let mappedPokeList = await pokemonList.map((_, index) => {
      let pokeIndex = index + 1;

      return fetch(`${baseURL}/${pokeIndex}`)
        .then(response => response.json())
        .catch(showErrorDetails);
    });

    return await Promise.all(mappedPokeList);
  }




  function showErrorDetails (error) {
    console.error('Error while fetching pokemons', error);
  }




  function findAncestor (el, classSelector) {
    while ((el = el.parentElement) && !el.classList.contains(classSelector));

    return el;
  }




  function translateY (value) {
    return `translateY(${value}px)`;
  }




  function translateMenuItemYPosition (newValue) {
    document.querySelector('.flag-active.menuwrapper__item').style.transform = translateY(newValue - 84);
  }




  function smartMenuWrapperTranslate (currentItem, totalItens) {
    let currentYTransfom = 0, totalHalf = Math.floor(totalItens / 2);

    let selectedItemIsHigherThanHalf = currentItem > totalHalf;

    if (selectedItemIsHigherThanHalf) {
      currentYTransfom = (currentItem - totalHalf) * 60;
    }

    document.querySelector('.menuwrapper').style.transform = translateY(-currentYTransfom);
  }




  function scrollTo (y) {
    document.querySelector('.maincontainer__wrapper').scroll(0, y);
  }



  function selectPokemonByItsType (type) {
    let { currentType } = pokeInfo;

    const pokeList = Array.from(
      document.querySelectorAll('.maincontainer__wrapper .pokemoncard')
    );

    pokeList.forEach(poke => {
      poke.classList.toggle('inevidence', !poke.classList.contains(type));
    });

    document.querySelector('.flag-active').classList.remove('disabled');

    let find = pokeList.find(poke => poke.classList.contains(type));

    scrollTo(find.offsetTop - 10);
  }



  function asideMenuItemClick (e) {
    let selectedItemIndex,
        target = findAncestor(e.target, 'menuwrapper__item'),
        asideMenuItens = Array.from(target.parentElement.children);

    translateMenuItemYPosition(target.offsetTop);

    asideMenuItens.forEach((child, index) => {
      let eventCameFromHere = child === target;

      child.classList.toggle('selected', eventCameFromHere);

      selectedItemIndex = eventCameFromHere
        ? index
        : selectedItemIndex;
    });

    smartMenuWrapperTranslate(selectedItemIndex, asideMenuItens.length);

    selectPokemonByItsType(target.dataset.type);
  }




  async function renderPokemons () {
    let pokemons = await pokemonsFetch();

    console.log(pokemons);

    pokemons.forEach((pokemon) => {
      let { id, name, types } = pokemon;

      id = String(id).padStart(3, '0');

      types = types.map(item => item.type.name);

      let typeSTR = types.map(name => 
        `<td class="pill ${name}">
          ${typeTranslate[name]}
        </td>`
      ).join('');

      document.querySelector('#main-section .maincontainer .maincontainer__wrapper').insertAdjacentHTML('beforeend', `
        <div class="pokemoncard ${types.join(' ')}">
          <div class="pokemoncard__wrapper">
            <figure class="pokemoncard__wrapper-image">
              <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${id}.png" alt="${name}" />
            </figure>

            <table class="pokemoncard__wrapper-info">
              <tr>
                <td class="pokename">
                  <h4>${name}</h4>
                </td>
              </tr>

              <tr class="poketype">
                ${typeSTR}
              </tr>
            </table>
          </div>
        </div>
      `);


      setTimeout(function () {
        document.querySelector('.share').classList.add('visible');
      }, 12000);
    });
  }




  document.querySelectorAll('.menuwrapper li.menuwrapper__item:not(.master):not(.flag-active)').forEach(menuItem => {
    menuItem.addEventListener('click', asideMenuItemClick, false);
  });




  function closeModal () {
    document.querySelector('.modal').classList.remove('visible');
  }




  document.querySelector('.menuwrapper__item.master').addEventListener('click', e => {
    let pokeList = Array.from(
      document.querySelectorAll('.maincontainer__wrapper .pokemoncard')
    );

    scrollTo(0);

    pokeList.forEach(poke => poke.classList.remove('inevidence'));

    document.querySelector('.flag-active').classList.add('disabled');
  }, false);



  [document.querySelector('.share .sharewrapper .closer')].forEach(el => {
    el.addEventListener('click', e => {
      closeModal();
    });
  });




  document.querySelector('button[type="submit"]').addEventListener('click', e => {
    let { name, mail } = document.forms.share;

    let focus = !name.value.trim()
      ? name
      : !mail.value.trim()
        ? mail
        : null;

    if (focus) {
      return focus.focus();
    }

    closeModal();
  }, false);



  renderPokemons();
})();
