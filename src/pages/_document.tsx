import Document, { DocumentContext, Html, Main, NextScript } from 'next/document';

export default class Kamiko extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html lang="en">
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
