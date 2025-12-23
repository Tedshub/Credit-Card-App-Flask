# Credit Card App Flask

A Flask-based web application for credit card information management and validation. This application provides an interactive user interface for processing credit card data using the Flask Python framework.

## Project Description

Credit Card App Flask is a web application built using the Flask framework to handle credit card-related operations. The application provides features for validation, processing, and managing credit card information through a responsive web interface.

### Key Features

- Interactive web interface with HTML/CSS/JavaScript
- Python backend using Flask framework
- Credit card data validation
- Real-time credit card information processing
- Two testing methods: Manual input and JSON input
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

## Testing Fraud Detection

The application provides two methods for testing the fraud detection system through the web interface:

### Method 1: Manual Input

Use the manual input form in the web interface to enter transaction details individually. Fill in all required fields with appropriate values.

### Method 2: JSON Input

Use the JSON input method to test with pre-formatted data. The application accepts JSON input with the following structure:

#### Sample Test Data 1
```json
{
  "input": {
    "cc_num": 3591919803438423.0,
    "category": 9.0,
    "amt": 1250.99,
    "gender": 1.0,
    "city": 803.0,
    "state": 9.0,
    "zip": 32780.0,
    "lat": 28.5697,
    "long": -80.8191,
    "city_pop": 54767.0,
    "merch_lat": 35.812398,
    "merch_long": -85.883061,
    "hour": 23.0,
    "dayofweek": 0.0,
    "month": 12.0,
    "age": 38.0
  }
}
```

#### Sample Test Data 2
```json
{
  "input": {
    "cc_num": 3573030041201292.0,
    "category": 5.0,
    "amt": 850.5,
    "gender": 0.0,
    "city": 16.0,
    "state": 44.0,
    "zip": 84002.0,
    "lat": 40.3207,
    "long": -110.436,
    "city_pop": 302.0,
    "merch_lat": 39.450498,
    "merch_long": -109.960431,
    "hour": 3.0,
    "dayofweek": 2.0,
    "month": 6.0,
    "age": 35.0
  }
}
```

### How to Test

1. Open the application in your browser at `http://localhost:5000`
2. Choose one of the testing methods:
   - **Manual Input**: Fill in the form fields with transaction details
   - **JSON Input**: Copy one of the sample JSON data above and paste it into the JSON input area
3. Click the submit/predict button
4. View the fraud detection results

### Input Parameters Explanation

- **cc_num**: Credit card number
- **category**: Transaction category code
- **amt**: Transaction amount in currency
- **gender**: Gender (0 = Female, 1 = Male)
- **city**: City code identifier
- **state**: State code identifier
- **zip**: ZIP/Postal code
- **lat**: Customer latitude coordinate
- **long**: Customer longitude coordinate
- **city_pop**: City population
- **merch_lat**: Merchant latitude coordinate
- **merch_long**: Merchant longitude coordinate
- **hour**: Hour of transaction (0-23)
- **dayofweek**: Day of week (0 = Monday, 6 = Sunday)
- **month**: Month of transaction (1-12)
- **age**: Customer age in years

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
- All numerical values in JSON input must be in float format (with decimal point)

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

### Invalid JSON format
Ensure all numerical values in JSON input include decimal points (e.g., 9.0 instead of 9) and the JSON structure matches the sample format provided.

### Prediction error
Verify that all required fields are provided and have appropriate data types. Check the browser console for detailed error messages.

## Contact

For questions or suggestions, please reach out through [GitHub](https://github.com/Tedshub).