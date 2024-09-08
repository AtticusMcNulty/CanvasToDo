# CanvasToDo
## How I got the Idea
I developed this project during my sophomore year. I was inspired by "TickTick," a task management app I used for classes. Unlike other to-do apps I had tried (Notion, Todoist, etc.), TickTick stuck with me because of its simplicity and easy access from the Macbook menubar. While using it, I had to manually enter my assignments and dates, which led me to try automating this process. After discovering the Canvas API, which my school uses, I decided to build an app to interact with it.

## Learning behind the Project
I was already familiar with React and had worked with APIs in previous projects, like MyMeals. However, working with the Canvas API was different because many of its calls are restricted due to its connection with school platforms. I had to find creative workarounds to access the data I needed. The Canvas LMS documentation helped with basic tasks, but for more complex issues, I relied on the Canvas LMS community help site. Through questions I received valuable insights on my posts from more experienced members of the community. Links to these resources are included below.

## Project Description
CanvasToDo requires users to generate an API key through their Canvas account to log in. Once the key is validated, a backend JavaScript file uses it to make API calls, sending the data to the React frontend.</br>

Key features include:</br>
- Header: Displays user’s name, ID, and profile picture.
- Courses: Shows current courses with the ability to add or remove them dynamically.
- To-Do List: Lists upcoming assignments, allows users to check off completed ones (with the option to move them back), add custom assignments, and set completion percentages.
- Modules: Displays course modules with a dropdown for each item, labeling assignments that need submission, are awaiting grading, and their respective grades.</br>

## Visual Walkthrough

## Resources
Canvas API Documentation: [https://canvas.instructure.com/doc/api/](https://canvas.instructure.com/doc/api/)</br>
Canvas LMS Community: [https://docs.ultralytics.com/](https://community.canvaslms.com/)</br>
