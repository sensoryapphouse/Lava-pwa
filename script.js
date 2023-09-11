/*  Buttons:

*/
var red;
var ballStyle = 0;
var huecount = 0,
    invert = false;
var changeDir = 200;
var strokewidth = 5;
var resized = false;

var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Common = Matter.Common,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint;
var engine;
var world_width;
var world_height;
var screen;

var splash;
var button;
var button1;
var button2;
var button3;
var crosshairs;
var bdy;
window.onload = function () {
    //    if ('serviceWorker' in navigator) {
    //        navigator.serviceWorker
    //            .register('./sw.js');
    //    }

    crosshairs = document.querySelector('crosshairs');
    crosshairs.hidden = true;
    splash = document.querySelector('splash');
    //    splash.hidden = true;
    bdy = document.getElementById('body');
    button = document.querySelector('button');
    button1 = document.querySelector('button1');
    button2 = document.querySelector('button2');
    button3 = document.querySelector('button3');
    button.onmousedown = function (e) {
        event.preventDefault();
        Action(1);
    }
    button1.onmousedown = function (e) {
        event.preventDefault();
        Action(2);
    }
    button2.onmousedown = function (e) {
        event.preventDefault();
        Action(3);
    }
    button3.onmousedown = function (e) {
        event.preventDefault();
        Action(4);
    }

    splash.onclick = function (e) {
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        } else if (document.body.msRequestFullscreen) {
            document.body.msRequestFullscreen();
        } else if (document.body.mozRequestFullScreen) {
            document.body.mozRequestFullScreen();
        } else if (document.body.webkitRequestFullscreen) {
            document.body.webkitRequestFullscreen();
        }
        splash.hidden = true;
    }

    start();
}

var huecount = 0;
var invert = false;

function Action(i) {
    switch (i) {
        case 1:
            for (i = 0; i < 12; i++) {
                var b = red.bodies[i]; // Math.floor(Math.random() * 16)
                Body.applyForce(b, {
                    x: b.position.x,
                    y: b.position.y
                }, {
                    x: b.mass * (Math.random() - .5) / 5,
                    y: b.mass * (Math.random() - .5) / 5
                });
            }
            PlaySound(1);
            break;
        case 2:
            ballStyle++;
            if (ballStyle > 4)
                ballStyle = 0;
            resized = true;
            PlaySound(2);
            break;
        case 3:
            switch (changeDir) {
                case 200:
                    changeDir = 100;
                    break;
                case 400:
                    changeDir = 200;
                    break;
                case 50:
                    changeDir = 400;
                    break;
                case 100:
                    changeDir = 50;
                    break;

            }
            PlaySound(3);
            break;
        case 4:
            huecount++;
            if (huecount > 6) {
                huecount = 0;
                invert = !invert;
            }
            var s = "";
            if (invert) {
                s = "invert(100%) ";
            }
            button.style.filter = button1.style.filter = button2.style.filter = button3.style.filter = s;
            if (huecount == 6)
                bdy.style.filter = s + "grayscale(100%)";
            else
                bdy.style.filter = s + "hue-rotate(" + (huecount * 60) + "deg)";
            break;
    }
}


var player;
var player1;
var player2;

function PlaySound(i) {
    switch (i) {
        case 1:
            if (player == undefined) {
                player = document.getElementById('audio');
                player.loop = false;
            }
            player.load();
            player.play();
            break;
        case 2:
            if (player1 == undefined) {
                player1 = document.getElementById('audio1');
            }
            player1.load();
            player1.play();
            break;
        case 3:
            if (player2 == undefined) {
                player2 = document.getElementById('audio2');
            }
            player2.load();
            player2.play();
            break;
    }
}

function toggleButtons() {
    button.hidden = !button.hidden;
    button1.hidden = !button1.hidden;
    button2.hidden = !button2.hidden;
    button3.hidden = !button3.hidden;
}

window.addEventListener('keydown', e => {
    if (e.repeat)
        return;
    switch (e.keyCode) {
        case 32:
        case 49:
            Action(1);
            break;
        case 50:
            Action(2);
            break;
        case 51:
        case 13:
            Action(3);
            break;
        case 52:
            Action(4);
            break;
        case 53:
            toggleButtons();
            break;
    }
});

function start() {
    world_width = window.innerWidth;
    world_height = window.innerHeight;
    screen = document.getElementById("screen");
    // create a Matter.js engine
    engine = Engine.create(screen, {
        render: {
            options: {
                width: world_width,
                height: world_width,
                showAngleIndicator: true,
                wireframes: true,
            }
        }
    });

    var gravity_scale = 0.04;
    engine.world.gravity.y = gravity_scale;

    // add a mouse controlled constraint
    var mouseConstraint = MouseConstraint.create(engine);
    World.add(engine.world, mouseConstraint);

    var options = {
        isStatic: true,
        render: {
            visible: true
        }
    };

    engine.world.bodies = [];

    function addWalls() {
        // these static walls will not be rendered in this sprites example, see options
        var ground = Bodies.rectangle(world_width / 2, world_height, world_width, 50, options);
        var wall1 = Bodies.rectangle(0, world_height / 2, 50, world_height, options);
        var wall2 = Bodies.rectangle(world_width, world_height / 2, 50, world_height, options);
        var top = Bodies.rectangle(world_width / 2, 0, world_width, 50, options);
        World.add(engine.world, [ground, wall1, wall2, top]);
    }
    addWalls();

    var add_stack = function (color, count, size) {
        var stack = Composites.stack(world_width / 3, world_height / 3, count, count - 1, 0, 0, function (x, y) {
            return Bodies.circle(x, y, (Math.random() * world_width / 20) + 5.7 * size, {
                density: Math.random() / 500 + 0.0006, //0.0005,
                frictionAir: Math.random() / 40, //0.06,
                restitution: .5,
                friction: 0.00001,
                render: {
                    fillStyle: color,
                    strokeStyle: color,
                    strokeWidth: size * strokewidth
                }
            });
        });
        World.add(engine.world, stack);
        return stack;
    }

    function addBalls() {
        if (ballStyle != 1)
            add_stack("#70F0FF", 4, .15);
        if (ballStyle != 2)
            add_stack("#606FFF", 3.5, .5);
        if (ballStyle != 3)
            add_stack("#888FFF", 5, 1.);
        if (ballStyle != 4)
            add_stack("#70F0FF", 3, 3);
        red = add_stack("#ff8888", 4, 5);
    }
    addBalls();

    //    for (i = 0; i < 12; i++) { // add variable
    //        red.bodies[i].grav = true; 
    //    }
    var renderOptions = engine.render.options;
    // renderOptions.background = 'http://brm.io/matter-js-demo-master/img/wall-bg.jpg';
    renderOptions.background = 'transparent'; //'#404080';
    // renderOptions.showAngleIndicator = false;
    renderOptions.wireframes = false;

    // run the engine
    ;
    Engine.run(engine);
    engine.world.gravity.y = gravity_scale;
    engine.world.gravity.x = gravity_scale / 6;


    var toggle = 0;
    var count = 0;
    var up = -1;

    function removeAll() {
        try {
            for (i = 3; i >= 0; i--)
                Matter.Composite.remove(engine.world, engine.world.bodies[i]);

            for (j = engine.world.composites.length - 1; j >= 0; j--)
                for (k = engine.world.composites[j].bodies.length - 1; k >= 0; k--)
                    Matter.Composite.remove(engine.world.composites[j], engine.world.composites[j].bodies[k]);
        } catch (e) {};
    }

    window.setInterval(function () {
        if (resized) {
            resized = false;
            removeAll();
            addWalls();
            addBalls();
            return;
        }
        count++;
        if (count > changeDir) {
            up = -up;
            count = 0;
            engine.world.gravity.y = -engine.world.gravity.y;
            if (Math.random() < 0.25)
                engine.world.gravity.x = -engine.world.gravity.x;
        }
        for (i = 0; i < 12; i++) {
            var b = red.bodies[i]; // Math.floor(Math.random() * 16)
            Body.applyForce(b, {
                x: b.position.x,
                y: b.position.y
            }, {
                x: 0,
                y: b.mass * up / 4000
            });
        }
        //        if (Math.random() < 0.5)
        //            engine.world.gravity.y = -engine.world.gravity.y;
        console.log("tick");
    }, 50);

}

var tmr;
window.onresize = function () {
    try {
        clearTimeout(tmr);
    } catch (e) {};
    tmr = window.setTimeout(function () {
            world_width = window.innerWidth;
            world_height = window.innerHeight;
            resized = true;
        },
        300);

}

var gpad;

function getAxes() {
    //        console.log('Axis', gpad.getAxis(0), gpad.getAxis(1), gpad.getButton(14).value);

    if (splash.hidden) {
        JoystickMoveTo(gpad.getAxis(1), gpad.getAxis(0));
        JoystickMoveTo(gpad.getAxis(3), gpad.getAxis(2));
    }
    setTimeout(function () {
        getAxes();
    }, 50);
}

gamepads.addEventListener('connect', e => {
    console.log('Gamepad connected:');
    console.log(e.gamepad);
    gpad = e.gamepad;
    e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
    e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
    setTimeout(function () {
        getAxes();
    }, 50);
});


gamepads.addEventListener('disconnect', e => {
    console.log('Gamepad disconnected:');
    console.log(e.gamepad);
});

gamepads.start();
var mouseC, mouseY;
var grabbed;
var b = null;

function MouseClick() {
    if (splash.hidden) {
        var s;
        var elements = document.elementsFromPoint(crosshairs.offsetLeft + (crosshairs.offsetWidth) / 2, crosshairs.offsetTop + (crosshairs.offsetHeight) / 2);
        try {
            if (elements[0].className != "btn") {
                //                var mouseX = crosshairs.offsetLeft + (crosshairs.offsetWidth) / 2;
                //                var mouseY = crosshairs.offsetTop + (crosshairs.offsetHeight) / 2;//                for (j = engine.world.composites.length - 1; j >= 0; j--) {
                //                    grabbed = Matter.Query.point(engine.world.composites[j].bodies, {
                //                        x: mouseX,
                //                        y: mouseY
                //                    });
                //                    if (grabbed.length > 0) {
                //                        b = grabbed[0];
                //                        Body.applyForce(b, {
                //                            x: b.position.x,
                //                            y: b.position.y
                //                        }, {
                //                            x: b.mass * (Math.random() - .5) / 4,
                //                            y: b.mass * (Math.random() - .5) / 4
                //                        });
                //                        return;
                //                    }
                //                }
            } else {
                elements[0].click();
            }
        } catch {}
    }
}

function MoveMouse(xm, ym) {
    crosshairs.hidden = false;
    try {
        mouseX = crosshairs.offsetLeft + (crosshairs.offsetWidth) / 2;
        mouseY = crosshairs.offsetTop + (crosshairs.offsetHeight) / 2;
        mouseX += xm;
        mouseY += ym;
        if (mouseX < 10)
            mouseX = 10;
        if (mouseY < 10)
            mouseY = 10;
        if (mouseX >= window.innerWidth - 10)
            mouseX = window.innerWidth - 10;
        if (mouseY >= window.innerHeight - 10)
            mouseY = window.innerHeight - 10;
        crosshairs.style.left = mouseX - crosshairs.offsetWidth / 2 + "px";
        crosshairs.style.top = mouseY - crosshairs.offsetHeight / 2 + "px";
        for (j = engine.world.composites.length - 1; j >= 0; j--) {
            grabbed = Matter.Query.point(engine.world.composites[j].bodies, {
                x: mouseX,
                y: mouseY
            });
            if (grabbed.length > 0) {
                b = grabbed[0];
                Body.applyForce(b, {
                    x: b.position.x,
                    y: b.position.y
                }, {
                    x: b.mass * (Math.random() - .5) / 20,
                    y: b.mass * (Math.random() - .5) / 20
                });
                return;
            }
        }
        console.log("Xtarget: ", mouseX, mouseY);
    } catch {}
}

function JoystickMoveTo(jy, jx) {
    if (splash.hidden) {
        if (Math.abs(jx) < .1 && Math.abs(jy) < .1) {
            try {
                if (gpad.getButton(14).value > 0) // dpad left
                    MoveMouse(-3, 0);
                if (gpad.getButton(12).value > 0) // dup
                    MoveMouse(0, -2);
                if (gpad.getButton(13).value > 0) // ddown
                    MoveMouse(0, 2);
                if (gpad.getButton(15).value > 0) // dright
                    MoveMouse(3, 0);
            } catch {}
            return;
        }
        if (Math.abs(jx) < .1)
            jx = 0;
        if (Math.abs(jy) < .1)
            jy = 0;
        if (jx == 0 && jy == 0)
            return;
        MoveMouse(jx * 10, jy * 10);
    }
}

function showPressedButton(index) {
    console.log("Press: ", index);
    if (!splash.hidden) {
        splash.hidden = true;
    } else switch (index) {
        case 0: // A click
            //            if (crosshairs.hidden)
            Action(1);
            //            else//                MouseClick();
            break;
        case 1: // B
            Action(2);
            break;
        case 2: // Y
            Action(3);
            break;
        case 4:
            Action(4);
            break;
        case 8:
            toggleButtons();
            break
        case 5:
        case 6:
        case 7:
        case 9:
        case 11:
        case 16:
            break;
        case 10: // XBox
            showMenu();
            break;
        default:
    }
}

function removePressedButton(index) {
    console.log("Releasd: ", index);
}
