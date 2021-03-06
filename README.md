# Dry Seasons

![Welcome Screenshot](/public/welcome-ss.png)

An events based platform created in 6 days as a final project in [Spiced Academy](https://www.spiced-academy.com/) bootcamp.
Dry Seasons was created with a goal to show users possibilities of having fun without alcohol and give them a chance to find other people in the same situation. More on Why? - the story behind.

## Table of contents

-   [What I used?](#what-i-used)
-   [What I have?](#what-i-have)
-   [Showroom](#showroom)
-   [What I want?](#what-i-want)
-   [Why? - the story behind](#why)

## What I used? <a name="what-i-used"></a>

HTML, CSS, Node.js / Express, Bundle.js, PostgreSQL, React, React Hooks, Redux;

Google Maps Javascript API, Google Places API, Moment.js, AWS - S3, react-places-autocomplete, react-google-maps

Csurf, Cookie Session, Bcrypt

## What I have? <a name="what-i-have"></a>

All the features:

-   Log in / Registration

*   Logged in users:

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

## Search Events

[![Search Events](https://i.gyazo.com/dd70d0735e0583a0387747e7432907e0.gif)](https://gyazo.com/dd70d0735e0583a0387747e7432907e0)

## Edit your event

[![Edit your event](https://i.gyazo.com/6f0ac49c4c9a781edc89752267a73caa.gif)](https://gyazo.com/6f0ac49c4c9a781edc89752267a73caa)

## Event Page - Attend

[![Event Page - Attend](https://i.gyazo.com/14e1c930f46a062a7d019cc644355ca6.gif)](https://gyazo.com/14e1c930f46a062a7d019cc644355ca6)

## Most popular events

[![Most popular events](https://i.gyazo.com/1d5e543e5338895a5bb2a4ee6b2c535b.gif)](https://gyazo.com/1d5e543e5338895a5bb2a4ee6b2c535b)

## Map of events

[![Map of events](https://i.gyazo.com/0b98c46b0ebfd35a478305e83c1bc4f4.gif)](https://gyazo.com/0b98c46b0ebfd35a478305e83c1bc4f4)

## <a name="what-i-want"></a>What I want?

This project was supposed to be finished and presented in 6 days so I ignored some obvious functionalities not to lose time, especially the ones I have done before on other projects and I am sure I can easily do again.

Next functionalities I want to add:

-   Develop profile - delete profile (automatically all hosted events), add interests sections
-   Develop event page - add discussion board, delete event by host - all attendees get a message that the event has been deleted
-   Develop users' connections - add Message host, show all messages with other users, block a user

## <a name="why"></a>Why? - the story behind

"From Dryanuary through to Sober October, this is the place to explore the world of sober possibilities. Attend events to meet other sober people, try something new, or find inspiration what to do today (and maybe go get wasted tomorrow). We don't judge, we inspire"

When I started the web development bootcamp, I decided to have a break from alcohol so I can help my brain cope with such a large influx of information every day and not to waste time on brain-wrecking hangovers. Obviously, I haven't become smarter, just slightly more stressed but I did have a bit more time and for most of it I had to still be in a bar, listening to drunk friends and wondering what other alcohol free overpriced drink the bar might have and when is it ok to go home. There is just so much of Jever Fun that a person can take.

When living in big cities, especially "party" places like Berlin, it is sometimes hard to socialise in any other manner than going to a bar, even up to a point where NOT binge drinking is seen as a weakness and a sign of the ultimate bore. It makes us more comfortable with people, it makes us want to talk to people, sometimes even for 10h (who would do that sober), it makes us actually like people or at least be able to stand them. It makes us feel great about ourselves and how much fun we are having. So we drink again. Cause all our friends are and cause that's what you do when you meet. Cause the work hours are done. Cause it's Friday. Cause it's any day of the week, does it really matter?

When we started doing our final project, the teacher told us to think about something that we personally would like to use - and this was the first thing that came out. I figured there must be a need for it and there must be more people that would gain benefit from it, especially with a recent trend of focusing on a healthy lifestyle. On the other hand, this is not a platform to advise people against drinking [(that's these guys)](https://www.aa.org/), but just to give different options of having fun. Something that I would actually like to see.
