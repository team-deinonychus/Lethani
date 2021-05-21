# Software Requirements

## Vision

Our vision is to create a fun rpg where you can move around slay monsters and see/chat with other players that are doing the same.

## Scope (In/Out)

### In

- This app will allow users to create secure accounts and sign in.

- This app will allow users to view an About Us page that tells them about the creators.

- This app will allow users to communicate with each other in real time.

- This app will allow users to play a simple RPG and perform actions such as attack, move and die.

- This app till allow users to see other users that are also playing the game.

- This app will allow users to view their highscore adn compare it to other users.

### Out

- This app will not allow players to fight each other

- This app will not become an IOS or Android app.

- This app won't graphics within the gameplay.

- This app will not allow unregistered users to play.

## MVP

- Users can create and manage accounts.

- Users can edit their data (change class upload profile pic)

- Users can play the game and perform basic actions such as.
    - move.
    - attack.
    - die.
    - chat with other players.
    - view other players.
    
- Users can delete their accounts.

- movent and attack have a base cool down.

## Stretch

- Ability to collect items and use

- Add attack speed

- Add damage types

- Add animations

- Add a shop.

## Functional Requirements

- Visitor can visit home, signup, aboutUs. 

- Users can  view and modify their profile, login, message other users, and view high scores and delete their profile.

### Usability

We want our webapp to have a self-explanatory user-friendly experience. We should be able to send the link to our home page to an uninformed user and without any guidance have them:

- Know what the site is about just by viewing home page

- Navigate to the sign-up page and create an account

- Play the game

- Chat with other players

- Visit the About Us page

- Have fun!

This will confirm that our site is fully functional and self-explanatory.

### Security

We want to make sure that our site is secure as possible to protect both our users and site integrity. We will ensure site integrity by running code injection tests in various fields to confirm our site can't be altered by outside sources. We will use Springs security dependency to encode hashed and salted passwords.