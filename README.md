# Dry Seasons

![Welcome Screenshot](/public/welcome-ss.png)

An events based platform created in 6 days as a final project in [Spiced Academy](https://www.spiced-academy.com/) bootcamp.
Dry Seasons was created with a goal to show users possibilities of having fun without alcohol and give them a chance to find other people in the same situation. More on Why? - the story behind.

## Table of contents

-   [What I used?](#what-i-used)
-   [What I have?](#what-i-have)
-   [Showroom](#showroom)
-   [What I want?](#what-i-want)
-   [Who to thank?](#credits)
-   [Why? - the story behind](#why)

## What I used? <a name="what-i-used"></a>

HTML, CSS, Node.js / Express, Bundle.js, PostgreSQL, React, React Hooks, Redux;

Google Maps Javascript API, Google Places API, Moment.js, AWS - S3, react-places-autocomplete, react-google-maps

## What I have? <a name="what-i-have"></a>

All the features:

-   Log in / Registration
-   Logged in users:
    -   Create an event - name, date (calendar), time, address (autocomplete), image upload (Multer, AWS - S3), description, category
    -   Edit their own event - all previous data displayed
    -   See other users' events
    -   Attend / Unattend other users' events
    -   See other attendees
    -   Upload avatar
    -   See a list of events they are attending and events they are hosting
    -   Search events:
        -   list of their events
        -   list of events coming up soon
        -   list of most popular events by number of attendees
        -   search by category or show all events
    -   Show by category, for each category:
        -   Show today
        -   Show tomorrow
        -   Show this week
        -   Show next week
    -   Show map of all events
        -   Google map with a marker for each event and info window that opens on click on the marker, with brief description and a link to the event's page

*   Not logged in users:

    -   See other users' events and attendees
    -   Search events:
        -   list of their events
        -   list of events coming up soon
        -   list of most popular events by number of attendees
        -   search by category or show all events
    -   Show by category, for each category:
        -   Show today
        -   Show tomorrow
        -   Show this week
        -   Show next week
    -   Show map of all events
        -   Google map with a marker for each event and info window that opens on click on the marker, with brief description and a link to the event's page

*   Events in the past don't get displayed
*   Added dummy users and dummy events into the database for display purposes

## <a name="showroom"></a>Showroom

## <a name="what-i-want"></a>What I want?

This project was supposed to be finished and presented in 6 days so I avoided some obvious functionalities not to lose time, especially the ones I have done before on other projects and I am sure I can easily do them again.
Functionalities I want to add:

-   Develop profile - delete profile (automatically all hosted events), add interests sections
-   Develop event page - add discussion board, delete event by host - all attendees get a message that the event has been deleted
-   Develop users' connections - add Message host, show all messages with other users, block a user

## <a name="why"></a>Why? - the story behind
