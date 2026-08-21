const datePicker = document.getElementById('date-picker');
const fetchBtn = document.getElementById('fetch-btn');
const loadingSpinner = document.getElementById('loading');
const mediaContainer = document.getElementById('media-container');
const mediaTitle = document.getElementById('media-title');
const mediaDate = document.getElementById('media-date');
const mediaExplanation = document.getElementById('media-explanation');

const API_KEY = 'Mj3DXH3FK2rHl8M6H60im2gw7AfpDr5pPvW6fuYu';

// Set default max date to today's date in YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];
datePicker.max = today;

async function fetchNASAData(selectedDate = '') {
    showLoading(true);
    mediaTitle.textContent = 'Loading cosmic data...';
    mediaExplanation.textContent = '';
    mediaDate.textContent = '';
    mediaContainer.innerHTML = '';

    try {
        let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
        if (selectedDate) {
            url += `&date=${selectedDate}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || data.error?.message || `HTTP ${response.status}: Failed to fetch image.`);
        }

        renderData(data);
    } catch (error) {
        console.error('Fetch error:', error);
        mediaTitle.textContent = 'Unable to Load Picture';
        mediaExplanation.innerHTML = `<span style="color: #f87171;">${error.message}</span>`;
    } finally {
        showLoading(false);
    }
}

function renderData(data) {
    mediaTitle.textContent = data.title || 'Astronomy Picture of the Day';
    mediaDate.textContent = data.date || '';
    mediaExplanation.textContent = data.explanation || 'No description provided.';
    mediaContainer.innerHTML = '';

    const mediaUrl = data.hdurl || data.url;

    if (data.media_type === 'image') {
        const img = document.createElement('img');
        img.src = mediaUrl;
        img.alt = data.title;
        img.style.maxWidth = '100%';
        img.style.borderRadius = '8px';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        mediaContainer.appendChild(img);
    } else if (data.media_type === 'video') {
        if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be') || mediaUrl.includes('vimeo.com')) {
            const iframe = document.createElement('iframe');
            iframe.src = mediaUrl;
            iframe.title = data.title;
            iframe.allowFullscreen = true;
            iframe.style.width = '100%';
            iframe.style.height = '400px';
            iframe.style.border = 'none';
            iframe.style.borderRadius = '8px';
            mediaContainer.appendChild(iframe);
        } else {
            mediaContainer.innerHTML = `
                <div style="padding: 1.5rem; text-align: center; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    <p style="margin-bottom: 0.8rem; color: #cbd5e1;">This media must be viewed directly on the source host:</p>
                    <a href="${mediaUrl}" target="_blank" rel="noopener noreferrer" style="color: #93c5fd; text-decoration: underline; font-weight: bold;">
                        Open Media in New Tab ↗
                    </a>
                </div>
            `;
        }
    }
}

function showLoading(isLoading) {
    if (loadingSpinner) {
        loadingSpinner.classList.toggle('hidden', !isLoading);
    }
}

fetchBtn.addEventListener('click', () => {
    fetchNASAData(datePicker.value);
});

// Automatically fetch today's picture
fetchNASAData();