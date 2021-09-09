# [WIP] Planner

This planner is a personal project, currently a work in progress.

The app aims to make it easy for employers to create and share work schedules with their employees. Employees will be notified when their schedule changes and will be prompted to approve the updates before they are automatically added to their phone's calendar.

## Features

#### Managing Employees

Employers can manage a list of their staff, which includes adding and removing employees, updating their info (status, role, personal details, etc.) and setting the amount of working hours specified in their contract.

#### Creating Work Schedules

Employers can add, edit and remove shifts from a weekly planning. Each shift is assigned to an employee and holds information about the date, time and place they're scheduled to work at.

#### Calendar Subscriptions

Each employee will receive a unique link to automatically add their work schedule to their calendar via a subscription. Changes in the planning that are made by the employer will be automatically synchronized with the employees' calendars.

## Feature Implementation Status

| Feature                        | View    | Status      |
| ------------------------------ | ------- | ----------- |
| Login as employer              | AUTH    | Done        |
| View, edit and delete employee | STAFF   | Done        |
| Search and filter employees    | STAFF   | Done        |
| View shifts in weekly planning | PLANNER | Done        |
| Search and filter shifts       | PLANNER | Done        |
| Edit shift                     | PLANNER | In progress |
| Delete shift                   | PLANNER | In progress |
| Add new shift                  | PLANNER | In progress |
| Login as employee              | AUTH    | -           |
| Activate account as employee   | AUTH    | -           |
| Add new employee               | STAFF   | -           |

#### Built With

- Vue 3
  - [Vue CLI](https://cli.vuejs.org)
  - [Vue Router](https://next.router.vuejs.org)
  - [Vuex](https://next.vuex.vuejs.org)
- Firebase
  - [Firebase Auth](https://firebase.google.com/docs/auth)
  - [Cloud Firestore](https://firebase.google.com/docs/firestore)
