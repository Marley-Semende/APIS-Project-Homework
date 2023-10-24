// Constants
const apiKey = config.apiKey;
const resultsPerPage = 10;
let currentPage = 1;
let currentQuery = '';

// Functions
const searchAlbum = async () => {
    currentQuery = document.getElementById('search').value.trim();
    const albumDetails = document.getElementById('album-details');
    const loading = document.getElementById('loading');

    if (!currentQuery) {
        showToast('Please enter an album name.');
        return;
    }

    try {
        currentPage = 1;
        loading.style.display = 'block';
        albumDetails.style.display = 'none';
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(currentQuery)}&api_key=${apiKey}&format=json&limit=${resultsPerPage}&page=${currentPage}`);
        const data = await response.json();

        if (!data.results.albummatches.album || data.results.albummatches.album.length === 0) {
            showToast('Album not found. Please check the name.');
        } else {
            const albums = data.results.albummatches.album;
            displayAlbums(albums);
        }
    } catch (error) {
        showToast('Error fetching data from Last.fm API.');
    } finally {
        loading.style.display = 'none';
    }
}

const clearInput = () => {
    document.getElementById('search').value = '';
}

const displayAlbums = (albums) => {
    const albumDetails = document.getElementById('album-details');
    albumDetails.innerHTML = '';
    albumDetails.style.display = 'block';

    albums.forEach((album) => {
        const albumElement = document.createElement('div');
        albumElement.classList.add('album');
        albumElement.innerHTML = `
            <h2>${album.name} by ${album.artist}</h2>
            <img src="${album.image[2]['#text']}" alt="${album.name} cover">
            <p><strong>Artist:</strong> ${album.artist}</p>
            <p><strong>Album Name:</strong> ${album.name || 'Not Available'}</p>
            <p><strong>Release Date:</strong> ${album.releasedate || 'Not Available'}</p>
            <p><strong>Listeners:</strong> ${album.listeners || 'Not Available'}</p>
            <p><strong>Playcount:</strong> ${album.playcount || 'Not Available'}</p>
        `;

        albumDetails.appendChild(albumElement);
    });

    if (albums.length === resultsPerPage) {
        document.getElementById('load-more-button').style.display = 'block';
    } else {
        document.getElementById('load-more-button').style.display = 'none';
    }
}

const loadMoreResults = async () => {
    currentPage++;
    const loading = document.getElementById('loading');

    try {
        loading.style.display = 'block';
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(currentQuery)}&api_key=${apiKey}&format=json&limit=${resultsPerPage}&page=${currentPage}`);
        const data = await response.json();

        if (data.results.albummatches.album && data.results.albummatches.album.length > 0) {
            const albums = data.results.albummatches.album;
            displayAlbums(albums);
        } else {
            showToast('No more results to load.');
        }
    } catch (error) {
        showToast('Error loading more results from Last.fm API.');
    } finally {
        loading.style.display = 'none';
    }
}
//toast
const showToast = (message) => {
    Toastify({
        text: message,
        backgroundColor: 'red',
    }).showToast();
}

// Event Listeners
document.getElementById('search-button').addEventListener('click', searchAlbum);
document.getElementById('clear-button').addEventListener('click', clearInput);
document.getElementById('search').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        searchAlbum();
    }
});
document.getElementById('load-more-button').addEventListener('click', loadMoreResults);



