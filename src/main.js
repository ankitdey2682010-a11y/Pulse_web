import { ssrExportAllKey } from 'vite/runtime';
import './style.css';

const datePicker = document.getElementById('date-picker');

const fetchBtn = document.getElementById('fetch-btn');

const loadingSpinner = document.getElementById('loading');

const mediaContainer = document.getElementById('media-container');

const mediaTitle = document.getElementById('media-title');

const mediaDate = document.getElementById('media-date');

const mediaExplanation = document.getElementById('media-explanation');

const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

const today = new Date().toISOString().split('T')[0];
datePicker.max = today;

async function fetchNASAData(selectedDate = '') 
{
    showLoading(true);
    mediaTitle.textContent = 'Loading cosmic data...';
    mediaExplanation.textContent = '';
    mediaDate.textContent = '';
    mediaContainer.innerHTML = '';

    try 
    {
        let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
        if (selectedDate) {
            url += `&date=${selectedDate}`;
        }

        const response = await fetch(url);
        
        if (!response.ok) 
            {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.msg || errorData.error?.message || `HTTP Error ${response.status}`);
        }

        const data = await response.json();
        renderData(data);
    } catch (error) {
        console.error('Fetch error:', error);
        mediaTitle.textContent = 'Failed to load APOD data';
        mediaExplanation.textContent = `Error: ${error.message}. Please try again or pick another date.`;
    } finally {
        showLoading(false);
    }
}

function renderData(data) {
    mediaTitle.textContent = data.title || 'Astronomy Picture of the Day';
    mediaDate.textContent = data.date || '';
    mediaExplanation.textContent = data.explanation || 'No description provided.';

    mediaContainer.innerHTML = '';

    if (data.media_type === 'image') {
        const img = document.createElement('img');
        img.src = data.hdurl || data.url;
        img.alt = data.title;
        img.className = 'apod-media';
        mediaContainer.appendChild(img);
    } else if (data.media_type === 'video') {
        const iframe = document.createElement('iframe');
        iframe.src = data.url;
        iframe.title = data.title;
        iframe.allowFullscreen = true;
        iframe.className = 'apod-media apod-video';
        mediaContainer.appendChild(iframe);
    }
}

function showLoading(isLoading) 
{
    if (loadingSpinner) 
        {
        if (isLoading) 
            {
            loadingSpinner.classList.remove('hidden');
        }
         else 
            {
            loadingSpinner.classList.add('hidden');
        }
    }
}

fetchBtn.addEventListener('click', () => {
    fetchNASAData(datePicker.value);
});

fetchNASAData();
