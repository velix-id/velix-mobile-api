export const invoke = (event, context, cb) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'requestAuth not Implimented',
      input: event,
    }),
  };

  cb(null, response);
}
