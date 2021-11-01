// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
require('dotenv').config()
const twilio =  require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_ACCOUNT_TOKEN;   // Your Auth Token from www.twilio.com/console
const messageSid = process.env.TWILIO_MSG_SID;  
const phoneNumber = process.env.TWILIO_VERIFIED_ACCOUNT_PHONE; // +15558675309

const verifyAuth = async ( authHeader ) => {
  try {
    const parts = authHeader.split( " " );
    if ( parts.length !== 2 || parts[0] !== "Bearer" ) {
      // No access token was passed
      console.log('no key');
      return null;
    }
    const accessToken = parts[1];
    if (accessToken !== process.env.API_SECRET) {
      // invalid key
      console.log('invalid key');

      return false;
    }

    if (accessToken === process.env.API_SECRET) {
      // valid key
      console.log('valid key');
      return true;
    }

    // not sure ??
    console.log('unknown case?');

    return null;
  } catch ( err ) {
    console.log( err );
    return null;
  }
};

const sendMessage = async () => {
    console.log('sendMessage');
    const twilioclient = twilio(accountSid, authToken, {
    logLevel: 'debug'
  });
  
  try {
    const message = await twilioclient.messages 
      .create({   
        body: 'this is a test!',  
        messagingServiceSid: messageSid,      
        to: phoneNumber, // in trial mode this can only be your own verified number
      });
    return ( message.status==='accepted' || message.status==='sent');
  } catch (error) {
    console.log({error});
    return false;
  }
}

export default async function handler(req, res) {
  if (await verifyAuth(req.headers.authorization)){
    const msgSuccess = await sendMessage();
    if (msgSuccess) {
      res.status(200).json({ message: 'OK!' })
    } else {
      res.status(200).json({ message: 'Request OK, message failed!' })
    }
  } else {
    res.status(401).json({ message: 'Unauthorized.' })
  }
}
