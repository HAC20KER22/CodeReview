from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage

import google.generativeai as genai
import os
import re
import json


class CodeUploadView(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        file_path = default_storage.save(file.name, file)
        return Response({'message': 'File uploaded successfully', 'path': file_path}, status=status.HTTP_200_OK)
    
class CodeReviewView(APIView):
    def post(self,request):
        try:
            file = request.FILES.get('file')
            if not file:
                return Response({'error':'No File Uploaded'},status=status.HTTP_400_BAD_REQUEST)
            
            #Read File Count
            code = file.read().decode('UTF-8')

            #Configure Gemini
            api_key = os.getenv("GEMINI_API_KEY")
            genai.configure(api_key=api_key)

            #Choose Model
            model = genai.GenerativeModel('gemini-pro-latest')

            #Create a prompt
            prompt = f"""
            Review This Code:
            1. Readability
            2. Modularity
            3. Potential Bugs
            4. Improvement suggestions

            Respond in structured JSON with fields: readability, modularity, bugs, suggestions.
            Make sure to summarise the content in these four fields and do not include any nested points in the JSON.
            Combining everything make sure to add a score out of 10 for each field as a different field in each field.
            The expected result 
                "readability": summary: "", score: 0,
                "modularity": summary: "", score: 0,
                "bugs": summary: "", score: 0,
                "suggestions": summary: "", score: 0,
            

            Code:
            {code}
            """

            #Generate Response
            response = model.generate_content(prompt)

            text = response.text.strip()

            #Remove Markdown formatting like ```json ...  ```
            text = re.sub(r"^```(json)?","",text)
            text = re.sub(r"```$","",text)
            text = text.strip()

            try:
                json_data = json.loads(text)
            except json.JSONDecodeError:
                #Fallback If its still not a valid JSON
                json_data = {'raw_output':text}


            #Return structured Review
            return Response(json_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error':str(e)},status=500)
