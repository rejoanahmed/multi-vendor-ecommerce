## Populate MongoDB

```
1. mongorestore mock_data/
2. pnpm dev
3. stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## update mock_data

```
mongodump -o mock_data
```
