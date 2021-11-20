## Sprint 3 Planning Meeting: 

The Sprint 3 planning meeting is being held on November 8, 2021 on Discord. The purpose of this meeting is to clearly indicate the sprint goal, identify all of the stories that will be handled this sprint, related tasks to those stories and how these tasks will be distributed amongst the six team members. All of the team members attended this meeting. The Project Demo to the TA will be done on November 23rd, 2021. We took care of any document related confusions and then we selected the user stories that we want to handle this sprint, broke it into subtasks and then distributed those tasks.

---
## Sprint goal:
 - Finish user stories PLSGIB-6, PLSGIB-9, PLSGIB-10, PLSGIB-18, PLSGIB-20, PLSGIB-65

---
## Tasks Breakdown:

Story: __PLSGIB-6__

Tasks:
- Create the UI for sorting on the Services page.
- Query to backend via axios to gather and sort listings.
- Create the backend endpoints for gathering and sorting listings.

Stories: __PLSGIB-9__

Tasks:
- Create the UI for the book appointments page.
- Query to backend via axios to check if listings have open slots and then book it.
- Create the backend endpoints for checking for open slots and doing the booking process.

Story: __PLSGIB-10__

Tasks:
- Create the UI for the previous purchases page.
- Query to backend via axios to find the previous purchases of the user.
- Create the backend endpoints for finding the previous purchases (listings and store) of the user. 

Story: __PLSGIB-18__

Tasks:
- Add on to the UI for the previous purchases page (ratings feature).
- Send rating of listing/store product to the backend via axios.
- Create the backend endpoints for updating the ratings of a listing/store product. 

Story: __PLSGIB-20__

Tasks:
- Create the UI for the checkout page.
- Query to backend via axios to save bookings or remove bookings upon failure.
- Create the backend endpoints for saving bookings. 

Story: __PLSGIB-65__

Tasks:
- Create a logout button on the 3 main directory pages.
- Navigate back to the login page and pass no data through.

## Spikes:
When building many frontend pages, we had API calls outside of the return function. This led to the request being sent to the same function. Thus, constantly querying the backend nonstop and leading to Warnings on the pages. To prevent this, we decided to use `useEffect()` and a boolean variable to prevent the one-time requests from being sent more than one time.  

---
## Team Capacity:
| Name | Estimated hours of work per day |
| --- | --- |
| Rohan Dey | 3 |
| Ali Orozgani | 3 |
| Mohannad Moustafa Shehata | 3 |
| Vinesh Benny | 3 |
| Tarushi Thapliyal | 3 |
| Leila Cheraghi Seifabad | 3 |

With a team of 6, our team is able to dedicate 180 hours to this sprint to complete 35 points. 

---

## Participants: 
Rohan Dey, Ali Orozgani, Mohannad Moustafa Shehata, Vinesh Benny, Tarushi Thapliyal, Leila Cheraghi Seifabad