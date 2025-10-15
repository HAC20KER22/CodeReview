# CodeReview

Frontend is a folder consiting of a frontend application built on NextJS. 

Before Running the application there is a setup required. 
You need a Gemini Key. 
1. Go to https://aistudio.google.com/
2. Go to Dashboard and select API Keys.
3. Create a new key.
4. Add it in the folder
```
cd codereview
touch keys.env
```
5. In the keys.env
```
GEMINI_API_KEY=<YOUR_KEY>
DEBUG=False
```

To run
```
cd frontend
npm run dev
```

codereview is a folder build of Django. 
To run 
```
cd backend
python manage.py runserver
```

