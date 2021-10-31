// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
require('dotenv').config()

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

export default async function handler(req, res) {
  if (await verifyAuth(req.headers.authorization)){
    res.status(200).json({ message: 'OK!' })
  } else {
    res.status(401).json({ message: 'Unauthorized.' })
  }
}
