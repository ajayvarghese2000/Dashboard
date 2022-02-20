/**
 * @brief allows to hide all the sub pages
 */
function hideall() 
{
    $("#MAIN").css("visibility", "hidden");
    $("#MAIN").css("z-index", "-1");
    $("#BIGAI").css("visibility", "hidden");
    $("#BIGAI").css("z-index", "-1");
    $("#BIGTHERM").css("visibility", "hidden");
    $("#BIGTHERM").css("z-index", "-1");
    $("#BIGRADS").css("visibility", "hidden");
    $("#BIGRADS").css("z-index", "-1");
    $("#BIGPOLL").css("visibility", "hidden");
    $("#BIGPOLL").css("z-index", "-1");
    $("#BIGGAS").css("visibility", "hidden");
    $("#BIGGAS").css("z-index", "-1");
    $("#BIGMAP").css("visibility", "hidden");
    $("#BIGMAP").css("z-index", "-1");
    return
}

/**
 * @brief Allows for the showing of various sub-pages
 * @param {*} id - the DOM element that called the function
 * @returns nothing
 */
async function showcontent(id) {

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
    
    // Gets the main contentbox DOM
    content = document.querySelector(id);

    // Removing old animations so they dont interfere
    content.classList.remove("animate__animated", "animate__slideInRight");
    await sleep(10); // WARNING This is BLOCKING

    hideall();

    $(id).css("z-index", "1");

    if(DRONES_AVAILABLE == false || CONNECTED == false)
    {
        alertify.alert("Server", "Try connecting to a drone first to see data");
        return;
    }

    // Adds the animation classes
    content.classList.add("animate__animated", "animate__slideInRight")

    // Sets it to be visible
    content.style.visibility = "visible"

    // Removes the classes aster the animation is finished
    content.addEventListener('animationend', () => {
        content.classList.remove("animate__animated", "animate__slideInRight")
        return;
    });

    return;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}