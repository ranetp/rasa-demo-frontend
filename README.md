# Frontend demo for Rasa
Example Rasa backend can be found in https://github.com/ranetp/rasa_test

index.js includes two variables, which need to be configured manually in case necessary:

```
RASA_API_URL = 'http://localhost:5005/webhooks/rest/webhook';
// Generate random sender id
SENDER_ID = Math.random().toString(36).substring(7); 
```
