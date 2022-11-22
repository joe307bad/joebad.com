import Head from 'next/head'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faLinkedin, faTwitter, faGithub} from '@fortawesome/free-brands-svg-icons'
import {allArticles} from 'contentlayer/generated';
import {select} from '../utils/select';

export default function Home({articles}) {
    return (
        <>
            <Head>
                <title>Joe Badaczewski | Front-End Engineer</title>
                <link rel="icon" href="/favicon.ico"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
                <link href="https://fonts.googleapis.com/css2?family=Pridi:wght@300;600&display=swap"
                      rel="stylesheet"/>
            </Head>

            <main>
                <div id="info">
                    <h1><strong style={{color: "#67BDFF"}}>Joe</strong> Badaczewski</h1>
                    <h2>Pittsburgh-based Front-End Engineer at AWS</h2>
                    <div style={{marginTop: 20, display: "flex", fontSize: 30, gap: 10, color: "#67BDFF"}}>
                        <FontAwesomeIcon icon={faLinkedin}/>
                        <FontAwesomeIcon icon={faTwitter}/>
                        <FontAwesomeIcon icon={faGithub}/>
                    </div>
                </div>
            </main>
        </>
    )
}

export function getStaticProps() {
    const articles = allArticles
        .map((article) =>
            select(article, [
                'slug',
                'title',
                'description',
                'publishedAt',
                'readingTime',
                'author',
                'category',
                'image',
            ])
        )
        .sort(
            (a, b) =>
                Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt))
        );

    return {props: {articles}};
}