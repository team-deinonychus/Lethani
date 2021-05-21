# Teamwork and conflict resolution plan

## Psychological safety

We will work by the following mantras

- “There are no stupid questions”
- “This is a safe place”
- “You belong here”
- “Your voice matters”

## Communication plan

Our main channel of communication is our team discord's channel. When people are not on discord, Slack is our second option to try and reach out to people. Remo can be used to meet with TAs and get help.

Daily progress meeting -- we'll touch base for 15 minutes to 30 minutes each day to talk about our progress on tasks or features and what needs to be done.

## Working hours

Our working hours are very approximately 9am - 5pm Pacific time. Feel free to try and get in touch with anyone outside of working hours using Discord or Slack. There is no expectation that people be available or working outside of working hours. However it's highly probable that people will we available or working outside of working hours on any given day.

## Making sure everyone is heard

When we are discussing the project, iterate through everyone's ideas to hear their ideas. We are all committed to giving everyone their fair chance to talk. Don’t hesitate to say something and bring it up to the group. If someone feels like another member of the group could contribute more or may not be included, feel free to directly reach out and ask that person for input.

## Conflict plan

- Try not to interrupt when we disagree so that we actually have a genuine opportunity to understand where the other person is coming from.
- If there is a conflict between specific members, the person(s) not involved should mediate as an objective party. The people not involved should also provide input because ultimately we are all figuring this out together.
- Outside mediation: talking with instructor or outside parties as necessary.
- If we are in a conflict and it is becoming too stressful, anyone has the option to say “hey I need a break” and table the subject. We also can together agree on a break together and revisit the matter at a later time.
- Hard vetoing: Everyone has the ability to resolve a conflict by articulating whatever idea they feel very strongly about and why. The group will commit to incorporating that idea with a reasonable compromise.
- We hope and expect not to use these processes and resolve our conflicts as casually as possible. We collectively commit to falling back on these processes if we need to.

## Work Plan:

- Use Git projects for project management.
- Work in feature branches with names that describe the feature that you're working on.
- Delete feature branches when pull requests are merged.
- In order to track which people were doing what, putting comments in the code to keep track of who is doing what; highlights on README, link to Github Projects
- At the end of each code session or a “major” ACP; the coding pair will update their section of the README.md. It should include at minimum, the following information:
- Remaining TODO: list of things that are still open based on the task assigned

# Git Process:

- What lives on GitHub?
    - Main branch (deploys to Heroku)
    - Dev branch
    - Feature branches, named after what features they’re implemented
- What is your Git flow? Work on semantically named feature branches.
- ACP as needed.
- Pull request upon feature completion.
- How many people must review a PR?
- Ideally 1 person other than submitter, however you can review a PR yourself as needed if you’re very confident that it’s not breaking
- Who merges PRs? Anyone
- How often will you merge feature branches into dev? Whenever necessary
- How will you communicate that it’s time to merge dev into main? Discord
- How will you communicate that it’s time to merge feature branches into dev? Just go ahead and merge it when the PR is reviewed and the code is needed.
- Daily team submission owner (or rotation?): Seamus
- Communication about code ideally takes place on PRs

# Testing

- Prioritize integration testing
- Should probably have unit tests on everything except naked getters or setters
- The more logic a method has, the more tests it needs (generally speaking)
- Don’t go crazy/overboard but we ideally we want tests
- Test the features of an object, not the implementation
- Create tests that catch any bugs we find

# General Project/Code Structure:

- To be discussed