/**
 * @brief allows to hide all the sub pages
 */
function hideall() 
{
    $("#MAIN").css("visibility", "hidden");
    $("#BIGAI").css("visibility", "hidden");
    $("#BIGTHERM").css("visibility", "hidden");
    $("#BIGRADS").css("visibility", "hidden");
    $("#BIGPOLL").css("visibility", "hidden");
    $("#BIGGAS").css("visibility", "hidden");
    $("#BIGMAP").css("visibility", "hidden");
    return
}

/**
 * @brief Allows for the showing of various sub-pages
 * @param {*} id - the DOM element that called the function
 * @returns nothing
 */
function showcontent(id) {

    // selecting the correct DOM element depending on the name of the input
    switch (id.innerHTML) {
        case 'Main':
            id = "#MAIN"
            break;
        case 'AI Camera':
            id = "#BIGAI"
            break;
        case 'Thermal Camera':
            id = "#BIGTHERM"
            break;
        case 'Radiation History':
            id = "#BIGRADS"
            break;
        case 'Pollution History':
            id = "#BIGPOLL"
            break;
        case 'Gas History':
            id = "#BIGGAS"
            break;
        case 'Maps':
            id = "#BIGMAP"
            break;
        
        default:
            id = "#MAIN"
            break;
    }
    
    hideall();

    if(DRONES_AVAILABLE == false || CONNECTED == false)
    {
        alertify.alert("Server", "Try connecting to a drone first to see data");
        return;
    }
    
    // Gets the main contentbox DOM
    content = document.querySelector(id)

    // Sets it to be visible
    content.classList.remove("animate__animated", "animate__slideInRight")
    content.style.visibility = "visible"

    // Adds the animation classes
    content.classList.add("animate__animated", "animate__slideInRight")

    // Removes the classes aster the animation is finished
    content.addEventListener('animationend', () => {
        content.classList.remove("animate__animated", "animate__slideInRight")
    });

    return;
}