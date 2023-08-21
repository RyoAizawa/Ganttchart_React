import styled from "styled-components";

export const TaskHeader = (props) => {

    const getyearAndMonth = (dates) => {
        const array = dates.map((elem) => {
            const year = new Date(elem).getFullYear();
            const month = new Date(elem).getMonth() + 1;
            return `${year}/${month}`;
        });
        return array;
    };
    // YYYY/MMの形で年月を取得
    const yearAndMonthArray = getyearAndMonth(props.fullDateArray);
    // YYYY/MMのユニークな値を配列に取得
    const uniqueYearAndMonth = new Set(yearAndMonthArray);

    return (
        <>
            <tr>
                <Th rowSpan="3">
                    No
                </Th>
                <Th rowSpan="3">
                    作業名
                </Th>
                <Th rowSpan="3">担当者</Th>
                <Th rowSpan="3">進捗率</Th>
                <Th rowSpan="3">状況</Th>
                <Th colSpan="3">予定</Th>
                <Th colSpan="3">実績</Th>
                <Th rowSpan="3">先行</Th>
                {(function () {
                    const headYearMonth = [];
                    uniqueYearAndMonth.forEach((yearAndMonth) => {
                        let count = 0;
                        props.fullDateArray.forEach((elem) => {
                            const tmpDate = new Date(elem);
                            const elemYearAndMonth = `${tmpDate.getFullYear()}/${
                                tmpDate.getMonth() + 1
                            }`;
                            if (elemYearAndMonth === yearAndMonth) {
                                count++;
                            }
                        });
                        headYearMonth.push(
                            <Th key={yearAndMonth} colSpan={count}>
                                {yearAndMonth}
                            </Th>
                        );
                    });
                    return headYearMonth;
                })()}
            </tr>
            <tr>
                <Th rowSpan="2">開始日</Th>
                <Th rowSpan="2">終了日</Th>
                <Th rowSpan="2">日数</Th>
                <Th rowSpan="2">開始日</Th>
                <Th rowSpan="2">終了日</Th>
                <Th rowSpan="2">日数</Th>
                {(function () {
                    let colDates = [];
                    props.fullDateArray.forEach((elem, i) => {
                        const date = new Date(elem).getDate();
                        colDates.push(
                            <AddTh key={i}>
                                {date}
                            </AddTh>
                        );
                    });
                    return colDates;
                })()}
            </tr>
            <tr>
                {(function () {
                    let colDays = [];
                    const weekOfDays = [
                        "日",
                        "月",
                        "火",
                        "水",
                        "木",
                        "金",
                        "土",
                    ];
                    props.fullDateArray.forEach((elem, i) => {
                        const day = new Date(elem).getDay();
                        colDays.push(<AddTh key={i}><Num>{weekOfDays[day]}</Num></AddTh>);
                    });
                    return colDays;
                })()}
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
const AddTh = styled.th`
    padding: 5px;
    border: 1px solid #aaa;
    text-align: center;
    vertical-align: middle;
`;

const Num = styled.div`
    width: 20px;
    text-align: center;
    vertical-align: middle;
`;

export default TaskHeader;
