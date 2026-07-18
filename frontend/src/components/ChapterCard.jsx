function ChapterCard({ chapter }) {
  return (
    <article>
      <span>Chapter {String(chapter.displayOrder).padStart(2, "0")}</span>
      <h2>{chapter.title}</h2>
      <p>{chapter.description}</p>
    </article>
  );
}

export default ChapterCard;