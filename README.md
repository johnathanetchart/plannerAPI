# Workout Planner API

## Description

This API allows a user to keep track of their workout. It tracks Users, Sessions, Phases, Mesocycles, and Microcycles. Sets are tracked including load, reps, and their corresponding user and session ids.

It utilizes a MYSQL database.

## Endpoints

### /users

GET
/users:username
Returns user object attributed to username in the form:
{
id,
name,
weight
}

GET
/users
returns all users in the form:
[
{
id,
name,
weight
},
...
]

POST
/users/:username
Creates a new user.
Body must be in the form:
{
name,
weight, // will default to 0 if not supplied
}
Returns new user object in the form:
{
id,
name,
weight
}

PUT
/users
Updates the user with supplied updatedUser object in the form of:
{
id,
name,
weight
}

### /sessions

GET
/sessions/:username
Returns all sessions attributed to username.
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

returns in the form:
//TODO

### /phases

GET
/phases/:username || /phases
Returns all phases associated with username or, if no username is present in req.params, returns a list of all phases.
optional query parameters are:
{
limit, //default value 100
offset //default value 0
}

returns in the form:
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
Creates a new phase for username.
Body parameter with newPhase in the form:
{
newPhase: {
date, //OPTIONAL - defaults to current time
name, //REQUIRED
}
}

returns in the form:
{
id, //phase's id
date,
user_id,
name,
}

PUT
/phases
Updates the phases table row in the database for the supplied phase with req.body in the form:
{
updatedPhase: {
id,
date,
user_id,
name,
}
}
returns updated phase on success in the form:
{
id,
date,
user_id,
name,
}

### /mesocycles

GET
/mesocycles/:username/:mesocycleId
Returns the mesocycle for a designated mesocycleId.
returns mesocycle:
{
id,
date,
phase_id,
user_id,
}

GET
/mesocycles/:username || /mesocycles
Returns a list of mesocycles for the designated user or, if no username is present in req.params, returns a list of all mesocycles.
Optional parameters are:
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
newMesocycle: {
date, //optional: defaults to current time
phaseId, //REQUIRED
userId, //OPTIONAL - but reduces database queries if included
}
}

Returns the created mesocycle:
{
id,
date,
phase_id,
user_id,
}

PUT
/mesocycles
Updates the mesocycle table row in the database for the supplied mesocycle id with req.body in the form:
{
updatedMesocycle: {
id,
date,
phase_id,
user_id,
}
}

Returns updated mesocycle in form:
{
id,
date,
phase_id,
user_id,
}

### /microcycles

GET
/microcycles/:username/:mesocycleId
Returns the specific microcycle information for a designated microcycleId
returns microcycle:
{
id,
date,
deload,
mesocycle_id,
phase_id,
user_id,
}

GET
/microcycles/:username
Returns a list of microcycles for the designated user.
optional parameters are:
{
limit, //default value 100
offset //default value 0
}

Returns a list of the user's microcycles:
[
{
id,
date,
deload,
mesocycle_id,
phase_id,
user_id,
},
...
]

POST
/microcycles/:username
Creates a new microcycle entry for the user.
Parameters include:
{
newMicrocycle: {
date, //optional: defaults to current time
deload, //REQUIRED
microcycleId, //REQUIRED
phaseId, //REQUIRED
userId, //optional but reduces database queries
}
}

Returns the created microcycle:
{
id,
date,
deload,
mesocycle_id,
phase_id,
user_id,
}

PUT
/microcycles/:username
Updates the microcycle table row in the database for the supplied microcycle with req.body in the form:
{
updatedMicrocycle: {
id,
date,
deload,
mesocycleId,
phaseId,
userId
}
}
if any of the properties of updatedMicrocycle are not present in body, it will return "Incomplete microcycle object received."
returns updated microcycle on success:
{
id,
date,
deload,
mesocycle_id,
phase_id,
user_id,
}

### /sessions

//TODO
