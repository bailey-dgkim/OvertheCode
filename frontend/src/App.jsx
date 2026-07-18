import { useEffect, useState } from "react";
import { fetchChapters } from "./api/chapterApi";
import ChapterCard from "./components/ChapterCard";

function App() {
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchChapters()
      .then((data) => {
        setChapters(data);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  }, []);

  return (
    <main>
      <header>
        <p>AI 시대의 실무 개발 로드맵</p>
        <h1>📚 Dev Journey</h1>
      </header>

      {error && <p>{error}</p>}

      <section>
        {chapters.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </section>
    </main>
  );
}

export default App;