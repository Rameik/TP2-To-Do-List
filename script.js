const lista = document.getElementById("lista");
const addButton = document.getElementById("add");
const deleteAllBtn = document.getElementById("deleteAll");
const fastestTask = document.getElementById("fastestTask")
let id = 0;

let listaElementos = [];

deleteAllBtn.addEventListener('click', () => {
    listaElementos = [];
    lista.innerHTML = "";
})

fastestTask.addEventListener('click', () => getFastestTask())

const addElementList = (contenido, fechaCreado, fechaTachado = "", checked = false) => {
    let elementoLista = {
        id: id,
        contenido: contenido,
        fechaCreado: fechaCreado,
        fechaTachado: fechaTachado,
        checked: checked
    }
    listaElementos.push(elementoLista)

    let element = listaElementos[listaElementos.length - 1]
    let node = renderList(element)
    
    lista.innerHTML += node;
    id++;
}

const checkElement = (checkbox) => {
    let elemento;

    listaElementos.forEach((item) => {
        if(item.id === parseInt(checkbox.dataset.id)) elemento = item
    })

    elemento.checked = !elemento.checked
    let variable="";

    if(elemento.fechaTachado === ""){
        elemento.fechaTachado = Date.now()
        variable = `Completado: ${new Date(elemento.fechaTachado).toLocaleDateString()} ${new Date(elemento.fechaTachado).toLocaleTimeString()}`
    }
    else{
        elemento.fechaTachado = ""
    }

    let tachado = checkbox.previousElementSibling
    tachado.innerHTML = variable

    let textoTachado = checkbox.parentNode.firstElementChild
    elemento.checked ? textoTachado.classList.add("checked") : textoTachado.classList.remove("checked")

    if (elemento.checked) {
        checkbox.style.padding = "12px"
        checkbox.innerHTML = '<span class="material-symbols-outlined">check</span>'
    }
    else{
        checkbox.innerHTML = ""
        checkbox.style.padding = "24px"
    }
}

const renderList = (element) => {
    const node = `<li>
    <p>${element.contenido}</p>
    <p>Creado: ${new Date(element.fechaCreado).toLocaleDateString()} ${new Date(element.fechaCreado).toLocaleTimeString()}</p>
    <p>${element.fechaTachado}</p>
    <button data-id="${element.id}" id="checkbox"></button>
    <button data-id="${element.id}" id="deleteOne"><span class="material-symbols-outlined">cancel</span></button>
    </li>`

    return node;
}

addButton.addEventListener('click', () => {
    let content = document.getElementById('contentInput').value
    if (content != '') {
        addElementList(content, Date.now())
        controlChecks()
        controlDeletes()
    }
    else{
        alert('El elemento está vacio')
    }
})

const controlChecks = () => {
    let listaChecks = document.querySelectorAll('#checkbox');

    listaChecks.forEach(checkbox => {
        checkbox.addEventListener('click', () => checkElement(checkbox));
    });
}

const controlDeletes = () => {
    let listaDelete = document.querySelectorAll('#deleteOne');

    listaDelete.forEach(element => {
        element.addEventListener('click', () => deleteOne(element));
    });
}

const getElementLi = (id) => {
    let listaLi = document.querySelectorAll('#element-li');
    let item;

    listaLi.forEach(element => {
        if(parseInt(element.dataset.id) === parseInt(id)) item = element
    });

    return item;
}

const deleteOne = (element) => {
    let liElement;

    listaElementos.forEach((item) => {
        if(item.id === parseInt(element.dataset.id)) liElement = item
    })

    var indice = listaElementos.indexOf(liElement);
    listaElementos.splice(indice, 1);

    lista.removeChild(element.parentNode)
}

const getFastestTask = () => {
    let map1 = listaElementos.map((element) => {
        return {
            id: element.id,
            tiempoTardado: new Date(element.fechaTachado) - new Date(element.fechaCreado)
        }
    });

    let minimo = map1.reduce((minimo, actual) => {
        return actual.tiempoTardado < minimo.tiempoTardado ? actual : minimo;
    });

    let listaChecks = document.querySelectorAll('#checkbox');
    let item;
    listaChecks.forEach(element => {
        element.parentNode.style.borderColor = "rgb(78, 76, 76)";
        if(parseInt(element.dataset.id) === parseInt(minimo.id)) item = element
    });
    
    item.parentNode.style.borderColor = "rgba(50, 50, 146, 0.836)";
}