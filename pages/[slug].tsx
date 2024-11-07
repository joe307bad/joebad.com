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
                <NextSeo title={page.title} description={page.seoDescription}/>
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
