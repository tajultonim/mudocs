import Pages from "./(page-layout)/explore/[...ids]/page";

export default function MainPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "μDocs",
            alternateName: [
              "MuDocs",
              "udocs",
              "RU PHY Seminar Library",
              "MuDocs E Library",
            ],
            url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
            description:
              "An e-library for storing and accessing academic papers and books, including resources from the Seminar Library of the Department of Physics, University of Rajshahi.",
            inLanguage: "en",
          }).replace(/</g, "\\u003c"),
        }}
      />

      <Pages params={Promise.resolve({ ids: [] })} />
    </>
  );
}
