/* CONST */
const starColor = '#fffcf7', starSize = 4, starMinScale = 0.2, overflowThreshold = 50, starCount = (window.innerWidth + window.innerHeight) / 6, canvasStarsBackground = document.getElementById('starsBackground'), context = canvasStarsBackground.getContext('2d');
const formStar = document.getElementById("formStar"), formContainer = document.getElementById("formContainer"), formWorldCanvas = document.querySelector('#formWorld'), DOTS_AMOUNT = 1000, DOT_RADIUS = 3.5, ctx = formWorldCanvas.getContext('2d'), formWorldP1 = document.getElementById("formWorldP1"), formWorldP2 = document.getElementById("formWorldP2"), formWorldP3 = document.getElementById("formWorldP3"), formWorldP4 = document.getElementById("formWorldP4"), formWorldP5 = document.getElementById("formWorldP5"), formWorldP6 = document.getElementById("formWorldP6"), formWorldP7 = document.getElementById("formWorldP7"), formTextArea = document.getElementById("formMessage"), serviceID = "service_azvo6j7", templateID = "template_0vvmp4e", formButton = document.getElementById("formButton");



/* LET */
let scale = 1, width, height, stars = [], pointerX, pointerY, velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0012 }, touchInput = false;
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
    } else {
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
                                            }, 400)
                                        }, 600)
                                    }, 400)
                                }, 900)
                            }, 400)
                        }, 1000)
                    }, 500)
                }, 400)
            }, 900)
        }, 500)/* */
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