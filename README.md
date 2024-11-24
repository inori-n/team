# TEAM
# Team Project Repository

Welcome to the **Team Project Repository**! This repository contains the source code and documentation for our software engineering project.

## Project Overview

This project demonstrates the implementation of a **contact management system** using front-end and back-end separation. It includes the following features:

- Adding, editing, deleting contacts
- Marking contacts as favorites
- Importing and exporting contacts
- Viewing and managing contact lists

## Features

- **Bookmark Contacts**: Mark important contacts as "favorites" for easy access.
- **Multiple Contact Methods**: Add multiple phone numbers, emails, and addresses for each contact.
- **Import/Export Functionality**: Batch import contacts from an Excel file and export data as an Excel file.
- **Responsive Frontend**: Intuitive user interface with support for multiple devices.
- **RESTful APIs**: Backend implemented using RESTful API architecture.

## Project Structure

### Frontend

- Developed using **HTML**, **CSS**, and **JavaScript**
- Contains dynamic UI components for user interaction

### Backend

- Built with **Node.js** and **Express**
- Provides APIs for managing contact data, including:
  - `GET`, `POST`, `PUT`, and `DELETE` endpoints for contacts
  - Endpoints for importing and exporting contact data

## How to Use

### Prerequisites

- Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)

- Clone the repository to your local machine:

  ```bash
  git clone https://github.com/inori-n/team.git
  cd team
  ```

### Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Access the backend at `http://localhost:3000`.

### Frontend Setup

1. Open the `frontend` folder in your favorite code editor.
2. Launch the `index.html` file in your browser.

### Deployment

The project is deployed on a cloud server and can be accessed at:

- **Cloud Server URL**: http://121.199.30.193/

## Branch Information

### Main Branch

The `main` branch contains the latest stable code for the project.

### Feature Branches

The following feature branches include specific updates and enhancements:

- `assignment5`
- `assignment5-1`
- `assignment5-2`
- `assignment5-3`
- `assignment5-4`
- `step1`, `step2`, `step3`, `step4`

## Collaboration

### Team Members

- **Jiayi Qiu**: Backend development.
- **Yitao Cai**: Frontend development.

### Git Workflow

- **Branching Strategy**: Separate branches for each feature.
- **Commit Standards**: Descriptive commit messages for every change.
- **Code Reviews**: Peer-reviewed merges into the `main` branch.

## API Documentation

### Endpoints

- `GET /contacts`: Fetch all contacts.
- `POST /contacts`: Add a new contact.
- `PUT /contacts/:id`: Update a contact.
- `DELETE /contacts/:id`: Delete a contact.
- `POST /contacts/import`: Import contacts from an Excel file.
- `GET /contacts/export`: Export contacts to an Excel file.

## Troubleshooting

If you encounter any issues, please:

1. Check the logs for error messages.
2. Verify that the backend server is running.
3. Ensure all required dependencies are installed.

For further assistance, please create an issue in the [GitHub repository](https://github.com/inori-n/team/issues).

------

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

Special thanks to all team members for their contributions to this project!
