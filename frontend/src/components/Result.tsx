type ResultCategory = {
  summary: string;
  score: number;
};

type ResultData = {
  readability: ResultCategory;
  modularity: ResultCategory;
  bugs: ResultCategory;
  suggestions: ResultCategory;
};

export default function ResultCard({ data }: { data: ResultData }) {
  if (!data) return null;
  return (
    <div>
      <div>Code Review Summary.</div>
      <div>
        Score:{" "}
        {(data.bugs.score +
          data.modularity.score +
          data.readability.score +
          data.suggestions.score) /
          4}
      </div>

      <div>Readability</div>
      <div>{data.readability.summary}</div>
      <div>Readability Score: {data.readability.score}/10</div>

      <div>Modularity</div>
      <div>{data.modularity.summary}</div>
      <div>Modularity Score: {data.modularity.score}/10</div>

      <div>Bugs</div>
      <div>{data.bugs.summary}</div>
      <div>Bugs Score: {data.bugs.score}/10</div>

      <div>Suggestions</div>
      <div>{data.suggestions.summary}</div>
      <div>Suggestions Score: {data.suggestions.score}/10</div>
    </div>
  );
}
