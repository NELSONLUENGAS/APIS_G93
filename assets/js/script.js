// Lista de ciudades con coordenadas
const cities = [
	{
		id: 'santiago',
		name: 'Santiago',
		country: 'Chile',
		lat: -33.4489,
		lon: -70.6693,
	},
	{
		id: 'buenos_aires',
		name: 'Buenos Aires',
		country: 'Argentina',
		lat: -34.6037,
		lon: -58.3816,
	},
	{ id: 'lima', name: 'Lima', country: 'Perú', lat: -12.0464, lon: -77.0428 },
	{
		id: 'bogota',
		name: 'Bogotá',
		country: 'Colombia',
		lat: 4.711,
		lon: -74.0721,
	},
	{
		id: 'mexico_city',
		name: 'Ciudad de México',
		country: 'México',
		lat: 19.4326,
		lon: -99.1332,
	},
	{
		id: 'quito',
		name: 'Quito',
		country: 'Ecuador',
		lat: -0.1807,
		lon: -78.4678,
	},
	{
		id: 'montevideo',
		name: 'Montevideo',
		country: 'Uruguay',
		lat: -34.9011,
		lon: -56.1645,
	},
	{
		id: 'caracas',
		name: 'Caracas',
		country: 'Venezuela',
		lat: 10.4806,
		lon: -66.9036,
	},
	{
		id: 'saopaulo',
		name: 'São Paulo',
		country: 'Brasil',
		lat: -23.5505,
		lon: -46.6333,
	},
	{
		id: 'rio_de_janeiro',
		name: 'Rio de Janeiro',
		country: 'Brasil',
		lat: -22.9068,
		lon: -43.1729,
	},
	{
		id: 'san_jose',
		name: 'San José',
		country: 'Costa Rica',
		lat: 9.9281,
		lon: -84.0907,
	},
	{
		id: 'asuncion',
		name: 'Asunción',
		country: 'Paraguay',
		lat: -25.2637,
		lon: -57.5759,
	},
	{
		id: 'la_paz',
		name: 'La Paz',
		country: 'Bolivia',
		lat: -16.4897,
		lon: -68.1193,
	},
	{
		id: 'santo_domingo',
		name: 'Santo Domingo',
		country: 'República Dominicana',
		lat: 18.4861,
		lon: -69.9312,
	},
	{
		id: 'guatemala_city',
		name: 'Ciudad de Guatemala',
		country: 'Guatemala',
		lat: 14.6349,
		lon: -90.5069,
	},
];

// Mapeo de códigos climáticos a condiciones e íconos
const weatherCodes = {
	0: {
		condition: 'Despejado',
		icon: 'fa-sun',
		color: 'from-yellow-400 to-orange-400',
	},
	1: {
		condition: 'Mayormente despejado',
		icon: 'fa-cloud-sun',
		color: 'from-blue-300 to-cyan-300',
	},
	2: {
		condition: 'Parcialmente nublado',
		icon: 'fa-cloud-sun',
		color: 'from-blue-300 to-gray-300',
	},
	3: {
		condition: 'Nublado',
		icon: 'fa-cloud',
		color: 'from-gray-400 to-gray-600',
	},
	45: {
		condition: 'Niebla',
		icon: 'fa-smog',
		color: 'from-gray-300 to-gray-500',
	},
	51: {
		condition: 'Llovizna ligera',
		icon: 'fa-cloud-rain',
		color: 'from-blue-400 to-cyan-300',
	},
	53: {
		condition: 'Llovizna moderada',
		icon: 'fa-cloud-rain',
		color: 'from-blue-500 to-cyan-400',
	},
	61: {
		condition: 'Lluvia ligera',
		icon: 'fa-cloud-showers-heavy',
		color: 'from-blue-500 to-cyan-400',
	},
	63: {
		condition: 'Lluvia moderada',
		icon: 'fa-cloud-showers-heavy',
		color: 'from-blue-600 to-cyan-500',
	},
	80: {
		condition: 'Chubascos',
		icon: 'fa-cloud-showers-heavy',
		color: 'from-blue-500 to-cyan-400',
	},
	95: {
		condition: 'Tormenta',
		icon: 'fa-bolt',
		color: 'from-purple-500 to-indigo-700',
	},
};

let tempChart = null;

const fetchWeatherData = async (city) => {
	try {
		const response = await fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`
		);
		if (!response.ok) throw new Error('Error en la API');

		return await response.json();
	} catch (error) {
		throw new Error(error.message || 'Error consultando los datos');
	}
};

const renderCityCards = async () => {
	const grid = document.getElementById('cities-grid');
	grid.innerHTML = '';

	for (const city of cities) {
		const weatherData = await fetchWeatherData(city);
		if (!weatherData) continue;

		const current = weatherData.current;
		const weatherCode = current.weather_code;
		const weatherInfo = weatherCodes[weatherCode] || weatherCodes[3];

		const card = document.createElement('div');

		card.className =
			'weather-card bg-slate-800 rounded-xl overflow-hidden fade-in';

		card.innerHTML = `
			<div class="relative">
                <div class="h-32 bg-gradient-to-r ${weatherInfo.color} flex items-center justify-center">
                    <i class="fas ${weatherInfo.icon} text-5xl text-white weather-icon"></i>
                </div>
            </div>
            <div class="p-5">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-xl font-bold">${city.name}</h3>
                        <p class="text-gray-400">${city.country}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-3xl font-bold">${current.temperature_2m}°C</p>
                        <p class="text-gray-400 text-sm">${weatherInfo.condition}</p>
                    </div>
                </div>
                
                <button class="w-full mt-4 bg-primary hover:bg-secondary transition-colors py-2 rounded-lg font-medium flex items-center justify-center forecast-btn" data-id="${city.id}">
                    <i class="fas fa-chart-line mr-2"></i>Ver pronóstico
                </button>
            </div>
		`;

		grid.appendChild(card);

		const btn = card.querySelector('.forecast-btn');
		btn.addEventListener('click', function () {
			showForecast(city, weatherData);
		});
	}

	document.getElementById('update-time').textContent =
		new Date().toLocaleTimeString('es-CO', {
			hour: '2-digit',
			minute: '2-digit',
		});

	document.getElementById('loading').classList.add('hidden');
};

const showForecast = (city, weatherData) => {
	document.getElementById(
		'modal-title'
	).textContent = `Pronóstico en ${city.name}, ${city.country}`;

	const daily = weatherData.daily;
	const maxTemp = Math.max(...daily.temperature_2m_max);
	const minTemp = Math.min(...daily.temperature_2m_min);

	document.getElementById('max-temp').textContent = `${maxTemp}°C`;
	document.getElementById('min-temp').textContent = `${minTemp}°C`;

	const dailyContainer = document.getElementById('daily-forecast');
	dailyContainer.innerHTML = '';

	for (let i = 0; i < daily.time.length; i++) {
		const date = new Date(daily.time[i]);
		const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });

		const weatherCode = daily.weather_code[i];
		const weatherInfo = weatherCodes[weatherCode] || weatherCodes[3];

		const dayElement = document.createElement('div');

		dayElement.className =
			'bg-slate-800 p-3rounded-lg text-center fade-in mb-2';

		dayElement.innerHTML = `
			<div class="flex items-center">
                <i class="fas ${weatherInfo.icon} text-xl mr-3 ${
			i === 0 ? 'text-yellow-400' : 'text-white'
		}"></i>
                <div class="flex-1">
                    <p class="font-bold">${dayName}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold">${daily.temperature_2m_max[i]}°C</p>
                    <p class="text-xs text-gray-400">${
											daily.temperature_2m_min[i]
										}°C</p>
                </div>
            </div>
		`;

		dailyContainer.appendChild(dayElement);
	}

	createTemperatureChart(weatherData);

	document.getElementById('forecast-modal').classList.remove('hidden');
};

const createTemperatureChart = (weatherData) => {
	const ctx = document.getElementById('temperature-chart').getContext('2d');

	if (tempChart) {
		tempChart.destroy();
	}

	const daily = weatherData.daily;
	const days = daily.time.map((date) => {
		const d = new Date(date);
		return d.toLocaleDateString('es-ES', { weekday: 'short' });
	});

	tempChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: days,
			datasets: [
				{
					label: 'Máxima',
					data: daily.temperature_2m_max,
					borderColor: '#f97316',
					backgroundColor: 'rgba(249, 115, 22, 0.1)',
					borderWidth: 3,
					pointBackgroundColor: '#fff',
					pointRadius: 5,
					fill: true,
					tension: 0.3,
				},
				{
					label: 'Mínima',
					data: daily.temperature_2m_min,
					borderColor: '#3b82f6',
					backgroundColor: 'rgba(59, 130, 246, 0.1)',
					borderWidth: 3,
					pointBackgroundColor: '#fff',
					pointRadius: 5,
					fill: true,
					tension: 0.3,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					labels: {
						color: '#e3e8f0',
						font: {
							size: 14,
						},
					},
				},
			},
			scales: {
				x: {
					grid: {
						color: 'rgba(100, 116, 139, 0.2)',
					},
					ticks: {
						color: '#cbd5e1',
					},
				},
				y: {
					grid: {
						color: 'rgba(100, 116, 139, 0.2)',
					},
					ticks: {
						color: '#cbd5e1',
						callback: function (value) {
							return `${value}°C`;
						},
					},
				},
			},
		},
	});
};

// Event listeners
document.getElementById('refresh-btn').addEventListener('click', () => {
	document.getElementById('loading').classList.remove('hidden');
	renderCityCards();
});

document.getElementById('close-modal').addEventListener('click', () => {
	document.getElementById('forecast-modal').classList.add('hidden');
});

// inicializar
document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('loading').classList.add('hidden');
	renderCityCards();
});
