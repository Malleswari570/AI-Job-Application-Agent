import React, { useEffect, useRef, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

/* =========================================================
   DOMAIN HELPERS
========================================================= */

const normalizeDomain = (value = "") => {
  const text = String(value).toLowerCase().trim();

  if (
    text.includes("data science") ||
    text.includes("data scientist")
  ) {
    return "Data Science";
  }

  if (
    text.includes("data analytics") ||
    text.includes("data analyst") ||
    text.includes("analytics")
  ) {
    return "Data Analytics";
  }

  if (
    text.includes("machine learning") ||
    text.includes("ml engineer") ||
    text.includes("machine learning engineer")
  ) {
    return "Machine Learning";
  }

  if (
    text.includes("artificial intelligence") ||
    text.includes("ai engineer") ||
    text === "ai" ||
    text.includes("generative ai")
  ) {
    return "AI / ML";
  }

  if (
    text.includes("python full stack") ||
    text.includes("python fullstack") ||
    text.includes("full stack python")
  ) {
    return "Python Full Stack";
  }

  if (
    text.includes("python developer") ||
    text.includes("python development")
  ) {
    return "Python Developer";
  }

  if (
    text.includes("web developer") ||
    text.includes("frontend") ||
    text.includes("backend developer")
  ) {
    return "Web Development";
  }

  if (
    text.includes("software developer") ||
    text.includes("software engineer")
  ) {
    return "Software Development";
  }

  return value || "";
};


/* =========================================================
   QUESTION DATABASE
========================================================= */

const QUESTION_BANK = {

  "Data Science": {
    aptitude: [
      {
        question:
          "A dataset contains 1,000 records and 20% contain missing values. How many records contain missing values?",
        options: ["100", "150", "200", "250"],
        answer: "200",
      },
      {
        question:
          "What is the average of 10, 20, 30, 40 and 50?",
        options: ["20", "25", "30", "35"],
        answer: "30",
      },
      {
        question:
          "If a model correctly predicts 90 out of 100 records, what is its accuracy?",
        options: ["80%", "85%", "90%", "95%"],
        answer: "90%",
      },
      {
        question:
          "Which measure is generally less affected by extreme outliers?",
        options: ["Mean", "Median", "Variance", "Standard deviation"],
        answer: "Median",
      },
      {
        question:
          "If 25% of 400 observations are removed, how many remain?",
        options: ["100", "200", "300", "350"],
        answer: "300",
      },
    ],

    coding: [
      {
        title: "Calculate Mean",
        description:
          "Write a Python program to calculate the mean of a list of numbers.",
        example:
          "Input: [10, 20, 30, 40]\nOutput: 25.0",
        starter:
          "numbers = [10, 20, 30, 40]\n\n# Write your code here",
        keywords: ["sum", "len", "mean"],
      },
      {
        title: "Find Missing Values",
        description:
          "Write Python code to count missing values in a list.",
        example:
          "Input: [10, None, 20, None]\nOutput: 2",
        starter:
          "data = [10, None, 20, None]\n\n# Write your code here",
        keywords: ["none", "count", "for"],
      },
    ],

    interview: [
      {
        type: "Introduction",
        question:
          "Tell me about yourself and your background in Data Science.",
      },
      {
        type: "Python",
        question:
          "How is Python used in Data Science? Explain libraries such as NumPy and Pandas.",
      },
      {
        type: "Statistics",
        question:
          "What is the difference between mean, median and mode?",
      },
      {
        type: "Machine Learning",
        question:
          "What is the difference between supervised and unsupervised learning?",
      },
      {
        type: "Data Preprocessing",
        question:
          "How do you handle missing values and duplicate records in a dataset?",
      },
      {
        type: "Machine Learning",
        question:
          "What is overfitting and how can you reduce it?",
      },
      {
        type: "Project",
        question:
          "Explain one of your AI, Machine Learning or Data Science projects.",
      },
      {
        type: "HR",
        question:
          "Why should we hire you for a Data Science role?",
      },
    ],
  },


  "Data Analytics": {
    aptitude: [
      {
        question:
          "A company has 500 customers and 20% are inactive. How many customers are active?",
        options: ["100", "300", "400", "450"],
        answer: "400",
      },
      {
        question:
          "What is 15% of 600?",
        options: ["60", "75", "90", "120"],
        answer: "90",
      },
      {
        question:
          "Sales increased from 200 to 250. What is the percentage increase?",
        options: ["20%", "25%", "30%", "50%"],
        answer: "25%",
      },
      {
        question:
          "Which value represents the middle observation in ordered data?",
        options: ["Mean", "Median", "Mode", "Range"],
        answer: "Median",
      },
      {
        question:
          "If 80 out of 100 customers are satisfied, what is the satisfaction percentage?",
        options: ["60%", "70%", "80%", "90%"],
        answer: "80%",
      },
    ],

    coding: [
      {
        title: "Find Maximum Sales",
        description:
          "Write Python code to find the maximum sales value from a list.",
        example:
          "Input: [100, 250, 180, 400]\nOutput: 400",
        starter:
          "sales = [100, 250, 180, 400]\n\n# Write your code here",
        keywords: ["max", "for", "return"],
      },
      {
        title: "Calculate Average",
        description:
          "Write Python code to calculate the average of numbers.",
        example:
          "Input: [10, 20, 30]\nOutput: 20",
        starter:
          "numbers = [10, 20, 30]\n\n# Write your code here",
        keywords: ["sum", "len", "average"],
      },
    ],

    interview: [
      {
        type: "Introduction",
        question:
          "Tell me about yourself and your interest in Data Analytics.",
      },
      {
        type: "SQL",
        question:
          "What is a SQL JOIN? Explain INNER JOIN and LEFT JOIN.",
      },
      {
        type: "Excel",
        question:
          "Which Excel functions have you used for data analysis?",
      },
      {
        type: "Power BI",
        question:
          "What is Power BI and how is it useful for data visualization?",
      },
      {
        type: "Data Cleaning",
        question:
          "How do you clean a dataset before performing analysis?",
      },
      {
        type: "Statistics",
        question:
          "What is the difference between mean and median?",
      },
      {
        type: "Project",
        question:
          "Explain a data analytics project you have worked on.",
      },
      {
        type: "HR",
        question:
          "Why should we hire you for a Data Analyst role?",
      },
    ],
  },


  "Machine Learning": {
    aptitude: [
      {
        question:
          "Which value is commonly used to measure classification accuracy?",
        options: [
          "Correct predictions / total predictions",
          "Total / incorrect",
          "Mean / median",
          "Variance / mean",
        ],
        answer: "Correct predictions / total predictions",
      },
      {
        question:
          "What happens when a model performs very well on training data but poorly on test data?",
        options: [
          "Underfitting",
          "Overfitting",
          "Normalization",
          "Encoding",
        ],
        answer: "Overfitting",
      },
      {
        question:
          "What percentage is 80 out of 100?",
        options: ["60%", "70%", "80%", "90%"],
        answer: "80%",
      },
      {
        question:
          "Which is a supervised learning algorithm?",
        options: [
          "Linear Regression",
          "K-Means",
          "PCA",
          "Apriori",
        ],
        answer: "Linear Regression",
      },
      {
        question:
          "If a dataset has 1,000 rows and 80% is used for training, how many rows are used for training?",
        options: ["600", "700", "800", "900"],
        answer: "800",
      },
    ],

    coding: [
      {
        title: "Calculate Prediction Accuracy",
        description:
          "Write Python code to calculate accuracy from correct and total predictions.",
        example:
          "Correct = 85, Total = 100\nOutput: 85",
        starter:
          "correct = 85\ntotal = 100\n\n# Write your code here",
        keywords: ["correct", "total", "accuracy"],
      },
      {
        title: "Calculate Mean",
        description:
          "Write Python code to calculate the mean of numerical data.",
        example:
          "Input: [2, 4, 6]\nOutput: 4",
        starter:
          "data = [2, 4, 6]\n\n# Write your code here",
        keywords: ["sum", "len", "mean"],
      },
    ],

    interview: [
      {
        type: "Introduction",
        question:
          "Tell me about yourself and your Machine Learning background.",
      },
      {
        type: "Machine Learning",
        question:
          "What is Machine Learning and what are its main types?",
      },
      {
        type: "Algorithms",
        question:
          "Explain the difference between classification and regression.",
      },
      {
        type: "Model Evaluation",
        question:
          "What are accuracy, precision, recall and F1-score?",
      },
      {
        type: "Overfitting",
        question:
          "What is overfitting and how can you prevent it?",
      },
      {
        type: "Feature Engineering",
        question:
          "What is feature engineering and why is it important?",
      },
      {
        type: "Project",
        question:
          "Explain your Machine Learning project and the model you used.",
      },
      {
        type: "HR",
        question:
          "Why should we hire you for a Machine Learning role?",
      },
    ],
  },


  "AI / ML": {
    aptitude: [
      {
        question:
          "What does AI primarily aim to create?",
        options: [
          "Intelligent systems",
          "Only databases",
          "Only websites",
          "Only spreadsheets",
        ],
        answer: "Intelligent systems",
      },
      {
        question:
          "What percentage is 45 out of 50?",
        options: ["70%", "80%", "90%", "95%"],
        answer: "90%",
      },
      {
        question:
          "Which technique is commonly used in NLP?",
        options: [
          "Tokenization",
          "Sorting only",
          "Binary search",
          "Stacking",
        ],
        answer: "Tokenization",
      },
      {
        question:
          "Which is commonly used to represent text numerically?",
        options: [
          "Embeddings",
          "HTML",
          "CSS",
          "JSON only",
        ],
        answer: "Embeddings",
      },
      {
        question:
          "If 30% of 500 records are selected, how many records are selected?",
        options: ["100", "150", "200", "250"],
        answer: "150",
      },
    ],

    coding: [
      {
        title: "Count Words",
        description:
          "Write Python code to count words in a sentence.",
        example:
          'Input: "Python is easy"\nOutput: 3',
        starter:
          'text = "Python is easy"\n\n# Write your code here',
        keywords: ["split", "len", "count"],
      },
      {
        title: "Reverse Text",
        description:
          "Write Python code to reverse a string.",
        example:
          'Input: "AI"\nOutput: "IA"',
        starter:
          'text = "AI"\n\n# Write your code here',
        keywords: ["[::-1]", "reverse", "reversed"],
      },
    ],

    interview: [
      {
        type: "Introduction",
        question:
          "Tell me about yourself and your background in Artificial Intelligence and Machine Learning.",
      },
      {
        type: "AI",
        question:
          "What is Artificial Intelligence and how is it different from Machine Learning?",
      },
      {
        type: "Machine Learning",
        question:
          "Explain supervised and unsupervised learning.",
      },
      {
        type: "NLP",
        question:
          "What is Natural Language Processing and where is it used?",
      },
      {
        type: "Generative AI",
        question:
          "What is Generative AI? Explain with an example.",
      },
      {
        type: "LLM",
        question:
          "What is an LLM and how does it process text?",
      },
      {
        type: "Project",
        question:
          "Explain your AI Job Application Agent or another AI project.",
      },
      {
        type: "HR",
        question:
          "Why should we hire you for an AI/ML role?",
      },
    ],
  },


  "Python Full Stack": {
    aptitude: [
      {
        question:
          "If 5 developers complete a task in 10 days, how many developer-days are required?",
        options: ["15", "30", "50", "100"],
        answer: "50",
      },
      {
        question:
          "What is 20% of 250?",
        options: ["25", "40", "50", "60"],
        answer: "50",
      },
      {
        question:
          "A SQL query returns 80 records and 25% are filtered out. How many remain?",
        options: ["20", "40", "60", "75"],
        answer: "60",
      },
      {
        question:
          "Which number comes next: 2, 4, 8, 16, ?",
        options: ["20", "24", "30", "32"],
        answer: "32",
      },
      {
        question:
          "If x = 5, what is x² + 2x?",
        options: ["25", "30", "35", "40"],
        answer: "35",
      },
    ],

    coding: [
      {
        title: "Reverse a String",
        description:
          "Write a Python program to reverse a given string.",
        example:
          'Input: "python"\nOutput: "nohtyp"',
        starter:
          'text = input()\n\n# Write your code here',
        keywords: ["[::-1]", "reverse", "reversed"],
      },
      {
        title: "Find Maximum Number",
        description:
          "Write a Python program to find the maximum number from a list.",
        example:
          "Input: [10, 25, 7, 40]\nOutput: 40",
        starter:
          "numbers = [10, 25, 7, 40]\n\n# Write your code here",
        keywords: ["max", "for", "sort"],
      },
    ],

    interview: [
      {
        type: "Introduction",
        question:
          "Tell me about yourself and your Python Full Stack development background.",
      },
      {
        type: "Python",
        question:
          "What are the differences between list, tuple, set and dictionary in Python?",
      },
      {
        type: "Backend",
        question:
          "Why would you use FastAPI for backend development?",
      },
      {
        type: "Database",
        question:
          "What is a SQL JOIN? Explain different types of JOINs.",
      },
      {
        type: "React",
        question:
          "What are React components and why are they useful?",
      },
      {
        type: "API",
        question:
          "What is a REST API and how does a frontend communicate with a backend?",
      },
      {
        type: "Project",
        question:
          "Explain your AI Job Application Agent project and the problem it solves.",
      },
      {
        type: "HR",
        question:
          "Why should we hire you for a Python Full Stack Developer role?",
      },
    ],
  },


  "Python Developer": {
    aptitude: [
      {
        question:
          "Which number comes next: 2, 4, 8, 16, ?",
        options: ["20", "24", "30", "32"],
        answer: "32",
      },
      {
        question:
          "What is 20% of 250?",
        options: ["25", "40", "50", "60"],
        answer: "50",
      },
      {
        question:
          "If x = 5, what is x² + 2x?",
        options: ["25", "30", "35", "40"],
        answer: "35",
      },
      {
        question:
          "If 5 developers complete a task in 10 days, how many developer-days are required?",
        options: ["15", "30", "50", "100"],
        answer: "50",
      },
      {
        question:
          "What is the average of 10, 20, 30 and 40?",
        options: ["20", "25", "30", "35"],
        answer: "25",
      },
    ],

    coding: [
      {
        title: "Check Palindrome",
        description:
          "Write a Python program to check whether a string is a palindrome.",
        example:
          'Input: "madam"\nOutput: Palindrome',
        starter:
          'text = input()\n\n# Write your code here',
        keywords: ["[::-1]", "palindrome", "reverse"],
      },
      {
        title: "Find Maximum",
        description:
          "Find the maximum number from a list using Python.",
        example:
          "Input: [10, 25, 40]\nOutput: 40",
        starter:
          "numbers = [10, 25, 40]\n\n# Write your code here",
        keywords: ["max", "for", "return"],
      },
    ],

    interview: [
      {
        type: "Introduction",
        question:
          "Tell me about yourself and your Python development experience.",
      },
      {
        type: "Python",
        question:
          "What are the main features of Python?",
      },
      {
        type: "Python",
        question:
          "Explain list, tuple, set and dictionary in Python.",
      },
      {
        type: "OOP",
        question:
          "What are the main concepts of Object-Oriented Programming?",
      },
      {
        type: "Exception Handling",
        question:
          "How does exception handling work in Python?",
      },
      {
        type: "API",
        question:
          "What is a REST API and how can Python be used to build one?",
      },
      {
        type: "Project",
        question:
          "Explain one of your Python projects.",
      },
      {
        type: "HR",
        question:
          "Why should we hire you as a Python Developer?",
      },
    ],
  },


  "Web Development": {
    aptitude: [
      {
        question:
          "Which language is primarily used to structure web pages?",
        options: ["HTML", "Python", "SQL", "Java"],
        answer: "HTML",
      },
      {
        question:
          "What is 25% of 400?",
        options: ["50", "75", "100", "125"],
        answer: "100",
      },
      {
        question:
          "Which number comes next: 5, 10, 20, 40, ?",
        options: ["50", "60", "70", "80"],
        answer: "80",
      },
      {
        question:
          "Which technology is commonly used for frontend UI?",
        options: ["React", "MySQL", "PostgreSQL", "FastAPI"],
        answer: "React",
      },
      {
        question:
          "If 80 out of 100 tests pass, what is the pass percentage?",
        options: ["60%", "70%", "80%", "90%"],
        answer: "80%",
      },
    ],

    coding: [
      {
        title: "Reverse a String",
        description:
          "Write JavaScript or Python code to reverse a string.",
        example:
          'Input: "hello"\nOutput: "olleh"',
        starter:
          'text = "hello"\n\n# Write your code here',
        keywords: ["reverse", "[::-1]", "reversed"],
      },
      {
        title: "Find Maximum",
        description:
          "Find the maximum value from an array/list.",
        example:
          "Input: [10, 20, 50]\nOutput: 50",
        starter:
          "numbers = [10, 20, 50]\n\n# Write your code here",
        keywords: ["max", "for", "return"],
      },
    ],

    interview: [
      {
        type: "Introduction",
        question:
          "Tell me about yourself and your web development background.",
      },
      {
        type: "Frontend",
        question:
          "What is React and why is it used?",
      },
      {
        type: "JavaScript",
        question:
          "What is the difference between let, const and var?",
      },
      {
        type: "Backend",
        question:
          "What is a REST API?",
      },
      {
        type: "Database",
        question:
          "What is the difference between SQL and NoSQL databases?",
      },
      {
        type: "Project",
        question:
          "Explain one of your web development projects.",
      },
      {
        type: "Problem Solving",
        question:
          "Describe a technical problem you solved.",
      },
      {
        type: "HR",
        question:
          "Why should we hire you for a Web Developer role?",
      },
    ],
  },


  "Software Development": {
    aptitude: [
      {
        question:
          "Which number comes next: 2, 4, 8, 16, ?",
        options: ["20", "24", "30", "32"],
        answer: "32",
      },
      {
        question:
          "What is 20% of 250?",
        options: ["25", "40", "50", "60"],
        answer: "50",
      },
      {
        question:
          "What is the average of 10, 20 and 30?",
        options: ["15", "20", "25", "30"],
        answer: "20",
      },
      {
        question:
          "If 80 of 100 test cases pass, what is the pass percentage?",
        options: ["60%", "70%", "80%", "90%"],
        answer: "80%",
      },
      {
        question:
          "A task requires 50 developer-days. With 5 developers, approximately how many days are required?",
        options: ["5", "10", "15", "20"],
        answer: "10",
      },
    ],

    coding: [
      {
        title: "Reverse a String",
        description:
          "Write a program to reverse a string.",
        example:
          'Input: "hello"\nOutput: "olleh"',
        starter:
          'text = input()\n\n# Write your code here',
        keywords: ["reverse", "[::-1]", "reversed"],
      },
      {
        title: "Find Maximum",
        description:
          "Find the maximum number from a list.",
        example:
          "Input: [10, 30, 20]\nOutput: 30",
        starter:
          "numbers = [10, 30, 20]\n\n# Write your code here",
        keywords: ["max", "for", "return"],
      },
    ],

    interview: [
      {
        type: "Introduction",
        question:
          "Tell me about yourself and your software development background.",
      },
      {
        type: "Programming",
        question:
          "Which programming languages and technologies are you comfortable with?",
      },
      {
        type: "OOP",
        question:
          "Explain the main concepts of Object-Oriented Programming.",
      },
      {
        type: "Database",
        question:
          "What is a SQL JOIN?",
      },
      {
        type: "API",
        question:
          "What is a REST API?",
      },
      {
        type: "Problem Solving",
        question:
          "Tell me about a difficult technical problem you solved.",
      },
      {
        type: "Project",
        question:
          "Explain one of your major projects.",
      },
      {
        type: "HR",
        question:
          "Why should we hire you for a Software Developer role?",
      },
    ],
  },
};


/* =========================================================
   GET RESUME DOMAIN
========================================================= */

const getResumeInformation = () => {
  let domain = "";
  let skills = [];

  try {
    domain =
      localStorage.getItem("resume_domain") || "";

    const storedSkills =
      localStorage.getItem("resume_skills");

    if (storedSkills) {
      const parsed = JSON.parse(storedSkills);

      if (Array.isArray(parsed)) {
        skills = parsed;
      }
    }
  } catch (error) {
    console.error(
      "Resume localStorage error:",
      error
    );
  }

  return {
    domain: normalizeDomain(domain),
    skills,
  };
};


/* =========================================================
   GET QUESTIONS BASED ON DOMAIN
========================================================= */

const getQuestionsForDomain = (domain) => {
  const normalized = normalizeDomain(domain);

  if (QUESTION_BANK[normalized]) {
    return QUESTION_BANK[normalized];
  }

  const domainText =
    normalized.toLowerCase();

  if (
    domainText.includes("data science")
  ) {
    return QUESTION_BANK["Data Science"];
  }

  if (
    domainText.includes("data")
  ) {
    return QUESTION_BANK["Data Analytics"];
  }

  if (
    domainText.includes("machine")
  ) {
    return QUESTION_BANK["Machine Learning"];
  }

  if (
    domainText.includes("ai")
  ) {
    return QUESTION_BANK["AI / ML"];
  }

  if (
    domainText.includes("python")
  ) {
    return QUESTION_BANK["Python Developer"];
  }

  if (
    domainText.includes("web") ||
    domainText.includes("frontend") ||
    domainText.includes("backend")
  ) {
    return QUESTION_BANK["Web Development"];
  }

  return QUESTION_BANK["Software Development"];
};


/* =========================================================
   MAKE 4 CODING QUESTIONS PER RESUME DOMAIN
========================================================= */

const buildCodingQuestions = (domain, baseQuestions = []) => {
  const normalized = normalizeDomain(domain);

  const extras = {
    "Data Science": [
      { title: "Calculate Median", description: "Write Python code to calculate the median of a list.", example: "Input: [1, 3, 5, 7, 9]\nOutput: 5", starter: "numbers = [1, 3, 5, 7, 9]\n\n# Write your code here", keywords: ["sort", "len", "median"] },
      { title: "Remove Duplicates", description: "Write Python code to remove duplicate values from a list.", example: "Input: [1, 2, 2, 3]\nOutput: [1, 2, 3]", starter: "data = [1, 2, 2, 3]\n\n# Write your code here", keywords: ["set", "unique", "for"] }
    ],
    "Data Analytics": [
      { title: "Filter High Sales", description: "Return sales values greater than 200.", example: "Input: [100, 250, 180, 400]\nOutput: [250, 400]", starter: "sales = [100, 250, 180, 400]\n\n# Write your code here", keywords: ["for", "if", "200"] },
      { title: "Count Categories", description: "Count how many times each category occurs.", example: "Input: ['A', 'B', 'A']\nOutput: {'A': 2, 'B': 1}", starter: "categories = ['A', 'B', 'A']\n\n# Write your code here", keywords: ["dict", "count", "for"] }
    ],
    "Machine Learning": [
      { title: "Calculate Precision", description: "Calculate precision from true positives and false positives.", example: "TP = 80, FP = 20\nOutput: 0.8", starter: "true_positive = 80\nfalse_positive = 20\n\n# Write your code here", keywords: ["true_positive", "false_positive", "precision"] },
      { title: "Normalize Values", description: "Normalize a list using min-max normalization.", example: "Input: [0, 5, 10]\nOutput: [0.0, 0.5, 1.0]", starter: "data = [0, 5, 10]\n\n# Write your code here", keywords: ["min", "max", "normalize"] }
    ],
    "AI / ML": [
      { title: "Count Unique Tokens", description: "Count unique words in a sentence.", example: "Input: 'AI is easy AI'\nOutput: 3", starter: "text = 'AI is easy AI'\n\n# Write your code here", keywords: ["split", "set", "len"] },
      { title: "Simple Keyword Classifier", description: "Classify text as AI when it contains the word 'ai'.", example: "Input: 'I study AI'\nOutput: AI", starter: "text = 'I study AI'\n\n# Write your code here", keywords: ["if", "ai", "lower"] }
    ],
    "Python Full Stack": [
      { title: "Check Palindrome", description: "Check whether a string is a palindrome.", example: "Input: 'madam'\nOutput: True", starter: "text = 'madam'\n\n# Write your code here", keywords: ["[::-1]", "palindrome", "return"] },
      { title: "Count API Status Codes", description: "Count successful HTTP status codes in a list.", example: "Input: [200, 404, 200]\nOutput: 2", starter: "status_codes = [200, 404, 200]\n\n# Write your code here", keywords: ["200", "count", "for"] }
    ],
    "Python Developer": [
      { title: "Check Prime Number", description: "Check whether a number is prime.", example: "Input: 7\nOutput: True", starter: "n = 7\n\n# Write your code here", keywords: ["for", "if", "return"] },
      { title: "Count Vowels", description: "Count vowels in a string.", example: "Input: 'hello'\nOutput: 2", starter: "text = 'hello'\n\n# Write your code here", keywords: ["for", "count", "vowels"] }
    ],
    "Web Development": [
      { title: "Filter Even Numbers", description: "Return even numbers from a list.", example: "Input: [1, 2, 3, 4]\nOutput: [2, 4]", starter: "numbers = [1, 2, 3, 4]\n\n# Write your code here", keywords: ["for", "if", "%"] },
      { title: "Validate User Data", description: "Check that a username is not empty.", example: "Input: 'Malli'\nOutput: Valid", starter: "username = 'Malli'\n\n# Write your code here", keywords: ["if", "strip", "return"] }
    ],
    "Software Development": [
      { title: "Check Palindrome", description: "Check whether a string is a palindrome.", example: "Input: 'madam'\nOutput: True", starter: "text = 'madam'\n\n# Write your code here", keywords: ["[::-1]", "palindrome", "return"] },
      { title: "Count Vowels", description: "Count vowels in a string.", example: "Input: 'hello'\nOutput: 2", starter: "text = 'hello'\n\n# Write your code here", keywords: ["for", "count", "vowels"] }
    ]
  };

  return [...baseQuestions, ...(extras[normalized] || extras["Software Development"])].slice(0, 4);
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const MockInterview = () => {

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [stage, setStage] =
    useState("home");

  const [resumeDomain, setResumeDomain] =
    useState("");

  const [resumeSkills, setResumeSkills] =
    useState([]);

  const [questions, setQuestions] =
    useState(null);

  const [
    aptitudeIndex,
    setAptitudeIndex,
  ] = useState(0);

  const [
    aptitudeAnswers,
    setAptitudeAnswers,
  ] = useState({});

  const [
    aptitudeScore,
    setAptitudeScore,
  ] = useState(0);

  const [codingAnswer, setCodingAnswer] =
    useState("");

  const [codingScore, setCodingScore] =
    useState(null);

  const [codingScores, setCodingScores] =
    useState([]);

  // Voice interview state
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingStatus, setRecordingStatus] = useState("Not recording");
  const [transcriptSupported, setTranscriptSupported] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [
    codingIndex,
    setCodingIndex,
  ] = useState(0);

  const [
    interviewIndex,
    setInterviewIndex,
  ] = useState(0);

  const [
    interviewAnswer,
    setInterviewAnswer,
  ] = useState("");

  const [
    interviewAnswers,
    setInterviewAnswers,
  ] = useState([]);

  const [cameraOn, setCameraOn] =
    useState(false);

  const [micOn, setMicOn] =
    useState(false);

  const [
    interviewScore,
    setInterviewScore,
  ] = useState(null);

  const [
    finalResult,
    setFinalResult,
  ] = useState(null);


  /* =====================================================
     LOAD RESUME DOMAIN
  ===================================================== */

  useEffect(() => {

    const loadResumeData = () => {

      const data =
        getResumeInformation();

      setResumeDomain(data.domain);
      setResumeSkills(data.skills);

      const selectedQuestions =
        getQuestionsForDomain(
          data.domain
        );

      setQuestions({
        ...selectedQuestions,
        coding: buildCodingQuestions(data.domain, selectedQuestions.coding),
      });

      console.log(
        "Resume Domain:",
        data.domain
      );

      console.log(
        "Resume Skills:",
        data.skills
      );
    };

    loadResumeData();

    window.addEventListener(
      "storage",
      loadResumeData
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadResumeData
      );
    };

  }, []);


  /* =====================================================
     CAMERA
  ===================================================== */

  const startCamera = async () => {

    try {

      if (!navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia) {

        alert(
          "Camera is not supported by this browser."
        );

        return;
      }

      let stream =
        streamRef.current;

      /*
       If stream already exists,
       simply enable tracks.
      */

      if (stream) {

        stream
          .getVideoTracks()
          .forEach(
            (track) => {
              track.enabled = true;
            }
          );

        stream
          .getAudioTracks()
          .forEach(
            (track) => {
              track.enabled = true;
            }
          );

        setCameraOn(true);
        setMicOn(true);

        return;
      }

      stream =
        await navigator.mediaDevices
          .getUserMedia({
            video: {
              width: {
                ideal: 1280,
              },
              height: {
                ideal: 720,
              },
              facingMode: "user",
            },
            audio: true,
          });

      streamRef.current =
        stream;

      setCameraOn(true);
      setMicOn(true);

      /*
       Video element may not be mounted
       immediately. We attach it in useEffect
       also.
      */

      if (videoRef.current) {

        videoRef.current.srcObject =
          stream;

        await videoRef.current.play()
          .catch(() => {});

      }

    } catch (error) {

      console.error(
        "Camera error:",
        error
      );

      setCameraOn(false);
      setMicOn(false);

      alert(
        "Camera/Microphone permission is required for the interview."
      );
    }
  };


  /* =====================================================
     ATTACH CAMERA AFTER INTERVIEW SCREEN RENDERS
  ===================================================== */

  useEffect(() => {

    if (
      stage !== "interview"
    ) {
      return;
    }

    const attachVideo = async () => {

      if (
        videoRef.current &&
        streamRef.current
      ) {

        videoRef.current.srcObject =
          streamRef.current;

        try {
          await videoRef.current.play();
        } catch (error) {
          console.log(
            "Video autoplay:",
            error
          );
        }
      }

    };

    const timer =
      setTimeout(
        attachVideo,
        100
      );

    return () =>
      clearTimeout(timer);

  }, [stage, cameraOn]);


  /* =====================================================
     STOP CAMERA
  ===================================================== */

  const stopCamera = () => {

    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach(
          (track) => {
            track.stop();
          }
        );

      streamRef.current =
        null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject =
        null;
    }

    setCameraOn(false);
    setMicOn(false);
  };


  /* =====================================================
     TOGGLE CAMERA
  ===================================================== */

  const toggleCamera = async () => {

    /*
      IMPORTANT:
      Do NOT stop the video track when
      clicking OFF.

      Just disable it.
      Therefore ON works again.
    */

    if (!streamRef.current) {

      await startCamera();

      return;
    }

    const videoTracks =
      streamRef.current
        .getVideoTracks();

    if (!videoTracks.length) {

      await startCamera();

      return;
    }

    const newState =
      !cameraOn;

    videoTracks.forEach(
      (track) => {
        track.enabled =
          newState;
      }
    );

    setCameraOn(newState);

    if (
      newState &&
      videoRef.current
    ) {

      videoRef.current.srcObject =
        streamRef.current;

      try {
        await videoRef.current.play();
      } catch (error) {
        console.log(error);
      }
    }
  };


  /* =====================================================
     TOGGLE MIC
  ===================================================== */

  const toggleMic = async () => {

    if (!streamRef.current) {

      await startCamera();

      return;
    }

    const audioTracks =
      streamRef.current
        .getAudioTracks();

    if (!audioTracks.length) {

      await startCamera();

      return;
    }

    const newState =
      !micOn;

    audioTracks.forEach(
      (track) => {
        track.enabled =
          newState;
      }
    );

    setMicOn(newState);
  };


  /* =====================================================
     APTITUDE
  ===================================================== */

  const selectAptitudeAnswer =
    (answer) => {

      setAptitudeAnswers(
        (previous) => ({
          ...previous,
          [aptitudeIndex]:
            answer,
        })
      );
    };


  const finishAptitude = () => {

    let score = 0;

    questions.aptitude.forEach(
      (question, index) => {

        if (
          aptitudeAnswers[index] ===
          question.answer
        ) {
          score++;
        }
      }
    );

    const percentage =
      Math.round(
        (score /
          questions.aptitude.length) *
          100
      );

    setAptitudeScore(
      percentage
    );

    setCodingIndex(0);
    setCodingAnswer("");
    setCodingScores([]);
    setCodingScore(null);

    setStage("coding");
  };


  /* =====================================================
     CODING
  ===================================================== */

  const submitCoding = () => {

    const answer = codingAnswer.toLowerCase();
    const currentCoding = questions.coding[codingIndex];

    if (!answer.trim()) {
      alert("Please write your code before submitting.");
      return;
    }

    let score = 0;

    if (answer.trim().length > 20) score += 40;

    if (currentCoding.keywords.some((keyword) =>
      answer.includes(keyword.toLowerCase())
    )) {
      score += 40;
    }

    if (answer.includes("print") || answer.includes("return")) {
      score += 20;
    }

    score = Math.min(score, 100);

    const updatedScores = [...codingScores, score];
    setCodingScores(updatedScores);

    if (codingIndex < questions.coding.length - 1) {
      setCodingIndex((previous) => previous + 1);
      setCodingAnswer("");
      return;
    }

    const average = Math.round(
      updatedScores.reduce((sum, item) => sum + item, 0) / updatedScores.length
    );

    setCodingScore(average);
    setStage("codingResult");
  };



  /* =====================================================
     VOICE INTERVIEW
  ===================================================== */

  const speakInterviewQuestion = (text) => {
    if (!window.speechSynthesis) {
      alert("Voice output is not supported by this browser. Please use Chrome or Edge.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      let stream = streamRef.current;

      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        setCameraOn(true);
        setMicOn(true);
      }

      const audioTracks = stream.getAudioTracks();
      if (!audioTracks.length) {
        alert("Microphone is not available. Please allow microphone permission.");
        return;
      }

      audioTracks.forEach((track) => { track.enabled = true; });
      setMicOn(true);

      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
        setRecordedAudioUrl("");
      }

      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        setRecordingStatus("✅ Answer recorded successfully");
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      setRecordingStatus("🔴 Recording your answer...");

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((seconds) => seconds + 1);
      }, 1000);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setTranscriptSupported(true);
        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) setInterviewAnswer(transcript.trim());
        };
        recognition.onerror = (event) => console.log("Speech recognition:", event.error);
        recognitionRef.current = recognition;
        recognition.start();
      } else {
        setTranscriptSupported(false);
      }
    } catch (error) {
      console.error("Recording error:", error);
      setRecordingStatus("❌ Recording failed. Check microphone permission.");
      alert("Could not start recording. Please allow microphone access and use Chrome/Edge.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (error) { console.log(error); }
      recognitionRef.current = null;
    }

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    setIsRecording(false);
  };

  const formatRecordingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  /* =====================================================
     START INTERVIEW
  ===================================================== */

  const startInterview = () => {

    setInterviewIndex(0);
    setInterviewAnswer("");
    setInterviewAnswers([]);
    setInterviewScore(null);
    setInterviewAnswer("");
    setRecordingStatus("Not recording");
    setRecordingSeconds(0);
    setIsRecording(false);
    setRecordedAudioUrl("");

    /*
      First render interview screen.
      Then useEffect will attach camera.
    */

    setStage("interview");

  };


  /* =====================================================
     START CAMERA AFTER INTERVIEW SCREEN IS READY
  ===================================================== */

  useEffect(() => {

    if (
      stage === "interview" &&
      !streamRef.current
    ) {

      const timer =
        setTimeout(() => {
          startCamera();
        }, 200);

      return () =>
        clearTimeout(timer);
    }

  }, [stage]);


  useEffect(() => {
    if (stage !== "interview" || !questions?.interview?.[interviewIndex]) return;
    const timer = setTimeout(() => {
      speakInterviewQuestion(questions.interview[interviewIndex].question);
    }, 500);
    return () => {
      clearTimeout(timer);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [stage, interviewIndex, questions]);

  /* =====================================================
     INTERVIEW ANSWER
  ===================================================== */

  const submitInterviewAnswer =
    () => {

      if (isRecording) stopRecording();

      if (
        !interviewAnswer.trim()
      ) {
        return;
      }

      const updatedAnswers = [
        ...interviewAnswers,
        interviewAnswer.trim(),
      ];

      setInterviewAnswers(
        updatedAnswers
      );

      setInterviewAnswer("");

      if (
        interviewIndex <
        questions.interview.length - 1
      ) {

        setInterviewIndex(
          (previous) =>
            previous + 1
        );

      } else {

        calculateInterviewScore(
          updatedAnswers
        );
      }
    };


  /* =====================================================
     INTERVIEW SCORE
  ===================================================== */

  const calculateInterviewScore =
    (answers) => {

      if (!answers.length) {
        return;
      }

      const totalLength =
        answers.reduce(
          (sum, answer) =>
            sum + answer.length,
          0
        );

      const averageLength =
        totalLength /
        answers.length;

      let score = 60;

      if (
        averageLength > 50
      ) {
        score += 10;
      }

      if (
        averageLength > 100
      ) {
        score += 10;
      }

      if (
        averageLength > 150
      ) {
        score += 10;
      }

      score =
        Math.min(
          score,
          95
        );

      setInterviewScore(
        score
      );

      const finalScore =
        calculateFinalScore(
          aptitudeScore,
          codingScore || 0,
          score
        );

      setFinalResult(
        finalScore
      );

      stopCamera();

      setStage("final");
    };


  /* =====================================================
     FINAL SCORE
  ===================================================== */

  const calculateFinalScore =
    (
      aptitude,
      coding,
      interview
    ) => {

      const overall =
        Math.round(
          aptitude * 0.25 +
          coding * 0.30 +
          interview * 0.45
        );

      return {
        overall,
        aptitude,
        coding,
        interview,
      };
    };


  /* =====================================================
     RESET
  ===================================================== */

  const restart = () => {

    stopCamera();

    setStage("home");

    setAptitudeIndex(0);
    setAptitudeAnswers({});
    setAptitudeScore(0);

    setCodingIndex(0);
    setCodingAnswer("");
    setCodingScore(null);
    setCodingScores([]);

    setInterviewIndex(0);
    setInterviewAnswer("");
    setInterviewAnswers([]);
    setInterviewScore(null);

    setFinalResult(null);

    const data =
      getResumeInformation();

    setResumeDomain(
      data.domain
    );

    setResumeSkills(
      data.skills
    );

    const selectedQuestions = getQuestionsForDomain(data.domain);
    setQuestions({
      ...selectedQuestions,
      coding: buildCodingQuestions(data.domain, selectedQuestions.coding),
    });
  };


  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {

    return () => {
      stopCamera();
    };

  }, []);


  /* =====================================================
     LOADING
  ===================================================== */

  if (!questions) {

    return (
      <div className="mock-page">
        <div className="loading-card">
          <div className="loading-icon">
            ⏳
          </div>

          <h2>
            Loading Resume Assessment...
          </h2>

          <p>
            Reading your uploaded resume
            and selecting questions.
          </p>
        </div>

        <style>{styles}</style>
      </div>
    );
  }


  /* =====================================================
     HOME
  ===================================================== */

  if (stage === "home") {

    return (
      <div className="mock-page">

        <div className="container">

          <div className="hero">

            <div className="eyebrow">
              AI CAREER PREPARATION
            </div>

            <h1>
              Mock Interview
            </h1>

            <p>
              Your assessment is automatically
              customized according to the
              domain detected from your uploaded
              resume.
            </p>

            <div className="domain">
              🎯 Resume Domain:
              <strong>
                {" "}
                {resumeDomain}
              </strong>
            </div>

            {resumeSkills.length > 0 && (
              <div className="skills-line">
                <span>
                  Resume Skills:
                </span>

                {resumeSkills
                  .slice(0, 8)
                  .map((skill, index) => (
                    <span
                      className="skill-chip"
                      key={index}
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            )}

          </div>


          <div className="round-grid">

            <RoundCard
              number="01"
              icon="🧠"
              title="Aptitude Test"
              description={`Aptitude questions customized for ${resumeDomain}.`}
            />

            <RoundCard
              number="02"
              icon="💻"
              title="Coding Test"
              description={`Coding problems based on your ${resumeDomain} profile.`}
            />

            <RoundCard
              number="03"
              icon="🎥"
              title="AI Interview"
              description={`Interview questions selected from your ${resumeDomain} resume.`}
            />

          </div>


          <div className="flow-card">

            <h2>
              Assessment Flow
            </h2>

            <div className="flow">

              <span>
                🧠 Aptitude
              </span>

              <b>→</b>

              <span>
                💻 Coding
              </span>

              <b>→</b>

              <span>
                🎥 Interview
              </span>

              <b>→</b>

              <span>
                🏆 Result
              </span>

            </div>

          </div>


          <button
            className="primary-button start-button"
            onClick={() =>
              setStage("aptitude")
            }
          >
            Start Assessment →
          </button>

        </div>

        <style>{styles}</style>

      </div>
    );
  }


  /* =====================================================
     APTITUDE
  ===================================================== */

  if (stage === "aptitude") {

    const question =
      questions.aptitude[
        aptitudeIndex
      ];

    return (
      <div className="mock-page">

        <div className="test-container">

          <div className="test-header">

            <div>

              <span>
                ROUND 01
              </span>

              <h1>
                🧠 Aptitude Test
              </h1>

              <small>
                {resumeDomain}
              </small>

            </div>

            <div className="counter">
              {aptitudeIndex + 1} /{" "}
              {questions.aptitude.length}
            </div>

          </div>


          <div className="progress-bg">

            <div
              className="progress"
              style={{
                width:
                  `${
                    ((aptitudeIndex + 1) /
                      questions.aptitude.length) *
                    100
                  }%`,
              }}
            />

          </div>


          <div className="question-box">

            <span className="question-number">
              Question {aptitudeIndex + 1}
            </span>

            <h2>
              {question.question}
            </h2>


            <div className="options">

              {question.options.map(
                (option, index) => (

                  <button
                    key={option}
                    className={
                      aptitudeAnswers[
                        aptitudeIndex
                      ] === option
                        ? "option selected"
                        : "option"
                    }
                    onClick={() =>
                      selectAptitudeAnswer(
                        option
                      )
                    }
                  >

                    <span>
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    {option}

                  </button>

                )
              )}

            </div>


            <div className="test-actions">

              <button
                className="secondary-button"
                disabled={
                  aptitudeIndex === 0
                }
                onClick={() =>
                  setAptitudeIndex(
                    (previous) =>
                      previous - 1
                  )
                }
              >
                ← Previous
              </button>


              {aptitudeIndex ===
              questions.aptitude.length - 1 ? (

                <button
                  className="primary-button"
                  disabled={
                    aptitudeAnswers[
                      aptitudeIndex
                    ] === undefined
                  }
                  onClick={
                    finishAptitude
                  }
                >
                  Submit Aptitude →
                </button>

              ) : (

                <button
                  className="primary-button"
                  disabled={
                    aptitudeAnswers[
                      aptitudeIndex
                    ] === undefined
                  }
                  onClick={() =>
                    setAptitudeIndex(
                      (previous) =>
                        previous + 1
                    )
                  }
                >
                  Next →
                </button>

              )}

            </div>

          </div>

        </div>

        <style>{styles}</style>

      </div>
    );
  }


  /* =====================================================
     CODING
  ===================================================== */

  if (stage === "coding") {

    const coding =
      questions.coding[
        codingIndex
      ];

    return (
      <div className="mock-page">

        <div className="test-container">

          <div className="test-header">

            <div>

              <span>
                ROUND 02
              </span>

              <h1>
                💻 Coding Test
              </h1>

              <small>
                {resumeDomain}
              </small>

            </div>

            <div className="domain">
              Python
            </div>

          </div>


          <div className="coding-layout">

            <div className="coding-question">

              <span className="question-number">
                Coding Problem{" "}
                {codingIndex + 1}
              </span>

              <h2>
                {coding.title}
              </h2>

              <p>
                {coding.description}
              </p>

              <h3>
                Example
              </h3>

              <pre>
                {coding.example}
              </pre>

              <h3>
                Starter Code
              </h3>

              <pre>
                {coding.starter}
              </pre>

            </div>


            <div className="code-editor">

              <div className="editor-header">
                <span>
                  main.py
                </span>

                <span>
                  Python 3
                </span>
              </div>


              <textarea
                value={codingAnswer}
                onChange={(event) =>
                  setCodingAnswer(
                    event.target.value
                  )
                }
                placeholder="Write your Python code here..."
                spellCheck="false"
              />


              <button
                className="primary-button"
                onClick={
                  submitCoding
                }
              >
                ▶ Submit Code
              </button>

            </div>

          </div>

        </div>

        <style>{styles}</style>

      </div>
    );
  }


  /* =====================================================
     CODING RESULT
  ===================================================== */

  if (
    stage === "codingResult"
  ) {

    return (
      <div className="mock-page">

        <div className="result-container">

          <div className="result-card center">

            <div className="big-icon">
              💻
            </div>

            <h1>
              Coding Test Completed
            </h1>

            <div className="big-score">

              <strong>
                {codingScore}
              </strong>

              <span>
                /100
              </span>

            </div>

            <p>
              Aptitude Score:
              {" "}
              <strong>
                {aptitudeScore}/100
              </strong>
            </p>

            <p>
              You completed {codingScores.length} coding questions for your {resumeDomain} domain.
            </p>

            <div className="score-list">
              {codingScores.map((score, index) => (
                <span key={index}>Q{index + 1}: {score}/100</span>
              ))}
            </div>

            <button
              className="primary-button"
              onClick={
                startInterview
              }
            >
              🎥 Start AI Interview →
            </button>

          </div>

        </div>

        <style>{styles}</style>

      </div>
    );
  }


  /* =====================================================
     INTERVIEW
  ===================================================== */

  if (stage === "interview") {

    const question =
      questions.interview[
        interviewIndex
      ];

    return (
      <div className="mock-page">

        <div className="live-container">

          <div className="live-header">

            <div>

              <span className="live">
                ● LIVE
              </span>

              <h2>
                🎥 AI Interview
              </h2>

              <p>
                {resumeDomain}
                {" • "}
                Question{" "}
                {interviewIndex + 1}
                {" / "}
                {questions.interview.length}
              </p>

            </div>


            <div className="camera-status">

              {cameraOn
                ? "🟢 Camera ON"
                : "🔴 Camera OFF"}

            </div>

          </div>


          <div className="video-grid">

            {/* AI */}

            <div className="ai-screen">

              <div className="ai-avatar">
                🤖
              </div>

              <h2>
                AI Interviewer
              </h2>

              <span className="listening">
                ● AI Interviewer
              </span>

              <p>
                Please answer naturally
                and explain your reasoning.
              </p>

            </div>


            {/* USER */}

            <div className="user-screen">

              {cameraOn ? (

                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="camera-video"
                />

              ) : (

                <div className="camera-off">

                  <div>
                    📹
                  </div>

                  <p>
                    Camera is OFF
                  </p>

                  <button
                    className="camera-enable-button"
                    onClick={
                      toggleCamera
                    }
                  >
                    Turn Camera ON
                  </button>

                </div>

              )}


              <div className="user-name">
                Malliswari
              </div>


              <div className="controls">

                <button
                  onClick={
                    toggleMic
                  }
                  className={
                    micOn
                      ? "control"
                      : "control danger"
                  }
                  title={
                    micOn
                      ? "Turn microphone off"
                      : "Turn microphone on"
                  }
                >
                  {micOn
                    ? "🎤"
                    : "🔇"}
                </button>


                <button
                  onClick={
                    toggleCamera
                  }
                  className={
                    cameraOn
                      ? "control"
                      : "control danger"
                  }
                  title={
                    cameraOn
                      ? "Turn camera off"
                      : "Turn camera on"
                  }
                >
                  {cameraOn
                    ? "📹"
                    : "🚫"}
                </button>

              </div>

            </div>

          </div>


          {/* QUESTION */}

          <div className="interview-question">

            <div className="question-top">

              <span>
                {question.type}
              </span>

              <span>
                {interviewIndex + 1}
                {" / "}
                {questions.interview.length}
              </span>

            </div>


            <h2>
              {question.question}
            </h2>


            <textarea
              value={
                interviewAnswer
              }
              onChange={(event) =>
                setInterviewAnswer(
                  event.target.value
                )
              }
              placeholder="Type your answer here..."
            />


            <div className="voice-actions">
              <button
                type="button"
                className="secondary-button voice-button"
                onClick={() => speakInterviewQuestion(question.question)}
              >
                🔊 {isSpeaking ? "Speaking..." : "Hear Question"}
              </button>

              {!isRecording ? (
                <button
                  type="button"
                  className="primary-button record-button"
                  onClick={startRecording}
                >
                  🎤 Record Answer
                </button>
              ) : (
                <button
                  type="button"
                  className="primary-button stop-record-button"
                  onClick={stopRecording}
                >
                  ⏹ Stop Recording
                </button>
              )}

              <span className={`recording-status ${isRecording ? "recording" : ""}`}>
                {isRecording
                  ? `🔴 Recording ${formatRecordingTime(recordingSeconds)}`
                  : recordingStatus}
              </span>
            </div>

            <div className="voice-help">
              {transcriptSupported
                ? "🎙️ Your voice is being recorded and your speech is converted to text automatically."
                : "🎙️ Your voice is being recorded. Speech-to-text is not supported in this browser, but you can still use the audio recording."}
            </div>

            {recordedAudioUrl && (
              <div className="recorded-audio">
                <strong>▶ Recorded answer — play it to confirm your voice was captured</strong>
                <audio controls src={recordedAudioUrl} />
              </div>
            )}

            <div className="answer-footer">

              <p>
                💡 Give a clear and
                structured answer.
              </p>

              <button
                className="primary-button"
                disabled={
                  !interviewAnswer.trim()
                }
                onClick={
                  submitInterviewAnswer
                }
              >
                {interviewIndex ===
                questions.interview.length - 1
                  ? "Finish Interview"
                  : "Submit Answer →"}
              </button>

            </div>

          </div>

        </div>

        <style>{styles}</style>

      </div>
    );
  }


  /* =====================================================
     FINAL RESULT
  ===================================================== */

  if (
    stage === "final" &&
    finalResult
  ) {

    return (
      <div className="mock-page">

        <div className="result-container">

          <div className="final-hero">

            <div className="big-icon">
              🎉
            </div>

            <h1>
              Assessment Completed
            </h1>

            <p>
              Your assessment for
              <strong>
                {" "}
                {resumeDomain}
              </strong>{" "}
              is completed.
            </p>


            <div className="overall-score">

              <strong>
                {finalResult.overall}
              </strong>

              <span>
                /100
              </span>

            </div>

            <h2>
              Overall Score
            </h2>

          </div>


          <div className="final-grid">

            <ResultScore
              icon="🧠"
              title="Aptitude"
              score={
                finalResult.aptitude
              }
            />

            <ResultScore
              icon="💻"
              title="Coding"
              score={
                finalResult.coding
              }
            />

            <ResultScore
              icon="🎥"
              title="AI Interview"
              score={
                finalResult.interview
              }
            />

          </div>


          <div className="result-card">

            <h2>
              🤖 AI Feedback
            </h2>

            <p className="feedback-text">

              Your assessment for{" "}
              <strong>
                {resumeDomain}
              </strong>{" "}
              has been completed.

              Focus on improving coding
              accuracy, technical concepts,
              aptitude speed and structured
              interview communication.

            </p>

          </div>


          <div className="result-card">

            <h2>
              📈 Recommended Next Steps
            </h2>

            <div className="recommendations">

              <div>
                ✓ Practice
                {" "}
                {resumeDomain}
                {" "}
                technical questions
              </div>

              <div>
                ✓ Practice coding problems
              </div>

              <div>
                ✓ Improve SQL and database concepts
              </div>

              <div>
                ✓ Practice explaining projects
              </div>

              <div>
                ✓ Improve interview communication
              </div>

            </div>

          </div>


          <div className="center">

            <button
              className="primary-button"
              onClick={
                restart
              }
            >
              🔄 Take Assessment Again
            </button>

          </div>

        </div>

        <style>{styles}</style>

      </div>
    );
  }

  return null;
};


/* =========================================================
   ROUND CARD
========================================================= */

const RoundCard = ({
  number,
  icon,
  title,
  description,
}) => {

  return (
    <div className="round-card">

      <div className="round-number">
        {number}
      </div>

      <div className="round-icon">
        {icon}
      </div>

      <h2>
        {title}
      </h2>

      <p>
        {description}
      </p>

    </div>
  );
};


/* =========================================================
   RESULT SCORE
========================================================= */

const ResultScore = ({
  icon,
  title,
  score,
}) => {

  return (
    <div className="result-score-card">

      <div className="result-score-icon">
        {icon}
      </div>

      <h2>
        {title}
      </h2>

      <strong>
        {score}
      </strong>

      <span>
        /100
      </span>

      <div className="progress-bg">

        <div
          className="progress"
          style={{
            width:
              `${score}%`,
          }}
        />

      </div>

    </div>
  );
};


/* =========================================================
   STYLES
========================================================= */

const styles = `

* {
  box-sizing: border-box;
}

.mock-page {
  min-height: 100vh;
  background: #f6f8fb;
  color: #111827;
  padding: 28px;
  font-family: Arial, Helvetica, sans-serif;
}

.container,
.test-container,
.live-container,
.result-container {
  max-width: 1150px;
  margin: auto;
}

/* LOADING */

.loading-card {
  max-width: 600px;
  margin: 100px auto;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 50px;
  text-align: center;
}

.loading-icon {
  font-size: 55px;
}

/* HERO */

.hero {
  background: linear-gradient(
    135deg,
    #111827,
    #374151
  );
  color: white;
  padding: 40px;
  border-radius: 24px;
  margin-bottom: 24px;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 2px;
  opacity: .7;
  font-weight: bold;
}

.hero h1 {
  font-size: 40px;
  margin: 12px 0;
}

.hero p {
  max-width: 700px;
  line-height: 1.7;
  opacity: .85;
}

.domain {
  display: inline-block;
  padding: 10px 15px;
  background: rgba(255,255,255,.12);
  border-radius: 20px;
  margin-top: 10px;
}

.skills-line {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.skill-chip {
  background: rgba(255,255,255,.12);
  padding: 7px 11px;
  border-radius: 15px;
  font-size: 12px;
}

/* ROUND CARDS */

.round-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.round-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 25px;
  position: relative;
}

.round-number {
  position: absolute;
  right: 18px;
  top: 18px;
  font-size: 12px;
  color: #9ca3af;
  font-weight: bold;
}

.round-icon {
  font-size: 42px;
}

.round-card h2 {
  margin-bottom: 8px;
}

.round-card p {
  color: #6b7280;
  line-height: 1.6;
}

/* FLOW */

.flow-card {
  background: white;
  padding: 25px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  margin-top: 20px;
}

.flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
}

.flow span {
  padding: 12px 18px;
  background: #f3f4f6;
  border-radius: 12px;
  font-weight: 600;
}

.flow b {
  color: #9ca3af;
}

.start-button {
  display: block;
  margin: 25px auto 0;
}

/* BUTTONS */

.primary-button,
.secondary-button {
  border: none;
  padding: 13px 22px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
}

.primary-button {
  background: #111827;
  color: white;
}

.primary-button:hover {
  background: #374151;
}

.primary-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.secondary-button {
  background: #f3f4f6;
  color: #111827;
}

/* TEST HEADER */

.test-header,
.live-header {
  background: linear-gradient(
    135deg,
    #111827,
    #374151
  );
  color: white;
  padding: 25px 30px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.test-header span {
  font-size: 12px;
  opacity: .7;
  letter-spacing: 1px;
}

.test-header h1 {
  margin: 7px 0 5px;
}

.test-header small {
  opacity: .7;
}

.counter {
  font-size: 22px;
  font-weight: bold;
}

/* PROGRESS */

.progress-bg {
  height: 7px;
  background: #e5e7eb;
  border-radius: 20px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #111827;
  border-radius: 20px;
}

/* QUESTION */

.question-box {
  background: white;
  padding: 35px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  margin-top: 20px;
}

.question-number {
  color: #6b7280;
  font-size: 13px;
}

.question-box h2 {
  line-height: 1.5;
  margin: 15px 0 25px;
}

.options {
  display: grid;
  gap: 12px;
}

.option {
  border: 1px solid #d1d5db;
  background: white;
  padding: 16px;
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  font-size: 15px;
}

.option:hover {
  border-color: #111827;
}

.option span {
  display: inline-flex;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f3f4f6;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-weight: bold;
}

.option.selected {
  background: #f3f4f6;
  border: 2px solid #111827;
}

.test-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
}

/* CODING */

.coding-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.coding-question,
.code-editor {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 25px;
}

.coding-question p {
  color: #4b5563;
  line-height: 1.7;
}

.coding-question pre {
  background: #111827;
  color: white;
  padding: 18px;
  border-radius: 12px;
  overflow-x: auto;
  line-height: 1.6;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  color: #6b7280;
}

.code-editor textarea {
  width: 100%;
  height: 400px;
  background: #111827;
  color: white;
  border: none;
  outline: none;
  border-radius: 12px;
  padding: 18px;
  font-family: Consolas, monospace;
  font-size: 14px;
  resize: none;
  line-height: 1.6;
  margin-bottom: 15px;
}

/* LIVE */

.live-header {
  margin-bottom: 20px;
}

.live-header h2 {
  margin: 8px 0;
}

.live-header p {
  opacity: .7;
  margin: 0;
}

.live {
  color: #86efac;
  font-size: 12px;
  font-weight: bold;
}

.camera-status {
  font-weight: bold;
}

/* VIDEO */

.video-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.ai-screen,
.user-screen {
  height: 430px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.ai-screen {
  background: white;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ai-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    #111827,
    #6b7280
  );
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 70px;
}

.listening {
  padding: 8px 14px;
  background: #ecfdf5;
  color: #047857;
  border-radius: 20px;
  font-size: 13px;
}

.ai-screen p {
  color: #6b7280;
}

.user-screen {
  background: #030712;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
  display: block;
}

.camera-off {
  height: 100%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.camera-off div {
  font-size: 60px;
}

.camera-enable-button {
  background: white;
  color: #111827;
  border: none;
  padding: 10px 16px;
  border-radius: 9px;
  cursor: pointer;
  font-weight: bold;
}

.user-name {
  position: absolute;
  top: 15px;
  left: 15px;
  color: white;
  background: rgba(0,0,0,.6);
  padding: 8px 12px;
  border-radius: 8px;
}

.controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
}

.control {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  background: white;
}

.control.danger {
  background: #ef4444;
  color: white;
}

/* INTERVIEW QUESTION */

.interview-question {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 28px;
  margin-top: 20px;
}

.question-top {
  display: flex;
  justify-content: space-between;
  color: #6b7280;
}

.interview-question h2 {
  line-height: 1.5;
}

.interview-question textarea {
  width: 100%;
  min-height: 160px;
  padding: 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  resize: vertical;
  font-family: inherit;
  outline: none;
}

.answer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.answer-footer p {
  color: #6b7280;
}

/* RESULT */

.result-container {
  max-width: 950px;
}

.result-card,
.final-hero {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 22px;
  padding: 35px;
  margin-bottom: 20px;
}

.center {
  text-align: center;
}

.big-icon {
  font-size: 60px;
}

.big-score,
.overall-score {
  width: 170px;
  height: 170px;
  border: 12px solid #111827;
  border-radius: 50%;
  margin: 25px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.big-score strong,
.overall-score strong {
  font-size: 45px;
  font-weight: bold;
}

.big-score span,
.overall-score span {
  color: #6b7280;
}

.final-hero {
  text-align: center;
}

.final-hero p {
  color: #6b7280;
}

.final-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 20px;
}

.result-score-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 25px;
}

.result-score-icon {
  font-size: 35px;
}

.result-score-card strong {
  font-size: 32px;
}

.result-score-card > span {
  color: #6b7280;
}

.result-score-card .progress-bg {
  margin-top: 15px;
}

.feedback-text {
  color: #4b5563;
  line-height: 1.8;
}

.recommendations {
  display: grid;
  gap: 12px;
}

.recommendations div {
  background: #f3f4f6;
  padding: 13px;
  border-radius: 10px;
}

/* RESPONSIVE */

@media (max-width: 900px) {

  .round-grid,
  .coding-layout,
  .video-grid,
  .final-grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 600px) {

  .mock-page {
    padding: 12px;
  }

  .hero {
    padding: 25px;
  }

  .hero h1 {
    font-size: 30px;
  }

  .test-header,
  .live-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .question-box,
  .interview-question,
  .result-card {
    padding: 20px;
  }

  .test-actions,
  .answer-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .test-actions button,
  .answer-footer button {
    width: 100%;
  }

  .ai-screen,
  .user-screen {
    height: 350px;
  }

}



.voice-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.voice-button, .record-button, .stop-record-button {
  min-height: 44px;
}

.recording-status {
  padding: 10px 14px;
  border-radius: 10px;
  background: #f1f5f9;
  font-size: 14px;
  font-weight: 600;
}

.recording-status.recording {
  background: #fee2e2;
  color: #b91c1c;
}

.voice-help {
  margin-top: 10px;
  color: #64748b;
  font-size: 13px;
}

.recorded-audio {
  margin-top: 14px;
  padding: 14px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: #f8fafc;
}

.recorded-audio strong {
  display: block;
  margin-bottom: 8px;
}

.recorded-audio audio {
  width: 100%;
  max-width: 520px;
}

.score-list {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin: 16px 0;
}

.score-list span {
  padding: 7px 10px;
  border-radius: 8px;
  background: #f1f5f9;
  font-weight: 600;
  font-size: 13px;
}
`;

export default MockInterview;