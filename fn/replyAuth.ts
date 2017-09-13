export const invoke = (event, context, cb) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'replyAuth not implimented',
      input: event,
    }),
  };

  cb(null, response);
}
