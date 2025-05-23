import {allPages} from "contentlayer/generated";
import {NextSeo} from "next-seo";
import {useMDXComponent} from "next-contentlayer/hooks";
import {NextIntlClientProvider} from "next-intl";
import Education from "../components/about/Education";
import Page from "../components/Page";
import {MostRecentExperience} from "../components/MostRecentExerience";
import TagsList from "../components/layout/TagsList";
import {SplitContent} from "../components/layout/SplitContent";
import LinkButton from "../components/buttons/LinkButton";
import ResumeButton from "../components/buttons/ResumeButton";
import {InlineLinkButtons} from "../components/layout/InlineLinkButtons";
import CV from "../components/CV";
import Accomplishment from "../components/Accomplishment";
import Position from "../components/Position";
import Head from "../components/Head";
import H from "next/head";

const usedComponents = {
    Education,
    MostRecentExperience,
    LinkButton,
    TagsList,
    SplitContent,
    ResumeButton,
    InlineLinkButtons,
    Position,
    Accomplishment
};

const SinglePost = ({page}) => {
    const MDXContent = useMDXComponent(page.body.code)

    if (page.slug === 'cv') {
        return (
            <CV page={page}>
                
                  <Head title="Joe's CV" />
                      <H>
                        <title>Joe's CV</title>
                        <>
                          <meta property="og:type" content="website" />
                          <meta property="og:description" content="Joe's professional history" />
                          <meta property="og:site_name" content="joebad.com" />
                          <meta property="og:title" content="Joe's CV" />
                          <meta
                            property="og:url"
                            content={`https://joebad.com/cv`}
                          />
                          <meta
                            property="og:image"
                            content="https://joebad.com/logo-twitter.png"
                          />
                        </>
                      </H>
                <MDXContent components={usedComponents}/>
            </CV>
        )
    }

    return (
        <NextIntlClientProvider locale="en-US">
            <NextSeo title={page.title} description={page.seoDescription}/>
            <Page>
                <MDXContent components={usedComponents}/>
            </Page>
        </NextIntlClientProvider>
    );
};
export default SinglePost;

export async function getStaticPaths() {
    return {
        paths: allPages.map((page) => ({
            params: {slug: page.slug},
        })),
        fallback: false,
    };
}

export async function getStaticProps({params}) {
    const page = allPages.find((article) => article.slug === params.slug);

    return {props: {page}};
}
