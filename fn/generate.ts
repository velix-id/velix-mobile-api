export const invoke = (event, context, cb) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'generate not implimented',
      input: event,
    }),
  };

  cb(null, response);
}
