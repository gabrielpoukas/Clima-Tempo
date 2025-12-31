
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
        document.body.classList.remove("clouds", "clear", "rain", "snow");
    
        const estadoClima = clima.toLowerCase();
    
        if (estadoClima.includes("clouds")) {
            document.body.classList.add("clouds");
        } else if (estadoClima.includes("clear")) {
            document.body.classList.add("clear");
        } else if (estadoClima.includes("rain") || estadoClima.includes("drizzle")) {
            document.body.classList.add("rain");
        } else if (estadoClima.includes("snow")) {
            document.body.classList.add("snow");
        }
    }
    
    atualizarFundo(dados.weather[0].main);




}

async function buscarCidade(cidade) {
    const loading = document.querySelector("#loading");
    const result = document.querySelector("#weather-result");

    result.style.display = "none";
    loading.style.display = "block";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade},BR&appid=${key}&lang=pt_br&units=metric`;

    try {
        const resposta = await fetch(url);
        
        if (!resposta.ok) {
            throw new Error("Cidade não encontrada. Verifique o nome!");
        }

        const dados = await resposta.json();
        
        loading.style.display = "none";
        colocarDadosNaTela(dados);

    } catch (erro) {
        loading.style.display = "none";
        alert(erro.message);
    }
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