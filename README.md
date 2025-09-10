# Cinema Tickets

See [task description](./TASK.md) to view the problem statement.

## 📋 Testing Instructions 📋

There was no requirement to provide any user facing application, therefore this application is built to satisfy unit tests.

These can be run by first cloning this repository, then running:

```
npm i
npm test
```

## 🤔 Assumptions 🤔

I have assumed that the number of infant tickets must not exceed the number of adult tickets, due to the statement 'They will be sitting on an Adult's lap'. However, I am assuming that infant tickets **do not** count towards the maximum number of seats in the booking, since they do not take up an additional physical seat. I've made this assumption as this is something that I would challenge in the requirements in a real-world project, because I believe the intention of this code is to manage the number of _seats_ (and the payment for said seats), rather than managing tickets specifically.
