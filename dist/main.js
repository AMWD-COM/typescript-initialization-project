"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//#endregion
//#region Variables Declarations
const prepare = {};
prepare.cards = [];
prepare.progress = 0;
prepare.fullTrack = new Audio('./assets/audio/fulltruck.mp3');
prepare.failAudio = new Audio('./assets/audio/fail.mp3');
prepare.flipAudio = new Audio('./assets/audio/flip.mp3');
prepare.goodAudio = new Audio('./assets/audio/good.mp3');
prepare.gameOverAudio = new Audio('./assets/audio/game-over.mp3');
prepare.fullTrack.loop = true;
const numberOfCards = 20;
const tempNumbers = [];
let cardsHtmlContent = '';
//#endregion
//#region Functions Declarations
const getRandomInt = (min, max) => {
    let result;
    let exists = true;
    min = Math.ceil(min);
    max = Math.floor(max);
    while (exists) {
        result = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!tempNumbers.find(no => no === result)) {
            exists = false;
            tempNumbers.push(result);
        }
        return result;
    }
};
const toggleFlip = (index) => {
    prepare.fullTrack.play();
    const card = prepare.cards[index];
    if (!card.flip && card.clickable) {
        flip(card, index);
        selectCard(card, index);
    }
};
const flip = (card, index) => {
    prepare.flipAudio.play();
    if (card) {
        card.flip = card.flip === '' ? 'flip' : '';
        document.getElementById(`card-fip-${index}`).classList.value = card.flip;
    }
};
const selectCard = (card, index) => {
    if (!prepare.selectedCard_1) {
        prepare.selectedCard_1 = card;
        prepare.selectedIndex_1 = index;
    }
    else if (!prepare.selectedCard_2) {
        prepare.selectedCard_2 = card;
        prepare.selectedIndex_2 = index;
    }
    if (prepare.selectedCard_1 && prepare.selectedCard_2) {
        if (prepare.selectedCard_1.src === prepare.selectedCard_2.src) {
            prepare.selectedCard_1.clickable = false;
            prepare.selectedCard_2.clickable = false;
            prepare.selectedCard_1 = null;
            prepare.selectedCard_2 = null;
            stopAudio(prepare.failAudio);
            stopAudio(prepare.goodAudio);
            prepare.goodAudio.play();
            changeProgress();
            checkFinish();
        }
        else {
            setTimeout(() => {
                stopAudio(prepare.failAudio);
                stopAudio(prepare.goodAudio);
                prepare.failAudio.play();
                flip(prepare.selectedCard_1, prepare.selectedIndex_2);
                flip(prepare.selectedCard_2, prepare.selectedIndex_2);
                prepare.selectedCard_1 = null;
                prepare.selectedCard_2 = null;
            }, 1000);
        }
    }
};
const changeProgress = () => {
    const progress = prepare.cards.filter(card => !card.clickable).length / numberOfCards;
    const progressElement = document.getElementById('progress');
    progressElement.innerText = `${progress} %`;
    progressElement.style.width = `${progress} %`;
};
const checkFinish = () => {
    if (prepare.cards.filter(card => !card.clickable).length === numberOfCards) {
        /**End of Game */
        stopAudio(prepare.fullTrack);
        stopAudio(prepare.flipAudio);
        stopAudio(prepare.goodAudio);
        prepare.gameOverAudio.play();
    }
};
const stopAudio = (audio) => {
    if (audio && audio.played) {
        audio.pause();
        audio.currentTime = 0;
    }
};
//#endregion
//#region Game Logic Functions
for (let index = 0; index < numberOfCards / 2; index++) {
    const noc = numberOfCards / 2;
    prepare.cards.push({
        id: getRandomInt(0, noc),
        src: `./assets/images/${index}.jpg`,
        flip: '',
        clickable: true,
        index
    });
    prepare.cards.push({
        id: getRandomInt(0, noc),
        src: `./assets/images/${index}.jpg`,
        flip: '',
        clickable: true,
        index
    });
}
prepare.cards.sort((a, b) => a.id > b.id ? 1 : -1);
prepare.cards.forEach((item, index) => {
    cardsHtmlContent += `
    <span class="col-sm-3 col-lg-2">
            <!-- Card Flip -->
            <div class="cart-flip" onclick="toggleFlip(${index})">
                <div id="card-flip-${index}">
                    <div class="front">
                        <!-- front content -->
                        <div class="card">
                            <img
                                src="./assets/back.jpg"
                                alt="Loading..."
                                class="card-image"
                            />
                            <span class="card-content"> ${index + 1} </span>
                        </div>
                    </div>
                    <div class="back">
                        <!-- back content -->

                        <div class="card">
                            <img
                                src="./assets/images/${item.index}.jpg"
                                alt="Image [100%x180]"
                                data-holder-rendered="true"
                                style="
                                    width: 100%;
                                    height: 120px;
                                    display: block;
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </span>
        <!-- End Card Flip -->
    
    `;
});
document.getElementById('cards').innerHTML = cardsHtmlContent;
//#endregion
