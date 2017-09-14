# Velix ID Mobile API
```
  GET       - https://3phw6ramn5.execute-api.us-east-1.amazonaws.com/dev/generate

  GET|PUT   - https://3phw6ramn5.execute-api.us-east-1.amazonaws.com/dev/v/{velixid}/auths
  
  GET|POST  - https://3phw6ramn5.execute-api.us-east-1.amazonaws.com/dev/auth/{authid}
```

Platfrom: ```AWS Lambda with NodeJS```

Endpoint : ```https://3phw6ramn5.execute-api.us-east-1.amazonaws.com/dev```

## API Methods

### Generate New Velix ID

```PUT - /generate```

### Get All Authorizations for a VelixID

```GET - /v/{velixid}/auths```

**Query Parameters:**
- status - { new | canceled | rejected | accepted }

### Create new Authorization for a Velix ID

```PUT - /v/{velixid}/auths```

### Get Authorization Status / Detail

```GET - /auth/{authid}```

### Respond to an existing Authorization

```POST - /auth/{authid}```
