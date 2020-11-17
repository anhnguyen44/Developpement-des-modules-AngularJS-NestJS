"use strict";
exports.__esModule = true;
var AWS = require("aws-sdk");
AWS.config.update({
    region: 'eu-central-1'
});
var args = process.argv.slice(2);
if (args.length < 1) {
    console.error("\n=============================\nPlease Provide a Build Number\n=============================");
    process.exit(1);
}
console.log('Deployment Started');
var INSTANCE_ID = "i-0ed7d2d2191c0c2d5";
var TRAVIS_BRANCH = args[0];
var TRAVIS_BUILD_NUMBER = args[1];
var ssm = new AWS.SSM();
var checkStatus = function (commandId) {
    var iterations = 0;
    var getDetails = function () {
        console.log('iteration:', iterations);
        ssm.listCommandInvocations({
            CommandId: commandId,
            Details: true
        }).promise().then(function (resp) {
            var command = resp.CommandInvocations[0];
            var status = command.Status;
            if (status === 'Pending' || status === 'InProgress') {
                iterations++;
                getDetails();
            }
            else if (status === "Success") {
                console.log('COMMAND RESULT:');
                console.log(command);
                console.log('Command was successful.');
            }
            else {
                console.error('COMMAND RESULT:');
                console.error(command);
                console.error("Result '" + status + "' was either unhandled or is an error.");
                process.exit(1);
            }
        })["catch"](function (errorResp) {
            console.error('An error occurrd with the promise to listCommandInvocations.');
            console.error(errorResp);
            process.exit(1);
        });
    };
    getDetails();
};
var deployBackend = function () {
    ssm.sendCommand({
        InstanceIds: [INSTANCE_ID],
        DocumentName: "AWS-RunShellScript",
        Parameters: {
            commands: ["export TRAVIS_BUILD_NUMBER=" + TRAVIS_BUILD_NUMBER + " && wget --no-cache -O docker-compose.yml https://raw.githubusercontent.com/tsmean/tsmean/\"" + TRAVIS_BRANCH + "\"/docker/docker-compose.yml && docker stack deploy --compose-file docker-compose.yml tsmean && rm docker-compose.yml"]
        }
    }).promise().then(function (resp) {
        var commandId = resp.Command.CommandId;
        checkStatus(commandId);
        console.log('Successfully Deployed Backend');
    })["catch"](function (errorResp) {
        console.error(errorResp);
        console.error('Error in deploying backend');
        process.exit(1);
    });
};
deployBackend();
