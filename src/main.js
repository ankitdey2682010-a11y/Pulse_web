import './style.css';

const datePicker = document.getElementById('date-picker');

const fetchBtn = document.getElementById('fetch-btn');

const mediaContainer = document.getElementById('media-container');

const mediaTitle = document.getElementById('media-title');

const mediaDate = document.getElementById('media-date');

const mediaExplanation = document.getElementById('media-explanation');

const loadingSpinner = document.getElementById('loading');

const today = new Date().toISOString().split('T')[0];
datePicker.max = today;
datePicker.value = today;

async function fetchApod(date) 
{

    const apiKey = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    loadingSpinner.classList.remove('hidden');
    mediaContainer.innerHTML = '';
    
    try 
    {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data from NASA API');
        
        const data = await response.json();
        renderApod(data);
    } 
    catch (error) 
    {

        mediaTitle.textContent = "Error";
        mediaExplanation.textContent = error.message;
    }
     finally 
     {
        loadingSpinner.classList.add('hidden');
    }
}

function renderApod(data) 
{
    mediaTitle.textContent = data.title;
    mediaDate.textContent = data.date;
    mediaExplanation.textContent = data.explanation;

    if (data.media_type === 'image') {
        const img = document.createElement('img');
        img.src = data.hdurl || data.url;
        img.alt = data.title;
        mediaContainer.appendChild(img);
    } else if (data.media_type === 'video') {
        const iframe = document.createElement('iframe');
        iframe.src = data.url;
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        mediaContainer.appendChild(iframe);
    }
}

fetchBtn.addEventListener('click', () => {
    if (datePicker.value) {
        fetchApod(datePicker.value);
    }
});

fetchApod(today);