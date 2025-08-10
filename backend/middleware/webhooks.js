// middleware/webhooks.js
exports.verifyWebhook = (secret) => (req, res, next) => {
  const signature = req.headers['x-hub-signature'];
  const hmac = crypto.createHmac('sha1', secret);
  const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
  
  if (signature !== `sha1=${digest}`) {
    return next(new ErrorResponse('Invalid webhook signature', 401));
  }
  next();
};