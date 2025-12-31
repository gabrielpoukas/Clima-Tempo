
const key = "beade7bb60774427d8ba46e561395f23"; 

function colocarDadosNaTela(dados) {
    console.log(dados); 

    document.querySelector("#city").innerHTML = `${dados.name}, ${dados.sys.country}`;

    document.querySelector("#temp").innerHTML = Math.floor(dados.main.temp) + "°C";

    document.querySelector("#description").innerHTML = dados.weather[0].description;

    document.querySelector("#humidity").innerHTML = dados.main.humidity + "%";

    document.querySelector("#wind").innerHTML = Math.floor(dados.wind.speed * 3.6) + " km/h";

    const iconCode = dados.weather[0].icon;
    document.querySelector("#weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    document.querySelector("#weather-result").style.display = "block";

    function atualizarFundo(clima) {
        const body = document.body;
        body.classList.remove("clouds", "clear", "rain", "snow");
    
        const estado = clima.toLowerCase();
    
        if (estado.includes("nuven") || estado.includes("cloud") || estado.includes("nublado") || estado.includes("mist")) {
            body.classList.add("clouds");
        } 
        else if (estado.includes("limpo") || estado.includes("clear") || estado.includes("sol") || estado.includes("ensolarado")) {
            body.classList.add("clear");
        } 
        else if (estado.includes("chuva") || estado.includes("rain") || estado.includes("drizzle") || estado.includes("tempestade")) {
            body.classList.add("rain");
        } 
        else if (estado.includes("neve") || estado.includes("snow")) {
            body.classList.add("snow");
        }
    }
    
    atualizarFundo(dados.weather[0].main);




}

async function buscarCidade(cidade) {
    const loading = document.querySelector("#loading");
    const result = document.querySelector("#weather-result");
    const forecast = document.querySelector("#forecast-container");

    result.classList.add("hidden");
    forecast.classList.add("hidden");
    loading.classList.remove("hidden");

    const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)},BR&appid=${key}&lang=pt_br&units=metric`;
    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cidade)},BR&appid=${key}&lang=pt_br&units=metric`;

    try {
        const [resCurrent, resForecast] = await Promise.all([
            fetch(urlCurrent),
            fetch(urlForecast)
        ]);

        if (!resCurrent.ok || !resForecast.ok) throw new Error("Cidade não encontrada!");

        const dadosCurrent = await resCurrent.json();
        const dadosForecast = await resForecast.json();

        loading.classList.add("hidden");
        result.classList.remove("hidden");
        forecast.classList.remove("hidden");

        colocarDadosNaTela(dadosCurrent);
        mostrarPrevisao(dadosForecast);

    } catch (erro) {
        loading.classList.add("hidden");
        alert(erro.message);
    }
}

function mostrarPrevisao(dados) {
    const container = document.querySelector("#forecast-container");
    container.innerHTML = ""; 

    const listaDias = dados.list.filter(item => item.dt_txt.includes("12:00:00"));

    listaDias.forEach(item => {
        const data = new Date(item.dt * 1000);
        const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');

        container.innerHTML += `
            <div class="forecast-item">
                <p class="day">${diaSemana}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="clima">
                <p class="temp">${Math.floor(item.main.temp)}°C</p>
            </div>
        `;
    });
}
function cliqueiNoBotao() {
    const cidade = document.querySelector("#city-input").value;
    
    if (cidade.trim() === "") {
        alert("Por favor, digite o nome de uma cidade.");
        return;
    }

    buscarCidade(cidade);
}

document.querySelector("#search-button").addEventListener("click", cliqueiNoBotao);

document.querySelector("#city-input").addEventListener("keypress", (evento) => {
    if (evento.key === "Enter") {
        cliqueiNoBotao();
    }
});