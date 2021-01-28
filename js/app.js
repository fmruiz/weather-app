// DOM vars
const container = document.querySelector('.container');
const resultado = document.querySelector('.resultado');
const formulario = document.querySelector('#formulario');


// window listener
window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});


// functions
const buscarClima = e => {
    e.preventDefault();
    // country n cities vars
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;
    // validation
    if(ciudad === '' || pais === '') {      
        // show error
        error('Ambos campos son obligatorios');
        return;
    };
    // API
    consultaAPI(ciudad, pais);
};

// error message
const error = mje => {
    const alerta = document.querySelector('.bg-danger');

    if(!alerta) {
        // create element
        const alerta = document.createElement('div');
        alerta.classList.add('col-6', 'bg-danger', 'text-light', 'text-center', 'rounded', 'mx-auto', 'py-2', 'mt-3');
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="d-block">${mje}</span>`
        // add to container element
        container.appendChild(alerta);
        // remove element
        setTimeout(() => {
            alerta.remove()
        }, 5000);
    };
};

// API request
const consultaAPI = (ciudad, pais) => {
    // key n url vars
    const appID = '369bdec3fc9bc9d9916842e40c227695';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            // clean last search
            cleanHTML();
            // if city is wrong
            if(data.cod == '404') {
                error('Ciudad no encontrada');
            };
            // show results
            mostrarClima(data);
        })
};

// show results
const mostrarClima = data => {
    // data destructuring and conversion to celsius var
    const {main:{temp, temp_max, temp_min}, name} = data;
    const temperature = celsius(temp)
    const temperature_max = celsius(temp_max)
    const temperature_min = celsius(temp_min)

    // title city
    const cityName = document.createElement('h3');
    cityName.classList.add('city-name', 'text-center', 'my-5');
    cityName.innerHTML = name
    resultado.append(cityName)
    // tempDiv
    const tempDiv = document.createElement('div');
    tempDiv.classList.add('d-flex', 'justify-content-around', 'align-items-center')
    tempDiv.innerHTML = `
    <span>${temperature}°C</span>
    <div class="d-flex flex-column">
    <span>${temperature_max}°C</span>
    <span>${temperature_min}°C</span>
    </div>`
    resultado.append(tempDiv)
};

// rounding data n convert to celsius
const celsius = data => {
    const temp = parseInt(data)
    return Math.round(temp-273.15)
};

// clean last search
const cleanHTML = () => {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    };
};


