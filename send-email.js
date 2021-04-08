var aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});

exports.handler = async (event) => {
    console.log("Event: " + JSON.stringify(event));
    var params = {
      Destination: {
        ToAddresses: [
          event.Records[0].Sns.Message.split(' ')[1]
        ]
      },
      Message: { 
        Body: { 
          Html: {
          Charset: "UTF-8",
          Data: event.Records[0].Sns.Message+"<br><br><br> <a href="+event.Records[0].Sns.UnsubscribeUrl+">Unsubscribe</a></br></br></br>"
          },
         },
         Subject: {
          Charset: 'UTF-8',
          Data: 'Books Notification'
         }
        },
      Source: 'noreply@dev.booksbuffet.me'
    };

    var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    
    await sendPromise.then(
      function(data) {
        console.log("data: ");
        console.log(data.MessageId);
    }).catch(
        function(err) {
        console.log("Error: ");
        console.error(err, err.stack);
    });
};