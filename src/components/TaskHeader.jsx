import styled from "styled-components";

export const TaskHeader = () => {
    return (
        <>
            <tr>
                <Th rowSpan="2" className="fixed">
                    No
                </Th>
                <Th rowSpan="2" className="fixed">
                    作業名
                </Th>
                <Th rowSpan="2">担当者</Th>
                <Th rowSpan="2">進捗率</Th>
                <Th rowSpan="2">状況</Th>
                <Th colSpan="3">予定</Th>
                <Th colSpan="3">実績</Th>
                <Th rowSpan="2">先行</Th>
            </tr>
            <tr>
                <Th>開始日</Th>
                <Th>終了日</Th>
                <Th>日数</Th>
                <Th>開始日</Th>
                <Th>終了日</Th>
                <Th>日数</Th>
            </tr>
        </>
    );
};

const Th = styled.th`
    padding: 5px;
    border: 1px solid #aaa;
    text-align: center;
    vertical-align: middle;
`;

export default TaskHeader;
