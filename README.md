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
limit, //default value 100
offset, //default value 0
}

POST
/sessions/:username
NOT IMPLEMENTED
will create a new session.
must include in body:
{
date, //default to current time if not supplied
name,
phase_id,
mesocycle_id,
microcycle_id,
user_id, //optional, but queries one less //// TODO MAKE OPTIONAL
}

    returns in the form of:
      //TODO

### /phases

GET
/phases/:username
returns phases of username
optional parameters are:
{
limit, //default value 100
offset //default value 0
}

    returns in the form of:
      [
          {
              id,
              date,
              user_id,
              name
          },
          ...
      ]

POST
/phases/:username
creates a new phase for username
optional body parameters are:
{
date, //defaults to current time
}

    returns in the form of:
      {
        id, //phase's id
        date,
        user_id,
        name
      }

PUT
/phases/:id
updates the phase row in the database for the supplied phase id with req.body in the form:
{
newName, //OPTIONAL - new name
newDate //OPTIONAL - new date //will count as success with no change if improper format
}
if newName or newDate are not present in body, it will return "No changed requested."
returns updated phase on success
{
id,
name,
date
}

### /mesocycles

GET
/mesocycles/:username/:mesocycleId
Retrieves the specific mesocycle information for a designated mesocycleId
returns mesocycle:
{
id,
date,
phase_id,
user_id,
}

GET
/mesocycles/:username
Retrieves a list of mesocycles for the designated user.
optional parameters are:
{
limit, //default value 100
offset //default value 0
}

Returns a list of the user's mesocycles:
[
{
id,
date,
phase_id,
user_id,
},
...
]

POST
/mesocycles/:username
Creates a new mesocycle entry for the user.
Parameters include:
{
date, //optional: defaults to current time
phaseId, //REQUIRED
userId, //optional but reduces database queries
}

Returns the created mesocycle:
{
id,
date,
phase_id,
user_id,
}

PUT
/mesocycles/:username/:mesocycleId
Updates the mesocycle table row in the database for the supplied mesocycle id with req.body in the form:
{
newDate, //OPTIONAL - new date //will count as success with no change if improper format
newPhaseId,
newUserId,
}
if newDate, newPhaseId, and newUserId are not present in body, it will return "No changed requested."
returns updated mesocycle on success:
{
id,
date,
phase_id,
user_id,
}

### /microcycles

//TODO

### /sessions

//TODO
