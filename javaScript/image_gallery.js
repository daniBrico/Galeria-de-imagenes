const d = document,
  w = window,
  accesKey = "Dr5Pvu60URBR5yKOMWGNWF5nFeY1Ns2UOOv1VTNkX0E";
let filtro = undefined,
  page = 1,
  control = 0;

const getData = async (filtro = undefined) => {
  try {
    const $fragment = d.createDocumentFragment(),
      $sectionImages = d.getElementById("section_image");
    let json;

    if (filtro !== undefined) {
      json = await traerDatosUnplash(filtro);
    } else {
      json = await traerDatosUnplash();
    }

    let cantidadImagenes = Object.keys(json).length;

    if (cantidadImagenes === 0) {
      mostrarMensaje("Ingrese otra palabra clave");
    } else {
      json.forEach((e) => {
        const $article = d.createElement("article");
        $article.classList.add("main__article");
        $article.innerHTML = `
          <img class="main__img" src=${e.urls.small} alt="${e.alt_description}">
        `;
        $fragment.appendChild($article);
      });

      $sectionImages.appendChild($fragment);
    }
  } catch (err) {
    console.log(err);
  }
}

const traerDatosUnplash = async (filtro = undefined) => {
  try {
    let res,
      json;

    if (filtro === undefined) {
      res = await axios.get(`https://api.unsplash.com/photos/random?count=12&client_id=${accesKey}`);
      json = await res.data;
    } else {
      console.log(page);
      res = await axios.get(`https://api.unsplash.com/search/photos?per_page=12&page=${page}&query=${filtro}&client_id=${accesKey}`);
      json = await res.data.results;
    }

    return json;
  } catch (err) {
    console.log(err);
  }
}


const mostrarMensaje = (palabraClave) => {
  const $h1Mensaje = d.querySelector(".div__h1-mensaje"),
    $modalMensaje = d.getElementById("modal-mensaje");

  $h1Mensaje.textContent = palabraClave;
  $modalMensaje.classList.add("view");

  setTimeout(() => {
    $modalMensaje.classList.remove("view");
  }, 1500);
}

const eliminarElementos = () => {
  const $sectionImage = d.getElementById("section_image");
  let $articleLista = d.querySelectorAll("article");

  $articleLista.forEach((e) => {
    $sectionImage.removeChild(e);
  });
}

const scrollTopBtn = () => {
  const $btnScroll = d.querySelector(".scroll-top-btn");

  w.addEventListener("scroll", (e) => {
    let scrollTop = w.pageYOffset || d.documentElement.scrollTop;
    if (scrollTop > 100) {
      $btnScroll.classList.remove("hidden");
    } else {
      $btnScroll.classList.add("hidden");
    }
  });
}

d.addEventListener("DOMContentLoaded", (e) => {
  getData();
  scrollTopBtn();
});

d.addEventListener("click", (e) => {
  if (e.target.matches(".main__img")) {
    const $modal = d.getElementById("div-modal"),
      $divImg = d.querySelector(".div__img"),
      $divPDescription = d.querySelector(".div__p-description");

    $divImg.setAttribute("src", `${e.target.getAttribute("src")}`);
    $divPDescription.textContent = `${e.target.getAttribute("alt")}`;
    $modal.classList.add("view");
  }

  if ((e.target.matches(".div__modal-container")) || (e.target.matches(".div__modal"))) {
    if (e.target.matches(".div__modal")) {
      e.target.parentNode.classList.remove("view");
    } else {
      e.target.classList.remove("view");
    }
  }

  if (e.target.matches(".btn_buscar")) {
    const $inputText = d.querySelector(".header__input-text");
    if ($inputText.value !== "") {
      control = 0;
      page = 1;
      filtro = $inputText.value;
      eliminarElementos();
      getData($inputText.value);
    } else {
      mostrarMensaje("El cuadro de texto esta vacío");
    }
  }

  if (e.target.matches("#mostrar-mas")) {
    if (control < 3) {
      if (filtro === undefined) {
        getData(filtro);
      } else {
        page++;
        console.log(page);
        getData(filtro);
      }
      control++;
    } else {
      mostrarMensaje("Llegó al límite de busquedas");
    }
  }

  if (e.target.matches(".main__btn-fotos-random")) {
    const $btnBuscar = d.querySelector(".header__input-text");
    $btnBuscar.value = "";
    filtro = undefined;
    console.log("entro");
    eliminarElementos();
    getData();
  }

  if ((e.target.matches(".scroll-top-btn")) || (e.target.matches(".scroll-top-btn *"))) {
    w.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }
});