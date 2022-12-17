#### POST a new user

> POST /api/users

```json
{
  "name": "abayomi",
  "slogan": "lovely",
  "party": "Republican"
}
```

---

#### GET all users

> GET /api/users

```json
[
  {
    "name": "abayomi",
    "votes": 0,
    "slogan": "lovely",
    "party": "Republican",
    "role": "user",
    "_id": "639dd0398b685d8649a2490b",
    "createdAt": "2022-12-17T14:20:41.743Z",
    "updatedAt": "2022-12-17T14:20:41.743Z",
    "__v": 0
  }
]
```

---

#### UPDATE BY VOTING A USER

> PUT /api/users/:id

```json
{
  "votes": 1
}
```
