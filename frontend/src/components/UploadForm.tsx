"use client";
import React, { useState } from "react";
import axios from "axios";
import ResultCard from "./Result";
import CodeCard from "./CodeCard";
import { Assistant } from "next/font/google";

interface ReviewResponse {
  readability: { summary: string; score: number };
  modularity: { summary: string; score: number };
  bugs: { summary: string; score: number };
  suggestions: { summary: string; score: number };
}

export default function Home() {
  const [codes, setCodes] = useState<{ name: string; content: string }[]>([]);
  const [results, setResults] = useState<ReviewResponse[]>([]);
  const [openStates, setOpenStates] = useState<boolean[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const fileArray: { name: string; content: string }[] = [];
    const readers: Promise<void>[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const reader = new FileReader();

      const promise = new Promise<void>((resolve) => {
        reader.onload = (e) => {
          const content = e.target?.result as string;
          fileArray.push({ name: file.name, content });
          resolve();
        };
      });

      reader.readAsText(file);
      readers.push(promise);
    }

    Promise.all(readers).then(() => {
      setCodes(fileArray);
      setOpenStates(fileArray.map(() => false));
      setResults([]); // clear old results when uploading new files
    });
  };

  const handleSubmit = async () => {
    if (codes.length === 0) {
      setError("Please upload at least one file!");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const allResults: ReviewResponse[] = [];

      for (const codeFile of codes) {
        const blob = new Blob([codeFile.content], { type: "text/plain" });
        const formData = new FormData();
        formData.append("file", blob, codeFile.name);

        const response = await axios.post<ReviewResponse>(
          "http://localhost:8000/api/review/",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        allResults.push(response.data);
      }

      setResults(allResults);
    } catch (err) {
      console.error(err);
      setError("Error while uploading or reviewing one or more files.");
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = (index: number) => {
    setOpenStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  return (
    <div className="bg-white min-h-screen text-black flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">Code Review Assistant</h2>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="block text-s p-2 text-blue-500 border border-blue-300 rounded-lg cursor-pointer bg-blue-100 dark:text-gray-200 focus:outline-none dark:bg-blue-500 dark:border-blue-700 dark:placeholder-gray-400 mb-3"
        accept=".py,.java,.c,.cpp,.js,.ts,.jsx,.tsx"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {loading ? "Reviewing..." : "Submit for Review"}
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      <div className="w-full max-w-4xl mt-6">
        {codes.map((c, i) => (
          <div
            key={i}
            className="border border-gray-300 rounded-md p-4 mb-4 shadow-sm"
          >
            <button
              onClick={() => toggleOpen(i)}
              className="w-full text-left p-2 font-semibold bg-gray-100 rounded-md"
            >
              {c.name} {openStates[i] ? "▲" : "▼"}
            </button>

            {openStates[i] && (
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <CodeCard filename={c.name} code={c.content} />
                </div>
                <div className="flex-1">
                  {results[i] ? (
                    <ResultCard data={results[i]} />
                  ) : (
                    <p className="italic text-gray-500">
                      Review not available yet. Submit to generate analysis.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
