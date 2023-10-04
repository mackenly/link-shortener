export default {
  logo: <span>Link Shortener</span>,
  faviconGlyph: "🔗",
  useNextSeoProps() {
    return {
      titleTemplate: "%s – Docs"
    }
  },
  primaryHue: 24,
  project: {
    link: 'https://github.com/mackenly/link-shortener',
  },
  docsRepositoryBase: "https://github.com/mackenly/link-shortener/tree/main/docs",
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Docs for link-shortener open source self-hosted shortlink manager" />
      <meta property="og:title" content="Likn Shortener Docs" />
      <meta property="og:description" content="Docs for link-shortener open source self-hosted shortlink manager" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" content="#000000" />
    </>
  ),
  footer: {
    text: (
      <span>
        ©{' '}{new Date().getFullYear()}{' '}
        <a href="https://tricitiesmediagroup.com" target="_blank">
          Tricities Media Group x Mackenly Jones
        </a>
        .
      </span>
    )
  }
  // ...
}