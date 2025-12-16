# Credit Card App Flask

A Flask-based web application for credit card information management and validation. This application provides an interactive user interface for processing credit card data using the Flask Python framework.

## Project Description

Credit Card App Flask is a web application built using the Flask framework to handle credit card-related operations. The application provides features for validation, processing, and managing credit card information through a responsive web interface.

### Key Features

- Interactive web interface with HTML/CSS/JavaScript
- Python backend using Flask framework
- Credit card data validation
- Real-time credit card information processing
- Responsive and user-friendly design

### Technologies Used

- **Python**: Primary programming language
- **Flask**: Web framework for backend
- **HTML/CSS**: Markup and styling for interface
- **JavaScript**: Client-side interactivity

## Getting Started

### Prerequisites

Ensure your system has the following installed:
- Python 3.7 or newer
- pip (Python package manager)

### Installation

1. Clone this repository
```bash
git clone https://github.com/Tedshub/Credit-Card-App-Flask.git
cd Credit-Card-App-Flask
```

2. Create a virtual environment
```bash
python -m venv .venv
```

3. Activate the virtual environment

For Windows:
```bash
.venv\Scripts\activate
```

For Linux/MacOS:
```bash
source .venv/bin/activate
```

4. Install dependencies from requirements.txt
```bash
pip install -r requirements.txt
```

### Running the Application

1. Ensure the virtual environment is activated

2. Run the Flask application
```bash
python app.py
```

or
```bash
flask run
```

3. Access the application through your browser at:
```
http://localhost:5000
```

or
```
http://127.0.0.1:5000
```

### Deactivating Virtual Environment

After finishing with the application, deactivate the virtual environment with:
```bash
deactivate
```

## Project Structure
```
Credit-Card-App-Flask/
│
├── models/                 # Folder for machine learning models or database models
│
├── static/                 # Folder for static files (CSS, JavaScript, images)
│
├── templates/              # Folder for HTML templates
│
├── .venv/                  # Virtual environment (not committed to repository)
│
├── app.py                  # Main Flask application file
│
├── requirements.txt        # Python dependencies list
│
└── README.md              # Project documentation
```

### Folder Structure Explanation

- **models/**: Contains model files for data processing or database structures
- **static/**: Stores static files such as CSS, JavaScript, and images used in the frontend
- **templates/**: Contains HTML template files rendered by Flask
- **app.py**: Main file that runs the Flask application and defines routes
- **requirements.txt**: File containing all Python packages required to run the application

## Contributing

Contributions to the development of this project are welcome. Please create a pull request or open an issue to discuss new features or bug fixes.

## Developer

Developed by [Tedshub](https://github.com/Tedshub)

## License

This project is open source and available for use according to development and learning needs.

## Important Notes

- Ensure not to store sensitive credit card information in code or repository
- Always use a virtual environment to isolate project dependencies
- Update requirements.txt when adding new packages with: `pip freeze > requirements.txt`
- Do not commit the `.venv/` folder to the repository (already configured in .gitignore)

## Troubleshooting

### Error during dependency installation
Ensure pip is updated to the latest version:
```bash
python -m pip install --upgrade pip
```

### Error when running the application
Ensure all dependencies are installed correctly and the virtual environment is activated.

### Port already in use
If port 5000 is already in use, you can run the application on another port:
```bash
flask run --port 5001
```

## Contact

For questions or suggestions, please reach out through [GitHub](https://github.com/Tedshub).
