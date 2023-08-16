import Task from "./Task";
import TaskRight from "./TaskRight";
import TaskHeader from "./TaskHeader";
import TaskHeaderRight from "./TaskHeaderRight";
import styled from "styled-components";
import { useState } from "react";

export const ChartTable = (props) => {
    // ガントチャートに出力する日数
    const columnsValue = 90;
    // 当日から何日前からの日付けを出力するか指定
    const daysAgo = 15;

    const [actDiffDay, setActDiffDay] = useState([]);
    const [planDiffDay, setPlanDiffDay] = useState([]);
    const [fullDate, setFullDate] = useState([]);

    const handleActDiffDay = (res) => {
        setActDiffDay(res);
        console.log(actDiffDay)
    };
    const handlePlanDiffDay = (res) => {
        setPlanDiffDay(res);
    };
    const handleFullDate = (res) => {
        setFullDate(res);
    };

    return (
        <>
            <TableWrapper>
                <TableLeft>
                    <Table>
                        <Thead>
                            <TaskHeader />
                        </Thead>
                        <Tbody>
                            {props.taskData.map((task) => {
                                return (
                                    <Task
                                        key={task.id}
                                        task={task}
                                        columnsValue={columnsValue}
                                        handlePlanDiffDay={handlePlanDiffDay}
                                        handleActDiffDay={handleActDiffDay}
                                    />
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableLeft>
                <TableRight>
                    <Table>
                        <Thead>
                            <TaskHeaderRight
                                columnsValue={columnsValue}
                                daysAgo={daysAgo}
                                handleFullDate={handleFullDate}
                            />
                        </Thead>
                        <Tbody>
                            {props.taskData.map((task) => {
                                return (
                                    <TaskRight
                                        key={task.id}
                                        task={task}
                                        columnsValue={columnsValue}
                                        planDiffDay={planDiffDay}
                                        actDiffDay={actDiffDay}
                                        fullDate={fullDate}
                                    />
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableRight>
            </TableWrapper>
        </>
    );
};

const TableWrapper = styled.div`
    display: flex;
`;

const TableLeft = styled.div`
    min-width: 60%;
    overflow-x: scroll;
`;

const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
`;
const Thead = styled.thead`
    background: #006caa;
    color: white;
    height: 120px;
`;
const Tbody = styled.tbody``;
const TableRight = styled.div`
    min-width: 40%;
    overflow-x: scroll;
`;

export default ChartTable;
