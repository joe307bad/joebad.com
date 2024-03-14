import {NextIntlClientProvider} from "next-intl";
import {NextSeo} from "next-seo";
import styles from "../styles/v2.module.scss";
import Link from "next/link";

export default function CV({page, children}) {
    return (
        <>
            <style global jsx>{`
                html,
                body {
                    background-color: black;
                }
            `}</style>
            <NextIntlClientProvider locale="en-US">
                <NextSeo title={page.title} description={page.seoDescription}/>
                <div className='flex justify-center'>
                    <div id={styles.v2} className='p-5 max-w-[600px]'>
                        <div className='w-full items-end'>
                            <Link href='/'>
                                <img className='pb-5' height={100} width={100} src="/penguin-2.png"/>
                            </Link>
                            <h1 className='h-[27px] text-lg font-bold'>Joe Badaczewski</h1>
                            <h2 className='h-[37px] '>Senior Software Engineer at{' '}
                                <Link target='_blank' href="https://frameworkltc.com/">
                                    SoftWriters
                                </Link></h2>
                            <h2 className='h-[37px] max-w-[400px]'>BA in Digital Media Arts + MS in Multimedia Technology from
                                Duquesne
                                University</h2>
                        </div>
                        <br/>
                        <div className='inline'>
                            <span><Link href="/Badaczewski_CV.pdf">Download CV</Link></span>
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