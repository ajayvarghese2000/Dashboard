var VIEW = 0;

/**
 * @brief allows to hide all the sub pages
 */
function hideall() 
{
    $("#MAIN").css("visibility", "hidden");
    $("#MAIN").css("content-visibility", "hidden");
    $("#MAIN").css("z-index", "-1");

    $("#BIGAI").css("visibility", "hidden");
    $("#BIGAI").css("content-visibility", "hidden");
    $("#BIGAI").css("z-index", "-1");
    
    $("#BIGTHERM").css("visibility", "hidden");
    $("#BIGTHERM").css("content-visibility", "hidden");
    $("#BIGTHERM").css("z-index", "-1");

    $("#BIGRADS").css("visibility", "hidden");
    $("#BIGRADS").css("content-visibility", "hidden");
    $("#BIGRADS").css("z-index", "-1");

    $("#BIGPOLL").css("visibility", "hidden");
    $("#BIGPOLL").css("content-visibility", "hidden");
    $("#BIGPOLL").css("z-index", "-1");

    $("#BIGGAS").css("visibility", "hidden");
    $("#BIGGAS").css("content-visibility", "hidden");
    $("#BIGGAS").css("z-index", "-1");

    $("#BIGMAP").css("visibility", "hidden");
    $("#BIGMAP").css("content-visibility", "hidden");
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
            VIEW = 1;
            break;
        case 'AI Camera':
            id = "#BIGAI"
            VIEW = 2;
            break;
        case 'Thermal Camera':
            id = "#BIGTHERM"
            VIEW = 3;
            break;
        case 'Radiation History':
            id = "#BIGRADS"
            VIEW = 4;
            break;
        case 'Pollution History':
            id = "#BIGPOLL"
            VIEW = 5;
            break;
        case 'Gas History':
            id = "#BIGGAS"
            VIEW = 6;
            break;
        case 'Maps':
            id = "#BIGMAP"
            VIEW = 7;
            break;
        
        default:
            id = "#MAIN"
            VIEW = 1;
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
    $(id).css("content-visibility", "visible");

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

function disconnect() {
    
    sock.disconnect();

    $("#infomessage").html("Disconnected From Drone")

    content = document.querySelector(".kc_fab_main_btn");
        
    // Removes any existing animations
    content.classList.remove("animate__animated", "animate__backInRight", "animate__backOutRight");

    // Adds the animation classes
    content.classList.add("animate__animated", "animate__backOutRight")

    content.addEventListener('animationend', () => {
        content.classList.remove("animate__animated", "animate__backOutRight")
        return;
    });

    $(".kc_fab_main_btn").css("visibility", "hidden");
}