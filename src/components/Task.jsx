import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export const Task = (props) => {
    let planSt = props.task.startDatePlan;
    let planEd = props.task.endDatePlan;
    let actSt = props.task.startDateAct;
    let actEd = props.task.endDateAct;

    const [planDiffDay, setPlanDiffDay] = useState();
    const [actDiffDay, setActDiffDay] = useState();
    const [colDays, setColDays] = useState([]);

    let startDatePlanRef = useRef();
    let endDatePlanRef = useRef();
    let startDateActRef = useRef();
    let endDateActRef = useRef();

    useEffect(() => {
        setColDays(createColDays(planSt, planEd, actSt, actEd));
        return () => {
            let diffDay = calcDiffDay(planSt, planEd);
            setPlanDiffDay(diffDay);
            diffDay = calcDiffDay(actSt, actEd);
            setActDiffDay(diffDay);
        };
    }, []);

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

    const createColDays = (planStart, planEnd, actStart, actEnd) => {
        const colDaysArray = props.fullDateArray.map((elem, i) => {
            let planBar = "";
            let actBar = "";
            const formattedColDate = dateTimeFormatJP.format(new Date(elem));
            if (planStart !== "" && planEnd !== "") {
                const formattedStDatePlan = dateTimeFormatJP.format(
                    new Date(planStart)
                );
                if (formattedColDate === formattedStDatePlan) {
                    planBar = (
                        <PlanBar>
                            <ProgBar></ProgBar>
                        </PlanBar>
                    );
                }
            }
            if (actStart !== "" && actEnd !== "") {
                const formattedStDateAct = dateTimeFormatJP.format(
                    new Date(actStart)
                );
                if (formattedColDate === formattedStDateAct) {
                    actBar = <ActBar></ActBar>;
                }
            }
            return (
                <Td
                    ref={(el) => (colDays[i] = el)}
                    key={i}
                    name={formattedColDate}
                >
                    {planBar}
                    {actBar}
                </Td>
            );
        });
        return colDaysArray;
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

    // // 日付けがセットされた後の挙動
    const checkDate = (process) => {
        if (process === "plan") {
            const planStCurrent = startDatePlanRef.current.value;
            const planEdCurrent = endDatePlanRef.current.value;

            // 終了日は開始日以前を設定できないようにする
            if (planStCurrent !== "") {
                endDatePlanRef.current.setAttribute("min", planStCurrent);
            }
            // 開始、終了の日付けがセットされているか確認
            if (planStCurrent !== "" && planEdCurrent !== "") {
                planSt = planStCurrent;
                planEd = planEdCurrent;

                // 、予定、実績それぞれの開始/終了がセットされていれば差分を計算する
                const diffDay = calcDiffDay(planStCurrent, planEdCurrent);
                setPlanDiffDay(diffDay);
                setColDays(createColDays(planSt, planEd, actSt, actEd));
            }
        } else {
            const actStCurrent = startDateActRef.current.value;
            const actEdCurrent = endDateActRef.current.value;
            if (actStCurrent !== "") {
                endDateActRef.current.setAttribute("min", actStCurrent);
            }
            if (actStCurrent !== "" && actEdCurrent !== "") {
                actSt = actStCurrent;
                actEd = actEdCurrent;

                const diffDay = calcDiffDay(actStCurrent, actEdCurrent);
                setActDiffDay(diffDay);
                setColDays(createColDays(planSt, planEd, actSt, actEd));
            }
        }
    };

    // 設定した開始日、終了日の情報をもとにチャートバーを作成
    const setChartBar = (diffDay, bar, stDate, edDate) => {
        // もしも差分日数が0かマイナス値になっていた場合はバーを非表示にして早期return
        if (diffDay < 1) {
            bar.current.style.display = "none";
            return;
        }
        // 非表示にしたバーを再表示
        bar.current.style.display = "";
        // チャートの起点を決める
        // colDays.forEach((col) => {
        //     if (col.props.name === dateTimeFormatJP.format(new Date(stDate))) {
        //         console.log(col);
        //     }
        // });
        // if (stDate < today) {
        //     // 本日以前の日付けを選んだ場合、起点は本日とする
        //     selectedDateCol = selectedRow.children(`td[name=${today}]`);
        // } else if (selectedRow.children(`td[name=${stDate}]`).length < 1) {
        //     // テーブルにない日付けを開始日に選択した場合、バーを消して早期return
        //     $(`#${process}Bar_${index}`).css("display", "none");
        //     return;
        // }
        //     // 起点は全ての日付けカラム内の何番目か
        //     let startColumnIndex = 0
        //     let columnCount = 0
        //     selectedRow.children(".col_day").each((i, column) => {
        //         if (column.isEqualNode(selectedDateCol[0])) {
        //             startColumnIndex = i
        //         }
        //         columnCount = i + 1
        //     })
        //     // 差分がバーのチャートバーのカラムサイズとなる
        //     let barColumCount = diffDay
        //     // 開始日が本日の日付け以前の場合、開始日から本日までの差分を取得
        //     if (stDate < today) {
        //         const diffDayForToday = calcDiffDay(stDate, today)
        //         barColumCount -= diffDayForToday - 1
        //     }
        //     // 差分が起点以降の空きカラム数を超えたらバーのサイズは空きカラムの領域を超えないようにする
        //     if (barColumCount > (columnCount - startColumnIndex)) {
        //         barColumCount = columnCount - startColumnIndex
        //     }
        //     // 1本分のボーダーサイズを取得
        //     const border = (selectedDateCol.outerWidth() - selectedDateCol.innerWidth()) / 2
        //     // 要素の幅+ボーダー*カラム数でバーサイズを計算
        //     const barSize = ((selectedDateCol.innerWidth() + border) * barColumCount)
        //     // 起点と終端のpadding = 1px分を調整しバーの幅を設定
        //     $(`#${process}Bar_${index}`).css("width", `${barSize - 2}px`)
        //     // 起点の情報を取得出来たらバーを設定した起点に移動
        //     if (selectedDateCol.length > 0) selectedDateCol.append($(`#${process}Bar_${index}`))
    };

    return (
        <>
            <tr>
                <Td>{props.task.id}</Td>
                <TaskTitle>{props.task.title}</TaskTitle>
                <Td>{props.task.name}</Td>
                <Td>
                    <InputRange
                        type="range"
                        step="10"
                        min="0"
                        max="100"
                        defaultValue={0}
                    />
                </Td>
                <Td>進行中</Td>
                <Td>
                    <InputDate
                        ref={startDatePlanRef}
                        type="date"
                        defaultValue={dateTimeFormat(planSt)}
                        onChange={() => checkDate("plan")}
                    />
                </Td>
                <Td>
                    <InputDate
                        ref={endDatePlanRef}
                        type="date"
                        defaultValue={dateTimeFormat(planEd)}
                        onChange={() => checkDate("plan")}
                    />
                </Td>
                <Td>{planDiffDay}</Td>
                <Td>
                    <InputDate
                        ref={startDateActRef}
                        type="date"
                        defaultValue={dateTimeFormat(actSt)}
                        onChange={() => checkDate("act")}
                    />
                </Td>
                <Td>
                    <InputDate
                        ref={endDateActRef}
                        type="date"
                        defaultValue={dateTimeFormat(actEd)}
                        onChange={() => checkDate("act")}
                    />
                </Td>
                <Td>{actDiffDay}</Td>
                <Td></Td>
                {colDays}
            </tr>
        </>
    );
};

const Td = styled.td`
    padding: 5px;
    border: 1px solid #aaa;
    text-align: center;
    vertical-align: middle;
`;
const TaskTitle = styled.td`
    padding: 5px;
    border: 1px solid #aaa;
    text-align: center;
    vertical-align: middle;
    width: 200px;
`;

const InputDate = styled.input`
    max-width: 100px;
`;
const InputRange = styled.input`
    max-width: 60px;
`;

const PlanBar = styled.div`
    top: 4px;
    height: 19px;
    background: #93bef3;
    z-index: 1;
`;

const ActBar = styled.div`
    top: 17px;
    height: 5px;
    background-color: blue;
    border: none;
    z-index: 2;
`;

const ProgBar = styled.div`
    height: 100%;
    width: 0px;
    background: #ffc135;
`;

export default Task;
