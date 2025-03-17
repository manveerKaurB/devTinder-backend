# DevTinder APIs

### authRouter
- POST /signup
- POST /login
- POST /logout

### profileRouter
- GET profile/view
- PATCH profile/edit
- PATCH profile/password

### connectionRequestRouter
- POST /request/send/interested/:usedId
- POST /request/send/ignored/:usedId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

### userRouter
- GET /connections
- GET /user/requests
- GET /user/feed - gets your profi;es of other users on platform

status: ignore, interested, accepted, rejected



