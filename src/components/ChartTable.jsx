import Task from "./Task";
import TaskHeader from "./TaskHeader";
import styled from "styled-components";

export const ChartTable = (props) => {
    // ガントチャートに出力する日数
    const columnsValue = 30;
    // 当日から何日前からの日付けを出力するか指定
    const daysAgo = 15;

    // テーブルヘッダ表示の日付を出力
    const today = new Date();
    let colDates = [];
    // 指定した日数前から、指定した日数分日付けを配列に取得する
    for (let i = -daysAgo; i < columnsValue - daysAgo; i++) {
        const newDate = new Date();
        newDate.setDate(today.getDate() + i);
        colDates.push(newDate);
    }

    const fullDateArray = [];
    // 整合性を取るためにYYYY/MM/DDのデータを指定日数分作成する
    colDates.forEach((date) => {
        const y = date.getFullYear()
        const m = date.getMonth() + 1
        const d = date.getDate()
        const fullDate = `${y}/${m}/${d}`;
        fullDateArray.push(fullDate);
    })

    console.log("chartTable")

    return (
        <>
            <Table>
                <Thead>
                    <TaskHeader
                        fullDateArray={fullDateArray}
                    />
                </Thead>
                <Tbody>
                    {props.taskData.map((task) => {
                        return (
                            <Task
                                key={task.id}
                                task={task}
                                fullDateArray={fullDateArray}
                            />
                        );
                    })}
                </Tbody>
            </Table>
        </>
    );
};

const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
`;
const Thead = styled.thead`
    background: #006caa;
    color: white;
`;
const Tbody = styled.tbody``;

export default ChartTable;
