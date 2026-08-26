sdSkill Tree RPG — v0.1

Build a personal RPG-style skill tree application that I can use to track my long-term personal development.

This is primarily a personal tool, not a SaaS productivity platform. The goal is to visualize my personal "skill tree", track progression, maintain accountability, and remind me when it is time to work on a skill.

The application should feel like a clean modern RPG character progression interface, not like a conventional productivity dashboard.

Do not overbuild the application. The first version should be small, polished, functional, and easy to extend later.

1. Core Concept

The application represents my personal development as an RPG skill tree.

Each skill belongs to a larger branch.

Example:

                         CHARACTER
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
    ENGINEERING           THINKING          COMMUNICATION
        │                    │                    │
   ┌────┼────┐          ┌────┴────┐          ┌────┴────┐
   │    │    │          │         │          │         │
 React  TS   CS     Decision    Deep       Writing   Speaking
                     Making      Work

The tree should be visually interesting and game-like while remaining clean and professional.

Do not make it look like a childish video game.

Think:

modern RPG skill tree
dark/clean game UI
subtle progression effects
nodes connected by branches
clear levels and XP
polished desktop interface
responsive mobile interface
minimal visual clutter
2. Initial Skills

Do not populate the application with dozens of skills.

Start with these initial branches and skills:

Engineering
Software Engineering
TypeScript
React
Computer Science
Thinking
Decision Making
Deep Work
Communication
Writing
Verbal Communication
Character
Discipline
Consistency

The architecture must make it easy to add additional branches and skills later.

Future branches may include:

Business
Finance
Leadership
Fitness
Islamic studies
etc.

Do not implement those yet.

3. XP System

Each skill has a maximum progression of 100 XP for its current progression level.

For v0.1, keep the progression model simple.

Completing one deliberate practice session gives:

+1 XP

For example:

TypeScript
64 / 100 XP
Level 6

When the skill reaches 100 XP, it advances to the next level and the XP progression resets or rolls over according to a clean progression model.

The exact level calculation should be implemented cleanly so it can be changed later.

Important:

Do NOT subtract XP when I miss a day.

Missing a day should affect consistency/streak statistics, but it should not erase accumulated progress.

Track separately:

XP
Level
Current streak
Best streak
Total practice sessions
Last practiced date
Consistency

Example:

TypeScript

LEVEL 6

████████████░░░░░░░░
64 / 100 XP

🔥 4 day streak

64 total sessions
Last practiced: Today
4. Practice Sessions

Each time I complete a practice session for a skill, I should be able to record it with a simple interaction.

The primary interaction should be something like:

+1 XP — PRACTICE

This should:

Add 1 XP.
Record a practice session.
Update the current streak.
Update the best streak if necessary.
Update the last practiced date.
Update consistency statistics.
Persist the new state locally.

Do not create a complicated task-management system.

A skill is not a task list.

The application is primarily tracking deliberate practice and progression.

5. Streaks

Track:

Current streak
Best streak
Total sessions
Last practice date

A missed day should NOT remove XP.

The streak can reset when the user misses the expected practice window according to the skill's configured frequency.

Keep the streak implementation modular because the scheduling/feasibility system will become more sophisticated later.

6. Skill Feasibility

The application should support the concept that not every skill can or should be practiced every day.

Each skill should therefore have metadata such as:

Priority
Frequency
Difficulty
Reminder schedule

For example:

Software Engineering
Priority: S
Frequency: Daily

TypeScript
Priority: A
Frequency: 3x/week

Computer Science
Priority: A
Frequency: 2x/week

Writing
Priority: B
Frequency: 2x/week

Do not build the full scheduling/optimization algorithm yet.

Simply make the data model capable of supporting it later.

The future application should eventually be able to determine:

"What skills should I work on today?"

But that is NOT part of v0.1.

7. Skill Tree Home Screen

The skill tree should be the primary/home screen.

Do not make the main screen look like a generic SaaS dashboard.

The tree itself should dominate the interface.

Each branch should have:

Branch name
Overall branch level/progress
Connected skill nodes

Each skill node should visually communicate:

Skill name
Level
XP/progress
Whether it is currently active
Whether today's practice has been completed
Current streak where appropriate

Use visual hierarchy so the user can immediately understand the character's development.

Clicking a skill node opens its detail view.

8. Skill Detail View

Clicking a skill should open a detailed skill panel/page.

Example:

TYPECRIPT

LEVEL 6

█████████████░░░░░░░
64 / 100 XP

🔥 4 DAY STREAK

64 TOTAL SESSIONS

Last practiced:
Today

[ +1 XP — PRACTICE ]

Reminder:
Every 2 days · 18:00

The detail view should also provide:

practice history
XP progression
streak information
reminder configuration
priority
frequency
edit skill controls

Keep it visually consistent with the RPG/game UI.

9. Adding and Editing Skills

Provide a simple skill editor.

Fields:

Name
Branch
Description
Priority
Frequency
Reminder schedule

The system should allow adding new branches and skills later.

Do not make the user manually edit JSON or source code to create skills.

10. Technology Stack

Use:

Next.js
React
TypeScript
modern CSS/Tailwind if appropriate
Redis for reminder infrastructure
Browser-based storage using the Origin Private File System (OPFS) API

The application should be designed primarily as a client-side application/PWA.

Do not create a traditional standalone Express/Node backend unless it becomes technically necessary for a feature.

Use Next.js capabilities where server-side functionality is actually required.

Keep the architecture modular so external infrastructure can be introduced later without rewriting the application.

11. Local Storage / OPFS

Use the Origin Private File System API as the primary browser-based persistence mechanism for the application's local data.

Persist at minimum:

branches
skills
XP
levels
practice sessions
streaks
best streaks
last practiced dates
priority
frequency
reminder configuration
application settings

Create a clean storage abstraction rather than accessing OPFS directly throughout the React components.

For example, conceptually:

Storage Layer
    │
    ├── skills
    ├── sessions
    ├── settings
    └── reminders

The UI should not care whether the underlying storage is OPFS.

This will allow the storage implementation to evolve later.

Handle browsers where OPFS is unavailable gracefully.

12. Redis / Reminder System

Redis will be used for the reminder/scheduling infrastructure.

The application should include a dedicated Reminder/Scheduler configuration UI.

This can either be:

a modal opened from settings, or
a dedicated Scheduler section inside Settings.

The user should be able to configure:

Skill
Reminder frequency
Preferred time
Active/inactive

Example:

TypeScript

Reminder:
Every 2 days

Time:
18:00

Status:
Enabled

The Redis integration must be isolated behind a reminder/scheduling service abstraction.

Do not couple the React UI directly to Redis.

IMPORTANT:

Do not assume that a browser can permanently execute a background Redis scheduler.

The implementation should clearly separate:

Client/PWA
     │
     └── Reminder configuration

Server-side scheduling mechanism
     │
     └── Redis

Notification delivery
     │
     ├── Browser notification
     └── Mobile push

If reliable background execution or push delivery requires a small server-side Next.js route, serverless function, worker, or external push infrastructure, use the smallest appropriate solution.

Do not create an unnecessary traditional backend server.

13. Notifications

Notifications should primarily be browser/PWA based.

The application should support:

Desktop/browser

Browser notifications when permission has been granted.

Mobile/PWA

The application should be installable to the phone home screen as a PWA.

Design the notification architecture so it can support mobile push notifications.

Do not rely on keeping a browser tab permanently running in the background because mobile operating systems may suspend or terminate web applications.

Use appropriate Web Push/PWA mechanisms where required.

The architecture should allow reminder events to eventually result in:

Reminder triggered
        ↓
Push notification
        ↓
"Time to practice TypeScript."

The notification system should be abstracted so the reminder engine does not care whether the final notification is browser, mobile push, or another future channel.

14. Settings

Create a clean settings screen.

Initial settings:

Notifications
Enable notifications
Notification permission status
Push notification configuration
Test notification
Scheduler
View active reminders
Add reminder
Edit reminder
Disable reminder
Data
Export data
Import data
Reset application data
Appearance
Theme
Animation preferences

Do not overbuild settings.

15. PWA

The application should be designed as a proper Progressive Web App.

Requirements:

Installable on mobile
Installable on desktop
Responsive UI
App-like navigation
Appropriate manifest
Service worker where required
Notification support
Mobile-friendly interactions
Touch-friendly skill tree
Offline-first behavior for core skill tracking

The core skill tree and progression tracking should continue to work without an internet connection.

Reminder synchronization/push functionality may require connectivity.

16. Visual Design

The UI should feel like a personal RPG character progression system.

Avoid generic:

Bootstrap dashboards
Corporate SaaS styling
excessive cards
spreadsheet-like interfaces
productivity-app aesthetics

Instead use:

skill nodes
connected branches
XP bars
levels
subtle glow/highlight effects
progression animations
clean typography
restrained colors
strong hierarchy
dark mode as the primary aesthetic
responsive layout

The design should remain sophisticated and minimal.

Think:

"RPG character progression screen redesigned as a modern productivity application."

Do not use excessive game effects.

No unnecessary:

loot
weapons
fantasy characters
coins
achievements
avatars
leaderboards

The RPG metaphor should primarily exist through progression, nodes, levels, XP, and branches.

17. Responsive Behavior

Desktop:

The entire skill tree should have enough space to visualize relationships between branches.

Mobile:

The tree must remain usable on a phone.

Use:

zoom/pan if appropriate
touch-friendly nodes
collapsible branches
bottom sheets/modals for skill details
responsive navigation

The application should feel like a native app when installed on mobile.

18. Architecture Principles

Keep the code modular.

Suggested conceptual structure:

app/
components/
  skill-tree/
  skill/
  scheduler/
  settings/
  notifications/

lib/
  skills/
  progression/
  storage/
  reminders/
  notifications/

types/

Separate:

UI
↓
Application logic
↓
Domain models
↓
Storage / infrastructure

Do not put progression calculations directly inside React components.

For example, create reusable functions/services for:

adding XP
calculating levels
calculating streaks
calculating consistency
recording sessions
loading skills
saving skills
scheduling reminders
19. Important Scope Constraint

This is v0.1.

Do NOT implement:

social features
accounts
leaderboards
multiplayer
achievements
quests
inventory
gamified currencies
complex AI recommendations
advanced analytics
complicated scheduling optimization
subscription/payment system
multi-user SaaS architecture

The goal is:

Build a beautiful personal skill tree that I can actually use every day.

It should be possible to open the application, see my character, click a skill, practice it, gain XP, maintain my streak, and receive reminders.

That's the entire purpose of the first version.

20. Development Approach

Build incrementally.

Phase 1

Build the visual skill tree using static/mock data.

Focus heavily on:

layout
nodes
connections
animations
responsive behavior
visual hierarchy
Phase 2

Implement the skill domain model and XP system.

Phase 3

Implement OPFS persistence.

Phase 4

Implement practice history and streak calculation.

Phase 5

Implement skill editing and settings.

Phase 6

Implement PWA functionality.

Phase 7

Implement reminder configuration.

Phase 8

Integrate Redis and the appropriate server-side scheduling mechanism.

Phase 9

Implement browser/mobile push notifications.

Do not attempt to solve the entire architecture before the core experience exists.

21. First Deliverable

Start by creating the actual application UI and core interaction.

I want to be able to:

Open the application.
See my skill tree.
See the initial branches and skills.
Click a skill.
See its level, XP, streak, and history.
Press +1 XP.
See the progress update immediately.
Reload the application and retain the progress using OPFS.

Only after this works should the reminder infrastructure be implemented.

The application should feel polished from the beginning, but the underlying implementation should remain simple and extensible.