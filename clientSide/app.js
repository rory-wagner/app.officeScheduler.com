var ID_TO_UPDATE;

var BASE_URL = "http://localhost:8080";

var EMPLOYEES_LIST = ["Calmare", "Dr. Wagner", "Laser"];

function createMainTable(){
    var mainDiv = document.querySelector("#main");
    var scheduleTable = document.createElement("table");
    scheduleTable.border = 1;
    mainDiv.appendChild(scheduleTable);
    var employeesRow = document.createElement("tr");

    // create employees header row here:
    for (i in EMPLOYEES_LIST){
        var columnLabel = document.createElement("td");
        columnLabel.innerHTML = EMPLOYEES_LIST[i];
        employeesRow.appendChild(columnLabel);
    }

    scheduleTable.appendChild(employeesRow);
    
};

function displayCharacters(){
    middleColumn = document.querySelector("#middle");
    middleColumn.innerHTML = "";
    ALL_CHARACTERS.forEach(element => {
        // naming data members
        var name = element["name"];
        var nation = element["nation"];
        var quote = element["quote"];
        var episode = element["episode"];
        var book = element["book"];

        var nationPicture = document.createElement("img");

        // Formatting the data to be presentable:
        nationPicture.setAttribute("src", NATION_PICTURES[nation]);
        //middleColumn.appendChild(nationPicture);

        displayName = document.createElement("h4");
        displayQuote = document.createElement("div");
        displayName.innerHTML = name;
        quoteData = document.createElement("p");
        quoteData.innerHTML = "'" + quote + "'";
        displayQuote.appendChild(quoteData); 
        episodeData = document.createElement("p");
        episodeData.innerHTML = "Episode: " + episode + " Book: " + book;
        displayQuote.appendChild(episodeData);

        //placing the data and appending a delete button:
        middleColumn.appendChild(displayName);
        middleColumn.appendChild(displayQuote);
        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        middleColumn.appendChild(deleteButton);
        deleteButton.onclick = function () {
            console.log("This one was clicked " + element["id"]);
            if (confirm("You sure you want to delete?")){
                // here we need to delete
                fetch(BASE_URL + '/quotes/' + String(element["id"]), {
                    //request parameters:
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (response){
                    //handle the response:
                    console.log("Server responded from DELETE!", response);
                    goGetData();
                });
            }
        }

        //format the picture size:
        var size = displayName.offsetHeight;
        size += displayQuote.offsetHeight;
        size += (3 * deleteButton.offsetHeight);
        nationPicture.height = size;
        nationPicture.width = size;

        //placing and defining the updateButton:
        var updateButton = document.createElement("button");
        updateButton.innerHTML = "Update";
        middleColumn.appendChild(updateButton);
        updateButton.onclick = function () {
            console.log("Update for this was clicked: " + element[0]);
            //here we need to update the object.
            addButton.innerHTML = "Save Character"
            var newNameInput = document.querySelector("#nameAdder");
            newNameInput.value = name;
            var newNationInput = document.querySelector("#nationAdder");
            newNationInput.value = nation;
            var newQuoteInput = document.querySelector("#quoteAdder");
            newQuoteInput.value = quote;
            var newEpisodeInput = document.querySelector("#episodeAdder");
            newEpisodeInput.value = episode;
            var newBookInput = document.querySelector("#bookAdder");
            newBookInput.value = book;
            ID_TO_UPDATE = element["id"];
        }
    });
};

function goGetData(){
    fetch(BASE_URL + '/quotes', {
        //request parameters:
        method: "GET",
        credentials: "include",
        headers: {
        }
        }).then(function main(response){
            // response is ready to use (it is an array)
            // save the response for use later:
            
            response.json().then(function (data) {
                ALL_CHARACTERS = data;
                console.log("Server responded from GET!");
                console.log(data);
                displayCharacters();
                // if (!first){
                //     addQuoteAndRandomPicture();
                // }
        });
    });
};

var checkLoginButton = document.querySelector("#checkLoginButton");
var checkRegistrationButton = document.querySelector("#checkRegistrationButton");

checkLoginButton.onclick = function(){
    var usernameField = document.querySelector("#usernameLogin");
    var passwordField = document.querySelector("#passwordLogin");
    var username = usernameField.value;
    var password = passwordField.value;
    var bodyString = "username=" + encodeURIComponent(username);
    bodyString += "&password=" + encodeURIComponent(password);
    fetch(BASE_URL + '/logins', {
        method: "POST",
        credentials: "include",
        body: bodyString,
        headers:{
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function main(response){
        console.log(response);
        if (response.status == 401){
            alert("Bad username/password");
        }
        else{
            alert("Successful login!");
            changeToMainScreen();
            goGetData();
        }
    })
};

checkRegistrationButton.onclick = function(){
    var usernameField = document.querySelector("#usernameRegister");
    var passwordField = document.querySelector("#passwordRegister");
    var firstNameField = document.querySelector("#firstNameRegister");
    var lastNameField = document.querySelector("#lastNameRegister");
    var username = usernameField.value;
    var password = passwordField.value;
    var firstName = firstNameField.value;
    var lastName = lastNameField.value;
    var bodyString = "username=" + encodeURIComponent(username);
    bodyString += "&password=" + encodeURIComponent(password);
    bodyString += "&firstName=" + encodeURIComponent(firstName);
    bodyString += "&lastName=" + encodeURIComponent(lastName);
    fetch(BASE_URL + '/registrations', {
        method: "POST",
        credentials: "include",
        body: bodyString,
        headers:{
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(function main(response){
        console.log(response);
        if (response.status == 422){
            alert("Username already in use.");
        }
        else{
            alert("Successful registration!");
            changeToLoginScreen();
        }
    })
};

var switchToRegistrationButton = document.querySelector("#switchToRegistration");
var switchToLoginButton = document.querySelector("#switchToLogin");
var loginDiv = document.querySelector("#login");
var registrationDiv = document.querySelector("#registration");
var mainDiv = document.querySelector("#main");

switchToRegistrationButton.onclick = function(){
    changeToRegistrationScreen();
};

switchToLoginButton.onclick = function(){
    changeToLoginScreen();
};

function changeToRegistrationScreen(){
    loginDiv.style.display = "none";
    registrationDiv.style.display = "block";
    mainDiv.style.display = "none";
};

function changeToLoginScreen(){
    loginDiv.style.display = "block";
    registrationDiv.style.display = "none";
    mainDiv.style.display = "none";
};

function changeToMainScreen(){
    loginDiv.style.display = "none";
    registrationDiv.style.display = "none";
    mainDiv.style.display = "block";
};

function pageLoaded(){
    fetch(BASE_URL + '/quotes', {
        method: "GET",
        credentials: "include"
    }).then(function main(response){
        console.log("Server responded to reloading the page.");
        if (response.status == 200){
            changeToMainScreen();
            goGetData();
        }
    })
};
// pageLoaded();
changeToMainScreen();
createMainTable();