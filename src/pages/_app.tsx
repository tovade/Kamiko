import type { AppProps } from 'next/app'
import '../dashboard/styles/globals.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}
