# API documentation

Right now this is a rough outline of the planned routes for our application's API.

## Auth Routes

- `POST /signup`: Creates a new user when they sign up.
- `GET /login`: Displays a login page
- `GET /signup`: Displays a signup page
- `POST /login`: (Implemented by Spring Security) Logs in a user and gives the user agent the authentication token

## Main routes

- `GET /`: Displays the homepage/splash page
- `GET /about`: Displays an about page that tells the visitor about the website and its creators.

## Users

- `GET /profile`: Requires authentication. Provides a view that allows users to edit their own profile, edit and add
  their posts.
- `DELETE /profile/`: Requires authentication. Allows user remove themselves.
- `PUT /profile`: Requires authentication. Allows a user to edit the details of their own profile, including changing
  their bio, information, linked accounts. Redirects to `PUT /profile/image` Requires authentication. Allows user to upload a profile picture to their account

## Messaging

- `GET /messages`: Requires authentication. "Inbox view". Displays a list of message threads that the currently logged
  in user is a part of. Sorts the threads by how recent a message was posted and whether there are unread messages.