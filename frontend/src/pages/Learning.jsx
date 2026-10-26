import React, { useMemo, useState } from "react";
import "./Learning.css";

/*
  Learning.jsx

  Flow:
  Resume upload -> detected domain -> this page
  -> Roadmap -> Concept -> Explanation/Types/Examples
  -> Practice -> Answer checking -> Mistake correction

  Props expected from Dashboard:
    topic={domain}
    skills={skills}
    missingSkills={missingSkills}
    onBack={() => ...}
*/

const ROADMAPS = {
  "python full stack": {
    icon: "🐍",
    title: "Python Full Stack",
    description:
      "Learn Python, databases, backend APIs, frontend development and full-stack integration.",
    stages: [
      {
        title: "Python Fundamentals",
        concepts: [
          {
            name: "Variables & Data Types",
            explanation:
              "Variables store values in Python. Common data types include int, float, str, bool, list, tuple, set and dict.",
            types: [
              "int - whole numbers",
              "float - decimal numbers",
              "str - text",
              "bool - True or False",
              "list - ordered collection",
              "tuple - immutable collection",
              "set - unique values",
              "dict - key-value pairs",
            ],
            examples: [
              {
                code: 'name = "Malliswari"\nage = 21\nis_student = True',
                text: "Creating variables with different data types.",
              },
              {
                code: 'skills = ["Python", "SQL", "React"]',
                text: "A list can store multiple values.",
              },
            ],
            practice: {
              question:
                "Create a variable called age and store the value 21 in it.",
              starter: "age = ",
              answer:
                "age = 21",
              keywords: ["age", "21"],
              hint: "Use the variable name age and assign 21 to it.",
            },
          },
          {
            name: "Conditional Statements",
            explanation:
              "Conditional statements allow a program to make decisions based on conditions.",
            types: [
              "if",
              "if-else",
              "if-elif-else",
              "nested if",
            ],
            examples: [
              {
                code: 'age = 20\nif age >= 18:\n    print("Adult")',
                text: "The condition is checked before executing the block.",
              },
            ],
            practice: {
              question:
                'Write an if statement that prints "Pass" when marks are greater than or equal to 40.',
              starter: "marks = 65\n",
              answer:
                'marks = 65\nif marks >= 40:\n    print("Pass")',
              keywords: ["if", "marks", "40", "print"],
              hint: "Use if marks >= 40 and print Pass.",
            },
          },
          {
            name: "Loops",
            explanation:
              "Loops repeat a block of code. Python mainly provides for and while loops.",
            types: [
              "for loop",
              "while loop",
              "nested loop",
            ],
            examples: [
              {
                code: "for i in range(1, 6):\n    print(i)",
                text: "range(1, 6) produces 1 through 5 because the stop value is excluded.",
              },
              {
                code: 'count = 1\nwhile count <= 5:\n    print(count)\n    count += 1',
                text: "A while loop continues while its condition is True.",
              },
            ],
            practice: {
              question:
                "Print numbers from 1 to 10 using a for loop.",
              starter: "",
              answer:
                "for i in range(1, 11):\n    print(i)",
              keywords: ["for", "range", "1", "11", "print"],
              hint: "Remember that the second value of range() is excluded.",
            },
          },
          {
            name: "Functions",
            explanation:
              "A function is a reusable block of code that performs a particular task.",
            types: [
              "function without arguments",
              "function with arguments",
              "function with return value",
              "lambda function",
            ],
            examples: [
              {
                code: "def add(a, b):\n    return a + b\n\nresult = add(10, 20)",
                text: "The function receives two arguments and returns their sum.",
              },
            ],
            practice: {
              question:
                "Create a function square(n) that returns the square of n.",
              starter: "",
              answer:
                "def square(n):\n    return n * n",
              keywords: ["def", "square", "n", "return"],
              hint: "Define square with one parameter n and return n * n.",
            },
          },
          {
            name: "Object Oriented Programming",
            explanation:
              "OOP organizes code using classes and objects. It helps build reusable and maintainable applications.",
            types: [
              "class and object",
              "inheritance",
              "encapsulation",
              "polymorphism",
              "abstraction",
            ],
            examples: [
              {
                code: 'class Student:\n    def __init__(self, name):\n        self.name = name\n\ns1 = Student("Malliswari")',
                text: "Student is a class and s1 is an object.",
              },
            ],
            practice: {
              question:
                "Create a class Student with a name attribute.",
              starter: "",
              answer:
                'class Student:\n    def __init__(self, name):\n        self.name = name',
              keywords: ["class", "Student", "__init__", "self", "name"],
              hint: "Use a class and an __init__ method.",
            },
          },
        ],
      },
      {
        title: "Database & SQL",
        concepts: [
          {
            name: "SQL Basics",
            explanation:
              "SQL is used to create, read, update and delete data in relational databases.",
            types: [
              "SELECT",
              "INSERT",
              "UPDATE",
              "DELETE",
              "CREATE",
            ],
            examples: [
              {
                code: "SELECT name, email\nFROM patients;",
                text: "Selects specific columns from a table.",
              },
              {
                code: "SELECT * FROM patients\nWHERE age >= 18;",
                text: "WHERE filters rows.",
              },
            ],
            practice: {
              question:
                "Write a query to select all columns from the doctors table.",
              starter: "",
              answer:
                "SELECT * FROM doctors;",
              keywords: ["select", "*", "from", "doctors"],
              hint: "Use SELECT * FROM table_name.",
            },
          },
          {
            name: "SQL JOINs",
            explanation:
              "JOINs combine related rows from two or more tables using a common column.",
            types: [
              "INNER JOIN",
              "LEFT JOIN",
              "RIGHT JOIN",
              "FULL JOIN",
            ],
            examples: [
              {
                code: "SELECT patients.name, appointments.date\nFROM patients\nINNER JOIN appointments\nON patients.id = appointments.patient_id;",
                text: "Combines patient and appointment information.",
              },
            ],
            practice: {
              question:
                "Write an INNER JOIN between patients and appointments using patients.id = appointments.patient_id.",
              starter: "",
              answer:
                "SELECT * FROM patients INNER JOIN appointments ON patients.id = appointments.patient_id;",
              keywords: ["select", "from", "patients", "inner join", "appointments", "on"],
              hint: "Use INNER JOIN and connect the two id columns with ON.",
            },
          },
        ],
      },
      {
        title: "Backend Development",
        concepts: [
          {
            name: "FastAPI",
            explanation:
              "FastAPI is a Python framework used to build fast APIs and backend services.",
            types: [
              "GET endpoint",
              "POST endpoint",
              "PUT endpoint",
              "DELETE endpoint",
            ],
            examples: [
              {
                code: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\ndef home():\n    return {"message": "Hello"}',
                text: "Creates a simple GET endpoint.",
              },
            ],
            practice: {
              question:
                "Create a FastAPI GET endpoint /hello that returns {'message': 'Hello'}.",
              starter: "",
              answer:
                'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/hello")\ndef hello():\n    return {"message": "Hello"}',
              keywords: ["fastapi", "app", "@app.get", "/hello", "return"],
              hint: "Create FastAPI(), add @app.get('/hello'), then return the dictionary.",
            },
          },
          {
            name: "REST API",
            explanation:
              "A REST API allows frontend applications and other clients to communicate with backend resources over HTTP.",
            types: [
              "GET - read",
              "POST - create",
              "PUT - replace/update",
              "PATCH - partial update",
              "DELETE - remove",
            ],
            examples: [
              {
                code: "GET /patients\nPOST /patients\nPUT /patients/1\nDELETE /patients/1",
                text: "Different HTTP methods perform different operations.",
              },
            ],
            practice: {
              question:
                "Which HTTP method should be used to create a new patient?",
              starter: "",
              answer: "POST",
              keywords: ["post"],
              hint: "Think about the HTTP method used to create a resource.",
            },
          },
          {
            name: "Authentication & JWT",
            explanation:
              "Authentication verifies a user's identity. JWT is commonly used to represent a signed login token that can be sent with API requests.",
            types: [
              "login authentication",
              "access token",
              "refresh token",
              "role-based authorization",
            ],
            examples: [
              {
                code: "Authorization: Bearer <access_token>",
                text: "A client can send an access token in the Authorization header.",
              },
            ],
            practice: {
              question:
                "Write the standard Authorization header format for a Bearer token.",
              starter: "",
              answer:
                "Authorization: Bearer <access_token>",
              keywords: ["authorization", "bearer", "access_token"],
              hint: "The header starts with Authorization: Bearer.",
            },
          },
        ],
      },
      {
        title: "Frontend Development",
        concepts: [
          {
            name: "HTML & CSS",
            explanation:
              "HTML creates the structure of a web page and CSS controls its appearance and layout.",
            types: [
              "HTML elements",
              "forms",
              "CSS selectors",
              "flexbox",
              "grid",
              "responsive design",
            ],
            examples: [
              {
                code: '<button class="primary">Login</button>\n\n.primary {\n  padding: 10px 20px;\n  border-radius: 8px;\n}',
                text: "HTML creates a button and CSS styles it.",
              },
            ],
            practice: {
              question:
                "Write an HTML heading containing the text CareerAI.",
              starter: "",
              answer: "<h1>CareerAI</h1>",
              keywords: ["h1", "careerai"],
              hint: "Use an h1 element.",
            },
          },
          {
            name: "JavaScript",
            explanation:
              "JavaScript adds logic and interactivity to web applications.",
            types: [
              "variables",
              "functions",
              "arrays",
              "objects",
              "events",
              "async/await",
            ],
            examples: [
              {
                code: 'const name = "Malliswari";\nconsole.log(name);',
                text: "A constant stores a value and console.log displays it.",
              },
            ],
            practice: {
              question:
                "Create a JavaScript variable called score with value 90.",
              starter: "",
              answer: "const score = 90;",
              keywords: ["const", "score", "90"],
              hint: "Use const score = 90.",
            },
          },
          {
            name: "React Components",
            explanation:
              "React components are reusable UI building blocks. Components receive data through props and can manage state.",
            types: [
              "functional components",
              "props",
              "state",
              "event handlers",
            ],
            examples: [
              {
                code: 'function Welcome({ name }) {\n  return <h1>Hello {name}</h1>;\n}',
                text: "A functional component receives name through props.",
              },
            ],
            practice: {
              question:
                "Create a React component called Greeting that returns <h1>Hello</h1>.",
              starter: "",
              answer:
                "function Greeting() {\n  return <h1>Hello</h1>;\n}",
              keywords: ["function", "greeting", "return", "h1", "hello"],
              hint: "Create a function component and return an h1.",
            },
          },
          {
            name: "React Hooks",
            explanation:
              "Hooks let functional React components use features such as state and lifecycle-related behavior.",
            types: [
              "useState",
              "useEffect",
              "useMemo",
              "useRef",
              "custom hooks",
            ],
            examples: [
              {
                code: 'const [count, setCount] = useState(0);',
                text: "useState creates state and a function to update it.",
              },
            ],
            practice: {
              question:
                "Write a useState declaration for a count starting at 0.",
              starter: "",
              answer:
                "const [count, setCount] = useState(0);",
              keywords: ["usestate", "count", "setcount", "0"],
              hint: "Use const [count, setCount] = useState(0).",
            },
          },
        ],
      },
      {
        title: "Full Stack Integration",
        concepts: [
          {
            name: "Frontend to Backend API Calls",
            explanation:
              "The frontend sends HTTP requests to backend endpoints and uses the returned data to update the UI.",
            types: [
              "GET request",
              "POST request",
              "authenticated request",
              "JSON response",
            ],
            examples: [
              {
                code: 'const response = await fetch("http://127.0.0.1:8000/patients");\nconst data = await response.json();',
                text: "fetch() sends a request and response.json() reads the JSON response.",
              },
            ],
            practice: {
              question:
                "Write a fetch GET request to /api/patients and convert the response to JSON.",
              starter: "",
              answer:
                'const response = await fetch("/api/patients");\nconst data = await response.json();',
              keywords: ["fetch", "/api/patients", "await", "json"],
              hint: "Use fetch() followed by response.json().",
            },
          },
          {
            name: "Database Integration",
            explanation:
              "A backend connects to a database so application data can be stored and retrieved persistently.",
            types: [
              "connection",
              "query",
              "insert",
              "update",
              "delete",
            ],
            examples: [
              {
                code: "Frontend → FastAPI → MySQL\nMySQL → FastAPI → Frontend",
                text: "The backend acts as the bridge between the frontend and database.",
              },
            ],
            practice: {
              question:
                "Complete the flow: React → ? → MySQL.",
              starter: "",
              answer: "FastAPI",
              keywords: ["fastapi"],
              hint: "The Python backend handles the database communication.",
            },
          },
        ],
      },
    ],
  },

  "data analytics": {
    icon: "📊",
    title: "Data Analytics",
    description:
      "Build skills in Excel, SQL, Python, statistics, Pandas and Power BI.",
    stages: [
      {
        title: "Excel",
        concepts: [
          {
            name: "Excel Basics",
            explanation:
              "Excel is widely used for organizing, cleaning, calculating and analyzing tabular data.",
            types: [
              "formulas",
              "functions",
              "sorting",
              "filtering",
              "pivot tables",
              "charts",
            ],
            examples: [
              {
                code: "=SUM(B2:B10)\n=AVERAGE(B2:B10)\n=COUNT(B2:B10)",
                text: "Common Excel aggregation formulas.",
              },
            ],
            practice: {
              question:
                "Write an Excel formula to calculate the average of B2 to B10.",
              starter: "",
              answer: "=AVERAGE(B2:B10)",
              keywords: ["average", "b2:b10"],
              hint: "Use the AVERAGE function.",
            },
          },
        ],
      },
      {
        title: "SQL",
        concepts: [
          {
            name: "SQL Queries",
            explanation:
              "SQL is used to retrieve, filter, group and modify relational data.",
            types: [
              "SELECT",
              "WHERE",
              "GROUP BY",
              "ORDER BY",
              "JOIN",
              "subquery",
            ],
            examples: [
              {
                code: "SELECT department, COUNT(*)\nFROM employees\nGROUP BY department;",
                text: "GROUP BY creates groups for aggregation.",
              },
            ],
            practice: {
              question:
                "Write a query to select all rows from the patients table.",
              starter: "",
              answer: "SELECT * FROM patients;",
              keywords: ["select", "*", "from", "patients"],
              hint: "Use SELECT * FROM patients.",
            },
          },
        ],
      },
      {
        title: "Python for Analytics",
        concepts: [
          {
            name: "Pandas",
            explanation:
              "Pandas is a Python library for working with structured data using Series and DataFrame objects.",
            types: [
              "Series",
              "DataFrame",
              "filtering",
              "grouping",
              "merging",
            ],
            examples: [
              {
                code: 'import pandas as pd\n\ndf = pd.read_csv("patients.csv")\nprint(df.head())',
                text: "Reads a CSV file into a DataFrame.",
              },
            ],
            practice: {
              question:
                "Write Python code to import pandas using the alias pd.",
              starter: "",
              answer: "import pandas as pd",
              keywords: ["import", "pandas", "as", "pd"],
              hint: "Use import pandas as pd.",
            },
          },
          {
            name: "Data Cleaning",
            explanation:
              "Data cleaning handles missing, duplicate, incorrect or inconsistent values before analysis.",
            types: [
              "missing values",
              "duplicates",
              "wrong data types",
              "outliers",
              "inconsistent text",
            ],
            examples: [
              {
                code: "df = df.drop_duplicates()\ndf = df.dropna()",
                text: "Removes duplicate rows and rows containing missing values.",
              },
            ],
            practice: {
              question:
                "Write Pandas code to remove duplicate rows.",
              starter: "",
              answer: "df = df.drop_duplicates()",
              keywords: ["df", "drop_duplicates"],
              hint: "Use the DataFrame drop_duplicates method.",
            },
          },
        ],
      },
      {
        title: "Statistics",
        concepts: [
          {
            name: "Mean, Median & Mode",
            explanation:
              "Mean is the arithmetic average, median is the middle value after sorting, and mode is the most frequent value.",
            types: [
              "mean",
              "median",
              "mode",
            ],
            examples: [
              {
                code: "Data: 1, 2, 2, 3, 4\nMean = 2.4\nMedian = 2\nMode = 2",
                text: "These measures summarize the center of a dataset.",
              },
            ],
            practice: {
              question:
                "Find the mean of 10, 20 and 30.",
              starter: "",
              answer: "20",
              keywords: ["20"],
              hint: "Add all values and divide by the number of values.",
            },
          },
        ],
      },
      {
        title: "Power BI",
        concepts: [
          {
            name: "Power BI Basics",
            explanation:
              "Power BI is used to connect data, transform it and create interactive reports and dashboards.",
            types: [
              "data import",
              "Power Query",
              "data model",
              "DAX",
              "visuals",
              "dashboard",
            ],
            examples: [
              {
                code: "Data Source → Power Query → Data Model → Visuals → Dashboard",
                text: "A common Power BI workflow.",
              },
            ],
            practice: {
              question:
                "Which Power BI component is mainly used for data transformation?",
              starter: "",
              answer: "Power Query",
              keywords: ["power query"],
              hint: "It is the transformation and preparation tool inside Power BI.",
            },
          },
        ],
      },
    ],
  },

  "machine learning": {
    icon: "🧠",
    title: "Machine Learning",
    description:
      "Learn Python, data preparation, supervised learning, unsupervised learning and model evaluation.",
    stages: [
      {
        title: "ML Foundations",
        concepts: [
          {
            name: "Machine Learning Basics",
            explanation:
              "Machine learning enables systems to learn patterns from data and make predictions or decisions.",
            types: [
              "supervised learning",
              "unsupervised learning",
              "reinforcement learning",
            ],
            examples: [
              {
                code: "Data → Preprocessing → Training → Evaluation → Prediction",
                text: "A typical machine learning workflow.",
              },
            ],
            practice: {
              question:
                "Name the ML type where the training data contains target labels.",
              starter: "",
              answer: "Supervised learning",
              keywords: ["supervised"],
              hint: "The model learns from examples that already have target labels.",
            },
          },
          {
            name: "Train Test Split",
            explanation:
              "Train-test splitting separates data used to train a model from data used to evaluate its performance on unseen examples.",
            types: [
              "training set",
              "test set",
              "validation set",
            ],
            examples: [
              {
                code: "X_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)",
                text: "A common 80/20 split.",
              },
            ],
            practice: {
              question:
                "What is the main purpose of a test set?",
              starter: "",
              answer:
                "Evaluate the model on unseen data",
              keywords: ["evaluate", "unseen"],
              hint: "It checks how the trained model performs on data it did not train on.",
            },
          },
        ],
      },
      {
        title: "Supervised Learning",
        concepts: [
          {
            name: "Regression",
            explanation:
              "Regression predicts a continuous numerical value.",
            types: [
              "linear regression",
              "multiple regression",
              "polynomial regression",
            ],
            examples: [
              {
                code: "model.fit(X_train, y_train)\npredictions = model.predict(X_test)",
                text: "A regression model predicts numerical outcomes.",
              },
            ],
            practice: {
              question:
                "Is predicting house price a regression or classification problem?",
              starter: "",
              answer: "Regression",
              keywords: ["regression"],
              hint: "House price is a continuous numerical value.",
            },
          },
          {
            name: "Classification",
            explanation:
              "Classification predicts a category or class.",
            types: [
              "binary classification",
              "multiclass classification",
            ],
            examples: [
              {
                code: 'prediction = model.predict([[5.1, 3.5, 1.4, 0.2]])',
                text: "A classifier can predict a class such as a flower species.",
              },
            ],
            practice: {
              question:
                "Is spam email detection a classification or regression problem?",
              starter: "",
              answer: "Classification",
              keywords: ["classification"],
              hint: "The result is a category such as spam or not spam.",
            },
          },
        ],
      },
      {
        title: "Unsupervised Learning",
        concepts: [
          {
            name: "Clustering",
            explanation:
              "Clustering groups similar observations when target labels are not provided.",
            types: [
              "K-Means",
              "hierarchical clustering",
              "DBSCAN",
            ],
            examples: [
              {
                code: "from sklearn.cluster import KMeans\nmodel = KMeans(n_clusters=3, random_state=42)",
                text: "K-Means divides observations into a chosen number of clusters.",
              },
            ],
            practice: {
              question:
                "Which clustering algorithm requires you to choose the number of clusters beforehand?",
              starter: "",
              answer: "K-Means",
              keywords: ["k-means", "kmeans"],
              hint: "Its n_clusters parameter specifies the number of clusters.",
            },
          },
        ],
      },
    ],
  },

  "ai & data science": {
    icon: "🤖",
    title: "AI & Data Science",
    description:
      "Learn Python, data analysis, statistics, machine learning, NLP and generative AI.",
    stages: [
      {
        title: "Python & Data",
        concepts: [
          {
            name: "NumPy",
            explanation:
              "NumPy provides fast numerical arrays and mathematical operations in Python.",
            types: [
              "1D arrays",
              "2D arrays",
              "vectorized operations",
              "matrix operations",
            ],
            examples: [
              {
                code: "import numpy as np\narr = np.array([1, 2, 3])\nprint(arr.mean())",
                text: "Creates a NumPy array and calculates its mean.",
              },
            ],
            practice: {
              question:
                "Write code to import NumPy using the alias np.",
              starter: "",
              answer: "import numpy as np",
              keywords: ["import", "numpy", "as", "np"],
              hint: "Use import numpy as np.",
            },
          },
        ],
      },
      {
        title: "Machine Learning",
        concepts: [
          {
            name: "Model Evaluation",
            explanation:
              "Model evaluation measures how well a model performs using suitable metrics.",
            types: [
              "accuracy",
              "precision",
              "recall",
              "F1-score",
              "MAE",
              "RMSE",
            ],
            examples: [
              {
                code: "Accuracy = Correct Predictions / Total Predictions",
                text: "Accuracy measures the proportion of correct predictions.",
              },
            ],
            practice: {
              question:
                "Which metric is commonly used for a regression model to measure average absolute error?",
              starter: "",
              answer: "MAE",
              keywords: ["mae", "mean absolute error"],
              hint: "MAE stands for Mean Absolute Error.",
            },
          },
        ],
      },
      {
        title: "NLP & Generative AI",
        concepts: [
          {
            name: "NLP Basics",
            explanation:
              "Natural Language Processing enables computers to work with human language.",
            types: [
              "tokenization",
              "stemming",
              "lemmatization",
              "text classification",
              "named entity recognition",
            ],
            examples: [
              {
                code: 'text = "CareerAI is useful"\ntokens = text.split()',
                text: "A simple example of splitting text into tokens.",
              },
            ],
            practice: {
              question:
                "What does NLP stand for?",
              starter: "",
              answer: "Natural Language Processing",
              keywords: ["natural language processing"],
              hint: "It is the field of AI that works with human language.",
            },
          },
          {
            name: "Generative AI",
            explanation:
              "Generative AI creates new content such as text, images, code or audio from learned patterns and user instructions.",
            types: [
              "large language models",
              "text generation",
              "image generation",
              "code generation",
              "RAG applications",
            ],
            examples: [
              {
                code: "User Prompt → LLM → Generated Response",
                text: "A simple generative AI interaction.",
              },
            ],
            practice: {
              question:
                "What does LLM stand for?",
              starter: "",
              answer: "Large Language Model",
              keywords: ["large language model"],
              hint: "LLM is the common abbreviation for a language model trained on large amounts of data.",
            },
          },
        ],
      },
    ],
  },
};

const DEFAULT_ROADMAP = {
  icon: "🎯",
  title: "Software Development",
  description:
    "A general software-development roadmap based on common programming and application-development skills.",
  stages: [
    {
      title: "Programming Fundamentals",
      concepts: [
        {
          name: "Programming Basics",
          explanation:
            "Programming fundamentals include variables, data types, conditions, loops, functions and problem solving.",
          types: [
            "variables",
            "conditions",
            "loops",
            "functions",
            "data structures",
          ],
          examples: [
            {
              code: 'name = "Malliswari"\nprint(name)',
              text: "A basic variable and output example.",
            },
          ],
          practice: {
            question:
              "Write code that stores the value 10 in a variable called number.",
            starter: "",
            answer: "number = 10",
            keywords: ["number", "10"],
            hint: "Create a variable named number and assign 10.",
          },
        },
      ],
    },
    {
      title: "Web & APIs",
      concepts: [
        {
          name: "REST APIs",
          explanation:
            "REST APIs allow applications to communicate using HTTP requests and responses.",
          types: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
          ],
          examples: [
            {
              code: "GET /users\nPOST /users",
              text: "GET reads resources and POST creates resources.",
            },
          ],
          practice: {
            question:
              "Which HTTP method is normally used to create a new resource?",
            starter: "",
            answer: "POST",
            keywords: ["post"],
            hint: "Think about the HTTP method for creating data.",
          },
        },
      ],
    },
  ],
};

function normalizeDomain(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getRoadmap(topic) {
  const key = normalizeDomain(topic);

  if (ROADMAPS[key]) {
    return ROADMAPS[key];
  }

  if (key.includes("python") && key.includes("full")) {
    return ROADMAPS["python full stack"];
  }

  if (key.includes("data") && key.includes("analytic")) {
    return ROADMAPS["data analytics"];
  }

  if (key.includes("machine") && key.includes("learn")) {
    return ROADMAPS["machine learning"];
  }

  if (key.includes("ai") || key.includes("data science")) {
    return ROADMAPS["ai & data science"];
  }

  return DEFAULT_ROADMAP;
}

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[`"'.,;:!?()[\]{}<>/\\_=+*-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function checkPracticeAnswer(answer, practice) {
  const clean = normalizeText(answer);

  if (!clean) {
    return {
      correct: false,
      empty: true,
      title: "Please enter an answer",
      message: "Write your answer in the practice box and try again.",
      correction: "",
    };
  }

  const expected = normalizeText(practice.answer);

  if (clean === expected) {
    return {
      correct: true,
      title: "Correct! 🎉",
      message:
        "Excellent. Your answer matches the expected solution.",
      correction: practice.answer,
    };
  }

  const keywords = (practice.keywords || []).map(normalizeText);
  const matched = keywords.filter((word) =>
    clean.includes(word)
  );

  const ratio =
    keywords.length > 0
      ? matched.length / keywords.length
      : 0;

  if (ratio >= 0.65) {
    return {
      correct: false,
      partial: true,
      title: "Almost correct",
      message:
        "Your approach is close, but something is missing or written incorrectly.",
      correction: practice.answer,
    };
  }

  return {
    correct: false,
    title: "There is a mistake",
    message:
      "Your answer does not match the required approach. Check the hint and compare your code with the corrected solution.",
    correction: practice.answer,
  };
}


// Detailed learning data for interactive type explanations.
const TYPE_DETAILS = {
  "int": { explanation: "int is used for whole numbers without a decimal part. It is useful for counts, ages, indexes and quantities.", syntax: "variable = 10", examples: ["age = 21", "marks = 95", "count = 0"], use: "Used when a value represents a complete number such as age, quantity or count." },
  "float": { explanation: "float stores numbers that contain a decimal value. It is useful when fractional or measured values are required.", syntax: "variable = 10.5", examples: ["price = 99.50", "height = 5.6", "average = 82.75"], use: "Used for prices, measurements, percentages and scientific calculations." },
  "str": { explanation: "str represents text. A string can contain letters, numbers, spaces and symbols and is written inside quotes.", syntax: "name = \"value\"", examples: ["name = \"Malliswari\"", "city = \"Kakinada\"", "course = \"AI & Data Science\""], use: "Used for names, messages, addresses, labels and other text data." },
  "bool": { explanation: "bool has only two logical values: True or False. It is commonly used in conditions and decision making.", syntax: "is_valid = True", examples: ["is_student = True", "is_logged_in = False", "age >= 18"], use: "Used to represent yes/no, on/off and condition results." },
  "list": { explanation: "A list is an ordered, changeable collection. It can store multiple values and allows duplicate items.", syntax: "items = [value1, value2]", examples: ["skills = [\"Python\", \"SQL\"]", "marks = [80, 90, 75]", "skills.append(\"React\")"], use: "Used when you need an ordered collection that can change during program execution." },
  "tuple": { explanation: "A tuple is an ordered collection that cannot be changed after creation. This makes it useful for fixed groups of values.", syntax: "point = (10, 20)", examples: ["point = (10, 20)", "rgb = (255, 0, 0)", "student = (\"Malli\", 21)"], use: "Used for fixed records, coordinates and values that should not be modified." },
  "set": { explanation: "A set stores unique values and automatically removes duplicates. It is useful when membership and uniqueness matter.", syntax: "values = {1, 2, 3}", examples: ["nums = {1, 2, 2, 3}", "skills = {\"Python\", \"SQL\"}", "skills.add(\"React\")"], use: "Used for unique collections and fast membership checks." },
  "dict": { explanation: "A dictionary stores data as key-value pairs. Each key is used to access its corresponding value.", syntax: "data = {\"key\": value}", examples: ["student = {\"name\": \"Malli\"}", "student[\"age\"] = 21", "print(student[\"name\"])"], use: "Used for structured records such as user profiles, JSON data and configuration." },
  "if": { explanation: "if executes a block only when its condition is True. It is the basic building block of decision making.", syntax: "if condition:\n    statement", examples: ["if age >= 18: print(\"Adult\")", "if score >= 50: print(\"Pass\")", "if logged_in: print(\"Dashboard\")"], use: "Used to make a program react differently to different conditions." },
  "if-else": { explanation: "if-else provides two paths: one for a True condition and another for False.", syntax: "if condition:\n    ...\nelse:\n    ...", examples: ["if age >= 18: print(\"Adult\")\nelse: print(\"Minor\")", "if marks >= 40: print(\"Pass\")\nelse: print(\"Fail\")", "if online: print(\"Active\")\nelse: print(\"Offline\")"], use: "Used when exactly two outcomes are possible." },
  "if-elif-else": { explanation: "if-elif-else checks multiple conditions in order and runs the first matching block.", syntax: "if condition1:\n    ...\nelif condition2:\n    ...\nelse:\n    ...", examples: ["if m >= 90: grade=\"A\"\nelif m >= 75: grade=\"B\"\nelse: grade=\"C\"", "if age < 13: group=\"Child\"\nelif age < 18: group=\"Teen\"\nelse: group=\"Adult\"", "if temp > 35: status=\"Hot\"\nelif temp > 20: status=\"Warm\"\nelse: status=\"Cool\""], use: "Used when a decision has three or more possible outcomes." },
  "nested if": { explanation: "A nested if is an if statement placed inside another if block. The inner decision is checked only after the outer condition succeeds.", syntax: "if condition1:\n    if condition2:\n        ...", examples: ["if age >= 18:\n    if citizen: print(\"Eligible\")", "if logged_in:\n    if admin: print(\"Admin Panel\")", "if score >= 50:\n    if attendance >= 75: print(\"Pass\")"], use: "Used for dependent decisions where one condition must be satisfied before checking another." },
  "for loop": { explanation: "A for loop repeats a block for each item in a sequence or for each value produced by an iterator.", syntax: "for item in sequence:\n    statement", examples: ["for i in range(5): print(i)", "for name in names: print(name)", "for n in [2,4,6]: print(n)"], use: "Used when you want to process every item in a collection or repeat a known number of times." },
  "while loop": { explanation: "A while loop keeps running as long as its condition remains True. The condition is checked before each iteration.", syntax: "while condition:\n    statement", examples: ["while count < 5: count += 1", "while password != correct: password = input(\"Try again: \")", "while balance > 0: balance -= 10"], use: "Used when the number of repetitions depends on a changing condition." },
  "nested loop": { explanation: "A nested loop is a loop inside another loop. The inner loop runs completely for each iteration of the outer loop.", syntax: "for x in items:\n    for y in items:\n        ...", examples: ["for i in range(3):\n    for j in range(2): print(i,j)", "for row in matrix:\n    for value in row: print(value)", "for a in [1,2]:\n    for b in [3,4]: print(a,b)"], use: "Used for grids, matrices, combinations and multi-level data." },
  "function without arguments": { explanation: "A function without arguments performs a reusable task without receiving input values from the caller.", syntax: "def greet():\n    statement", examples: ["def greet(): print(\"Hello\")", "def show_menu(): print(\"Menu\")", "def welcome(): print(\"Welcome\")"], use: "Used for reusable actions that do not need external input." },
  "function with arguments": { explanation: "A function with arguments receives values from the caller, making the same function reusable with different inputs.", syntax: "def add(a, b):\n    return a + b", examples: ["def greet(name): print(\"Hi\", name)", "def add(a,b): return a+b", "def square(n): return n*n"], use: "Used when a task must work with different input values." },
  "function with return": { explanation: "A function with return sends a result back to the caller. The returned value can be stored, printed or used in another calculation.", syntax: "def function():\n    return value", examples: ["def add(a,b): return a+b", "def get_name(): return \"Malli\"", "def is_even(n): return n % 2 == 0"], use: "Used when a function needs to produce a result for another part of the program." },
  "lambda": { explanation: "A lambda is a small anonymous function written in a single expression. It is useful for short operations passed to functions such as map, filter and sorted.", syntax: "lambda arguments: expression", examples: ["square = lambda x: x*x", "add = lambda a,b: a+b", "names = sorted(names, key=lambda x: len(x))"], use: "Used for short one-line functions where creating a full def function would be unnecessary." },
  "class/object": { explanation: "A class is a blueprint that defines data and behavior. An object is a real instance created from that class.", syntax: "class Student:\n    pass", examples: ["class Student: pass", "s = Student()", "s.name = \"Malli\""], use: "Used to model real-world entities and organize related data and behavior." },
  "inheritance": { explanation: "Inheritance allows a child class to reuse and extend attributes or methods of a parent class.", syntax: "class Child(Parent):\n    ...", examples: ["class Dog(Animal): pass", "class Admin(User): pass", "class Car(Vehicle): pass"], use: "Used to reuse common functionality while creating specialized classes." },
  "encapsulation": { explanation: "Encapsulation keeps related data and methods together and controls how internal data is accessed or changed.", syntax: "class Account:\n    def __init__(self):\n        self._balance = 0", examples: ["account._balance = 100", "def deposit(self, amount): self._balance += amount", "Use properties to control access"], use: "Used to protect internal state and expose safe operations." },
  "polymorphism": { explanation: "Polymorphism means the same operation or method name can work with different object types in different ways.", syntax: "obj.method()", examples: ["dog.speak()", "cat.speak()", "for shape in shapes: shape.area()"], use: "Used to write flexible code that works with multiple related object types." },
  "abstraction": { explanation: "Abstraction exposes essential behavior while hiding unnecessary implementation details.", syntax: "abstract class -> required methods", examples: ["Payment.pay()", "Car.start()", "model.predict(data)"], use: "Used to simplify complex systems by showing users only what they need." },
  "SELECT": { explanation: "SELECT retrieves data from one or more SQL tables. It is the main command used for reading data.", syntax: "SELECT columns FROM table;", examples: ["SELECT * FROM students;", "SELECT name FROM students;", "SELECT name, age FROM students WHERE age > 18;"], use: "Used to view and analyze stored database records." },
  "INSERT": { explanation: "INSERT adds new rows to a database table.", syntax: "INSERT INTO table (columns) VALUES (values);", examples: ["INSERT INTO students VALUES (1, 'Malli');", "INSERT INTO users(name) VALUES ('Asha');", "INSERT INTO marks VALUES (1, 90);"], use: "Used when creating new records such as users, orders or appointments." },
  "UPDATE": { explanation: "UPDATE changes existing rows in a table. A WHERE condition is normally used to target specific records.", syntax: "UPDATE table SET column=value WHERE condition;", examples: ["UPDATE users SET age=22 WHERE id=1;", "UPDATE marks SET score=95 WHERE id=2;", "UPDATE products SET price=500 WHERE id=3;"], use: "Used to modify existing database information." },
  "DELETE": { explanation: "DELETE removes rows from a table. A WHERE condition should be used carefully to avoid deleting unintended rows.", syntax: "DELETE FROM table WHERE condition;", examples: ["DELETE FROM users WHERE id=1;", "DELETE FROM orders WHERE status='Cancelled';", "DELETE FROM students WHERE age < 5;"], use: "Used to remove records that are no longer required." },
  "CREATE": { explanation: "CREATE defines a new database object such as a table, database or view.", syntax: "CREATE TABLE table_name (...);", examples: ["CREATE TABLE students(id INT, name TEXT);", "CREATE TABLE users(id INT PRIMARY KEY);", "CREATE DATABASE college;"], use: "Used when setting up database structures." },
  "GET": { explanation: "GET is used to retrieve data from a server or API endpoint without changing the resource.", syntax: "GET /users", examples: ["GET /users", "GET /users/10", "GET /products?category=books"], use: "Used for reading data in REST APIs." },
  "POST": { explanation: "POST sends data to a server, commonly to create a new resource or trigger an action.", syntax: "POST /users + request body", examples: ["POST /users", "POST /login", "POST /appointments"], use: "Used for creating records and submitting data." },
  "PUT": { explanation: "PUT replaces or fully updates a resource at a known URL.", syntax: "PUT /users/10 + full body", examples: ["PUT /users/10", "PUT /products/5", "PUT /profile/1"], use: "Used when the client wants to update a complete resource." },
  "PATCH": { explanation: "PATCH updates only selected fields of an existing resource.", syntax: "PATCH /users/10 + partial body", examples: ["PATCH /users/10", "PATCH /profile/1", "PATCH /orders/5"], use: "Used for partial updates when only a few fields need changing." },
  "RIGHT JOIN": { explanation: "RIGHT JOIN returns all rows from the right table and matching rows from the left table.", syntax: "SELECT ... FROM A RIGHT JOIN B ON A.id=B.id;", examples: ["A RIGHT JOIN B", "employees RIGHT JOIN departments", "orders RIGHT JOIN customers"], use: "Used when every row from the right-side table must be preserved." },
  "LEFT JOIN": { explanation: "LEFT JOIN returns every row from the left table and matching rows from the right table.", syntax: "SELECT ... FROM A LEFT JOIN B ON A.id=B.id;", examples: ["customers LEFT JOIN orders", "students LEFT JOIN marks", "users LEFT JOIN profiles"], use: "Used when the left table is the primary list and missing matches should still appear." },
  "INNER JOIN": { explanation: "INNER JOIN returns only rows where matching values exist in both tables.", syntax: "SELECT ... FROM A INNER JOIN B ON A.id=B.id;", examples: ["students INNER JOIN marks", "users INNER JOIN orders", "employees INNER JOIN departments"], use: "Used when only matching records are relevant." },
  "FULL JOIN": { explanation: "FULL JOIN returns matching rows plus unmatched rows from both tables.", syntax: "SELECT ... FROM A FULL JOIN B ON A.id=B.id;", examples: ["A FULL JOIN B", "students FULL JOIN marks", "customers FULL JOIN orders"], use: "Used when you need all records from both sides, even when a match is missing." },
};

function getTypeDetails(type, conceptName) {
  const clean = String(type).split(" - ")[0].trim();

  const aliases = {
    "function with return value": "function with return",
    "lambda function": "lambda",
    "class and object": "class/object",
    "GET endpoint": "GET",
    "POST endpoint": "POST",
    "PUT endpoint": "PUT",
    "DELETE endpoint": "DELETE",
    "GET - read": "GET",
    "POST - create": "POST",
    "PUT - replace/update": "PUT",
    "PATCH - partial update": "PATCH",
    "DELETE - remove": "DELETE",
  };
  const lookup = aliases[clean] || clean;
  if (TYPE_DETAILS[lookup]) return TYPE_DETAILS[lookup];

  const templates = {
    "HTML elements": ["<h1>Welcome</h1>", "<p>Learn HTML</p>", "<button>Login</button>"],
    "forms": ["<form><input type=\"text\" /></form>", "<form><input type=\"email\" /></form>", "<form><button type=\"submit\">Submit</button></form>"],
    "CSS selectors": [".card { padding: 20px; }", "#title { font-size: 24px; }", "button:hover { opacity: .8; }"],
    "flexbox": ["display: flex; justify-content: center;", "display: flex; gap: 20px;", "display: flex; align-items: center;"],
    "grid": ["display: grid; grid-template-columns: 1fr 1fr;", "display: grid; gap: 16px;", "grid-template-columns: repeat(3, 1fr);"],
    "responsive design": ["@media (max-width: 768px) { .card { width: 100%; } }", "@media (max-width: 600px) { nav { display: none; } }", "@media (min-width: 1024px) { .container { max-width: 1100px; } }"],
    "variables": ["let name = 'Malli';", "const age = 21;", "var city = 'Kakinada';"],
    "functions": ["function add(a,b) { return a+b; }", "function greet() { console.log('Hi'); }", "const square = n => n*n;"],
    "arrays": ["const nums = [1,2,3];", "nums.push(4);", "nums.map(n => n*2);"],
    "objects": ["const user = {name: 'Malli'};", "user.age = 21;", "console.log(user.name);"],
    "events": ["button.addEventListener('click', save);", "input.addEventListener('change', validate);", "form.addEventListener('submit', submitForm);"],
    "async/await": ["const data = await fetch('/users');", "const res = await api.get('/jobs');", "const result = await loadData();"],
    "functional components": ["function Home(){ return <h1>Home</h1>; }", "const Card = () => <div>Card</div>;", "function Profile(){ return <p>Profile</p>; }"],
    "props": ["<User name=\"Malli\" />", "<Card title=\"Python\" />", "<Button text=\"Login\" />"],
    "state": ["const [count,setCount] = useState(0);", "const [name,setName] = useState('');", "const [open,setOpen] = useState(false);"],
    "event handlers": ["<button onClick={save}>Save</button>", "<input onChange={handleChange} />", "<form onSubmit={handleSubmit}>"],
    "useState": ["const [count,setCount] = useState(0);", "const [name,setName] = useState('Malli');", "const [open,setOpen] = useState(false);"],
    "useEffect": ["useEffect(() => { loadData(); }, []);", "useEffect(() => { document.title = name; }, [name]);", "useEffect(() => { return cleanup; }, []);"],
    "useMemo": ["const total = useMemo(() => a+b, [a,b]);", "const filtered = useMemo(() => filter(data), [data]);", "const value = useMemo(() => expensive(), [input]);"],
    "useRef": ["const inputRef = useRef(null);", "inputRef.current.focus();", "const timerRef = useRef(null);"],
    "custom hooks": ["function useAuth(){ return auth; }", "function useFetch(url){ /* fetch */ }", "function useTheme(){ return theme; }"],
    "GET request": ["fetch('/users');", "fetch('/jobs');", "fetch('/products');"],
    "POST request": ["fetch('/users',{method:'POST'});", "fetch('/login',{method:'POST'});", "fetch('/appointments',{method:'POST'});"],
    "authenticated request": ["fetch('/profile',{headers:{Authorization: token}});", "api.get('/jobs', config);", "fetch('/admin',{headers:{Authorization: `Bearer ${token}`}});"],
    "JSON response": ["const data = await response.json();", "return Response.json({ok:true});", "JSON.parse(text);"],
    "connection": ["conn = connect(DB_URL)", "db = create_engine(URL)", "client = MongoClient(URL)"],
    "query": ["SELECT * FROM users;", "SELECT name FROM jobs;", "SELECT COUNT(*) FROM orders;"],
    "insert": ["INSERT INTO users VALUES (1,'Malli');", "df.to_sql('users', con=engine);", "db.users.insert_one({'name':'Malli'})"],
    "update": ["UPDATE users SET age=21 WHERE id=1;", "df.loc[0,'age']=21", "db.users.update_one({'id':1},{'$set':{'age':21}})"],
    "delete": ["DELETE FROM users WHERE id=1;", "df.drop(index=0)", "db.users.delete_one({'id':1})"],
    "formulas": ["=SUM(B2:B10)", "=AVERAGE(C2:C10)", "=IF(D2>=50,\"Pass\",\"Fail\")"],
    "functions": ["=SUM(A1:A10)", "=COUNT(B2:B20)", "=IF(C2>50,\"Yes\",\"No\")"],
    "sorting": ["Sort Sales from largest to smallest", "Sort Names A to Z", "Sort Date from newest to oldest"],
    "filtering": ["Filter Sales > 5000", "Filter Region = South", "Filter Status = Active"],
    "pivot tables": ["Rows=Region, Values=Sales", "Rows=Department, Values=Count", "Rows=Month, Columns=Product, Values=Revenue"],
    "charts": ["Bar chart for sales", "Line chart for monthly trend", "Pie chart for category share"],
    "WHERE": ["SELECT * FROM users WHERE age > 18;", "WHERE city = 'Kakinada'", "WHERE score BETWEEN 50 AND 100"],
    "GROUP BY": ["SELECT city, COUNT(*) FROM users GROUP BY city;", "GROUP BY department", "GROUP BY product"],
    "ORDER BY": ["ORDER BY salary DESC", "ORDER BY name ASC", "ORDER BY date DESC"],
    "JOIN": ["users JOIN orders ON users.id=orders.user_id", "students JOIN marks ON students.id=marks.id", "products JOIN sales ON products.id=sales.product_id"],
    "subquery": ["SELECT * FROM users WHERE age > (SELECT AVG(age) FROM users);", "WHERE salary > (SELECT AVG(salary) FROM employees)", "WHERE id IN (SELECT user_id FROM orders)"],
    "Series": ["pd.Series([10,20,30])", "pd.Series(['A','B','C'])", "pd.Series([1,2,3], name='Marks')"],
    "DataFrame": ["pd.DataFrame({'Name':['A','B']})", "df.head()", "df[['Name','Age']]"],
    "filtering": ["df[df['Age'] > 18]", "df[df['City'] == 'Kakinada']", "df[df['Marks'] >= 50]"],
    "grouping": ["df.groupby('City')['Sales'].sum()", "df.groupby('Dept').size()", "df.groupby('Product')['Revenue'].mean()"],
    "merging": ["pd.merge(customers, orders, on='id')", "pd.merge(a,b,on='user_id')", "pd.concat([df1,df2])"],
    "missing values": ["df.isna().sum()", "df.fillna(0)", "df.dropna()"],
    "duplicates": ["df.duplicated().sum()", "df.drop_duplicates()", "df.drop_duplicates(subset=['email'])"],
    "wrong data types": ["df['Age'] = df['Age'].astype(int)", "pd.to_numeric(df['Price'])", "pd.to_datetime(df['Date'])"],
    "outliers": ["df[df['Salary'] > 100000]", "IQR method for outliers", "Z-score method for outliers"],
    "inconsistent text": ["df['City'].str.strip()", "df['Name'].str.lower()", "df['State'].replace({'AP':'Andhra Pradesh'})"],
    "mean": ["df['Marks'].mean()", "mean = sum(values)/len(values)", "average salary = total salary / employees"],
    "median": ["df['Marks'].median()", "median of [10,20,30] = 20", "median is robust to extreme values"],
    "mode": ["df['City'].mode()", "mode of [A,A,B] = A", "most common category = mode"],
    "data import": ["pd.read_csv('data.csv')", "Excel -> Power BI", "SQL database -> Power BI"],
    "Power Query": ["Remove Columns", "Replace Values", "Change Data Type"],
    "data model": ["Fact Sales -> Dim Product", "Customer -> Orders relationship", "One-to-many relationship"],
    "DAX": ["Total Sales = SUM(Sales[Amount])", "Avg Sales = AVERAGE(Sales[Amount])", "Count Customers = COUNTROWS(Customers)"],
    "visuals": ["Bar chart for revenue", "Line chart for trend", "Card for total sales"],
    "dashboard": ["Sales KPI dashboard", "HR analytics dashboard", "Student performance dashboard"],
    "supervised learning": ["model.fit(X_train, y_train)", "Predict house price from labeled data", "Classify email as spam/not spam"],
    "unsupervised learning": ["KMeans(n_clusters=3)", "Group customers by behavior", "Find patterns without labels"],
    "reinforcement learning": ["agent -> action -> reward", "Robot learns by reward", "Game agent improves from feedback"],
    "training set": ["X_train, y_train", "80% data for learning", "model.fit(X_train, y_train)"],
    "test set": ["X_test, y_test", "model.predict(X_test)", "Evaluate unseen examples"],
    "validation set": ["Tune hyperparameters", "Compare model versions", "Validate before final testing"],
    "linear regression": ["LinearRegression().fit(X,y)", "Predict salary from experience", "y = mx + c"],
    "multiple regression": ["Predict price from area + rooms", "LinearRegression().fit(X_multi,y)", "y = b0+b1x1+b2x2"],
    "polynomial regression": ["PolynomialFeatures(2)", "Fit curved trend", "y = b0+b1x+b2x²"],
    "binary classification": ["spam vs not spam", "0 or 1 prediction", "LogisticRegression().fit(X,y)"],
    "multiclass classification": ["cat/dog/bird", "class 0/1/2", "model.predict(X_test)"],
    "K-Means": ["KMeans(n_clusters=3)", "Customer segmentation", "Assign points to nearest centroid"],
    "hierarchical clustering": ["AgglomerativeClustering()", "Build a cluster tree", "Merge closest groups step by step"],
    "DBSCAN": ["DBSCAN(eps=.5, min_samples=5)", "Detect dense customer groups", "Identify noise points"],
    "1D arrays": ["np.array([1,2,3])", "arr.shape -> (3,)", "arr[0]"],
    "2D arrays": ["np.array([[1,2],[3,4]])", "arr.shape -> (2,2)", "arr[0,1]"],
    "vectorized operations": ["arr * 2", "arr + 10", "arr1 + arr2"],
    "matrix operations": ["A @ B", "A.T", "np.linalg.inv(A)"],
    "accuracy": ["accuracy_score(y_test,pred)", "correct / total", "Compare predicted vs actual labels"],
    "precision": ["precision_score(y,pred)", "TP / (TP+FP)", "Useful when false positives are costly"],
    "recall": ["recall_score(y,pred)", "TP / (TP+FN)", "Useful when missing positives is costly"],
    "F1-score": ["f1_score(y,pred)", "2*precision*recall/(precision+recall)", "Balance precision and recall"],
    "MAE": ["mean_absolute_error(y,pred)", "Average absolute error", "MAE = mean(|actual-predicted|)"],
    "RMSE": ["mean_squared_error(y,pred,squared=False)", "Square root of MSE", "Penalizes larger errors more"],
    "tokenization": ["word_tokenize('I love Python')", "Split text into words", "Convert sentence into tokens"],
    "stemming": ["playing -> play", "studies -> studi", "Reduce words to stems"],
    "lemmatization": ["better -> good", "running -> run", "Use dictionary-based base forms"],
    "text classification": ["spam vs ham", "positive vs negative", "topic classification"],
    "named entity recognition": ["Malli -> PERSON", "India -> LOCATION", "Microsoft -> ORGANIZATION"],
    "large language models": ["prompt -> LLM -> response", "Generate an answer", "Summarize a document"],
    "text generation": ["prompt='Write a summary'", "Generate an email", "Generate interview questions"],
    "image generation": ["prompt -> image model -> image", "Create a poster", "Generate a product concept"],
    "code generation": ["prompt -> Python code", "Generate SQL query", "Generate React component"],
    "RAG applications": ["documents -> chunks -> embeddings -> retrieval -> LLM", "Ask questions over PDFs", "Retrieve company policy before answering"],
    "login authentication": ["email + password -> verify", "login -> token", "invalid password -> reject"],
    "access token": ["Authorization: Bearer <token>", "token -> protected API", "short-lived access token"],
    "refresh token": ["refresh token -> new access token", "Keep session active", "Rotate refresh token"],
    "role-based authorization": ["admin -> dashboard", "user -> profile", "role -> permission check"],
  };

  const examples = templates[clean] || [
    `${clean}: basic example`,
    `${clean}: practical project example`,
    `${clean}: real-world use example`,
  ];
  return {
    explanation: `${clean} is an important part of ${conceptName}. Understand its purpose, the input it receives, the processing it performs, and the result it produces. This helps you use it correctly instead of only memorizing the definition.`,
    syntax: `${clean} -> input -> processing -> output`,
    examples: examples.slice(0, 3),
    use: `Used in ${conceptName} when a real program or data workflow needs this operation.`,
  };
}

function getConceptDeepInfo(concept) {
  const typeNames = concept.types.map((t) => String(t).split(" - ")[0]);
  return {
    why: `${concept.name} is important because it helps you understand how real programs are structured and how individual pieces work together. Instead of memorizing one-line definitions, focus on the purpose, the flow of execution, and when to choose each type.`,
    how: `Start with the input, apply the ${concept.name} rule or operation, and observe the output. Then compare the available types: ${typeNames.slice(0, 5).join(", ")}${typeNames.length > 5 ? ", and more" : ""}.`,
    flow: ["Input / Requirement", concept.name, "Decision / Processing", "Output / Result"],
  };
}

export default function Learning({
  topic,
  skills = [],
  missingSkills = [],
  onBack,
}) {
  const roadmap = useMemo(() => getRoadmap(topic), [topic]);

  const [selectedConcept, setSelectedConcept] = useState(null);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceResult, setPracticeResult] = useState(null);
  const [completedConcepts, setCompletedConcepts] = useState([]);
  const [openStage, setOpenStage] = useState(0);
  const [selectedType, setSelectedType] = useState(null);

  const allConcepts = roadmap.stages.flatMap((stage) => stage.concepts);

  const selected = selectedConcept
    ? allConcepts.find(
        (concept) => concept.name === selectedConcept
      )
    : null;

  const openConcept = (concept) => {
    setSelectedConcept(concept.name);
    setPracticeAnswer("");
    setPracticeResult(null);
    setSelectedType(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePractice = () => {
    if (!selected?.practice) return;

    const result = checkPracticeAnswer(
      practiceAnswer,
      selected.practice
    );

    setPracticeResult(result);

    if (result.correct) {
      setCompletedConcepts((previous) =>
        previous.includes(selected.name)
          ? previous
          : [...previous, selected.name]
      );
    }
  };

  const resetPractice = () => {
    setPracticeAnswer("");
    setPracticeResult(null);
  };

  const roadmapProgress =
    allConcepts.length > 0
      ? Math.round(
          (completedConcepts.filter((name) =>
            allConcepts.some((concept) => concept.name === name)
          ).length /
            allConcepts.length) *
            100
        )
      : 0;

  return (
    <div className="learning-page">
      <div className="learning-topbar">
        <button
          type="button"
          className="learning-back-button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <div className="learning-topbar-title">
          <span>PERSONALIZED LEARNING</span>
          <strong>{roadmap.title}</strong>
        </div>
      </div>

      {!selected ? (
        <>
          <section className="learning-hero">
            <div className="learning-hero-content">
              <span className="learning-eyebrow">
                ✦ ROADMAP FROM YOUR RESUME
              </span>

              <h1>
                {roadmap.icon} {roadmap.title}
              </h1>

              <p>{roadmap.description}</p>

              <div className="learning-tags">
                {skills.slice(0, 8).map((skill, index) => (
                  <span key={`${skill}-${index}`}>
                    ✓ {skill}
                  </span>
                ))}

                {skills.length === 0 && (
                  <span>✓ Personalized learning path</span>
                )}
              </div>
            </div>

            <div className="learning-progress-card">
              <span>YOUR PROGRESS</span>
              <strong>{roadmapProgress}%</strong>

              <div className="learning-progress-track">
                <div
                  style={{
                    width: `${roadmapProgress}%`,
                  }}
                />
              </div>

              <small>
                {completedConcepts.length} of{" "}
                {allConcepts.length} concepts completed
              </small>
            </div>
          </section>

          {missingSkills.length > 0 && (
            <section className="missing-skills-learning">
              <div>
                <span className="learning-eyebrow">
                  AI SKILL GAPS
                </span>
                <h2>Prioritize these skills</h2>
                <p>
                  These skills were identified as areas to improve
                  from your resume analysis.
                </p>
              </div>

              <div className="missing-learning-list">
                {missingSkills.slice(0, 10).map((skill, index) => (
                  <span key={`${skill}-${index}`}>
                    + {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="roadmap-section">
            <div className="roadmap-heading">
              <div>
                <span className="learning-eyebrow">
                  STEP-BY-STEP ROADMAP
                </span>
                <h2>Learn in the right order</h2>
                <p>
                  Click any concept to open its explanation, types,
                  examples and practice.
                </p>
              </div>
            </div>

            <div className="roadmap">
              {roadmap.stages.map((stage, stageIndex) => (
                <div className="roadmap-stage" key={stage.title}>
                  <button
                    type="button"
                    className={`stage-header ${
                      openStage === stageIndex ? "open" : ""
                    }`}
                    onClick={() =>
                      setOpenStage(
                        openStage === stageIndex ? -1 : stageIndex
                      )
                    }
                  >
                    <span className="stage-number">
                      {String(stageIndex + 1).padStart(2, "0")}
                    </span>

                    <span className="stage-title">
                      <strong>{stage.title}</strong>
                      <small>
                        {stage.concepts.length} concepts
                      </small>
                    </span>

                    <span className="stage-arrow">
                      {openStage === stageIndex ? "−" : "+"}
                    </span>
                  </button>

                  {openStage === stageIndex && (
                    <div className="concept-grid">
                      {stage.concepts.map((concept, conceptIndex) => {
                        const completed =
                          completedConcepts.includes(concept.name);

                        return (
                          <button
                            type="button"
                            className={`concept-card ${
                              completed ? "completed" : ""
                            }`}
                            key={concept.name}
                            onClick={() => openConcept(concept)}
                          >
                            <div className="concept-number">
                              {completed
                                ? "✓"
                                : `${stageIndex + 1}.${conceptIndex + 1}`}
                            </div>

                            <div className="concept-card-body">
                              <span>CONCEPT</span>
                              <h3>{concept.name}</h3>
                              <p>
                                {concept.explanation.slice(0, 110)}
                                ...
                              </p>
                              <strong>
                                Learn & Practice →
                              </strong>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="concept-page">
          <button
            type="button"
            className="concept-back"
            onClick={() => {
              setSelectedConcept(null);
              setSelectedType(null);
              resetPractice();
            }}
          >
            ← Back to roadmap
          </button>

          <div className="concept-hero">
            <span className="learning-eyebrow">CONCEPT</span>
            <h1>{selected.name}</h1>
            <p>{selected.explanation}</p>
          </div>

          <div className="concept-content-grid">
            <article className="concept-content-card">
              <div className="content-card-heading">
                <span>01</span>
                <div>
                  <small>UNDERSTAND</small>
                  <h2>What is {selected.name}?</h2>
                </div>
              </div>

              <div className="large-explanation">
                <p>{selected.explanation}</p>
                <div style={{ marginTop: "18px", display: "grid", gap: "14px" }}>
                  <div><strong>Why is it important?</strong><p>{getConceptDeepInfo(selected).why}</p></div>
                  <div><strong>How does it work?</strong><p>{getConceptDeepInfo(selected).how}</p></div>
                </div>
              </div>

              <div style={{ marginTop: "24px", padding: "18px", borderRadius: "16px", background: "linear-gradient(135deg,#f7f8ff,#eefbf7)", border: "1px solid #e4e7f0" }}>
                <strong style={{ display: "block", marginBottom: "14px" }}>Visual Learning Flow</strong>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
                  {getConceptDeepInfo(selected).flow.map((step, i, arr) => (
                    <React.Fragment key={step}>
                      <div style={{ padding: "12px 16px", borderRadius: "12px", background: "white", border: "1px solid #dfe3ee", fontWeight: 700 }}>{step}</div>
                      {i < arr.length - 1 && <span style={{ fontSize: "20px", fontWeight: 800 }}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </article>

            <article className="concept-content-card">
              <div className="content-card-heading">
                <span>02</span>
                <div>
                  <small>TYPES</small>
                  <h2>Types</h2>
                </div>
              </div>

              <div className="types-list">
                {selected.types.map((type, index) => {
                  const typeInfo = getTypeDetails(type, selected.name);
                  const cleanType = String(type).split(" - ")[0];
                  const isActive = selectedType?.type === cleanType;
                  return (
                    <button
                      type="button"
                      key={`${type}-${index}`}
                      onClick={() => setSelectedType({ type: cleanType, info: typeInfo })}
                      style={{ width: "100%", textAlign: "left", cursor: "pointer", border: isActive ? "2px solid #6c63ff" : "1px solid #e4e7f0", background: isActive ? "#f5f3ff" : "white", borderRadius: "14px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}
                    >
                      <span>{index + 1}</span>
                      <p style={{ margin: 0, flex: 1 }}><strong>{cleanType}</strong>{String(type).includes(" - ") ? ` — ${String(type).split(" - ").slice(1).join(" - ")}` : ""}</p>
                      <span>↗</span>
                    </button>
                  );
                })}
              </div>

              {selectedType && (
                <div style={{ marginTop: "18px", padding: "22px", borderRadius: "18px", background: "#fbfbff", border: "1px solid #dfe3ee" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
                    <div><small>TYPE EXPLANATION</small><h3 style={{ margin: "6px 0 0" }}>{selectedType.type}</h3></div>
                    <button type="button" onClick={() => setSelectedType(null)} style={{ border: 0, background: "transparent", cursor: "pointer", fontSize: "18px" }}>✕</button>
                  </div>
                  <p style={{ lineHeight: 1.7 }}>{selectedType.info.explanation}</p>
                  <div style={{ margin: "16px 0" }}>
                    <strong>Syntax</strong>
                    <pre style={{ marginTop: "8px", overflowX: "auto" }}><code>{selectedType.info.syntax}</code></pre>
                  </div>
                  <strong>3 Examples</strong>
                  <div style={{ display: "grid", gap: "10px", marginTop: "10px" }}>
                    {selectedType.info.examples.slice(0, 3).map((example, i) => (
                      <div key={i} style={{ padding: "12px 14px", background: "white", borderRadius: "12px", border: "1px solid #e4e7f0" }}>
                        <small>Example {i + 1}</small>
                        <pre style={{ margin: "8px 0 0", whiteSpace: "pre-wrap" }}><code>{example}</code></pre>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "16px", padding: "12px 14px", borderRadius: "12px", background: "#f2faf7" }}><strong>Real-world use:</strong> {selectedType.info.use}</div>
                </div>
              )}
            </article>
          </div>

          <article className="examples-card">
            <div className="content-card-heading">
              <span>03</span>
              <div>
                <small>LEARN BY EXAMPLE</small>
                <h2>Examples</h2>
              </div>
            </div>

            <div className="examples-grid">
              {selected.examples.map((example, index) => (
                <div className="example-item" key={index}>
                  <div className="example-label">
                    Example {index + 1}
                  </div>

                  <pre>
                    <code>{example.code}</code>
                  </pre>

                  <p>{example.text}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="practice-card">
            <div className="practice-heading">
              <div>
                <span className="learning-eyebrow">
                  04 · PRACTICE
                </span>
                <h2>Now try it yourself 💻</h2>
                <p>
                  Write your answer below. The learning system checks
                  your answer and explains mistakes.
                </p>
              </div>

              <div className="practice-badge">
                INTERACTIVE
              </div>
            </div>

            <div className="practice-question">
              <span>QUESTION</span>
              <h3>{selected.practice.question}</h3>

              {selected.practice.starter && (
                <pre className="starter-code">
                  <code>{selected.practice.starter}</code>
                </pre>
              )}
            </div>

            <textarea
              className="practice-editor"
              value={practiceAnswer}
              onChange={(event) => {
                setPracticeAnswer(event.target.value);
                setPracticeResult(null);
              }}
              placeholder="Write your answer here..."
              spellCheck="false"
            />

            <div className="practice-actions">
              <button
                type="button"
                className="check-answer-button"
                onClick={handlePractice}
              >
                Check My Answer →
              </button>

              <button
                type="button"
                className="reset-answer-button"
                onClick={resetPractice}
              >
                Clear
              </button>
            </div>

            <div className="hint-box">
              <strong>💡 Hint</strong>
              <p>{selected.practice.hint}</p>
            </div>

            {practiceResult && (
              <div
                className={`practice-result ${
                  practiceResult.correct
                    ? "correct"
                    : "incorrect"
                }`}
              >
                <div className="result-icon">
                  {practiceResult.correct ? "✓" : "!"}
                </div>

                <div className="result-content">
                  <h3>{practiceResult.title}</h3>
                  <p>{practiceResult.message}</p>

                  {!practiceResult.correct &&
                    practiceResult.correction && (
                      <div className="correction-box">
                        <span>✓ CORRECTED ANSWER</span>
                        <pre>
                          <code>
                            {practiceResult.correction}
                          </code>
                        </pre>
                      </div>
                    )}

                  {practiceResult.correct && (
                    <button
                      type="button"
                      className="next-concept-button"
                      onClick={() => {
                        const currentIndex =
                          allConcepts.findIndex(
                            (concept) =>
                              concept.name === selected.name
                          );

                        const next =
                          allConcepts[currentIndex + 1];

                        if (next) {
                          openConcept(next);
                        } else {
                          setSelectedConcept(null);
                        }
                      }}
                    >
                      Next Concept →
                    </button>
                  )}
                </div>
              </div>
            )}
          </article>
        </section>
      )}
    </div>
  );
}
