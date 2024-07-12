'use client'

import { useRouter } from "next/navigation";
import getArticles from "./articles";
import { useEffect, useState } from "react";

export default async function Page() {

    const router = useRouter();

    // const [articles, setArticles] = useState([]);

    // useEffect(() => {
    //     getArticles().then(articles => {
    //         setArticles(articles)
    //     })
    // }, []);

    return (
            <div className={'container'}>
                <h1>Nortern Inuit</h1>
                <div>
                    <p>
                        {/*{JSON.stringify(articles)}*/}
                    </p>
                </div>
            </div>
    );
}