# AsclepiusLM-frontend
This is the frontend implementation for AsclepiusLM, which infers a Causal SLM trained with a weighted loss function to achieve higher accuracy with medical text summarization

# How to run
1. First, clone this repository using the below command:

    `https://github.com/Chilliwiddit/AsclepiusLM-frontend.git`

2. Navigate inside the repository root directory and run:

    `uvicorn serve:app --reload`

3. The frontend can now be accessed at the following link:

    `http://127.0.0.1:8000/`