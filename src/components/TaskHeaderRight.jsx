import styled from "styled-components";

export const TaskHeaderRight = (props) => {
    // テーブルヘッダ表示の日付を出力
    const today = new Date("2023/08/05");
    let colDates = [];
    // 指定した日数前から、指定した日数分日付けを配列に取得する
    for (let i = -props.daysAgo; i < props.columnsValue - props.daysAgo; i++) {
        const newDate = new Date();
        newDate.setDate(today.getDate() + i);
        colDates.push(newDate);
    }
    const getyearAndMonth = (dates) => {
        const array = dates.map((elem) => {
            const year = elem.getFullYear();
            const month = elem.getMonth() + 1;
            return `${year}/${month}`;
        });
        return array;
    };
    // YYYY/MMの形で年月を取得
    const yearAndMonthArray = getyearAndMonth(colDates);
    // YYYY/MMのユニークな値を配列に取得
    const uniqueYearAndMonth = new Set(yearAndMonthArray);
    const getDates = (dates) => {
        const array = dates.map((elem) => {
            const date = elem.getDate();
            return date;
        });
        return array;
    };
    // 日付けを取得
    const datesArray = getDates(colDates);
    const fullDateArray = [];
    // 整合性を取るためにYYYY/MM/DDのデータを指定日数分作成する
    for (let i = 0; i < colDates.length; i++) {
        const fullDate = `${yearAndMonthArray[i]}/${datesArray[i]}`;
        fullDateArray.push(fullDate);
    }

    return (
        <>
            <tr>
                {(function () {
                    const headYearMonth = [];
                    uniqueYearAndMonth.forEach((yearAndMonth) => {
                        let count = 0;
                        fullDateArray.forEach((elem) => {
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
                {(function () {
                    let colDates = [];
                    fullDateArray.forEach((elem, i) => {
                        const date = new Date(elem).getDate();
                        colDates.push(
                            <Th key={i} className="head_dates">
                                {date}
                            </Th>
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
                    fullDateArray.forEach((elem, i) => {
                        const day = new Date(elem).getDay();
                        colDays.push(
                            <Th key={i} className="head_days">
                                {weekOfDays[day]}
                            </Th>
                        );
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

export default TaskHeaderRight;
