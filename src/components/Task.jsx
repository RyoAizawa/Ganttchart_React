import styled from "styled-components";
import { useEffect } from "react";

export const Task = (props) => {
    // YYYY/MM/DDからYYYY-MM-DDにフォーマットするメソッド
    const dateTimeFormat = (date) => {
        const dateJp = dateTimeFormatJP.format(new Date(date));
        return dateJp.replace(/\//g, "-");
    };
    // 日付けを日本時間のYYYY/MM/DDにフォーマットするメソッド
    const dateTimeFormatJP = new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    const actDiffDay = () => {
        props.handleActDiffDay(calcDiffDay(props.task.startDateAct, props.task.endDateAct));
        return calcDiffDay(props.task.startDateAct, props.task.endDateAct);
    };
    const planDiffDay = () => {
        props.handlePlanDiffDay(calcDiffDay(props.task.startDatePlan, props.task.endDatePlan));
        return calcDiffDay(props.task.startDatePlan, props.task.endDatePlan);
    };
    // 予定、実績にセットされた日付けの差分を計算
    const calcDiffDay = (stDate, edDate) => {
        const startDate = new Date(stDate);
        const endDate = new Date(edDate);
        const diffTime = endDate.getTime() - startDate.getTime();
        let diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        // マイナス値になった場合は0を設定しておく
        if (diffDay < 0) diffDay = 0;
        return diffDay;
    };

    return (
        <>
            <tr>
                <Td>{props.task.id}</Td>
                <TaskTitle>{props.task.title}</TaskTitle>
                <Td>{props.task.name}</Td>
                <Td>
                    <input
                        type="range"
                        step="10"
                        min="0"
                        max="100"
                        defaultValue={0}
                    />
                </Td>
                <Td>進行中</Td>
                <Td>
                    <input
                        type="date"
                        defaultValue={dateTimeFormat(props.task.startDatePlan)}
                    />
                </Td>
                <Td>
                    <input
                        type="date"
                        defaultValue={dateTimeFormat(props.task.endDatePlan)}
                    />
                </Td>
                <Td id="planDif_1">{planDiffDay()}</Td>
                <Td>
                    <input
                        type="date"
                        defaultValue={dateTimeFormat(props.task.startDateAct)}
                    />
                </Td>
                <Td>
                    <input
                        type="date"
                        defaultValue={dateTimeFormat(props.task.endDateAct)}
                    />
                </Td>
                <Td id="actDif_1">{actDiffDay()}</Td>
                <Td className="precedence"></Td>
            </tr>
        </>
    );
};

const Td = styled.td`
    padding: 5px;
    border: 1px solid #aaa;
    text-align: center;
    vertical-align: middle;
    height: 50px;
`;
const TaskTitle = styled.td`
    padding: 5px;
    border: 1px solid #aaa;
    text-align: center;
    vertical-align: middle;
    width: 200px;
`;

export default Task;
