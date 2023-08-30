import { useState, useEffect } from "react";
import useSWR from "swr";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

import Header from "./components/GlobalHeader";
import ChartTable from "./components/ChartTable";

const GlobalStyle = createGlobalStyle`
    ${reset}
    *, *::after, *::before {
        font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN",
        "Hiragino Sans", Meiryo, sans-serif;
    }
    html {
        font-size: 62.5%;
    }
    body,input,select {
        font-size: 1.2rem;
    }

`;
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const App = () => {
    const { data, error, isLoading } = useSWR("/api/data", fetcher);
    const [indentProcess, setIndentProcess] = useState("");

    const handleClick = (process) => {
        setIndentProcess(process);
    };
    useEffect(() => {
        setIndentProcess("");
    }, [indentProcess]);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <div>loading...</div>;

    return (
        <>
            <GlobalStyle />
            <Header handleClick={handleClick} />
            <main>
                <ChartTable taskData={data} indentProcess={indentProcess} />
            </main>
        </>
    );
};

export default App;
