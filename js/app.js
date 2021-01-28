// DOM vars
const container = document.querySelector('.container');
const resultado = document.querySelector('.resultado');
const formulario = document.querySelector('#formulario');

// countries array to change backgroundImage
const countries = [   '../img/argentina.jpg', 
                '../img/brasil.jpg',
                '../img/bolivia.jpg',
                '../img/chile.jpg',
                '../img/colombia.jpg',
                '../img/peru.jpg',]

// window listener
window.addEventListener('load', () => {
    formulario.addEventListener('submit', searchTemp);
    // change random backgroundImg
    const random = Math.floor(Math.random()*countries.length);
    document.body.style.backgroundImage = `url(${countries[random]})`;
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
});


// functions
const searchTemp = e => {
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
    requestAPI(ciudad, pais);
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
const requestAPI = (ciudad, pais) => {
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
            showResults(data);
        })
};

// show results
const showResults = data => {
    // data destructuring and conversion to celsius var
    const {main:{temp, temp_max, temp_min}, name} = data;
    const temperature = celsius(temp);
    const temperature_max = celsius(temp_max);
    const temperature_min = celsius(temp_min);
    const daySensation = sensation(temperature);

    // title city
    const cityName = document.createElement('h2');
    cityName.classList.add('city-name', 'text-center', 'mb-5', 'mt-3');
    cityName.innerHTML = name;
    resultado.append(cityName);
    // tempDiv
    const tempDiv = document.createElement('div');
    tempDiv.classList.add('d-flex', 'justify-content-around', 'align-items-center');
    tempDiv.innerHTML = `
    <span class="temperature">${temperature}°C</span>
    <div class="d-flex flex-column">
    <span>${temperature_max}°C MAX</span>
    <span>${temperature_min}°C MIN</span>
    <p class="text-center sensation">${daySensation}</p>
    </div>`
    resultado.append(tempDiv);
};

// rounding data n convert to celsius
const celsius = data => {
    const temp = parseInt(data)
    return Math.round(temp-273.15)
};

// day sensation data
const sensation = data => {
    const tempSensation = parseInt(data)
    if(tempSensation>25){
        return "Dia caluroso"
    } if(tempSensation>15 && tempSensation<=25) {
        return "Dia calido"
    } if(tempSensation<15) {
        return "Dia frio"
    }
}

// clean last search
const cleanHTML = () => {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    };
};




