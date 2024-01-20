document.addEventListener('DOMContentLoaded', function () {
    // GitHub username for which you want to fetch repositories
    const username = 'SushantKumar1999';
    
    // GitHub API endpoint for fetching user details
    const userApiUrl = `https://api.github.com/users/${username}`;
    
    // GitHub API endpoint for fetching user repositories
    const reposApiUrl = `https://api.github.com/users/${username}/repos`;

    // Number of repositories to display per page
    const repositoriesPerPage = 4;

    // Fetch user details from GitHub API
    fetch(userApiUrl)
        .then(response => response.json())
        .then(userData => {
            // Display user profile picture and other details
            displayUserDetails(userData);

            // Fetch repositories from GitHub API
            return fetch(reposApiUrl);
        })
        .then(response => response.json())
        .then(repositories => {
            // Display the first page of repositories
            displayRepositories(repositories, 1, repositoriesPerPage);
            
            // Display pagination
            displayPagination(repositories, repositoriesPerPage);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Function to display user details
    function displayUserDetails(user) {
        const repositoriesContainer = document.getElementById('repositories');

         // Display other user details (e.g., name, bio, etc.)
         const userDetails = `
         <h2 class="username">${user.name || username}</h2>
         <p class="userbio">${user.bio || 'No bio available'}</p>
         <p class="userlocation"><i class="fas fa-map-marker-alt"></i>  ${user.location || 'No Location available'} </p>
     `;

        // Display user profile picture
        const profilePicture = `<img src="${user.avatar_url}" alt="Profile Picture" class="img-fluid rounded-circle mb-3">`;
        repositoriesContainer.innerHTML += profilePicture;

       
        repositoriesContainer.innerHTML += userDetails;
    }

    // Function to display repositories based on page number
    function displayRepositories(repositories, currentPage, repositoriesPerPage) {
        const startIndex = (currentPage - 1) * repositoriesPerPage;
        const endIndex = startIndex + repositoriesPerPage;
        const repositoriesContainer = document.getElementById('repositories');

        const repositoriesToShow = repositories.slice(startIndex, endIndex);

        repositoriesContainer.innerHTML += repositoriesToShow.map(repo => {
            return `
            <div class="row">
            <div class="col-sm-9">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${repo.name}</h5>
                    <p class="card-text">${repo.description || 'No description available'}</p>
                    <a href="${repo.html_url}" target="_blank" class="btn btn-primary">View on GitHub</a>
                </div>
            </div>
            </div>
        </div>
            `;
        }).join('');
    }

    // Function to display pagination
    function displayPagination(repositories, repositoriesPerPage) {
        const totalPages = Math.ceil(repositories.length / repositoriesPerPage);
        const paginationContainer = document.getElementById('pagination');

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = `<button class="btn btn-outline-secondary mr-2" onclick="changePage(${i})">${i}</button>`;
            paginationContainer.innerHTML += pageButton;
        }
    }

    // Function to change the current page and update display
    window.changePage = function (pageNumber) {
        const repositoriesContainer = document.getElementById('repositories');
        const paginationContainer = document.getElementById('pagination');

        // Clear previous content
        repositoriesContainer.innerHTML = '';
        paginationContainer.innerHTML = '';

        // Fetch and display repositories for the selected page
        fetch(reposApiUrl)
            .then(response => response.json())
            .then(repositories => {
                displayRepositories(repositories, pageNumber, repositoriesPerPage);
                displayPagination(repositories, repositoriesPerPage);
            })
            .catch(error => console.error('Error fetching data:', error));
    };
});
