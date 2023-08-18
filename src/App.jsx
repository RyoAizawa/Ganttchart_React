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
        scroll-behavior: smooth;
    }
`;
const fetcher = (...args) => fetch(...args).then(res => res.json())

const App = () => {
    const {data, error, isLoading} = useSWR("/api/data", fetcher)
    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>

    return (
        <>
            <GlobalStyle />
            <Header />
            <main>
                <ChartTable taskData={data} />
            </main>
        </>
    );
};

export default App;
