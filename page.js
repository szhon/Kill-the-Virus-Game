// ===================== Fall 2021 EECS 493 Assignment 2 =====================
// This starter code provides a structure and helper functions for implementing
// the game functionality. It is a suggestion meant to help you, and you are not
// required to use all parts of it. You can (and should) add additional functions
// as needed or change existing functions.

// ==============================================
// ============ Page Scoped Globals Here ========
// ==============================================

// Div Handlers
let game_window;
// let play_window;
let play_game_window;

// Game Object Helpers
let AST_OBJECT_REFRESH_RATE = 15;
let maxPersonPosX = 1218;
let maxPersonPosY = 658;
let PERSON_SPEED = 5; // Speed of the person
let vaccineOccurrence = 20000; // Vaccine spawns every 20 seconds
let vaccineGone = 5000; // Vaccine disappears in 5 seconds
let maskOccurrence = 15000; // Masks spawn every 15 seconds
let maskGone = 5000; // Mask disappears in 5 seconds


var timesClicked = 0;

var volume = 0.5;

// Movement Helpers
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;

// var LEFT_UP = false;
// var LEFT_DOWN = false;
// var RIGHT_UP = false;
// var RIGHT_DOWN = false;

var touched = false;
var masked = false;
var vaccined = 1;
var refreshed = false;
var endGame = false;
// Position variables
var KEYS = {
    left: 37,
    right: 39,
    up: 38,
    down: 40
}

//Game difficulty
var difficulty = 'Normal';
//测试用，一会要改！
var Spawn_rate = 800;
var virus_speed = 3; //px
var currVirusX = 0;
var currVirusY = 0;
var currMaskX = -100;
var currMaskY = -100;
var currVacX = 0;
var currVacY = 0;
var OBJECT_REFRESH_TIME = virus_speed; //ms
var virusIdx = 0;
var decider = 0;


//interval clear
var score_interval_status;
var mask_interval_status;
var vacc_interval_status;
var direction_interval_status;
var virus_interval_status = [];
var fireVirus_interval;

var covid_danger = 20;
let Current_score = 0;

//sound
var sound = {};
sound.collect = new Audio('src/audio/collect.mp3');
sound.die = new Audio('src/audio/die.mp3');


// ==============================================
// ============ Functional Code Here ============
// ==============================================

// Keydown event handler
document.onkeydown = function(e) {
    if (e.key == 'ArrowLeft') LEFT = true;
    if (e.key == 'ArrowRight') RIGHT = true;
    if (e.key == 'ArrowUp') UP = true;
    if (e.key == 'ArrowDown') DOWN = true;
    // console.log("on key down", LEFT);
    direction_interval_status = setInterval(() => {
        setDirection();
    }, 500);

    whichImgPlayer();

}

// Keyup event handler
document.onkeyup = function(e) {
    if (e.key == 'ArrowLeft') LEFT = false;
    if (e.key == 'ArrowRight') RIGHT = false;
    if (e.key == 'ArrowUp') UP = false;
    if (e.key == 'ArrowDown') DOWN = false;
    whichImgPlayer();
}

// Main
$(document).ready(function() {
    // ====== Startup ====== 
    game_window = $('.game-window');
    player = $("#player");
    play_game_window = $('.play_game');
    // setDirection();


    // TODO: ADD MORE

});

// TODO: ADD YOUR FUNCTIONS HERE
//change vol
var rangeInput = document.getElementById("myRangeVol");
rangeInput.addEventListener("input", function() {
    document.getElementById("rangevalue").textContent = rangeInput.value;
    volume = 0.01 * rangeInput.value;
    console.log("change vol", volume);
}, false);

$('button2').click(function() {
    $('setting').show();
})

$(".Close_button").click(function() {
    $(".setting").hide();
})

$('#actual_game').hide();
$('#endGameWindow').hide();

//set time out for ready page
function ready_page_disappear() {
    whichImgPlayer();

    var readyPage = $(".ready_page");
    readyPage.hide();
    // changeVolumn();



    $('.play_game').show();
    // fireVirus
    fireVirus_interval = setInterval(() => {
        fireVirus();
        console.log("start firing virus");
    }, Spawn_rate);
    show_mask();
    show_vaccine();
    update_score();
}

function reset_score_board() {
    touched = false;
    refreshed = true;
    masked = false;
    endGame = false;
    vaccined = 1;
    Current_score = 0;
    covid_danger = 20;
    player.css("left", 600);
    player.css("top", 300);



    //reset score and level
    var scoreitem = $("#score_num");
    scoreitem.text(Current_score);

    //reset level
    $('#covid_level').text(vaccined);

    //reset danger
    $('#covid_danger_num').text(covid_danger);
    console.log("reset_score_board");
}

function ShowGame() {
    reset_score_board();

    $('#actual_game').show();
    $('.Tutorial').hide();
    $('.play_game').hide();
    $('#endGameWindow').hide();
    //set page time out
    var readyPage = $(".ready_page");
    readyPage.show();

    // clear_virus_helper();
    console.log("show Game!");


    setTimeout(() => {
        ready_page_disappear();
    }, 3000);

    set_spawn_speed_virus();
    //start game
}

//researt
//之前页面没有刷新！
//when click start over
function showMain() {
    $('#endGameWindow').hide();
    $("#mainMenu").show();
    $("#menu_button").show();

    console.log("show Main");

}


//病毒出现
function fireVirus() {
    console.log('Firing covid...');
    // ADD CODE HERE TO MAKE ROCKETS AND FIRE THEM
    //set speed

    var VirusDivStr = "<div id='r-" + virusIdx + "' class='rocket' > <img src='src/covidstriod.png'/></div>";

    //add to game window
    game_window.append(VirusDivStr);

    var curVirus = $('#r-' + virusIdx);

    // console.log("curVirus: ", curVirus);
    virusIdx++;



    curVirus.css("position", "absolute");
    generate_ramdon_position();

    curVirus.css("top", currVirusY);

    curVirus.css("left", currVirusX);

    const startX = parseInt(curVirus.css("left"));
    const startY = parseInt(curVirus.css("top"));


    var curr_virus_interval = setInterval(function() {
            var speedX = getRandomNumber(0, virus_speed);
            var speedY = Math.sqrt(virus_speed * virus_speed - speedX * speedX);

            // console.log(startX, startY);
            if (touched == false) {
                if (startX == 0) {
                    curVirus.css("left", parseInt(curVirus.css("left")) + speedX);
                    curVirus.css("top", parseInt(curVirus.css("top")) + speedY);
                } else if (startY == 0) {
                    curVirus.css("left", parseInt(curVirus.css("left")) + speedX);
                    curVirus.css("top", parseInt(curVirus.css("top")) + speedY);

                } else if (startX == maxPersonPosX) {
                    curVirus.css("left", parseInt(curVirus.css("left")) - speedX);
                    curVirus.css("top", parseInt(curVirus.css("top")) + speedY);

                } else if (startY == maxPersonPosY) {
                    curVirus.css("left", parseInt(curVirus.css("left")) + speedX);
                    curVirus.css("top", parseInt(curVirus.css("top")) - speedY);

                }
                var virusY = parseInt(curVirus.css("top"));
                var virusX = parseInt(curVirus.css("left"));
                var personX = parseInt(player.css("left"));
                var personY = parseInt(player.css("top"));

                //when touch the virus
                if (Math.abs(virusX - personX) < 50 && Math.abs(virusY - personY) < 50) {
                    virusX = personY + 10000000;
                    virusY = personX + 10000000;
                    curVirus.css("left", virusX);
                    curVirus.css("top", virusY);
                    touched = true;
                    curVirus.remove();
                    whichImgPlayer();

                    console.log("toucheddddd!!!!!!");
                    console.log("virus X: ", virusX, "virus Y: ", virusY);
                }

                //out of boundary
                if (parseInt(curVirus.css("top")) <= 0 ||
                    parseInt(curVirus.css("left")) <= 0 ||
                    parseInt(curVirus.css("top")) >= maxPersonPosY ||
                    parseInt(curVirus.css("left")) >= maxPersonPosX) {
                    // console.log("378, curVirus left", parseInt(curVirus.css("left")),
                    //     "touch: ", touched);
                    curVirus.css("left", -100);
                    curVirus.css("top", -100);
                    curVirus.remove();

                }

            } else {
                //ceshi!!!!
                // curVirus.remove();
                setTimeout(function() {
                        // console.log("remove cur virus");
                        curVirus.remove();
                        // curVirus.css("left", -1);
                        // curVirus.css("top", -1);
                        refreshed = false;
                    },
                    3000
                )
            }
        },
        virus_speed);
    // console.log(currentVirusList);
    virus_interval_status.push(curr_virus_interval);
}
//口罩出现
//物体的速度有问题！！！！
function show_mask() {
    console.log("mask show")

    // maskInstance.hide();

    mask_interval_status = setInterval(function() {
        currMaskX = getRandomNumber(0, maxPersonPosX);
        currMaskY = getRandomNumber(0, maxPersonPosY);

        // console.log("mask loc", currMaskY, currMaskX);
        var MaskDivStr = "<div> <img id='maskInstance' src='src/mask.gif'/></div>";

        //add to game window
        play_game_window.append(MaskDivStr);

        var maskInstance = $("#maskInstance");
        maskInstance.css("position", "absolute");

        maskInstance.css("top", currMaskY);
        maskInstance.css("left", currMaskX);

        // maskInstance.show();
        maskInstance.css("width", 70);
        maskInstance.css("height", 33);

        setTimeout(function() {

            // maskInstance.css("top", 20000);
            // maskInstance.css("left", 10000);
            // maskInstance.hide();
            console.log("remove mask!!!!!!");
            currMaskY = -100;
            currMaskX = -100;
            maskInstance.remove();

        }, maskGone)

    }, maskOccurrence);
}

//疫苗出现
function show_vaccine() {
    var vaccInstance = $("#vaccInstance");
    vaccInstance.hide();
    vacc_interval_status = setInterval(function() {
        currVacX = getRandomNumber(0, maxPersonPosX);
        currVacY = getRandomNumber(0, maxPersonPosY);
        // console.log("Vac loc", currVacX, currVacY);


        vaccInstance.css("top", currVacY);
        vaccInstance.css("left", currVacX);
        vaccInstance.show();


        setTimeout(function() {
            currVacX = -10000;
            currVacY = -10000;
            vaccInstance.hide();
        }, vaccineGone)
    }, vaccineOccurrence);
}

//口罩和人的交互
function interacte_mask_vac() {
    // var player = $('#player');
    var personX = parseInt(player.css("left"));
    var personY = parseInt(player.css("top"));
    console.log("in the interactive part!!!");
    if (Math.abs(currMaskX - personX) < 40 && Math.abs(currMaskY - personY) < 40) {
        masked = true;
        sound.collect.volume = volume;
        sound.collect.play();
        whichImgPlayer();
        currMaskY = -100;
        currMaskX = -100;
        $('#maskInstance').hide();
        console.log("masked", masked);
    }

    //comes with vaccines
    if (Math.abs(currVacX - personX) < 50 && Math.abs(currVacY - personY) < 50) {
        currVacX = -100;
        currVacY = -100;
        sound.collect.volume = volume;
        sound.collect.play();
        $('#vaccInstance').hide();
        vaccined++;
        //update speed
        //level increse
        $('#covid_level').text(vaccined);

        //virus speed * 1.2
        virus_speed = virus_speed + 0.2;
        console.log("virus_speed", virus_speed);


        //danger incred *2
        covid_danger = covid_danger + 2;
        $('#covid_danger_num').text(covid_danger);

        console.log("vaccined", vaccined);
    }
}


//结束
function ShowEndPage() {
    console.log("show end page");


    //hide the current game window
    $("#actual_game").hide();

    //show the end window button

    //ceshi
    $('#mainMenu').show();

    $('#menu_button').hide();

    // console.log("show en")
    $("#endGameWindow").show();

    $('#score_end').text(Current_score);
    console.log("score end: ", Current_score);
    clear_Interval_helper();
    clear_virus_helper();


    //reset
    // Current_score = 0;
    // covid_danger = 0;
    // clearInterval(virus_interval_status);


}

//记录分数
function update_score() {
    score = $("#score_num");
    score_interval_status = setInterval(() => {
        Current_score += 40;
        score.text(Current_score);
        console.log("update score");
    }, 500);
}






//===================================================

// ==============================================
// =========== Utility Functions Here ===========
// ==============================================
function clear_virus_helper() {
    console.log("enter clear virus helper function");
    virus_interval_status.forEach(virus_interval => {
        clearInterval(virus_interval);
    });
    virus_interval_status = [];
    console.log("after clear virus helper()------", virus_interval_status);
}

function clear_Interval_helper() {
    clearInterval(score_interval_status);
    clearInterval(vacc_interval_status);
    clearInterval(mask_interval_status);
    clearInterval(fireVirus_interval);
    clearInterval(direction_interval_status);
    console.log("clear interval helper");


    //clear virus on screen


}
//set broder for selecting
function setbroder(className) {
    console.log("broder", className);
    $(".Easy_button").css({ 'border': '0px solid transparent' });
    $(".Normal_button").css({ 'border': '0px solid transparent' });
    $(".Hard_button").css({ 'border': '0px solid transparent' });

    $("." + className).css({ 'border': '5px solid yellow' });
    difficulty = className;
    console.log("difficulty", className);

    // console.log("set >>>>>>>>")
}

function setDirection() {

    if (touched == false) {
        if (LEFT) {
            // console.log("moving left");
            var newPos = parseInt(player.css("left")) - PERSON_SPEED;
            if (newPos < 0) {
                newPos = 0;
            }
            player.css("left", newPos);
        } else if (RIGHT) {
            // console.log("moving right");

            // ADD CODE HERE TO MOVE SPACESHIP TO THE RIGHT
            var newPos = parseInt(player.css("left")) + PERSON_SPEED;
            if (newPos > maxPersonPosX) {
                newPos = maxPersonPosX;
            }
            player.css("left", newPos);
        }

        if (UP) {
            // console.log("moving up");
            // ADD CODE HERE TO MOVE SPACESHIP UP
            var newPos = parseInt(player.css("top")) - PERSON_SPEED;
            if (newPos < 0) {
                newPos = 0;
            }
            player.css("top", newPos);
        } else if (DOWN) {
            // console.log("moving down");
            var newPos = parseInt(player.css("top")) + PERSON_SPEED;
            if (newPos > maxPersonPosY) {
                newPos = maxPersonPosY;
            }
            player.css("top", newPos);
        }


        interacte_mask_vac();
    }

}

function whichImgPlayer() {
    var playernow = $("#player_face");
    if (touched) {
        if (masked) {

            masked = false;
            touched = false;
            console.log("inside of 175!");
            playernow.attr('src', 'src/player/player.gif');


        } else {

            playernow.attr('src', 'src/player/player_touched.gif');
            console.log("touch and show face 581");
            clear_Interval_helper();
            if (endGame == false) {
                sound.die.volume = volume;
                console.log("volume; ", volume);
                sound.die.play();
                endGame = true;
            }


            console.log("virus_interval_status", virus_interval_status);

            // clear_Interval_helper();
            setTimeout(() => {
                ShowEndPage()
            }, 2000);
        }
        // console.log("old touched 175");

    } else {
        if (masked == false) {
            // console.log("do not has mask now");
            if (LEFT) {
                playernow.attr('src', 'src/player/player_left.gif');

            } else if (RIGHT) {
                playernow.attr('src', 'src/player/player_right.gif');

            } else if (UP) {
                // console.log("up face")
                playernow.attr('src', 'src/player/player_up.gif');


            } else if (DOWN) {
                // console.log("down face")
                playernow.attr('src', 'src/player/player_down.gif');
            }
            //idle
            else {
                // console.log("idle face")
                playernow.attr('src', 'src/player/player.gif');
            }

        } else {
            console.log("has mask now");
            if (LEFT) {
                playernow.attr('src', 'src/player/player_masked_left.gif');

            } else if (RIGHT) {
                playernow.attr('src', 'src/player/player_masked_right.gif');

            } else if (UP) {
                // console.log("up face")
                playernow.attr('src', 'src/player/player_masked_up.gif');


            } else if (DOWN) {
                // console.log("down face")
                playernow.attr('src', 'src/player/player_masked_down.gif');



            }
            //idle
            else {
                // console.log("idle face")
                playernow.attr('src', 'src/player/player_masked.gif');


            }

        }
    }
}

function set_spawn_speed_virus() {

    if (difficulty == 'Easy_button') {
        Spawn_rate = 1000;
        virus_speed = 1; //px
        covid_danger = 10;


    } else if (difficulty == 'Normal_button') {
        Spawn_rate = 800;
        virus_speed = 3; //px
        covid_danger = 20;

    } else if (difficulty == 'Hard_button') {
        Spawn_rate = 600;
        virus_speed = 5; //px
        covid_danger = 30;
    }

    $('#covid_danger_num').text(covid_danger);
    // console.log("danger", covid_danger);
    console.log("Line 661-------mode choice", covid_danger);

}

function generate_ramdon_position() {
    //     let maxPersonPosX = 1218;
    // let maxPersonPosY = 658;

    currVirusX = getRandomNumber(0, maxPersonPosX);
    currVirusY = getRandomNumber(0, maxPersonPosY);

    decider = Math.random();
    if (decider > 0.8) {
        currVirusY = 0;
    } else if (decider > 0.6) {
        currVirusY = maxPersonPosY;

    } else if (decider > 0.3) {
        currVirusX = 0;
    } else {
        currVirusX = maxPersonPosX;
    }

}

function showSetting() {
    var showsetting = $('.setting')
    showsetting.toggle();
}

function showTutorial() {
    if (timesClicked == 0) {
        var showtutorial = $('.Tutorial')
        showtutorial.show();
        $('#actual_game').hide();
        console.log("show tutorial", timesClicked);

    } else {
        ShowGame();
        console.log("-------play game here? Again? Line 648---------");

        $('#endGameWindow').hide();
        // $('#mainMenu').hide();
        $('#actual_game').show();

        console.log("do not have tutorial");
    }
    timesClicked++;
    console.log("times Clicked", timesClicked);

    $('#mainMenu').hide();
}







// Are two elements currently colliding?
function isColliding(o1, o2) {
    return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange) {
    return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange) {
    const o1D = {
        'left': o1.offset().left + o1_xChange,
        'right': o1.offset().left + o1.width() + o1_xChange,
        'top': o1.offset().top + o1_yChange,
        'bottom': o1.offset().top + o1.height() + o1_yChange
    };
    const o2D = {
        'left': o2.offset().left,
        'right': o2.offset().left + o2.width(),
        'top': o2.offset().top,
        'bottom': o2.offset().top + o2.height()
    };
    // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
    if (o1D.left < o2D.right &&
        o1D.right > o2D.left &&
        o1D.top < o2D.bottom &&
        o1D.bottom > o2D.top) {
        // collision detected!
        return true;
    }
    return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max) {
    return (Math.random() * (max - min)) + min;
}