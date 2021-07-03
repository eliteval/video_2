const path = require('path');

// import .env variables
require('dotenv-safe')
  .load({
  path: path.join(__dirname, '../../.env')//,
  //sample: path.join(__dirname, '../../.env.example'),
});


module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  socketPort: process.env.SOCKETIO_PORT,
  baseWebUrl: process.env.BASE_WEB_URL,
  baseUrl: process.env.BASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  mongo: {
    uri: process.env.MONGO_URI,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  emailConfig: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
  smsConfig: {
    Sid: process.env.TWILIO_SID,
    authToken: process.env.TWILIO_TOKEN,
    sender: process.env.TWILIO_SENDER
  },
  paymentConfig: {
    notifyUrl: process.env.NOTIFY_URL,
    clientUrl: process.env.CLIENT_URL,
    merchantPosId: process.env.MERCHANT_POS_ID,
    description: process.env.DESCRIPTION,
    secondKey: process.env.SECOND_KEY,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  },
  culqiConfing: {
    public_key: process.env.CULQI_API_PUBLIC_KEY,
    private_key: process.env.CULQI_API_PRIVATE_KEY
  },
  awsConfig:{
    aws_api_id : process.env.AWS_API_ID,
    aws_api_secret : process.env.AWS_API_SECRET,
    bucket : process.env.AWS_BUCKET_PUBLIC,
    region : process.env.AWS_REGION
  }
};
