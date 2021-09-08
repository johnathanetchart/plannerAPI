# Workout Planner API

## Description

This API allows a user to keep track of their workout. It tracks Users, Sessions, Phases, Mesocycles, and Microcycles. Sets are tracked including load, reps, and their corresponding user and session ids.

It utilizes a MYSQL database.

## Endpoints

### /users

GET
/users:username
returns user in the form:
{
id,
name,
weight
}

POST
/users:username
NOT IMPLEMENTED
will create a new user
send in body:
{
"name": String
"weight": Number // will default to 0 if not supplied
}
returns new user object including new id
{
id,
name,
weight
}

### /sessions

GET
/sessions/:username
returns sessions of username
optional query parameters are:
{
'limit', //default value 100
'offset' //default value 0
}

POST
/sessions/:username
NOT IMPLEMENTED
will create a new session.
must include in body:
{
`date` DATETIME NOT NULL, //default to current time if not supplied
`name` varchar(255) NOT NULL,
`phase_id` int NOT NULL,
`mesocycle_id` int NOT NULL,
`microcycle_id` int NOT NULL,
`user_id` int NOT NULL, //will probably use username instead
}

    returns in the form of:
      //TODO

### /phases

GET
/phases/:username
returns phases of username
optional parameters are:
{
'limit', //default value 100
'offset' //default value 0
}

    returns in the form of:
      [
          {
              "id",
              "date",
              "user_id",
              "name"
          },
          ...
      ]

POST
/phases/:username
creates a new phase for username
optional body parameters are:
{
'date', //defaults to current time
}

    returns in the form of:
      {
        "id", //phase's id
        "date",
        "user_id",
        "name"
      }

PUT
/phases/:id
updates the phase row in the database for the supplied phase id with req.body in the form of
{
newName, //OPTIONAL - new name
newDate //OPTIONAL - new date
}
returns updated phase on success

### /mesocycles

//TODO

### /microcycles

//TODO

### /sessions

//TODO
