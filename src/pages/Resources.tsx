import ResourcesHero from '../components/ResourcesHero';

export default function Resources() {
  return (
    <>
      <title>Resources | Coffee @ UMD</title>
      <ResourcesHero />
      {/* Recipe cards will be added separately; keep the hero's scroll target available. */}
      <section
        className="resources-spotlight"
        id="spotlight-recipes"
        aria-labelledby="spotlight-recipes-heading"
        tabIndex={-1}
      >
        <h2 id="spotlight-recipes-heading">Spotlight recipes</h2>
      </section>
    </>
  );
}
