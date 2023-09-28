const firstButton = document.getElementById("first-button");
const firstReversed = document.getElementById("reversed-string");
const image = document.getElementById("image");
const title = document.getElementById("title");
const description = document.getElementById("description");
const correctData = document.getElementById('load-correct-data');
const incorrectData = document.getElementById('load-incorrect-data');
const profileInfo = document.getElementById('profile-info');

function reversedString(string) {
    return string.split('').reverse().join('');
}

firstButton.addEventListener('click', () => {
    const string = document.getElementById("first-string").value;
    const reversed = reversedString(string);
    document.getElementById("first-string").value = "";

    setTimeout(() => {firstReversed.textContent = `Reversed string: ${reversed}`;}, 1000);
});

function createCalendar(cellsPerRow, totalCells) {
    var table = document.getElementById("calendar");
    var rowCount = Math.ceil(totalCells / cellsPerRow);
    var filledCells = 0;

    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var currentDate = new Date();

    for (var i = 0; i < rowCount; i++) {
        var row = table.insertRow(i);
        var cellsToFill = Math.min(cellsPerRow, totalCells - filledCells);

        for (var j = 0; j < cellsToFill; j++) {
            var cell = row.insertCell(j);
            if (j < 4 && i === 0) {
                cell.style.visibility = "hidden";
            } else {
                let button = document.createElement("button");
                var dayIndex = (filledCells + 5) % 7;
                var day = filledCells + 1;
                var currentDay = day < 10 ? "0" + day : day;

                var buttonText = `${daysOfWeek[dayIndex]}, 2023-09-${currentDay}`;
                button.textContent = buttonText;
                cell.appendChild(button);

                filledCells++;

                (function (buttonText) {
                    button.addEventListener('click', () => {
                        const date = buttonText.split(", ")[1];
                        btnDate = new Date(date);
                        if (btnDate <= currentDate) {
                            apodData(date)
                                .then(data => {
                                    displayApodData(data);
                                })
                                .catch(error => {
                                    displayApodError(error);
                                })
                                .finally(() => {
                                    console.log("Request completed.");
                                });
                        } else {
                            displayApodError("Selected date is in the future.");
                        }  
                    });
                })(buttonText);
            }
        }
    }
}

createCalendar(7, 30);

function apodData(date) {
    const apiKey = "BSp7wYhDjUbYlIlxQCjIDPe5YB5QziHxIlE6SqIc";
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    return new Promise((resolve, reject) => {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    reject("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data.code === 400) {
                    reject("Invalid date");
                }
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function displayApodData(data) {
    image.src = data.url;
    title.textContent = `Title: ${data.title}`;
    description.textContent = `Description: ${data.explanation}`;
}

function displayApodError(error) {
    image.src = "";
    title.textContent = "";
    description.textContent = "";
    console.log(`Error message: ${error}`);
}

correctData.addEventListener('click', () => {
    makeXMLHttpRequest("justmiroslav", (data) => {
        displayGitHubInfo(JSON.parse(data));
    }, (error) => {
        displayGitHubError(error);
    });
});

incorrectData.addEventListener('click', () => {
    makeXMLHttpRequest("hwanghxw", (data) => {
        displayGitHubInfo(JSON.parse(data));
    }, (error) => {
        displayGitHubError(error);
    });
});

function makeXMLHttpRequest(username, successCallback, errorCallback) {
    const url = `https://api.github.com/users/${username}`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            successCallback(xhr.responseText);
        } else {
            const error = `Error: ${xhr.status} ${xhr.statusText}`;
            errorCallback(error);
        }
    };

    xhr.onerror = function () {
        const error = 'Network error occurred.';
        errorCallback(error);
    };

    xhr.send();
}

function displayGitHubInfo(data) {
    profileInfo.innerHTML = `
        <div id="github-profile"><p><strong>GitHub profile</strong></p></div>
        <p><strong>Login:</strong> ${data.login}</p>
        <p><strong>Followers:</strong> ${data.followers}</p>
    `;
    console.log("Request completed.");
}

function displayGitHubError(error) {
    profileInfo.innerHTML = "";
    console.log(error);
}