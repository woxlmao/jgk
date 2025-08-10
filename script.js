document.addEventListener('DOMContentLoaded', () => {
    const getJokeBtn = document.getElementById('getJokeBtn');
    const jokeText = document.getElementById('jokeText');
    const jokeTypeSelect = document.getElementById('jokeType');

    // This function fetches the joke from the correct API
    async function fetchJoke() {
        const jokeType = jokeTypeSelect.value;
        let jokeData = '';

        // We set a loading message while the joke is being fetched
        jokeText.textContent = 'Finding a good one...';

        try {
            let apiUrl = '';
            
            // Set the API URL based on the selected category
            if (jokeType === 'dad') {
                apiUrl = 'https://icanhazdadjoke.com/';
            } else if (jokeType === 'dark') {
                apiUrl = 'https://v2.jokeapi.dev/joke/Dark';
            } else { // 'any' category
                // This URL gets any joke but avoids dark or explicit ones
                apiUrl = 'https://v2.jokeapi.dev/joke/Any?safe-mode';
            }

            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Process the response based on the API structure
            if (jokeType === 'dad') {
                jokeData = data.joke; // From icanhazdadjoke API
            } else {
                // From JokeAPI (for dark and any)
                if (data.type === 'single') {
                    jokeData = data.joke;
                } else {
                    // Corrected from 'punchline' to 'delivery'
                    jokeData = `${data.setup}\n...\n${data.delivery}`; 
                }
            }
            
            // Update the page with the new joke
            jokeText.textContent = jokeData;

        } catch (error) {
            // If something goes wrong, show an error message
            jokeText.textContent = 'Oops! Could not fetch a joke. Please try again.';
            console.error('There was an error!', error);
        }
    }

    // Add an event listener to the button
    getJokeBtn.addEventListener('click', fetchJoke);

    // Fetch a joke right away when the page loads
    fetchJoke();
});
