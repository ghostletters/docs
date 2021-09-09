module.exports = {
    lang: 'en-US',
    title: 'Documentation',
    description: 'Vite & Vue powered static site generator.',

    themeConfig: {
        repo: 'newur/vitepress_docs',
        docsDir: 'docs',

        editLinks: true,
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',


        nav: [
            { text: 'Blog', link: 'https://blog.ghostletters.xyz/' },
            { text: 'Mastodon', link: 'https://fosstodon.org/@ghost_letters' }
        ]
    }
}