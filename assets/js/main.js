/* CONST */
const starColor = '#fffcf7', starSize = 4, starMinScale = 0.2, overflowThreshold = 50, starCount = (window.innerWidth + window.innerHeight) / 6, canvasStarsBackground = document.getElementById('starsBackground'), context = canvasStarsBackground.getContext('2d');
const morphElts = { morphText1: document.getElementById("morphText1"), morphText2: document.getElementById("morphText2") }, morphTime = 2, morphCooldownTime = 4.5, morphContainer = document.getElementById("morph");
const typingTextStar1 = document.getElementById("typingTextStar1"), typingTextStar2 = document.getElementById("typingTextStar2"), typingTextStar3 = document.getElementById("typingTextStar3"), typingTextcontainer = document.getElementById("typingText"), typingTextLetters = document.getElementById("typingTextLetters");
const formStar = document.getElementById("formStar"), formContainer = document.getElementById("formContainer"), formWorldCanvas = document.querySelector('#formWorld'), DOTS_AMOUNT = 1000, DOT_RADIUS = 3.5, ctx = formWorldCanvas.getContext('2d'), formWorldP1 = document.getElementById("formWorldP1"), formWorldP2 = document.getElementById("formWorldP2"), formWorldP3 = document.getElementById("formWorldP3"), formWorldP4 = document.getElementById("formWorldP4"), formWorldP5 = document.getElementById("formWorldP5"), formWorldP6 = document.getElementById("formWorldP6"), formWorldP7 = document.getElementById("formWorldP7"), formTextArea = document.getElementById("formMessage"), serviceID = "service_azvo6j7", templateID = "template_0vvmp4e", formButton = document.getElementById("formButton");



/* LET */
let scale = 1, width, height, stars = [], pointerX, pointerY, velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0012 }, touchInput = false;
let typingTextContainerPerspective = 1;
let formWorldWidth = formWorldCanvas.clientWidth, formWorlHeight = formWorldCanvas.clientHeight, rotation = 0, dots = [], GLOBE_RADIUS = formWorldWidth * 0.35, GLOBE_CENTER_Z = -GLOBE_RADIUS, PROJECTION_CENTER_X = formWorldWidth / 2, PROJECTION_CENTER_Y = formWorlHeight / 2, FIELD_OF_VIEW = formWorldWidth * 0.8, resizeTimeout, formMessage;



/* FUNCTION STARTERS*/
generate();
resize();
step();



/* EVENTS */
window.onresize = resize;
canvasStarsBackground.onmousemove = onMouseMove;
canvasStarsBackground.ontouchmove = onTouchMove;
canvasStarsBackground.ontouchend = onMouseLeave;
document.onmouseleave = onMouseLeave;



/* STARS BACKGROUND */
function generate() {
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: 0,
            y: 0,
            z: starMinScale + Math.random() * (1 - starMinScale)
        });
    }
}
function placeStar(star) {
    star.x = Math.random() * width;
    star.y = Math.random() * height;
}
function recycleStar(star) {
    let direction = 'z';

    let vx = Math.abs(velocity.x),
        vy = Math.abs(velocity.y);

    if (vx > 1 || vy > 1) {
        let axis;

        if (vx > vy) {
            axis = Math.random() < vx / (vx + vy) ? 'h' : 'v';
        }
        else {
            axis = Math.random() < vy / (vx + vy) ? 'v' : 'h';
        }

        if (axis === 'h') {
            direction = velocity.x > 0 ? 'l' : 'r';
        }
        else {
            direction = velocity.y > 0 ? 't' : 'b';
        }
    }

    star.z = starMinScale + Math.random() * (1 - starMinScale);

    if (direction === 'z') {
        star.z = 0.1;
        star.x = Math.random() * width;
        star.y = Math.random() * height;
    }
    else if (direction === 'l') {
        star.x = -overflowThreshold;
        star.y = height * Math.random();
    }
    else if (direction === 'r') {
        star.x = width + overflowThreshold;
        star.y = height * Math.random();
    }
    else if (direction === 't') {
        star.x = width * Math.random();
        star.y = -overflowThreshold;
    }
    else if (direction === 'b') {
        star.x = width * Math.random();
        star.y = height + overflowThreshold;
    }

}
function resize() {
    scale = window.devicePixelRatio || 1;

    width = window.innerWidth * scale;
    height = window.innerHeight * scale;

    canvasStarsBackground.width = width;
    canvasStarsBackground.height = height;

    stars.forEach(placeStar);

}
function step() {
    context.clearRect(0, 0, width, height);

    update();
    render();

    requestAnimationFrame(step);
}
function update() {
    velocity.tx *= 0.96;
    velocity.ty *= 0.96;

    velocity.x += (velocity.tx - velocity.x) * 0.8;
    velocity.y += (velocity.ty - velocity.y) * 0.8;

    canvasStarsBackground.onanimationend = () => {
    };

    /* 
    CODE TO MOVE THE STARS*/

    stars.forEach((star) => {
        star.x += velocity.x * star.z;
        star.y += velocity.y * star.z;

        star.x += (star.x - width / 2) * velocity.z * star.z;
        star.y += (star.y - height / 2) * velocity.z * star.z;
        star.z += velocity.z;

        if (star.x < -overflowThreshold || star.x > width + overflowThreshold || star.y < -overflowThreshold || star.y > height + overflowThreshold) {
            recycleStar(star);
        }
    });
}
function render() {
    stars.forEach((star) => {
        context.beginPath();
        context.lineCap = 'round';
        context.lineWidth = starSize * star.z * scale;
        context.globalAlpha = 0.5 + 0.5 * Math.random();
        context.strokeStyle = starColor;

        context.beginPath();
        context.moveTo(star.x, star.y);

        var tailX = velocity.x * 2,
            tailY = velocity.y * 2;

        if (Math.abs(tailX) < 0.1) tailX = 0.5;
        if (Math.abs(tailY) < 0.1) tailY = 0.5;

        context.lineTo(star.x + tailX, star.y + tailY);

        context.stroke();
    });
}
function movePointer(x, y) {
    if (typeof pointerX === 'number' && typeof pointerY === 'number') {
        let ox = x - pointerX,
            oy = y - pointerY;

        velocity.tx = velocity.tx + (ox / 28 * scale) * (touchInput ? 1 : -1);
        velocity.ty = velocity.ty + (oy / 28 * scale) * (touchInput ? 1 : -1);
    }

    pointerX = x;
    pointerY = y;
}
function onMouseMove(event) {
    touchInput = false;

    movePointer(event.clientX, event.clientY);
}
function onTouchMove(event) {
    touchInput = true;

    movePointer(event.touches[0].clientX, event.touches[0].clientY, true);

    event.preventDefault();
}
function onMouseLeave() {
    pointerX = null;
    pointerY = null;
}



/* MORPH TEXT */
const morphTexts = [
    "",
    "Kat",
    "Hice esto para agradecerte",
    "Para agradecer lo feliz que me has hecho estos días.",
    "Claro, llevamos pocos días hablando, pero",
    "me han parecido suficientes para darme cuenta de muchas cosas.",
    "Por esas razones, me hubiera gustado poderte bajar las estrellas.",
    "Y como no estoy a tu lado, decidí hacerte un universo lleno de estrellas.",
    "De hecho, no es un universo cualquiera.",
    "Este universo es mi mente y las estrellas son mis pensamientos.",
    "",
    "Como cada estrella es uno de mis pensamientos, entonces ellas",
    "te escribirán aquí en la pantalla lo que representan cada una.",
    ""
];
let morphTextIndex = morphTexts.length - 1, morphNoTime = new Date(), morph = 0, morphCooldown = morphCooldownTime;
morphElts.morphText1.textContent = morphTexts[morphTextIndex % morphTexts.length];
morphElts.morphText2.textContent = morphTexts[(morphTextIndex + 1) % morphTexts.length];
function doMorph() {
    morph -= morphCooldown;
    morphCooldown = 0;

    let fraction = morph / morphTime;

    if (fraction > 1) {
        morphCooldown = morphCooldownTime;
        fraction = 1;
    }

    setMorph(fraction);
}
function setMorph(fraction) {
    morphElts.morphText2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    morphElts.morphText2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    fraction = 1 - fraction;

    morphElts.morphText1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    morphElts.morphText1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    morphElts.morphText1.textContent = morphTexts[morphTextIndex % morphTexts.length];
    morphElts.morphText2.textContent = morphTexts[(morphTextIndex + 1) % morphTexts.length];
}
function doCooldown() {
    morph = 0;

    morphElts.morphText2.style.filter = "";
    morphElts.morphText2.style.opacity = "100%";

    morphElts.morphText1.style.filter = "";
    morphElts.morphText1.style.opacity = "0%";
}
function animate() {
    if (morphTextIndex <= 25) {
        requestAnimationFrame(animate);

        let newTime = new Date();
        let shouldIncrementIndex = morphCooldown > 0;
        let dt = (newTime - morphNoTime) / 1000;

        morphNoTime = newTime;
        morphCooldown -= dt;

        if (morphCooldown <= 0) {
            if (shouldIncrementIndex) {
                morphTextIndex++;
            }

            doMorph();
        } 
        else {
            doCooldown();
        }
    } 
    else {
        morphContainer.remove();

        typingTextStar1.style.opacity = 1;
        typingTextStar1.style.animation = "shineStarEffectBeginning 0.15s 21, starToCursor 4s 1, starToCursorPosition1 4s 1";
    }
}
animate();



/* TYPING TEXT */
typingTextStar1.addEventListener("animationend", () => {
    if (event.animationName === "starToCursor") {
        setTimeout(() => {
            typingTextStar1.style.opacity = 0;
            typingText1();
        }, 500)
    }
    if (event.animationName === "cursorToStar") {
        typingTextStar1.remove();

        setTimeout(() => {
            typingTextStar2.style.opacity = 1;
            typingTextStar2.style.animation = "shineStarEffectBeginning 0.15s 21, starToCursor 4s 1, starToCursorPosition2 4s 1";
        }, 2000)
    }
});
function typingText1() {
    new TypeIt("#typingTextLetters", {
        speed: 0,

        afterComplete: () => {
            typingTextLetters.style.opacity = 0;
            typingTextStar1.style.opacity = 1;

            setInterval(() => {
                typingTextStar1.style.animation = "shineStarEffectEnd 0.15s 0.6s 22, cursorToStar 4s 1";
            }, 1000);
        }
    })
        .type("M")
        .pause(381)
        .type("i")
        .pause(183)
        .type("s")
        .pause(155)
        .type(" ")
        .pause(470)
        .type("o")
        .pause(182)
        .type("j")
        .pause(101)
        .type("o")
        .pause(142)
        .type("s")
        .pause(111)
        .type(" ")
        .pause(348)
        .type("y")
        .pause(180)
        .type(" ")
        .pause(194)
        .type("y")
        .pause(269)
        .type("o")
        .pause(267)
        .type(" ")
        .pause(1894)
        .type("c")
        .pause(204)
        .type("r")
        .pause(209)
        .type("e")
        .pause(175)
        .type("e")
        .pause(158)
        .type("m")
        .pause(312)
        .type("s")
        .pause(301)
        .delete(1)
        .pause(310)
        .type("o")
        .pause(147)
        .type("s")
        .pause(108)
        .type(" ")
        .pause(196)
        .type("q")
        .pause(64)
        .type("u")
        .pause(301)
        .type("e")
        .pause(494)
        .type(" ")
        .pause(445)
        .type("t")
        .pause(166)
        .type("´")
        .pause(225)
        .delete(1)
        .type("ú")
        .pause(223)
        .type(" ")
        .pause(163)
        .type("e")
        .pause(199)
        .type("r")
        .pause(67)
        .type("e")
        .pause(267)
        .type("s")
        .pause(356)
        .type(" ")
        .pause(183)
        .type("l")
        .pause(111)
        .type("a")
        .pause(219)
        .type(" ")
        .pause(375)
        .type("m")
        .pause(145)
        .type("u")
        .pause(199)
        .type("j")
        .pause(153)
        .type("e")
        .pause(116)
        .type("r")
        .pause(41)
        .type(" ")
        .pause(201)
        .type("m")
        .pause(216)
        .type("´")
        .pause(170)
        .delete(1)
        .type("á")
        .pause(73)
        .type("s")
        .pause(107)
        .type(" ")
        .pause(200)
        .type("g")
        .pause(127)
        .type("u")
        .pause(153)
        .type("a")
        .pause(141)
        .type("p")
        .pause(158)
        .type("a")
        .pause(128)
        .type(" ")
        .pause(129)
        .type("q")
        .pause(115)
        .type("u")
        .pause(148)
        .type("e")
        .pause(72)
        .type(" ")
        .pause(161)
        .type("a")
        .pause(168)
        .type("l")
        .pause(169)
        .type("g")
        .pause(116)
        .type("u")
        .pause(85)
        .type("n")
        .pause(186)
        .type("a")
        .pause(140)
        .type(" ")
        .pause(134)
        .type("v")
        .pause(103)
        .type("e")
        .pause(457)
        .type("z")
        .pause(136)
        .type(" ")
        .pause(1597)
        .type("h")
        .pause(127)
        .type("a")
        .pause(82)
        .type(" ")
        .pause(1060)
        .type("e")
        .pause(605)
        .type("x")
        .pause(169)
        .type("i")
        .pause(269)
        .type("s")
        .pause(634)
        .type("t")
        .pause(304)
        .type("i")
        .pause(432)
        .type("d")
        .pause(456)
        .type("o")
        .pause(1090)
        .type(".")
        .pause(8000)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(400)
        .delete(4)
        .pause(400)
        .delete(6)
        .pause(400)
        .delete(4)
        .pause(400)
        .delete(6)
        .pause(400)
        .delete(3)
        .pause(400)
        .delete(5)
        .pause(400)
        .delete(3)
        .pause(400)
        .delete(4)
        .pause(400)
        .delete(8)
        .pause(400)
        .delete(3)
        .pause(400)
        .delete(2)
        .pause(400)
        .delete(5)
        .pause(400)
        .delete(3)
        .go();
};
typingTextStar2.addEventListener("animationend", () => {
    if (event.animationName === "starToCursor") {
        setTimeout(() => {
            typingTextStar2.style.opacity = 0;
            typingTextLetters.style.opacity = 1;
            typingText2();
        }, 500)
    }
    if (event.animationName === "cursorToStar") {
        typingTextStar2.remove();
        typingTextContainerPerspective = 2;

        setTimeout(() => {
            typingTextStar3.style.opacity = 1;
            typingTextStar3.style.animation = "shineStarEffectBeginning 0.15s 21, starToCursor 4s 1, starToCursorPosition3 4s 1";
        }, 2000)
    }
});
function typingText2() {
    new TypeIt("#typingTextLetters", {
        speed: 0,

        afterComplete: () => {
            typingTextLetters.style.opacity = 0;
            typingTextStar2.style.opacity = 1;

            setInterval(() => {
                if (typingTextContainerPerspective == 1) {
                    typingTextcontainer.style.perspectiveOrigin = "70% 20%";
                }

                typingTextStar2.style.animation = "shineStarEffectEnd 0.15s 0.6s 22, cursorToStar 4s 1";
            }, 1000);
        }
    })
        .type("T")
        .pause(774)
        .type("u")
        .pause(205)
        .type(" ")
        .pause(235)
        .type("i")
        .pause(133)
        .type("n")
        .pause(774)
        .type("t")
        .pause(147)
        .type("e")
        .pause(689)
        .type("l")
        .pause(269)
        .type("i")
        .pause(242)
        .type("g")
        .pause(120)
        .type("e")
        .pause(101)
        .type("n")
        .pause(140)
        .type("c")
        .pause(102)
        .type("i")
        .pause(279)
        .type("a")
        .pause(1184)
        .type(",")
        .pause(105)
        .type(" ")
        .pause(677)
        .type("t")
        .pause(197)
        .type("u")
        .pause(153)
        .type("s")
        .pause(83)
        .type(" ")
        .pause(180)
        .type("l")
        .pause(172)
        .type("o")
        .pause(231)
        .type("g")
        .pause(112)
        .type("r")
        .pause(199)
        .type("o")
        .pause(162)
        .type("s")
        .pause(977)
        .type(" ")
        .pause(322)
        .type("y")
        .pause(153)
        .type(" ")
        .pause(165)
        .type("t")
        .pause(549)
        .type("u")
        .pause(139)
        .type("s")
        .pause(110)
        .type(" ")
        .pause(371)
        .type("m")
        .pause(127)
        .type("e")
        .pause(181)
        .type("t")
        .pause(77)
        .type("a")
        .pause(119)
        .type("s")
        .pause(117)
        .type(" ")
        .pause(1332)
        .type("m")
        .pause(113)
        .type("e")
        .pause(98)
        .type(" ")
        .pause(176)
        .type("p")
        .pause(194)
        .type("a")
        .pause(229)
        .type("r")
        .pause(101)
        .type("e")
        .pause(232)
        .type("c")
        .pause(129)
        .type("e")
        .pause(227)
        .type("n")
        .pause(1495)
        .type(" ")
        .pause(249)
        .type("t")
        .pause(147)
        .type("a")
        .pause(169)
        .type("n")
        .pause(1020)
        .type(" ")
        .pause(322)
        .type("m")
        .pause(318)
        .type("a")
        .pause(131)
        .type("r")
        .pause(111)
        .type("a")
        .pause(107)
        .type("v")
        .pause(297)
        .type("i")
        .pause(257)
        .type("l")
        .pause(160)
        .type("l")
        .pause(163)
        .type("o")
        .pause(105)
        .type("s")
        .pause(120)
        .type("a")
        .pause(235)
        .type("s")
        .pause(3489)
        .type(" ")
        .pause(438)
        .type("c")
        .pause(124)
        .type("o")
        .pause(167)
        .type("m")
        .pause(54)
        .type("o")
        .pause(1183)
        .type(" ")
        .pause(195)
        .type("p")
        .pause(171)
        .type("a")
        .pause(179)
        .type("r")
        .pause(77)
        .type("a")
        .pause(124)
        .type(" ")
        .pause(215)
        .type("q")
        .pause(187)
        .type("u")
        .pause(128)
        .type("e")
        .pause(253)
        .type("r")
        .pause(204)
        .type("e")
        .pause(163)
        .type("r")
        .pause(163)
        .type(" ")
        .pause(1937)
        .type("p")
        .pause(121)
        .type("a")
        .pause(178)
        .type("s")
        .pause(149)
        .type("a")
        .pause(194)
        .type("r")
        .pause(154)
        .type(" ")
        .pause(579)
        .type("t")
        .pause(291)
        .type("o")
        .pause(300)
        .type("d")
        .pause(127)
        .type("a")
        .pause(154)
        .type(" ")
        .pause(166)
        .type("m")
        .pause(164)
        .type("i")
        .pause(317)
        .type(" ")
        .pause(132)
        .type("v")
        .pause(119)
        .type("i")
        .pause(147)
        .type("d")
        .pause(103)
        .type("a")
        .pause(1283)
        .type(" ")
        .pause(132)
        .type("a")
        .pause(102)
        .type(" ")
        .pause(200)
        .type("t")
        .pause(499)
        .type("u")
        .pause(488)
        .type(" ")
        .pause(398)
        .type("l")
        .pause(122)
        .type("a")
        .pause(163)
        .type("d")
        .pause(94)
        .type("o")
        .pause(878)
        .type(".")
        .pause(8000)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(400)
        .delete(3)
        .pause(400)
        .delete(5)
        .pause(400)
        .delete(6)
        .pause(400)
        .delete(7)
        .pause(400)
        .delete(5)
        .pause(400)
        .delete(5)
        .pause(400)
        .delete(13)
        .pause(400)
        .delete(4)
        .pause(400)
        .delete(8)
        .pause(400)
        .delete(3)
        .pause(400)
        .delete(6)
        .pause(400)
        .delete(4)
        .pause(400)
        .delete(2)
        .pause(400)
        .delete(7)
        .pause(400)
        .delete(4)
        .pause(400)
        .delete(14)
        .pause(400)
        .delete(2)
        .go();

};
typingTextStar3.addEventListener("animationend", () => {
    if (event.animationName === "starToCursor") {
        setTimeout(() => {
            typingTextStar3.style.opacity = 0;
            typingTextLetters.style.opacity = 1;
            typingText3();
        }, 500)
    }

    if (event.animationName === "cursorToStar") {
        typingTextStar3.remove();
        typingTextcontainer.remove();
        formStar.style.animation = "formStarToFront 4s 1, shineStarEffectBeginning 0.15s 22, cssCounter 3.9s 1";
    }
});
function typingText3() {
    new TypeIt("#typingTextLetters", {
        speed: 0,

        afterComplete: () => {
            typingTextLetters.style.opacity = 0;
            typingTextStar3.style.opacity = 1;

            setInterval(() => {
                if (typingTextContainerPerspective == 2) {
                    typingTextcontainer.style.perspectiveOrigin = "50% 70%";
                }

                typingTextStar3.style.animation = "shineStarEffectEnd 0.15s 0.6s 22, cursorToStar 4s 1";
            }, 1000);
        }
    })
        .type("E")
        .pause(332)
        .type("s")
        .pause(223)
        .type("t")
        .pause(375)
        .type("o")
        .pause(247)
        .type("y")
        .pause(1348)
        .type(" ")
        .pause(219)
        .type("t")
        .pause(125)
        .type("a")
        .pause(104)
        .type("n")
        .pause(174)
        .type(" ")
        .pause(597)
        .type("e")
        .pause(115)
        .type("n")
        .pause(152)
        .type("a")
        .pause(121)
        .type("m")
        .pause(122)
        .type("o")
        .pause(114)
        .type("r")
        .pause(200)
        .type("a")
        .pause(194)
        .type("d")
        .pause(84)
        .type("o")
        .pause(205)
        .type(" ")
        .pause(171)
        .type("d")
        .pause(79)
        .type("e")
        .pause(114)
        .type(" ")
        .pause(218)
        .type("t")
        .pause(161)
        .type("i")
        .pause(1379)
        .type(" ")
        .pause(909)
        .delete(1)
        .pause(665)
        .type(",")
        .pause(102)
        .type(" ")
        .pause(424)
        .type("q")
        .pause(135)
        .type("u")
        .pause(143)
        .type("e")
        .pause(125)
        .type(" ")
        .pause(337)
        .type("s")
        .pause(176)
        .type("i")
        .pause(174)
        .type(" ")
        .pause(222)
        .type("u")
        .pause(101)
        .type("n")
        .pause(174)
        .type(" ")
        .pause(288)
        .type("d")
        .pause(194)
        .type("´")
        .pause(261)
        .delete(1)
        .type("í")
        .pause(120)
        .type("a")
        .pause(1264)
        .type(" ")
        .pause(246)
        .type("d")
        .pause(99)
        .type("e")
        .pause(206)
        .type("s")
        .pause(130)
        .type("p")
        .pause(215)
        .type("i")
        .pause(80)
        .type("e")
        .pause(111)
        .type("r")
        .pause(216)
        .type("t")
        .pause(110)
        .type("o")
        .pause(271)
        .type(" ")
        .pause(1068)
        .type("y")
        .pause(142)
        .type(" ")
        .pause(245)
        .type("o")
        .pause(205)
        .type("l")
        .pause(285)
        .type("v")
        .pause(127)
        .type("i")
        .pause(129)
        .type("d")
        .pause(129)
        .type("o")
        .pause(185)
        .type(" ")
        .pause(185)
        .type("m")
        .pause(134)
        .type("i")
        .pause(187)
        .type(" ")
        .pause(201)
        .type("n")
        .pause(176)
        .type("o")
        .pause(119)
        .type("m")
        .pause(251)
        .type("b")
        .pause(124)
        .type("r")
        .pause(111)
        .type("e")
        .pause(1315)
        .type(",")
        .pause(93)
        .type(" ")
        .pause(1201)
        .type("s")
        .pause(234)
        .type("e")
        .pause(122)
        .type("g")
        .pause(194)
        .type("u")
        .pause(122)
        .type("r")
        .pause(200)
        .type("a")
        .pause(203)
        .type("m")
        .pause(214)
        .type("e")
        .pause(2394)
        .type("n")
        .pause(212)
        .type("t")
        .pause(167)
        .type("e")
        .pause(1009)
        .type(" ")
        .pause(485)
        .type("s")
        .pause(138)
        .type("i")
        .pause(227)
        .type("g")
        .pause(99)
        .type("a")
        .pause(60)
        .type(" ")
        .pause(224)
        .type("r")
        .pause(135)
        .type("e")
        .pause(592)
        .type("c")
        .pause(223)
        .type("o")
        .pause(956)
        .type("r")
        .pause(572)
        .type("d")
        .pause(130)
        .type("a")
        .pause(145)
        .type("n")
        .pause(130)
        .type("d")
        .pause(109)
        .type("o")
        .pause(181)
        .type(" ")
        .pause(115)
        .type("e")
        .pause(127)
        .type("l")
        .pause(170)
        .type(" ")
        .pause(528)
        .type("t")
        .pause(176)
        .type("u")
        .pause(164)
        .type("y")
        .pause(234)
        .type("o")
        .pause(255)
        .type(" ")
        .pause(1898)
        .type(" ")
        .pause(507)
        .delete(1)
        .pause(703)
        .type("y")
        .pause(132)
        .type(" ")
        .pause(208)
        .type("t")
        .pause(94)
        .type("o")
        .pause(192)
        .type("d")
        .pause(93)
        .type("o")
        .pause(200)
        .type(" ")
        .pause(417)
        .type("l")
        .pause(149)
        .type("o")
        .pause(148)
        .type(" ")
        .pause(158)
        .type("q")
        .pause(113)
        .type("u")
        .pause(161)
        .type("e")
        .pause(212)
        .type(" ")
        .pause(247)
        .type("e")
        .pause(154)
        .type("r")
        .pause(127)
        .type("e")
        .pause(256)
        .type("s")
        .pause(830)
        .type(" ")
        .pause(808)
        .type("p")
        .pause(141)
        .type("a")
        .pause(360)
        .type("r")
        .pause(126)
        .type("a")
        .pause(160)
        .type(" ")
        .pause(241)
        .type("m")
        .pause(103)
        .type("i")
        .pause(1592)
        .type(".")
        .pause(8000)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(250)
        .delete(1)
        .pause(400)
        .delete(3)
        .pause(400)
        .delete(5)
        .pause(400)
        .delete(2)
        .pause(400)
        .delete(5)
        .pause(400)
        .delete(3)
        .pause(400)
        .delete(11)
        .pause(400)
        .delete(5)
        .pause(400)
        .delete(12)
        .pause(400)
        .delete(8)
        .pause(400)
        .delete(3)
        .pause(400)
        .delete(7)
        .pause(400)
        .delete(2)
        .pause(400)
        .delete(10)
        .pause(400)
        .delete(4)
        .pause(400)
        .delete(3)
        .pause(400)
        .delete(3)
        .pause(400)
        .delete(4)
        .pause(400)
        .delete(4)
        .pause(400)
        .delete(3)
        .pause(400)
        .delete(10)
        .pause(400)
        .delete(4)
        .pause(400)
        .delete(5)
        .go();
};



/* INSIDE STAR */
formStar.addEventListener("animationend", () => {
    if (event.animationName === "cssCounter") {
        formContainer.style.backgroundColor = "var(--whiteColor)";
    }

    if (event.animationName === "formStarToFront") {
        formWorldCanvas.style.opacity = 1;
        formWorldCanvas.style.animation = "formWorldGrowing 3s 1";
    }

    if (event.animationName === "formStarToBack") {
        formContainer.remove();
    }
});
formWorldCanvas.addEventListener("animationend", () => {
    if (event.animationName === "formWorldGrowing") {
        showingFormWorldTexts();
    }
    if (event.animationName === "formWorldShrinking") {
        formWorldCanvas.remove();
        formStar.style.animation = "formStarToBack 4s 1"
        formContainer.style.backgroundColor = "#00000000"
    }
});



/* FORM WORLD */
formWorldCanvas.width = formWorldCanvas.clientWidth;
formWorldCanvas.height = formWorldCanvas.clientHeight;
if (window.devicePixelRatio > 1) {
    formWorldCanvas.width = formWorldCanvas.clientWidth * 2;
    formWorldCanvas.height = formWorldCanvas.clientHeight * 2;
    ctx.scale(2, 2);
}
class Dot {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.xProject = 0;
        this.yProject = 0;
        this.sizeProjection = 0;
    }

    project(sin, cos) {
        const rotX = cos * this.x + sin * (this.z - GLOBE_CENTER_Z);
        const rotZ = -sin * this.x + cos * (this.z - GLOBE_CENTER_Z) + GLOBE_CENTER_Z;

        this.sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW - rotZ);
        this.xProject = (rotX * this.sizeProjection) + PROJECTION_CENTER_X;
        this.yProject = (this.y * this.sizeProjection) + PROJECTION_CENTER_Y;
    }

    draw(sin, cos) {
        this.project(sin, cos);
        ctx.beginPath();
        ctx.arc(this.xProject, this.yProject, DOT_RADIUS * this.sizeProjection, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}
function createDots() {
    dots.length = 0;

    for (let i = 0; i < DOTS_AMOUNT; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos((Math.random() * 2) - 1);
        const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
        const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
        const z = (GLOBE_RADIUS * Math.cos(phi)) + GLOBE_CENTER_Z;

        dots.push(new Dot(x, y, z));
    }
}
function formWorldRender(a) {
    ctx.clearRect(0, 0, formWorldWidth, formWorlHeight);

    rotation = a * 0.0001;

    const sineRotation = Math.sin(rotation);
    const cosineRotation = Math.cos(rotation);

    for (var i = 0; i < dots.length; i++) {
        dots[i].draw(sineRotation, cosineRotation);
    }

    window.requestAnimationFrame(formWorldRender);
}
function afterResize() {
    formWorldWidth = formWorldCanvas.offsetWidth;
    formWorlHeight = formWorldCanvas.offsetHeight;

    if (window.devicePixelRatio > 1) {
        formWorldCanvas.width = formWorldCanvas.clientWidth * 2;
        formWorldCanvas.height = formWorldCanvas.clientHeight * 2;
        ctx.scale(2, 2);
    }
    else {
        formWorldCanvas.width = formWorldWidth;
        formWorldCanvas.height = height;
    }

    GLOBE_RADIUS = formWorldWidth * 0.7;
    GLOBE_CENTER_Z = -GLOBE_RADIUS;
    PROJECTION_CENTER_X = formWorldWidth / 2;
    PROJECTION_CENTER_Y = formWorlHeight / 2;
    FIELD_OF_VIEW = formWorldWidth * 0.8;

    createDots();
}
function onResize() {
    resizeTimeout = window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(afterResize, 0);
}
window.addEventListener('resize', onResize);
createDots();
window.requestAnimationFrame(formWorldRender);



/* INSIDE STAR FORM */
function showingFormWorldTexts() {
    setTimeout(() => {
        formWorldP1.style.opacity = 1;

        setTimeout(() => {
            formWorldP2.style.opacity = 1;

            setTimeout(() => {
                formWorldP1.style.opacity = 0;
                formWorldP2.style.opacity = 0;

                setTimeout(() => {
                    formWorldP3.style.opacity = 1;

                    setTimeout(() => {
                        formWorldP4.style.opacity = 1;

                        setTimeout(() => {
                            formWorldP3.style.opacity = 0;
                            formWorldP4.style.opacity = 0;

                            setTimeout(() => {
                                formWorldP5.style.opacity = 1;

                                setTimeout(() => {
                                    formWorldP5.style.opacity = 0;

                                    setTimeout(() => {
                                        formWorldP6.style.opacity = 1;

                                        setTimeout(() => {
                                            formWorldP6.style.opacity = 0;

                                            setTimeout(() => {
                                                formWorldP7.style.opacity = 1;
                                            }, 4000)
                                        }, 6000)
                                    }, 4000)
                                }, 9000)
                            }, 4000)
                        }, 10000)
                    }, 5000)
                }, 4000)
            }, 9000)
        }, 5000)
    }, 200)
}
function CancelMessage() {
    var params = {
        message: "Lo sentimos, Kat no ha dejado un mensaje para ti"
    }

    emailjs.send(serviceID, templateID, params)
        .then((res) => {
            gettingOutOfStar();
        })
}
function textAreaValidation() {
    if (formTextArea.value == "") {
        formButton.disabled = true;
    }
    else {
        formButton.disabled = false;
    }
}
function sendMail() {
    formMessage = formTextArea.value;

    var params = {
        message: formMessage
    }

    emailjs.send(serviceID, templateID, params)
        .then((res) => {
            gettingOutOfStar();
        })
}
function gettingOutOfStar() {
    formWorldP7.style.transition = "opacity 0.5s"
    formWorldP7.style.opacity = 0;
    formWorldCanvas.style.animation = "formWorldShrinking 2s 1"
}