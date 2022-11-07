
const READING_DATA = 'readingData';
const PAST_POSITION = 'pastPosition';
const CURRENT_POSITION = 'currentPosition';
const whereYouLeftBanner = document.createElement("div");
let initialData = {};
let initialCurrentWebsiteData = {};

let timer = null;

function getTopPosition() {
    return parseInt(window.pageYOffset);
}

function getCurrentWebsite() {
    return window.location.href;
}

function getLocalStorageItem(item) {
    return JSON.parse(localStorage.getItem(item));
}

function setLocalStorageItem(item, value) {
    localStorage.setItem(item, JSON.stringify(value));
}

function getPastPosition() {
    return getLocalStorageItem(READING_DATA)[getCurrentWebsite()][PAST_POSITION];
}

function getCurrentPosition() {
    return getLocalStorageItem(READING_DATA)[getCurrentWebsite()][CURRENT_POSITION];
}

function removeLocalStorageItem(item) {
    localStorage.removeItem(item);
}

function goToPastPosition(event) {
    console.log(event);

    // on click on banner will scroll smooth to that position
    window.scrollTo({
        top: getPastPosition(),
        left: 0,
        behavior: 'smooth'
    });

    // remove the html from the DOM
    whereYouLeftBanner.remove();
}

function closeBanner() {
    // remove the html from the DOM
    whereYouLeftBanner.remove();
}

function addBannerToBody() {
    const htmlToAppend = '<div id="goToPastPositionWrapper">Click me if yoy want to return where you left</div><div id="closeWhereYouLeftBanner">No, thanks</div>';
    whereYouLeftBanner.insertAdjacentHTML('beforeend', htmlToAppend);
    whereYouLeftBanner.style.position = 'absolute';
    whereYouLeftBanner.style.right = '8px';
    whereYouLeftBanner.style.top = `${getTopPosition()}px`;
    whereYouLeftBanner.style.backgroundColor = '#000000';
    whereYouLeftBanner.style.color = '#FFFFFF';
    whereYouLeftBanner.style.fontSize = '14px';
    whereYouLeftBanner.style.padding = '12px';
    whereYouLeftBanner.style.borderRadius = '12px';
    whereYouLeftBanner.style.cursor = 'pointer';
    whereYouLeftBanner.style.zIndex = '99';
    return whereYouLeftBanner;
}

function addGoToPositionElementToWraper() {
    const goToPastPositionWrapper = document.getElementById('goToPastPositionWrapper');
    goToPastPositionWrapper.addEventListener("click", goToPastPosition);
}

function addCloseElementToWrapper() {
    const closeWhereYouLeftBanner = document.getElementById('closeWhereYouLeftBanner');
    // closeWhereYouLeftBanner.style.margin = '8px auto 0';
    // closeWhereYouLeftBanner.style.cursor = 'pointer';
    // closeWhereYouLeftBanner.style.width = 'fit-content';
    // closeWhereYouLeftBanner.style.padding = '4px 8px';
    // closeWhereYouLeftBanner.style.background = '#FFFFFF';
    // closeWhereYouLeftBanner.style.color = '#000000';

    closeWhereYouLeftBanner.addEventListener("click", closeBanner);
}

function getCurrentWebsiteData() {
    initialCurrentWebsiteData[CURRENT_POSITION] = getTopPosition();
    return initialCurrentWebsiteData;
}

function checkForMinimalDifference(x, y) {
    return Math.abs(x - y);
}

window.onload = (event) => {
    initialData = getLocalStorageItem(READING_DATA);
    initialCurrentWebsiteData[CURRENT_POSITION] = getTopPosition();

    if (initialData[getCurrentWebsite()] && initialData[getCurrentWebsite()][PAST_POSITION]) {
        initialCurrentWebsiteData[PAST_POSITION] = initialData[getCurrentWebsite()][PAST_POSITION];
    }

    // add the current position
    setLocalStorageItem(READING_DATA, {
        ...initialData,
        [getCurrentWebsite()]: initialCurrentWebsiteData
    }
    );

    // check if we have any value saved regarding where the user left on the page
    const pastPositionFromLocalStorage = getPastPosition();
    const currentPositionFromLocalStorage = getCurrentPosition();

    if (pastPositionFromLocalStorage && checkForMinimalDifference(pastPositionFromLocalStorage, currentPositionFromLocalStorage) > 5) {
        // if they are different add an html on the body that asks the user if wants to go where they left (clickable)
        const element = addBannerToBody();
        document.body.appendChild(element);
        addGoToPositionElementToWraper();
        addCloseElementToWrapper();
    }
};

window.onscroll = (event) => {
    if (timer !== null) {
        clearTimeout(timer);
    }

    timer = setTimeout(function () {
        // on scroll when it stops update the value for where the user left
        setLocalStorageItem(READING_DATA,
            {
                ...getLocalStorageItem(READING_DATA),
                [getCurrentWebsite()]: getCurrentWebsiteData()
            }
        )
    }, 500);
};

window.onbeforeunload = (event) => {
    // before unload make past position equal to current position
    setLocalStorageItem(READING_DATA,
        {
            ...getLocalStorageItem(READING_DATA),
            [getCurrentWebsite()]: {
                [PAST_POSITION]: getTopPosition()
            }
        }
    );
};