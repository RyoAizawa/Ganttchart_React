import { useState } from "react";
import Task from "./Task";
import TaskHeader from "./TaskHeader";
import styled from "styled-components";

export const ChartTable = (props) => {
    console.log(props.taskData)
    // ガントチャートに出力する日数
    const columnsValue = 30;
    // 当日から何日前からの日付けを出力するか指定
    const daysAgo = 7;

    const [fullDate, setFullDate] = useState([]);
    console.log(fullDate)
    return (
        <>
            <Table>
                <Thead>
                    <TaskHeader
                        columnsValue={columnsValue}
                        daysAgo={daysAgo}
                        setFullDate={setFullDate}
                    />
                </Thead>
                <Tbody>
                    {props.taskData.map((task) => {
                        return (
                            <Task
                                key={task.id}
                                task={task}
                                fullDate={fullDate}
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
