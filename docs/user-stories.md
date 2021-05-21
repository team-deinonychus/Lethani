# User Stories

## User Story: Account

As a user I’d like to be able to securely create and manage a personal account so that my experience is personalized to my interests.

### Feature Tasks

- User Model
- Password encoding
- Login
- User Repo/Database
- Manage profile

### Testing

- Ensure user can be created and stored in a database
- Ensure that password is encoded and decoded appropriately
- Ensure that their cannot be duplicate usernames
- Ensure that profile can be updated

## User Story: Creator

As a user I’d like to have a streamlined experience for using the site as a creator so that I can show off my work.

### Feature Tasks

- Personal profile is discoverable, pleasant to look at
- Post examples of my work
- View job postings

### Testing

- Ensure that visitors and creators can discover profile by tag or name search
- Ensure that my profile has places for creators to display their work
- Ensure that creators can search for job postings based on tags

## User Story: Visitor

As a user I’d like to have a streamlined experience for viewing the content and profiles of creators so that I can see cool content and potentially commission a work.

### Feature Tasks

- User can follow creators
- User can see feed showing followed creator posts
- Comments
- Personal profile is only viewable from job posts

### Testing

- Ensure that creators posts will display in followers feed
- Ensure that visitors profiles don't display in discover searches
- Ensure that visitors create a less complex profile and don't see the option to post while viewing their feed.

## User Story: Communication

As a user I’d like to be able to communicate with other users on the site.

### Feature Tasks

- Posting page for jobs
- Comments
- Websocket communication?

### Testing

- Ensure that visitors can send and receive a message to/from a creator
- Ensure that comments will display to visitors and creators

## User Story: About Us

As a user I’d like to learn more about the handsome fellows who made this amazing website.

### Feature Tasks

- About us page
- Github/ Linkedin links
- Profile picture

### Testing

- Ensure that about us is linked in footer.
- Ensure the Profiles are viewable and links are clickable
- Ensure the page is pleasant to look at and meets contrast requirements
