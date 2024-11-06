import {NextIntlClientProvider} from "next-intl";
import {NextSeo} from "next-seo";
import styles from "../styles/v2.module.scss";
import Link from "next/link";
import Header from "./layout/Header";

export default function CV({page, children}) {
    return (
        <>
            <style global jsx>{`
                html,
                body {
                    background-color: black;
                }\
            `}</style>
            <NextIntlClientProvider locale="en-US">
                <NextSeo title={page.title} description={page.seoDescription}/>
                <div className='flex justify-center'>
                    <div id={styles.v2} className='p-5 max-w-[600px]'>
                        <Header/>
                        <br/>
                        <div className='inline'>
                            <span><Link
                                rel="noopener noreferrer"
                                target={"_blank"} href="/Badaczewski_CV_2024_1.pdf" download>Download CV</Link></span>
                            {/*<span className='pl-2'>◆</span>*/}
                            {/*<span className='pl-2'><Link href="/">Blog</Link></span>*/}
                            <span className='pl-2'>◆</span>
                            <span className='pl-2'><Link href="mailto:joe307bad@gmail.com">Email</Link></span>
                        </div>
                        <br/>
                        <br/>
                        <br/>
                        <h3 className='font-bold h-[37px]'>Work History</h3>
                        {children}
                    </div>
                </div>
            </NextIntlClientProvider>
        </>
    )
}