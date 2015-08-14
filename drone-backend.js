var Cylon = require('cylon');
var bot;
var utils = require('./utils/droneUtils.js');

// Initialise the robot
Cylon.robot()
    .connection("ardrone", {
        adaptor: 'ardrone',
        port: '192.168.1.1'
    })
    .device("drone", {
        driver: "ardrone",
        connection: "ardrone"
    })
    .device("nav", {
        driver: "ardrone-nav",
    connection: "ardrone"
    })
    .on("ready", fly);
    
// Fly the bot
function fly(robot) {
    bot = robot;
    bot.drone.config('general:navdata_demo', 'TRUE');
    bot.nav.on("navdata", function(data) {
        //console.log(data);
    });

    bot.nav.on("altitudeChange", function(data) {
        console.log("Altitude:", data);
        if (data > 1.5) {
            bot.drone.land();
        }
    });

    bot.nav.on("batteryChange", function(data) {
        console.log("Battery level:", data);
    });
    bot.drone.getPngStream()
        .on("data", utils.sendFrame);
    utils.instructionListener.on('move', moveDrone);
    bot.drone.disableEmergency();
    bot.drone.ftrim();
    bot.drone.takeoff();
    after(5*1000, function() {
        bot.drone.left(0.2)
    });
    after(7*1000, function() {
        bot.drone.left(0)
    });
    after(10*1000, function() {
        bot.drone.land();
    });
    after(15*1000, function() {
        bot.drone.stop();
    });

}
function moveDrone(move) {
    if (move.left) {
        console.log("Moving left");
        bot.drone.left(0.2);
        bot.drone.forward(0);
        after(0.5*1000, function() {
            bot.drone.left(0);
            bot.drone.forward(0.05);
        });
    }

    if (move.right) {
        console.log("Moving right");
        bot.drone.right(0.2);
        bot.drone.forward(0);
        after(0.5*1000, function() {
            bot.drone.right(0);
            bot.drone.forward(0.05);
        });
    }
}
Cylon.start();
