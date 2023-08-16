import { useState, useEffect } from "react";
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

const App = () => {
    const [taskData, setTaskData] = useState([]);
    useEffect(() => {
        fetch("/api/data")
            .then((response) => response.json())
            .then((taskData) => setTaskData(taskData));
    }, []);

    return (
        <>
            <GlobalStyle />
            <Header />
            <main>
                <ChartTable taskData={taskData} />
            </main>
        </>
    );
};

export default App;
